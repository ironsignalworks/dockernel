export function markdownUrlTransform(url: string): string {
  const trimmed = (url ?? '').trim();
  if (!trimmed) return '';
  if (/^(blob:|data:|https?:|mailto:|tel:|\/|\.\/|\.\.\/|#)/i.test(trimmed)) {
    return trimmed;
  }
  return '';
}

