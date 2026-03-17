export function formatKoreanDate(isoString: string): string {
  const date = new Date(isoString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${String(date.getDate()).padStart(2, '0')}일`;
}
