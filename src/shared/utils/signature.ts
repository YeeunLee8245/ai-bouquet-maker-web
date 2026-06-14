import crypto from 'crypto';

/**
 * 꽃다발 레시피 ID에 대한 보안 서명(HMAC-SHA256)을 생성합니다.
 * 카드 메시지 노출용 링크 검증에 사용됩니다.
 */
export function generateMessageSignature(id: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY_DEFAULT || 'default-bouquet-secret-salt';
  return crypto
    .createHmac('sha256', secret)
    .update(id)
    .digest('hex');
}
