const SUPABASE_OBJECT_PUBLIC_PATH = '/storage/v1/object/public/';
const SUPABASE_RENDER_PUBLIC_PATH = '/storage/v1/render/image/public/';

export function toSupabaseResizedImageUrl(
  imageUrl: string | null | undefined,
  width: number = 124,
  height: number = 124,
): string | null {
  if (!imageUrl) {
    return null;
  }

  // Keep local fallback images untouched (e.g. /temp_tulip.png).
  if (!/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);

    if (url.pathname.includes(SUPABASE_OBJECT_PUBLIC_PATH)) {
      url.pathname = url.pathname.replace(
        SUPABASE_OBJECT_PUBLIC_PATH,
        SUPABASE_RENDER_PUBLIC_PATH,
      );
    } else if (!url.pathname.includes(SUPABASE_RENDER_PUBLIC_PATH)) {
      return imageUrl;
    }

    url.searchParams.set('width', String(width));
    url.searchParams.set('height', String(height));

    return url.toString();
  } catch {
    return imageUrl;
  }
}
