export interface ExportOptions {
  title?: string;
  quality: number;
  compression: boolean;
  includeMetadata: boolean;
  watermark: boolean;
}

export interface ExportSharePayload {
  title: string;
  content: string;
  options: ExportOptions;
  createdAt: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function openPdfPrintPreview(content: string, options: ExportOptions): boolean {
  const docTitle = (options.title?.trim() || 'DocKernel Export').slice(0, 120);
  const source = content.trim();
  const fallbackBody = 'No content available.';
  const bodyText = source.length > 0 ? source : fallbackBody;
  const escapedBody = escapeHtml(bodyText);
  const escapedTitle = escapeHtml(docTitle);
  const metadataBlock = options.includeMetadata
    ? `<div class="meta">Title: ${escapedTitle}</div>`
    : '';
  const watermarkBlock = options.watermark
    ? '<div class="watermark">DocKernel</div>'
    : '';
  const qualityHint = options.quality >= 85 ? 'high' : options.quality >= 60 ? 'medium' : 'draft';
  const compressionHint = options.compression ? 'enabled' : 'disabled';

  const popup = window.open('', '_blank', 'noopener,noreferrer');
  if (!popup) {
    return false;
  }

  popup.document.open();
  popup.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapedTitle}</title>
    <style>
      @page { size: A4; margin: 18mm; }
      body {
        font-family: Inter, Arial, sans-serif;
        color: #111827;
        background: #ffffff;
        margin: 0;
        padding: 0;
      }
      .page {
        position: relative;
        padding: 0;
        margin: 0 auto;
        max-width: 210mm;
      }
      h1 {
        font-size: 20px;
        margin: 0 0 6px;
      }
      .meta {
        font-size: 12px;
        color: #6b7280;
        margin-bottom: 14px;
      }
      .preflight {
        font-size: 11px;
        color: #6b7280;
        margin-bottom: 14px;
      }
      .content {
        font-size: 13px;
        line-height: 1.55;
        white-space: pre-wrap;
        word-break: break-word;
      }
      .watermark {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 48px;
        color: rgba(17, 24, 39, 0.08);
        letter-spacing: 2px;
        transform: rotate(-24deg);
        pointer-events: none;
        user-select: none;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <h1>${escapedTitle}</h1>
      ${metadataBlock}
      <div class="preflight">Quality: ${qualityHint} | Compression: ${compressionHint}</div>
      <div class="content">${escapedBody}</div>
    </div>
    ${watermarkBlock}
  </body>
</html>`);
  popup.document.close();

  window.setTimeout(() => {
    popup.focus();
    popup.print();
  }, 250);

  return true;
}

function encodeBase64Url(value: string): string {
  const utf8Bytes = new TextEncoder().encode(value);
  let binary = '';
  utf8Bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + '='.repeat(padLength);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function buildExportShareUrl(payload: ExportSharePayload): string | null {
  try {
    const url = new URL(window.location.href);
    const encoded = encodeBase64Url(JSON.stringify(payload));
    url.searchParams.set('view', 'pdf');
    url.searchParams.set('share', encoded);
    const output = url.toString();
    if (output.length > 7000) return null;
    return output;
  } catch {
    return null;
  }
}

export function readExportSharePayloadFromLocation(): ExportSharePayload | null {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') !== 'pdf') return null;
    const share = params.get('share');
    if (!share) return null;
    const parsed = JSON.parse(decodeBase64Url(share)) as ExportSharePayload;
    if (!parsed || typeof parsed.content !== 'string' || typeof parsed.title !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}
