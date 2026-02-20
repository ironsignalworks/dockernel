export const PAGE_BREAK_TOKEN = '<!--DK_PAGE_BREAK-->';

export function splitContentIntoPages(content: string, approxCharsPerPage: number): string[] {
  const source = (content ?? '').trim();
  if (!source) return [''];

  const explicitSegments = source
    .split(new RegExp(`\\s*${PAGE_BREAK_TOKEN}\\s*`, 'g'))
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
  const segments = explicitSegments.length > 0 ? explicitSegments : [source];
  const pages: string[] = [];

  for (const segment of segments) {
    // Wrap very long lines so visual pagination is more predictable and avoids mid-page crop.
    const wrapped = segment
      .split('\n')
      .map((line) => {
        const trimmedLine = line.trim();
        const isMarkdownImageLine = /^!\[[^\]]*]\([^)]+\)$/.test(trimmedLine);
        if (isMarkdownImageLine) return line;
        if (line.length <= 120) return line;
        const parts: string[] = [];
        let rest = line;
        while (rest.length > 120) {
          parts.push(rest.slice(0, 120));
          rest = rest.slice(120);
        }
        if (rest.length > 0) parts.push(rest);
        return parts.join('\n');
      })
      .join('\n');

    const blocks = wrapped.split(/\n{2,}/).filter((part) => part.trim().length > 0);
    let current = '';

    const splitOversizedBlock = (block: string): string[] => {
      const pieces: string[] = [];
      let rest = block.trim();
      while (rest.length > approxCharsPerPage) {
        // Prefer a newline boundary, then whitespace, then hard cut.
        let cut = rest.lastIndexOf('\n', approxCharsPerPage);
        if (cut < approxCharsPerPage * 0.5) {
          cut = rest.lastIndexOf(' ', approxCharsPerPage);
        }
        if (cut < approxCharsPerPage * 0.5) {
          cut = approxCharsPerPage;
        }
        pieces.push(rest.slice(0, cut).trim());
        rest = rest.slice(cut).trim();
      }
      if (rest.length > 0) pieces.push(rest);
      return pieces.length > 0 ? pieces : [block];
    };

    for (const block of blocks) {
      const blockParts = block.length > approxCharsPerPage ? splitOversizedBlock(block) : [block];
      for (const part of blockParts) {
        const candidate = current ? `${current}\n\n${part}` : part;
        if (candidate.length > approxCharsPerPage && current) {
          pages.push(current);
          current = part;
        } else {
          current = candidate;
        }
      }
    }

    if (current) pages.push(current);
  }

  return pages.length > 0 ? pages : [''];
}
