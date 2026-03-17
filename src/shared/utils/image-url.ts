// NOTE: Supabase 이미지 리사이징은 유료 기능(Transform)으로 현재 비활성화.
// 유료 플랜 전환 시 아래 주석을 해제하고 현재 구현부를 교체하면 됩니다.
//
// const SUPABASE_OBJECT_PUBLIC_PATH = '/storage/v1/object/public/';
// const SUPABASE_RENDER_PUBLIC_PATH = '/storage/v1/render/image/public/';

/**
 * Supabase 이미지 URL을 반환합니다.
 * (리사이징 비활성화 중 - 원본 URL 그대로 반환)
 */
export function toSupabaseResizedImageUrl(
  imageUrl: string | null | undefined,
  _width: number = 1024,
  _height: number = 1024,
): string | null {
  // _width, _height는 유료 플랜 전환 시 사용 예정
  void _width;
  void _height;

  if (!imageUrl) {
    return null;
  }
  return imageUrl;

  // --- 유료 플랜 전환 시 아래로 교체 ---
  // if (!/^https?:\/\//i.test(imageUrl)) return imageUrl;
  // try {
  //   const url = new URL(imageUrl);
  //   if (url.pathname.includes(SUPABASE_OBJECT_PUBLIC_PATH)) {
  //     url.pathname = url.pathname.replace(SUPABASE_OBJECT_PUBLIC_PATH, SUPABASE_RENDER_PUBLIC_PATH);
  //   } else if (!url.pathname.includes(SUPABASE_RENDER_PUBLIC_PATH)) {
  //     return imageUrl;
  //   }
  //   url.searchParams.set('width', String(_width));
  //   url.searchParams.set('height', String(_height));
  //   return url.toString();
  // } catch {
  //   return imageUrl;
  // }
}
