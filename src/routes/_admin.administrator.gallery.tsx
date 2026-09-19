import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { ImagePlus, Pencil, Trash2, Upload, X, Loader2, Images, Eye } from "lucide-react";

import { toast } from "sonner";

import {
  addGalleryImage,
  deleteGalleryImage,
  getGalleryImages,
  updateGalleryImage,
  type GalleryImage,
} from "@/lib/gallery";

export const Route = createFileRoute("/_admin/administrator/gallery")({
  component: AdminGallery,
});

function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  /* ========================================================= */
  /* LOAD GALLERY */
  /* ========================================================= */

  const loadGallery = async () => {
    try {
      setLoading(true);

      const data = await getGalleryImages();

      console.log("Gallery images loaded:", data);

      setImages(data);
    } catch (error) {
      console.error("Gallery loading error:", error);

      toast.error(error instanceof Error ? error.message : "Failed to load gallery images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  /* ========================================================= */
  /* ADD */
  /* ========================================================= */

  const handleAdd = () => {
    setEditingImage(null);
    setShowModal(true);
  };

  /* ========================================================= */
  /* EDIT */
  /* ========================================================= */

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setShowModal(true);
  };

  /* ========================================================= */
  /* CLOSE MODAL */
  /* ========================================================= */

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingImage(null);
  };

  /* ========================================================= */
  /* DELETE */
  /* ========================================================= */

  const handleDelete = async (image: GalleryImage) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${image.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(image.id);

      await deleteGalleryImage(image.id);

      setImages((current) => current.filter((item) => item.id !== image.id));

      toast.success("Gallery image deleted successfully.");
    } catch (error) {
      console.error("Delete gallery image error:", error);

      toast.error(error instanceof Error ? error.message : "Failed to delete image.");
    } finally {
      setDeletingId(null);
    }
  };

  /* ========================================================= */
  /* SAVED */
  /* ========================================================= */

  const handleSaved = (savedImage: GalleryImage) => {
    setImages((current) => {
      const exists = current.some((item) => item.id === savedImage.id);

      if (exists) {
        return current.map((item) => (item.id === savedImage.id ? savedImage : item));
      }

      return [savedImage, ...current];
    });

    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* =================================================== */}
      {/* HEADER */}
      {/* =================================================== */}

      <section className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Images className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Gallery Management
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add, edit and manage Masjid gallery images.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-[0.98]"
            >
              <ImagePlus className="h-5 w-5" />
              Add New Image
            </button>
          </div>
        </div>
      </section>

      {/* =================================================== */}
      {/* CONTENT */}
      {/* =================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Loading */}

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />

              <p className="text-sm text-muted-foreground">Loading gallery...</p>
            </div>
          </div>
        )}

        {/* Empty */}

        {!loading && images.length === 0 && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed bg-card p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Images className="h-8 w-8" />
            </div>

            <h2 className="text-xl font-semibold text-foreground">No Gallery Images</h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Add images related to Masjid activities, events, Ramadan, Quran classes and community
              activities.
            </p>

            <button
              type="button"
              onClick={handleAdd}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <ImagePlus className="h-5 w-5" />
              Add First Image
            </button>
          </div>
        )}

        {/* Gallery */}

        {!loading && images.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((image) => (
              <GalleryAdminCard
                key={image.id}
                image={image}
                deleting={deletingId === image.id}
                onView={() => setSelectedImage(image)}
                onEdit={() => handleEdit(image)}
                onDelete={() => handleDelete(image)}
              />
            ))}
          </div>
        )}
      </main>

      {/* =================================================== */}
      {/* FORM MODAL */}
      {/* =================================================== */}

      {showModal && (
        <GalleryFormModal image={editingImage} onClose={handleCloseModal} onSaved={handleSaved} />
      )}

      {/* =================================================== */}
      {/* IMAGE VIEWER */}
      {/* =================================================== */}

      {selectedImage && (
        <ImageViewer image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}

/* ============================================================= */
/* GALLERY ADMIN CARD */
/* ============================================================= */

function GalleryAdminCard({
  image,
  deleting,
  onView,
  onEdit,
  onDelete,
}: {
  image: GalleryImage;
  deleting: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}

      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image.image_url}
          alt={image.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <button
          type="button"
          onClick={onView}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
          aria-label="View image"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}

      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold text-foreground">{image.title}</h3>

        {image.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{image.description}</p>
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            disabled={deleting}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-destructive/20 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================= */
/* ADD / EDIT FORM */
/* ============================================================= */

function GalleryFormModal({
  image,
  onClose,
  onSaved,
}: {
  image: GalleryImage | null;
  onClose: () => void;
  onSaved: (image: GalleryImage) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState(image?.title ?? "");

  const [description, setDescription] = useState(image?.description ?? "");

  const [file, setFile] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(image?.image_url ?? null);

  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(image);

  /* ======================================================= */
  /* FILE CHANGE */
  /* ======================================================= */

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    console.log("Selected gallery file:", selectedFile);

    if (!selectedFile) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error(`Invalid image type: ${selectedFile.type || "unknown"}`);

      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      toast.error("Image size must be less than 5 MB.");

      event.target.value = "";
      return;
    }

    setFile(selectedFile);

    const objectUrl = URL.createObjectURL(selectedFile);

    setPreview(objectUrl);

    console.log("Gallery preview created:", objectUrl);
  };

  /* ======================================================= */
  /* REMOVE FILE */
  /* ======================================================= */

  const handleRemoveFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (image) {
      setPreview(image.image_url);
    } else {
      setPreview(null);
    }
  };

  /* ======================================================= */
  /* SUBMIT */
  /* ======================================================= */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("========== GALLERY SUBMIT ==========");

    console.log("Title:", title);
    console.log("Description:", description);
    console.log("File:", file);
    console.log("Editing:", isEditing);

    if (!title.trim()) {
      toast.error("Please enter an image title.");
      return;
    }

    if (!isEditing && !file) {
      toast.error("Please select an image.");
      return;
    }

    try {
      setSaving(true);

      toast.loading(isEditing ? "Updating gallery image..." : "Uploading gallery image...", {
        id: "gallery-upload",
      });

      let savedImage: GalleryImage;

      /* ================================================= */
      /* UPDATE */
      /* ================================================= */

      if (isEditing && image) {
        console.log("Updating gallery image:", image.id);

        savedImage = await updateGalleryImage({
          id: image.id,
          title: title.trim(),
          description: description.trim(),
          file,
        });

        console.log("Updated gallery image:", savedImage);

        toast.success("Gallery image updated successfully.", {
          id: "gallery-upload",
        });
      } else {

      /* ================================================= */
      /* ADD */
      /* ================================================= */
        console.log("Uploading new gallery image...");

        savedImage = await addGalleryImage({
          file: file!,
          title: title.trim(),
          description: description.trim(),
        });

        console.log("Uploaded gallery image:", savedImage);

        toast.success("Gallery image uploaded successfully.", {
          id: "gallery-upload",
        });
      }

      onSaved(savedImage);
    } catch (error) {
      console.error("========== GALLERY ERROR ==========");

      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong while uploading the image.",
        {
          id: "gallery-upload",
        },
      );
    } finally {
      setSaving(false);
    }
  };

  /* ======================================================= */
  /* MODAL */
  /* ======================================================= */

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-background shadow-2xl">
        {/* Header */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              {isEditing ? "Edit Gallery Image" : "Add Gallery Image"}
            </h2>

            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {isEditing
                ? "Update the image information."
                : "Upload an image related to the Masjid."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          {/* ================================================= */}
          {/* IMAGE */}
          {/* ================================================= */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Image</label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />

            {preview ? (
              <div className="relative overflow-hidden rounded-xl border bg-muted">
                <div className="aspect-video">
                  <img src={preview} alt="Gallery preview" className="h-full w-full object-cover" />
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-black/90 disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    Change Image
                  </button>

                  {file && (
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-lg bg-destructive/90 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-destructive disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/40 text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-50"
              >
                <ImagePlus className="mb-3 h-10 w-10" />

                <span className="font-semibold">Choose an image</span>

                <span className="mt-1 text-xs">JPG, PNG, WEBP or GIF • Max 5 MB</span>
              </button>
            )}
          </div>

          {/* ================================================= */}
          {/* TITLE */}
          {/* ================================================= */}

          <div>
            <label
              htmlFor="gallery-title"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Title
            </label>

            <input
              id="gallery-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: Ramadan Iftar"
              disabled={saving}
              maxLength={150}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>

          {/* ================================================= */}
          {/* DESCRIPTION */}
          {/* ================================================= */}

          <div>
            <label
              htmlFor="gallery-description"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Description
              <span className="ml-1 font-normal text-muted-foreground">(Optional)</span>
            </label>

            <textarea
              id="gallery-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe this Masjid activity or event..."
              disabled={saving}
              maxLength={500}
              rows={4}
              className="w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />

            <p className="mt-1 text-right text-xs text-muted-foreground">
              {description.length}/500
            </p>
          </div>

          {/* ================================================= */}
          {/* ACTIONS */}
          {/* ================================================= */}

          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !title.trim() || (!isEditing && !file)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  {isEditing ? "Updating..." : "Uploading..."}
                </>
              ) : (
                <>
                  {isEditing ? <Pencil className="h-4 w-4" /> : <Upload className="h-4 w-4" />}

                  {isEditing ? "Update Image" : "Upload Image"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================= */
/* IMAGE VIEWER */
/* ============================================================= */

function ImageViewer({ image, onClose }: { image: GalleryImage; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
        aria-label="Close image viewer"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="flex max-h-[90vh] max-w-6xl flex-col items-center">
        <img
          src={image.image_url}
          alt={image.title}
          className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl"
        />

        <div className="mt-4 max-w-2xl text-center text-white">
          <h2 className="text-xl font-bold">{image.title}</h2>

          {image.description && <p className="mt-1 text-sm text-white/70">{image.description}</p>}
        </div>
      </div>
    </div>
  );
}
