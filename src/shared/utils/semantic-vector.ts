const DEFAULT_DIMENSION = 128;

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hashToken(token: string, dimension: number): number {
  let hash = 2166136261;
  for (let i = 0; i < token.length; i += 1) {
    hash ^= token.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % dimension;
}

function buildNgrams(token: string): string[] {
  if (token.length <= 2) {
    return [token];
  }
  const ngrams: string[] = [];
  for (let i = 0; i < token.length - 1; i += 1) {
    ngrams.push(token.slice(i, i + 2));
  }
  return ngrams;
}

export function createHashedEmbedding(text: string, dimension = DEFAULT_DIMENSION): number[] {
  const vector = Array.from({ length: dimension }, () => 0);
  const normalized = normalizeText(text);
  if (!normalized) {
    return vector;
  }

  const tokens = normalized.split(' ').filter(Boolean);
  for (const token of tokens) {
    const units = buildNgrams(token);
    for (const unit of units) {
      const index = hashToken(unit, dimension);
      vector[index] += 1;
    }
  }

  const magnitude = Math.sqrt(vector.reduce((acc, value) => acc + value * value, 0));
  if (magnitude === 0) {
    return vector;
  }

  return vector.map(value => value / magnitude);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) {
    return 0;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
