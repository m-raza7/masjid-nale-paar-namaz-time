-- ============================================
-- MASJID GALLERY
-- ============================================

CREATE TABLE public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,

    description TEXT,

    image_url TEXT NOT NULL,

    image_path TEXT NOT NULL,

    created_by UUID
        REFERENCES auth.users(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================
-- GRANTS
-- ============================================

GRANT SELECT
ON public.gallery_images
TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE
ON public.gallery_images
TO authenticated;

GRANT ALL
ON public.gallery_images
TO service_role;


-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.gallery_images
ENABLE ROW LEVEL SECURITY;


-- ============================================
-- EVERYONE CAN VIEW GALLERY
-- ============================================

CREATE POLICY "Anyone can view gallery images"
ON public.gallery_images
FOR SELECT
USING (true);


-- ============================================
-- ONLY ADMINS CAN INSERT
-- ============================================

CREATE POLICY "Admins can insert gallery images"
ON public.gallery_images
FOR INSERT
TO authenticated
WITH CHECK (
    public.has_role(auth.uid(), 'admin')
);


-- ============================================
-- ONLY ADMINS CAN UPDATE
-- ============================================

CREATE POLICY "Admins can update gallery images"
ON public.gallery_images
FOR UPDATE
TO authenticated
USING (
    public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
    public.has_role(auth.uid(), 'admin')
);


-- ============================================
-- ONLY ADMINS CAN DELETE
-- ============================================

CREATE POLICY "Admins can delete gallery images"
ON public.gallery_images
FOR DELETE
TO authenticated
USING (
    public.has_role(auth.uid(), 'admin')
);


-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE TRIGGER trg_gallery_images_updated
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();