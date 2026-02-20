import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Minus, Plus, RotateCcw } from 'lucide-react';
import { splitContentIntoPages } from '../lib/paging';

interface PreviewPanelProps {
  content: string;
  layoutFormat?: 'book' | 'zine' | 'catalogue' | 'report' | 'custom';
  fullBookPreview?: boolean;
  previewPageCount?: number;
  activePresetName?: string;
}

export function PreviewPanel({
  content,
  layoutFormat = 'zine',
  fullBookPreview = false,
  previewPageCount = 12,
  activePresetName = 'Default',
}: PreviewPanelProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(0.8);
  const [showMargins, setShowMargins] = useState(true);
  const [spreadView, setSpreadView] = useState(false);
  const [syncScroll, setSyncScroll] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const clampZoom = (value: number) => Math.min(2.5, Math.max(0.35, value));

  const fitToViewport = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const sizeMap: Record<'book' | 'zine' | 'catalogue' | 'report' | 'custom', { width: number; height: number }> = {
      book: { width: 794, height: 1123 },
      zine: { width: 680, height: 960 },
      catalogue: { width: 860, height: 1123 },
      report: { width: 794, height: 1123 },
      custom: { width: 794, height: 1123 },
    };
    const size = sizeMap[layoutFormat];
    const pageWidth = spreadView ? size.width * 2 + 24 : size.width;
    const pageHeight = size.height;
    const padding = 80;
    const fitScale = Math.min(
      (viewport.clientWidth - padding) / pageWidth,
      (viewport.clientHeight - padding) / pageHeight,
      1.5,
    );
    setZoom(clampZoom(fitScale));
  }, [layoutFormat, spreadView]);

  useEffect(() => {
    fitToViewport();
    const onResize = () => fitToViewport();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [fitToViewport]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === viewportRef.current);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    if (document.fullscreenElement === viewport) {
      await document.exitFullscreen();
      return;
    }

    await viewport.requestFullscreen();
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Trackpad pinch and modifier+wheel should zoom.
    const shouldZoom = e.ctrlKey || e.metaKey;
    if (!shouldZoom) return;

    e.preventDefault();
    const step = Math.abs(e.deltaY) > 30 ? 0.08 : 0.04;
    const zoomDelta = e.deltaY > 0 ? -step : step;
    setZoom((prev) => clampZoom(prev + zoomDelta));
  };

  const trimmedContent = content.trim();
  const hasContent = trimmedContent.length > 0;
  const pageDimensionsByFormat: Record<typeof layoutFormat, { width: number; height: number }> = {
    book: { width: 794, height: 1123 },
    zine: { width: 680, height: 960 },
    catalogue: { width: 860, height: 1123 },
    report: { width: 794, height: 1123 },
    custom: { width: 794, height: 1123 },
  };
  const pageClassByFormat: Record<typeof layoutFormat, string> = {
    book: 'w-[794px] min-h-[1123px] p-16',
    zine: 'w-[680px] min-h-[960px] p-14',
    catalogue: 'w-[860px] min-h-[1123px] p-12',
    report: 'w-[794px] min-h-[1123px] p-14',
    custom: 'w-[794px] min-h-[1123px] p-16',
  };
  const contentClassByFormat: Record<typeof layoutFormat, string> = {
    book: 'prose prose-neutral max-w-none whitespace-pre-wrap break-all',
    zine: 'prose prose-neutral max-w-none text-[15px] leading-7 whitespace-pre-wrap break-all',
    catalogue: 'prose prose-neutral max-w-none columns-2 gap-8 whitespace-pre-wrap break-all',
    report: 'prose prose-neutral max-w-none whitespace-pre-wrap break-all',
    custom: 'prose prose-neutral max-w-none whitespace-pre-wrap break-all',
  };
  const formatLabel = layoutFormat.charAt(0).toUpperCase() + layoutFormat.slice(1);
  const targetPages = fullBookPreview ? Math.min(Math.max(previewPageCount, 2), 24) : 2;
  const baseChunks = splitContentIntoPages(content, layoutFormat === 'catalogue' ? 1400 : 1800);
  const pageChunks =
    baseChunks.length >= targetPages
      ? baseChunks.slice(0, targetPages)
      : [...baseChunks, ...Array.from({ length: targetPages - baseChunks.length }, () => '')];
  const maxPageIndex = Math.max(0, pageChunks.length - 1);
  const leftPageIndex = spreadView ? Math.max(0, Math.floor(currentPage / 2) * 2) : currentPage;
  const rightPageIndex = Math.min(maxPageIndex, leftPageIndex + 1);
  const activeSize = pageDimensionsByFormat[layoutFormat];
  const spreadGapPx = 24;
  const rawFrameWidth = spreadView ? activeSize.width * 2 + spreadGapPx : activeSize.width;
  const rawFrameHeight = activeSize.height;
  const zoomedFrameWidth = Math.round(rawFrameWidth * zoom);
  const zoomedFrameHeight = Math.round(rawFrameHeight * zoom);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, maxPageIndex));
  }, [maxPageIndex]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = 0;
    viewport.scrollLeft = 0;
  }, [currentPage, spreadView, layoutFormat]);

  const goPrev = () => {
    setCurrentPage((prev) => Math.max(0, prev - (spreadView ? 2 : 1)));
  };

  const goNext = () => {
    setCurrentPage((prev) => Math.min(maxPageIndex, prev + (spreadView ? 2 : 1)));
  };

  const parseSingleImageMarkdown = (pageMarkdown: string): string | null => {
    const trimmed = pageMarkdown.trim();
    if (!trimmed) return null;
    const match = trimmed.match(/^!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)$/);
    return match?.[1] ?? null;
  };

  return (
    <div className="h-full bg-neutral-100 flex flex-col items-center">
      {/* Preview Controls */}
      <div className="w-full px-6 py-3 bg-white border-b border-neutral-200 flex flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs text-neutral-500 uppercase tracking-wide">Layout Preview</div>
            <p className="mt-1 text-xs text-neutral-500">
              This view matches the final export. Preset: {activePresetName}.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 whitespace-nowrap max-w-full overflow-x-auto">
            <button
              onClick={() => setZoom((prev) => clampZoom(prev - 0.1))}
              className="h-8 w-8 inline-flex items-center justify-center text-xs text-neutral-600 hover:text-neutral-900 rounded-md border border-neutral-300 shadow-sm hover:border-neutral-400 transition-colors"
              title="Zoom out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((prev) => clampZoom(prev + 0.1))}
              className="h-8 w-8 inline-flex items-center justify-center text-xs text-neutral-600 hover:text-neutral-900 rounded-md border border-neutral-300 shadow-sm hover:border-neutral-400 transition-colors"
              title="Zoom in"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
              }}
              className="h-8 w-8 inline-flex items-center justify-center text-xs text-neutral-600 hover:text-neutral-900 rounded-md border border-neutral-300 shadow-sm hover:border-neutral-400 transition-colors"
              title="Reset view"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="h-8 w-8 inline-flex items-center justify-center text-xs text-neutral-600 hover:text-neutral-900 rounded-md border border-neutral-300 shadow-sm hover:border-neutral-400 transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <div className="pl-1 min-w-[3.75rem] shrink-0 text-xs text-neutral-500 tabular-nums">
              {Math.round(zoom * 100)}%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowMargins((prev) => !prev)}
            className={`h-8 px-3 text-xs rounded-md border shadow-sm transition-colors ${
              showMargins
                ? 'text-neutral-900 border-neutral-500 bg-neutral-100'
                : 'text-neutral-600 border-neutral-300 hover:text-neutral-900 hover:border-neutral-400'
            }`}
          >
            Show margins
          </button>
          <button
            onClick={() => setSpreadView((prev) => !prev)}
            className={`h-8 px-3 text-xs rounded-md border shadow-sm transition-colors ${
              spreadView
                ? 'text-neutral-900 border-neutral-500 bg-neutral-100'
                : 'text-neutral-600 border-neutral-300 hover:text-neutral-900 hover:border-neutral-400'
            }`}
          >
            Spread view
          </button>
          <button
            onClick={() => setSyncScroll((prev) => !prev)}
            className={`h-8 px-3 text-xs rounded-md border shadow-sm transition-colors ${
              syncScroll
                ? 'text-neutral-900 border-neutral-500 bg-neutral-100'
                : 'text-neutral-600 border-neutral-300 hover:text-neutral-900 hover:border-neutral-400'
            }`}
          >
            Sync scroll
          </button>
          <div className="ml-auto inline-flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentPage <= 0}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white text-neutral-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="min-w-[5rem] text-center text-xs text-neutral-500 tabular-nums">
              {leftPageIndex + 1}{spreadView ? `-${rightPageIndex + 1}` : ''} / {pageChunks.length}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={currentPage >= maxPageIndex}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white text-neutral-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Canvas */}
      <div
        ref={viewportRef}
        onWheel={handleWheel}
        className="relative flex-1 w-full overflow-auto select-none"
      >
        <div className="min-h-full w-full p-8 flex items-start justify-center bg-neutral-100">
          {/* Page */}
          <div
            style={{
              width: `${zoomedFrameWidth}px`,
              height: `${zoomedFrameHeight}px`,
            }}
            className="will-change-transform"
          >
            <div
              style={{
                width: `${rawFrameWidth}px`,
                height: `${rawFrameHeight}px`,
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
              }}
              className={`grid gap-6 ${spreadView ? 'grid-cols-2' : 'grid-cols-1'}`}
            >
              {[leftPageIndex, ...(spreadView ? [rightPageIndex] : [])].map((pageIndex, idx) => {
                const pageMarkdown = pageChunks[pageIndex] || '';
                const singleImageUrl = parseSingleImageMarkdown(pageMarkdown);

                return (
                <div
                  key={`preview-page-${pageIndex}`}
                  className={`bg-white rounded-lg shadow-lg relative ${singleImageUrl ? 'p-4' : pageClassByFormat[layoutFormat]}`}
                >
                  {/* Page content with margins visible */}
                  <div
                    className={
                      singleImageUrl ? 'h-full w-full' : contentClassByFormat[layoutFormat]
                    }
                  >
                    {hasContent ? (
                      singleImageUrl ? (
                        <img
                          src={singleImageUrl}
                          alt={`Imported page ${pageIndex + 1}`}
                          className="h-full w-full rounded object-contain"
                          draggable={false}
                        />
                      ) : (
                        <ReactMarkdown>{pageMarkdown || pageChunks[0] || ''}</ReactMarkdown>
                      )
                    ) : (
                      <div className="text-neutral-500 text-center mt-32 space-y-2">
                        <h3 className="text-base font-semibold text-neutral-800">Preview will appear here</h3>
                        <p className="text-sm">
                          As you add content, DocKernel will format it into pages automatically.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Margin indicators - subtle guides */}
                  {showMargins && (
                    <div className="absolute inset-0 pointer-events-none border-[60px] border-neutral-50 rounded-lg" />
                  )}
                  
                  {/* Page number */}
                  <div className="absolute bottom-8 right-16 text-xs text-neutral-400 flex items-center gap-2">
                    <span className="rounded border border-neutral-300 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-neutral-500">
                      {formatLabel}
                    </span>
                    <span>{pageIndex + 1}{spreadView && idx === 1 ? 'R' : spreadView ? 'L' : ''}</span>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
