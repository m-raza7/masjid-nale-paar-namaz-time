import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];

export type GalleryImageInsert = Database["public"]["Tables"]["gallery_images"]["Insert"];

export type GalleryImageUpdate = Database["public"]["Tables"]["gallery_images"]["Update"];

const GALLERY_BUCKET = "masjid-gallery";
const GALLERY_FOLDER = "gallery";

// --------------------------------------------------
// GET GALLERY IMAGES
// --------------------------------------------------

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching gallery images:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}

// --------------------------------------------------
// VALIDATE IMAGE
// --------------------------------------------------

function validateImage(file: File) {
  if (!file) {
    throw new Error("Please select an image.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file.");
  }

  // 10 MB maximum
  const maxSize = 10 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("Image size must be less than 10 MB.");
  }
}

// --------------------------------------------------
// CREATE IMAGE PATH
// --------------------------------------------------

function createImagePath(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName = `${crypto.randomUUID()}.${extension}`;

  return `${GALLERY_FOLDER}/${fileName}`;
}

// --------------------------------------------------
// UPLOAD IMAGE TO STORAGE
// --------------------------------------------------

async function uploadImageToStorage(file: File) {
  validateImage(file);

  const imagePath = createImagePath(file);

  console.log("Uploading gallery image...");
  console.log("Bucket:", GALLERY_BUCKET);
  console.log("Path:", imagePath);
  console.log("File:", file.name);
  console.log("Type:", file.type);
  console.log("Size:", file.size);

  const { error: uploadError } = await supabase.storage
    .from(GALLERY_BUCKET)
    .upload(imagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);

    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(imagePath);

  if (!publicUrl) {
    throw new Error("Could not generate public image URL.");
  }

  console.log("Image uploaded successfully.");
  console.log("Public URL:", publicUrl);

  return {
    imageUrl: publicUrl,
    imagePath,
  };
}

// --------------------------------------------------
// DELETE IMAGE FROM STORAGE
// --------------------------------------------------

async function deleteImageFromStorage(imagePath: string) {
  if (!imagePath) {
    return;
  }

  const { error } = await supabase.storage.from(GALLERY_BUCKET).remove([imagePath]);

  if (error) {
    console.error("Error deleting image from storage:", error);

    throw new Error(error.message);
  }
}

// --------------------------------------------------
// ADD GALLERY IMAGE
// --------------------------------------------------

export async function addGalleryImage(data: {
  title: string;
  description?: string | null;
  file: File;
}): Promise<GalleryImage> {
  if (!data.title.trim()) {
    throw new Error("Gallery image title is required.");
  }

  // Upload image first
  const { imageUrl, imagePath } = await uploadImageToStorage(data.file);

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    // Remove uploaded file if user lookup fails
    await deleteImageFromStorage(imagePath).catch(() => {});

    throw new Error(userError.message);
  }

  if (!user) {
    await deleteImageFromStorage(imagePath).catch(() => {});

    throw new Error("You must be logged in as an admin.");
  }

  // Insert database record
  const insertData: GalleryImageInsert = {
    title: data.title.trim(),
    description: data.description?.trim() || null,
    image_url: imageUrl,
    image_path: imagePath,
    created_by: user.id,
  };

  const { data: galleryImage, error } = await supabase
    .from("gallery_images")
    .insert(insertData)
    .select("*")
    .single();

  if (error) {
    console.error("Error inserting gallery image:", error);

    // Database insert failed, remove uploaded image
    await deleteImageFromStorage(imagePath).catch(() => {});

    throw new Error(error.message);
  }

  console.log("Gallery image added successfully:", galleryImage);

  return galleryImage;
}

// --------------------------------------------------
// UPDATE GALLERY IMAGE
// --------------------------------------------------

export async function updateGalleryImage(
  id: string,
  data: {
    title: string;
    description?: string | null;
    file?: File | null;
  },
): Promise<GalleryImage> {
  if (!data.title.trim()) {
    throw new Error("Gallery image title is required.");
  }

  let imageUrl: string | undefined;
  let imagePath: string | undefined;

  // If a new image was selected
  if (data.file) {
    const uploaded = await uploadImageToStorage(data.file);

    imageUrl = uploaded.imageUrl;
    imagePath = uploaded.imagePath;
  }

  // Get old image information
  const { data: oldImage, error: oldImageError } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("id", id)
    .single();

  if (oldImageError) {
    if (imagePath) {
      await deleteImageFromStorage(imagePath).catch(() => {});
    }

    throw new Error(oldImageError.message);
  }

  const updateData: GalleryImageUpdate = {
    title: data.title.trim(),
    description: data.description?.trim() || null,
  };

  if (imageUrl && imagePath) {
    updateData.image_url = imageUrl;
    updateData.image_path = imagePath;
  }

  const { data: updatedImage, error } = await supabase
    .from("gallery_images")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating gallery image:", error);

    // Remove newly uploaded image if DB update failed
    if (imagePath) {
      await deleteImageFromStorage(imagePath).catch(() => {});
    }

    throw new Error(error.message);
  }

  // If a new image replaced the old one,
  // delete the old image from Storage
  if (imagePath && oldImage.image_path && oldImage.image_path !== imagePath) {
    await deleteImageFromStorage(oldImage.image_path).catch((storageError) => {
      console.warn("Old gallery image could not be deleted:", storageError);
    });
  }

  console.log("Gallery image updated successfully:", updatedImage);

  return updatedImage;
}

// --------------------------------------------------
// DELETE GALLERY IMAGE
// --------------------------------------------------

export async function deleteGalleryImage(id: string): Promise<void> {
  // Get image first
  const { data: image, error: fetchError } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error finding gallery image:", fetchError);

    throw new Error(fetchError.message);
  }

  // Delete database record
  const { error: deleteError } = await supabase.from("gallery_images").delete().eq("id", id);

  if (deleteError) {
    console.error("Error deleting gallery database record:", deleteError);

    throw new Error(deleteError.message);
  }

  // Delete Storage image
  if (image.image_path) {
    await deleteImageFromStorage(image.image_path).catch((storageError) => {
      console.warn(
        "Database record deleted, but Storage image could not be deleted:",
        storageError,
      );
    });
  }

  console.log("Gallery image deleted successfully.");
}
