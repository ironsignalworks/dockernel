import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { splitContentIntoPages } from '../lib/paging';
import { markdownUrlTransform } from '../lib/markdown';
import { openPdfPrintPreview, type ExportSharePayload } from '../lib/export';
import { ArrowLeft, Download, Link2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExportShareViewProps {
  payload: ExportSharePayload;
}

export function ExportShareView({ payload }: ExportShareViewProps) {
  const pages = splitContentIntoPages(payload.content, 1800);

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 backdrop-blur px-4 py-3">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete('view');
              url.searchParams.delete('share');
              window.location.href = url.toString();
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to editor
          </Button>
          <div className="min-w-0 text-center">
            <h1 className="truncate text-sm font-semibold text-neutral-900">{payload.title || 'Shared Export'}</h1>
            <p className="text-xs text-neutral-500">Online PDF preview</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied');
                } catch {
                  toast.error('Could not copy link');
                }
              }}
            >
              <Link2 className="w-4 h-4" />
              Copy link
            </Button>
            <Button
              size="sm"
              className="bg-neutral-900 hover:bg-neutral-800"
              onClick={() => {
                const ok = openPdfPrintPreview(payload.content, {
                  ...payload.options,
                  title: payload.title,
                });
                if (!ok) {
                  toast.error('Popup blocked. Allow popups to export PDF.');
                }
              }}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
        {pages.map((page, index) => (
          <section key={`shared-page-${index + 1}`} className="mx-auto aspect-[1/1.414] w-full max-w-[794px] rounded-lg border border-neutral-200 bg-white p-10 shadow-sm overflow-hidden">
            <div className="mb-3 text-xs text-neutral-400">Page {index + 1}</div>
            <div className="prose prose-neutral max-w-none text-sm">
              <ReactMarkdown urlTransform={markdownUrlTransform}>{page}</ReactMarkdown>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

