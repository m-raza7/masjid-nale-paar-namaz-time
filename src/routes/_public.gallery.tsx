import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Images, Loader2, X, Maximize2 } from "lucide-react";

import { getGalleryImages, type GalleryImage } from "@/lib/gallery";

export const Route = createFileRoute("/_public/gallery")({
  head: () => ({
    meta: [
      {
        title: "Gallery — Masjid Nale-paar",
      },
      {
        name: "description",
        content:
          "View Masjid Nale-paar activities, events, Ramadan programs, Quran classes and community moments.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);

      const data = await getGalleryImages();

      setImages(data);
    } catch (error) {
      console.error("Failed to load gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="arabesque absolute inset-0 opacity-20" />

        <div className="container relative mx-auto px-4 py-16 text-center md:py-24">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
            <Images className="h-8 w-8" />
          </div>

          <div className="mt-6 text-xs uppercase tracking-[0.25em] text-gold">Masjid Nale-paar</div>

          <h1 className="mt-3 font-display text-4xl md:text-6xl">Masjid Gallery</h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-primary-foreground/75 md:text-lg">
            Moments, activities and memories from our Masjid and community.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* GALLERY */}
      {/* ===================================================== */}

      <section className="container mx-auto px-4 py-12 md:py-20">
        {/* Section Header */}

        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold">Community Moments</div>

            <h2 className="mt-2 font-display text-3xl text-primary md:text-4xl">Our Gallery</h2>
          </div>

          {!loading && images.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {images.length} {images.length === 1 ? "image" : "images"}
            </div>
          )}
        </div>

        {/* =================================================== */}
        {/* LOADING */}
        {/* =================================================== */}

        {loading && (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>

              <p className="text-sm text-muted-foreground">Loading gallery...</p>
            </div>
          </div>
        )}

        {/* =================================================== */}
        {/* EMPTY */}
        {/* =================================================== */}

        {!loading && images.length === 0 && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Images className="h-8 w-8" />
            </div>

            <h3 className="mt-5 font-display text-2xl text-primary">No Gallery Images</h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Gallery images will appear here when they are added by the Masjid administration.
            </p>
          </div>
        )}

        {/* =================================================== */}
        {/* GALLERY GRID */}
        {/* =================================================== */}

        {!loading && images.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((image) => (
              <GalleryCard key={image.id} image={image} onClick={() => setSelectedImage(image)} />
            ))}
          </div>
        )}
      </section>

      {/* ===================================================== */}
      {/* IMAGE VIEWER */}
      {/* ===================================================== */}

      {selectedImage && (
        <GalleryViewer image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}

/* ============================================================= */
/* GALLERY CARD */
/* ============================================================= */

function GalleryCard({ image, onClick }: { image: GalleryImage; onClick: () => void }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
      {/* Image */}

      <button
        type="button"
        onClick={onClick}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-muted text-left"
        aria-label={`View ${image.title}`}
      >
        <img
          src={image.image_url}
          alt={image.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Overlay */}

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/35">
          <div className="flex h-11 w-11 scale-75 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <Maximize2 className="h-5 w-5" />
          </div>
        </div>
      </button>

      {/* Content */}

      <div className="p-4">
        <h3 className="line-clamp-1 font-display text-xl text-primary">{image.title}</h3>

        {image.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {image.description}
          </p>
        )}
      </div>
    </article>
  );
}

/* ============================================================= */
/* FULL SCREEN IMAGE VIEWER */
/* ============================================================= */

function GalleryViewer({ image, onClose }: { image: GalleryImage; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Close */}

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
        aria-label="Close image"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Image + Information */}

      <div className="flex max-h-[92vh] max-w-6xl flex-col items-center">
        <img
          src={image.image_url}
          alt={image.title}
          className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl"
        />

        <div className="mt-5 max-w-2xl text-center text-white">
          <h2 className="font-display text-2xl">{image.title}</h2>

          {image.description && (
            <p className="mt-2 text-sm leading-6 text-white/70">{image.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
