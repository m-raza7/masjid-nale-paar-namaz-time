import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// ============================================================
// TYPES
// ============================================================

export type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];

export type GalleryImageInsert = Database["public"]["Tables"]["gallery_images"]["Insert"];

export type GalleryImageUpdate = Database["public"]["Tables"]["gallery_images"]["Update"];

// ============================================================
// CONSTANTS
// ============================================================

const GALLERY_BUCKET = "masjid-gallery";
const GALLERY_FOLDER = "gallery";

// ============================================================
// GET ALL GALLERY IMAGES
// ============================================================

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase.from("gallery_images").select("*").order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error("Error fetching gallery images:", error);

    throw new Error(error.message);
  }

  return data ?? [];
}

// ============================================================
// GET SINGLE GALLERY IMAGE
// ============================================================

export async function getGalleryImage(id: string): Promise<GalleryImage | null> {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching gallery image:", error);

    throw new Error(error.message);
  }

  return data;
}

// ============================================================
// CREATE UNIQUE IMAGE PATH
// ============================================================

function createImagePath(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

  const safeExtension = extension.replace(/[^a-z0-9]/gi, "");

  const uniqueId = crypto.randomUUID();

  return `${GALLERY_FOLDER}/${uniqueId}.${safeExtension}`;
}

// ============================================================
// VALIDATE IMAGE
// ============================================================

function validateImage(file: File): void {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid image format. Please upload JPG, PNG, WEBP, or GIF.");
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("Image size must be less than 5 MB.");
  }
}

// ============================================================
// GET CURRENT USER
// ============================================================

async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("You must be logged in to manage gallery images.");
  }

  return user.id;
}

// ============================================================
// UPLOAD IMAGE TO STORAGE
// ============================================================

async function uploadImageToStorage(file: File): Promise<{
  imagePath: string;
  imageUrl: string;
}> {
  validateImage(file);

  const imagePath = createImagePath(file);

  const { error: uploadError } = await supabase.storage
    .from(GALLERY_BUCKET)
    .upload(imagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("Error uploading gallery image:", uploadError);

    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(imagePath);

  if (!publicUrl) {
    await supabase.storage.from(GALLERY_BUCKET).remove([imagePath]);

    throw new Error("Could not generate the public image URL.");
  }

  return {
    imagePath,
    imageUrl: publicUrl,
  };
}

// ============================================================
// ADD GALLERY IMAGE
// ============================================================

export async function addGalleryImage({
  file,
  title,
  description,
}: {
  file: File;
  title: string;
  description?: string;
}): Promise<GalleryImage> {
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    throw new Error("Gallery image title is required.");
  }

  const userId = await getCurrentUserId();

  // Upload image
  const { imagePath, imageUrl } = await uploadImageToStorage(file);

  const galleryData: GalleryImageInsert = {
    title: trimmedTitle,
    description: description?.trim() || null,
    image_url: imageUrl,
    image_path: imagePath,
    created_by: userId,
  };

  const { data, error } = await supabase
    .from("gallery_images")
    .insert(galleryData)
    .select("*")
    .single();

  // Remove uploaded image if database insert fails
  if (error) {
    await supabase.storage.from(GALLERY_BUCKET).remove([imagePath]);

    console.error("Error creating gallery record:", error);

    throw new Error(error.message);
  }

  if (!data) {
    await supabase.storage.from(GALLERY_BUCKET).remove([imagePath]);

    throw new Error("Gallery image was created but no data was returned.");
  }

  return data;
}

// ============================================================
// UPDATE GALLERY IMAGE
// ============================================================

export async function updateGalleryImage({
  id,
  title,
  description,
  file,
}: {
  id: string;
  title: string;
  description?: string;
  file?: File | null;
}): Promise<GalleryImage> {
  console.log("========== UPDATE GALLERY IMAGE ==========");
  console.log("ID:", id);
  console.log("Title:", title);
  console.log("Description:", description);
  console.log("New file:", file);

  // ----------------------------------------------------------
  // VALIDATE ID
  // ----------------------------------------------------------

  if (!id) {
    throw new Error("Gallery image ID is required.");
  }

  // ----------------------------------------------------------
  // VALIDATE TITLE
  // ----------------------------------------------------------

  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    throw new Error("Gallery image title is required.");
  }

  // ----------------------------------------------------------
  // COMMON UPDATE DATA
  // ----------------------------------------------------------

  const updateData: GalleryImageUpdate = {
    title: trimmedTitle,
    description: description?.trim() || null,
  };

  // ==========================================================
  // CASE 1
  // NO NEW IMAGE
  // Only title / description are updated
  // ==========================================================

  if (!file) {
    console.log("Updating text only...");

    const { data, error } = await supabase
      .from("gallery_images")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating gallery text:", error);

      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Gallery image was not found.");
    }

    console.log("Gallery text updated successfully:", data);

    return data;
  }

  // ==========================================================
  // CASE 2
  // NEW IMAGE SELECTED
  // ==========================================================

  console.log("Replacing gallery image...");

  // ----------------------------------------------------------
  // Get existing database record
  // ----------------------------------------------------------

  const { data: existingImage, error: existingError } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("id", id)
    .single();

  if (existingError) {
    console.error("Error finding existing gallery image:", existingError);

    throw new Error(existingError.message);
  }

  if (!existingImage) {
    throw new Error("Gallery image was not found.");
  }

  // ----------------------------------------------------------
  // Upload new image
  // ----------------------------------------------------------

  const { imagePath: newImagePath, imageUrl: newImageUrl } = await uploadImageToStorage(file);

  console.log("New image uploaded:", newImagePath);

  // Add new image information
  updateData.image_path = newImagePath;
  updateData.image_url = newImageUrl;

  // ----------------------------------------------------------
  // Update database
  // ----------------------------------------------------------

  const { data: updatedImage, error: updateError } = await supabase
    .from("gallery_images")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  // ----------------------------------------------------------
  // Database update failed
  // ----------------------------------------------------------

  if (updateError || !updatedImage) {
    // Remove newly uploaded image
    await supabase.storage.from(GALLERY_BUCKET).remove([newImagePath]);

    console.error("Error updating gallery database:", updateError);

    throw new Error(updateError?.message || "Failed to update gallery image.");
  }

  // ----------------------------------------------------------
  // Delete OLD image
  // ----------------------------------------------------------

  if (existingImage.image_path) {
    const { error: removeOldError } = await supabase.storage
      .from(GALLERY_BUCKET)
      .remove([existingImage.image_path]);

    if (removeOldError) {
      console.warn("Database updated, but old image could not be deleted:", removeOldError.message);
    }
  }

  console.log("Gallery image updated successfully:", updatedImage);

  return updatedImage;
}

// ============================================================
// DELETE GALLERY IMAGE
// ============================================================

export async function deleteGalleryImage(id: string): Promise<void> {
  // ----------------------------------------------------------
  // Get image first
  // ----------------------------------------------------------

  const { data: image, error: fetchError } = await supabase
    .from("gallery_images")
    .select("id, image_path")
    .eq("id", id)
    .single();

  if (fetchError || !image) {
    throw new Error(fetchError?.message || "Gallery image not found.");
  }

  // ----------------------------------------------------------
  // Delete database record
  // ----------------------------------------------------------

  const { error: deleteError } = await supabase.from("gallery_images").delete().eq("id", id);

  if (deleteError) {
    console.error("Error deleting gallery record:", deleteError);

    throw new Error(deleteError.message);
  }

  // ----------------------------------------------------------
  // Delete Storage image
  // ----------------------------------------------------------

  if (image.image_path) {
    const { error: storageError } = await supabase.storage
      .from(GALLERY_BUCKET)
      .remove([image.image_path]);

    if (storageError) {
      console.warn(
        "Database record deleted, but Storage image could not be removed:",
        storageError.message,
      );
    }
  }
}

// ============================================================
// GET PUBLIC IMAGE URL
// ============================================================

export function getGalleryImageUrl(imagePath: string): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(imagePath);

  return publicUrl;
}
