import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Download, Link2 } from 'lucide-react';
import { analyzeDocument } from '../lib/preflight';
import { buildExportShareUrl, openPdfPrintPreview } from '../lib/export';
import { splitContentIntoPages } from '../lib/paging';
import ReactMarkdown from 'react-markdown';
import { markdownUrlTransform } from '../lib/markdown';
import { toast } from 'sonner';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  content: string;
  documentName?: string;
  onReviewLayout: () => void;
}

export function ExportModal({ open, onClose, content, documentName, onReviewLayout }: ExportModalProps) {
  const [isPreparingPreview, setIsPreparingPreview] = useState(false);
  const [quality, setQuality] = useState(85);
  const [compression, setCompression] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [watermark, setWatermark] = useState(false);
  const preflight = analyzeDocument(content);
  const hasMajorIssues = preflight.severity === 'major';
  const estimatedPages = Math.max(1, Math.ceil(Math.max(content.trim().length, 1) / 1800));
  const previewPages = splitContentIntoPages(content, 1800).slice(0, 4);

  useEffect(() => {
    if (!open) return;
    setIsPreparingPreview(true);
    const timer = window.setTimeout(() => {
      setIsPreparingPreview(false);
      toast.success('Final layout generated');
    }, 900);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl">Export document</DialogTitle>
          <p className="text-sm text-neutral-500">Preview and finalize output.</p>
        </DialogHeader>

        <div className="flex gap-6 flex-1 overflow-hidden px-6 pb-6">
          {/* Preview */}
          <div className="flex-1 flex flex-col">
            <div className="mb-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Final preview</Label>
            </div>
            <ScrollArea className="flex-1 bg-neutral-100 rounded-lg p-6">
              {isPreparingPreview ? (
                <div className="h-full min-h-[320px] flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-base font-semibold text-neutral-800">Preparing preview</h3>
                    <p className="mt-2 text-sm text-neutral-600">
                      DocKernel is generating a final layout for export.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {previewPages.map((page, index) => (
                    <div key={`export-preview-${index + 1}`} className="bg-white rounded shadow-sm p-8 aspect-[1/1.414] overflow-hidden">
                      <div className="text-xs text-neutral-400 mb-4">Page {index + 1}</div>
                      <div className="prose prose-sm max-w-none text-neutral-700">
                        <ReactMarkdown urlTransform={markdownUrlTransform}>{page}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Settings */}
          <div className="w-80 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="space-y-6 pr-2">
                {hasMajorIssues && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-amber-900">Export paused</h3>
                    <p className="text-sm text-amber-800">
                      Resolve layout warnings shown in Preflight to ensure a clean output.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        onClose();
                        onReviewLayout();
                      }}
                    >
                      Review layout
                    </Button>
                  </div>
                )}

                {preflight.hasLargeDocument && (
                  <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                    <h3 className="text-sm font-semibold text-neutral-900">Large document detected</h3>
                    <p className="mt-1 text-sm text-neutral-600">
                      Rendering may take a moment. Consider enabling compression before export.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-wide text-neutral-500">
                    Page Count
                  </Label>
                  <div className="text-2xl font-semibold text-neutral-900">{estimatedPages} pages</div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-wide text-neutral-500">
                    Quality
                  </Label>
                  <p className="text-xs text-neutral-500">Higher quality increases file size.</p>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-neutral-700">Output quality</span>
                      <span className="text-sm text-neutral-500">{quality >= 85 ? 'High' : quality >= 60 ? 'Balanced' : 'Draft'}</span>
                    </div>
                    <Slider value={[quality]} onValueChange={(value) => setQuality(value[0] ?? 85)} max={100} step={5} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm text-neutral-700">Compression</Label>
                      <p className="mt-1 text-xs text-neutral-500">Reduce file size for sharing.</p>
                    </div>
                    <Switch checked={compression} onCheckedChange={setCompression} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm text-neutral-700">Include metadata</Label>
                      <p className="mt-1 text-xs text-neutral-500">Adds title and author info to PDF.</p>
                    </div>
                    <Switch checked={includeMetadata} onCheckedChange={setIncludeMetadata} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm text-neutral-700">Watermark</Label>
                      <p className="mt-1 text-xs text-neutral-500">Add a faint mark to each page.</p>
                    </div>
                    <Switch checked={watermark} onCheckedChange={setWatermark} />
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="mt-6 space-y-2">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={async () => {
                  const shareUrl = buildExportShareUrl({
                    title: (documentName?.trim() || 'DocKernel Export').slice(0, 120),
                    content,
                    options: {
                      title: (documentName?.trim() || 'DocKernel Export').slice(0, 120),
                      quality,
                      compression,
                      includeMetadata,
                      watermark,
                    },
                    createdAt: new Date().toISOString(),
                  });
                  if (!shareUrl) {
                    toast.error('Document is too large for URL export. Use Download PDF.');
                    return;
                  }
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    toast.success('Export link copied');
                  } catch {
                    toast.error('Could not copy export link');
                  }
                }}
              >
                <Link2 className="w-4 h-4" />
                Copy export link
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => {
                  const shareUrl = buildExportShareUrl({
                    title: (documentName?.trim() || 'DocKernel Export').slice(0, 120),
                    content,
                    options: {
                      title: (documentName?.trim() || 'DocKernel Export').slice(0, 120),
                      quality,
                      compression,
                      includeMetadata,
                      watermark,
                    },
                    createdAt: new Date().toISOString(),
                  });
                  if (!shareUrl) {
                    toast.error('Document is too large for URL export. Use Download PDF.');
                    return;
                  }
                  window.open(shareUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                <Link2 className="w-4 h-4" />
                Open online preview
              </Button>
              <Button
                className="w-full gap-2 bg-neutral-900 hover:bg-neutral-800"
                disabled={hasMajorIssues}
                onClick={() => {
                  const ok = openPdfPrintPreview(content, {
                    title: (documentName?.trim() || 'DocKernel Export').slice(0, 120),
                    quality,
                    compression,
                    includeMetadata,
                    watermark,
                  });
                  if (!ok) {
                    toast.error('Popup blocked. Allow popups to export PDF.');
                    return;
                  }
                  toast.success('Print dialog opened. Choose Save as PDF.');
                }}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button variant="outline" className="w-full" onClick={onClose}>
                Back to document
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
