import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { TopBar } from './components/TopBar';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { InspectorPanel } from './components/InspectorPanel';
import { PaginatorPanel, type PaginatorAsset } from './components/PaginatorPanel';
import { ExportModal } from './components/ExportModal';
import { TemplateGrid } from './components/TemplateGrid';
import { SavedDocuments } from './components/SavedDocuments';
import { SettingsPanel } from './components/SettingsPanel';
import { ExportPresets } from './components/ExportPresets';
import { NewDocumentView } from './components/NewDocumentView';
import { AboutPage } from './components/AboutPage';
import { MobileWorkspace } from './components/MobileWorkspace';
import { TabletWorkspace } from './components/TabletWorkspace';
import { Toaster } from './components/ui/sonner';
import { PAGE_BREAK_TOKEN } from './lib/paging';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from './components/ui/resizable';
import { toast } from 'sonner';

const defaultMarkdown = '';

export default function App() {
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  const [activeNav, setActiveNav] = useState('new');
  const [content, setContent] = useState(defaultMarkdown);
  const [documentName, setDocumentName] = useState('');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStackedLayout, setIsStackedLayout] = useState(false);
  const [stackedWorkspaceTab, setStackedWorkspaceTab] = useState<'editor' | 'preview' | 'inspector'>('preview');
  const [layoutFormat, setLayoutFormat] = useState<'zine' | 'book' | 'catalogue' | 'report' | 'custom'>('zine');
  const [fullBookPreview, setFullBookPreview] = useState(false);
  const [previewPageCount, setPreviewPageCount] = useState(12);
  const [activePresetName, setActivePresetName] = useState('Default');
  const [paginatorAssets, setPaginatorAssets] = useState<Array<PaginatorAsset & { objectUrl?: string; textContent?: string }>>([]);
  const [compiledPaginatorPreview, setCompiledPaginatorPreview] = useState('');
  const [importedImageUrls, setImportedImageUrls] = useState<string[]>([]);
  const paginatorAssetsRef = useRef<Array<PaginatorAsset & { objectUrl?: string; textContent?: string }>>([]);
  const importedImageUrlsRef = useRef<string[]>([]);

  const isPhone = viewport.width < 768;
  const isTabletPortrait = viewport.width >= 768 && viewport.width < 1024;
  const isTabletLandscape = viewport.width >= 1024 && viewport.width < 1280;
  const isDesktopLayout = viewport.width >= 1280;

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(isDesktopLayout);
  }, [isDesktopLayout]);
  const isDocumentLoaded = showEditor || content.trim().length > 0 || documentName.trim().length > 0;

  const handleImportFile = async (file: File) => {
    const maxSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error('File too large. Limit is 2MB.');
      return;
    }

    const supportedTextExtensions = [
      '.md',
      '.markdown',
      '.txt',
      '.rtf',
      '.csv',
      '.json',
      '.xml',
      '.html',
      '.htm',
      '.yml',
      '.yaml',
    ];
    const supportedImageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
    const lowerName = file.name.toLowerCase();
    const isImage = file.type.startsWith('image/') || supportedImageExtensions.some((ext) => lowerName.endsWith(ext));
    const isSupportedText = supportedTextExtensions.some((ext) => lowerName.endsWith(ext));
    const isSupported = isSupportedText || isImage;
    if (!isSupported) {
      toast.error('Unsupported format. Use text files or images (png, jpg, webp, gif, svg).');
      return;
    }

    try {
      if (isImage) {
        const imageUrl = URL.createObjectURL(file);
        setImportedImageUrls((prev) => [...prev, imageUrl]);
        setContent((prev) => {
          const trimmedPrev = prev.trim();
          const prefix = trimmedPrev.length > 0 ? `${trimmedPrev}\n\n${PAGE_BREAK_TOKEN}\n\n` : '';
          return `${prefix}![${file.name}](${imageUrl})\n\n${PAGE_BREAK_TOKEN}`;
        });
      } else {
        const importedText = await file.text();
        setContent(importedText);
      }
      setShowEditor(true);
      setActiveNav('paginator');
      toast.success(`Imported ${file.name}`);
    } catch {
      toast.error('Could not read that file.');
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const buildCompiledPaginatorPreview = useCallback(() => {
    const title = documentName.trim() || 'Compiled Document';
    const assets = paginatorAssets;
    const textAssets = assets.filter((asset) => asset.kind === 'text');
    const imageAssets = assets.filter((asset) => asset.kind === 'image');
    const otherAssets = assets.filter((asset) => asset.kind === 'other');

    if (assets.length === 0) {
      setCompiledPaginatorPreview(content);
      return;
    }

    if (layoutFormat === 'catalogue') {
      const catalogueBlocks = imageAssets.length > 0
        ? imageAssets
            .map((asset, index) =>
              `${asset.objectUrl ? `![${asset.name}](${asset.objectUrl})\n\n${PAGE_BREAK_TOKEN}` : ''}\n\n### Item ${index + 1}: ${asset.name}\n\n- SKU: CAT-${String(index + 1).padStart(3, '0')}\n- Price: $${(index + 1) * 19}`,
            )
            .join('\n\n')
        : 'No image assets loaded yet.';

      const compiled = `# ${title}\n\n## Catalogue Layout\n\n${catalogueBlocks}`;
      setCompiledPaginatorPreview(compiled);
      return;
    }

    const textSection = textAssets.length > 0
      ? textAssets.map((asset, idx) => `## Section ${idx + 1}: ${asset.name}\n\n${asset.textContent ?? ''}`).join('\n\n')
      : content;
    const imageSection = imageAssets.length > 0
      ? `\n\n## Visual Assets\n\n${imageAssets
          .map((asset) => `### ${asset.name}\n\n${asset.objectUrl ? `![${asset.name}](${asset.objectUrl})\n\n${PAGE_BREAK_TOKEN}` : ''}`)
          .join('\n\n')}`
      : '';
    const attachmentSection = otherAssets.length > 0
      ? `\n\n## Attachments\n\n${otherAssets.map((asset) => `- ${asset.name} (${asset.sizeLabel})`).join('\n')}`
      : '';

    const headerByFormat: Record<'zine' | 'book' | 'report' | 'custom', string> = {
      zine: '## Zine Structure',
      book: '## Book Manuscript',
      report: '## Report Body',
      custom: '## Custom Template',
    };
    const formatKey = layoutFormat === 'catalogue' ? 'custom' : layoutFormat;
    const compiled = `# ${title}\n\n${headerByFormat[formatKey]}\n\n${textSection}${imageSection}${attachmentSection}`;
    setCompiledPaginatorPreview(compiled);
  }, [content, documentName, layoutFormat, paginatorAssets]);

  const handlePaginatorAssetImport = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const nextAssets = await Promise.all(
      files.map(async (file) => {
        const lower = file.name.toLowerCase();
        const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/.test(lower);
        const isText = /\.(md|markdown|txt|csv|json|xml|html|htm|yml|yaml)$/.test(lower) || file.type.startsWith('text/');

        if (isImage) {
          return {
            id: crypto.randomUUID(),
            name: file.name,
            kind: 'image' as const,
            sizeLabel: formatBytes(file.size),
            objectUrl: URL.createObjectURL(file),
          };
        }

        if (isText) {
          const text = await file.text();
          return {
            id: crypto.randomUUID(),
            name: file.name,
            kind: 'text' as const,
            sizeLabel: formatBytes(file.size),
            textContent: text.slice(0, 12000),
          };
        }

        return {
          id: crypto.randomUUID(),
          name: file.name,
          kind: 'other' as const,
          sizeLabel: formatBytes(file.size),
        };
      }),
    );

    setPaginatorAssets((prev) => [...prev, ...nextAssets]);
    toast.success(`Loaded ${nextAssets.length} file${nextAssets.length > 1 ? 's' : ''} for pagination`);
  };

  const removePaginatorAsset = (assetId: string) => {
    setPaginatorAssets((prev) => {
      const target = prev.find((asset) => asset.id === assetId);
      if (target?.objectUrl) URL.revokeObjectURL(target.objectUrl);
      return prev.filter((asset) => asset.id !== assetId);
    });
  };

  useEffect(() => {
    paginatorAssetsRef.current = paginatorAssets;
  }, [paginatorAssets]);

  useEffect(() => {
    importedImageUrlsRef.current = importedImageUrls;
  }, [importedImageUrls]);

  useEffect(() => {
    return () => {
      paginatorAssetsRef.current.forEach((asset) => {
        if (asset.objectUrl) URL.revokeObjectURL(asset.objectUrl);
      });
      importedImageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (compiledPaginatorPreview.length === 0) return;
    buildCompiledPaginatorPreview();
  }, [buildCompiledPaginatorPreview, compiledPaginatorPreview.length]);

  const renderMainContent = () => {
    const useStackedPanels = isStackedLayout;

    // Show new document welcome view
    if (activeNav === 'new' && !showEditor) {
      return (
        <NewDocumentView
          onStartBlank={() => {
            setShowEditor(true);
            setStackedWorkspaceTab('editor');
          }}
          onOpenTemplates={() => setActiveNav('templates')}
        />
      );
    }

    // Show template grid
    if (activeNav === 'templates') {
      return <TemplateGrid />;
    }

    // Show saved documents
    if (activeNav === 'saved') {
      return <SavedDocuments />;
    }

    // Show settings
    if (activeNav === 'settings') {
      return <SettingsPanel />;
    }

    // Show about
    if (activeNav === 'about') {
      return <AboutPage />;
    }

    // Show export presets
    if (activeNav === 'export') {
      return <ExportPresets />;
    }

    // Show paginator panel
    if (activeNav === 'paginator') {
      const previewContent = compiledPaginatorPreview || content;
      if (useStackedPanels) {
        return (
          <div className="h-full min-h-0 flex flex-col">
            <div className="border-b border-neutral-200 bg-white p-2 flex gap-2">
              <button
                type="button"
                className={`h-8 px-3 text-xs rounded-md border shadow-sm ${
                  stackedWorkspaceTab === 'editor' ? 'border-neutral-900 bg-neutral-100 text-neutral-900' : 'border-neutral-300 text-neutral-600'
                }`}
                onClick={() => setStackedWorkspaceTab('editor')}
              >
                Paginator
              </button>
              <button
                type="button"
                className={`h-8 px-3 text-xs rounded-md border shadow-sm ${
                  stackedWorkspaceTab === 'preview' ? 'border-neutral-900 bg-neutral-100 text-neutral-900' : 'border-neutral-300 text-neutral-600'
                }`}
                onClick={() => setStackedWorkspaceTab('preview')}
              >
                Preview
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              {stackedWorkspaceTab === 'preview' ? (
                <PreviewPanel
                  content={previewContent}
                  layoutFormat={layoutFormat}
                  fullBookPreview={fullBookPreview}
                  previewPageCount={previewPageCount}
                  activePresetName={activePresetName}
                />
              ) : (
                <PaginatorPanel
                  content={content}
                  selectedFormat={layoutFormat}
                  onFormatChange={setLayoutFormat}
                  fullBookPreview={fullBookPreview}
                  onFullBookPreviewChange={setFullBookPreview}
                  previewPageCount={previewPageCount}
                  onPreviewPageCountChange={setPreviewPageCount}
                  activePresetName={activePresetName}
                  onActivePresetNameChange={setActivePresetName}
                  assets={paginatorAssets}
                  onImportAssets={handlePaginatorAssetImport}
                  onRemoveAsset={removePaginatorAsset}
                  onCompilePreview={buildCompiledPaginatorPreview}
                />
              )}
            </div>
          </div>
        );
      }

      return (
        <div className="flex h-full min-h-0">
          <div className="w-[38%] min-w-[360px] border-r border-neutral-200 overflow-hidden">
            <PaginatorPanel
              content={content}
              selectedFormat={layoutFormat}
              onFormatChange={setLayoutFormat}
              fullBookPreview={fullBookPreview}
              onFullBookPreviewChange={setFullBookPreview}
              previewPageCount={previewPageCount}
              onPreviewPageCountChange={setPreviewPageCount}
              activePresetName={activePresetName}
              onActivePresetNameChange={setActivePresetName}
              assets={paginatorAssets}
              onImportAssets={handlePaginatorAssetImport}
              onRemoveAsset={removePaginatorAsset}
              onCompilePreview={buildCompiledPaginatorPreview}
            />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <PreviewPanel
              content={previewContent}
              layoutFormat={layoutFormat}
              fullBookPreview={fullBookPreview}
              previewPageCount={previewPageCount}
              activePresetName={activePresetName}
            />
          </div>
        </div>
      );
    }

    // Default 3-panel workspace
    if (useStackedPanels) {
      return (
        <div className="h-full flex flex-col min-h-0">
          <div className="border-b border-neutral-200 bg-white p-2 flex gap-2">
            <button
              type="button"
              className={`h-8 px-3 text-xs rounded-md border shadow-sm ${
                stackedWorkspaceTab === 'editor' ? 'border-neutral-900 bg-neutral-100 text-neutral-900' : 'border-neutral-300 text-neutral-600'
              }`}
              onClick={() => setStackedWorkspaceTab('editor')}
            >
              Editor
            </button>
            <button
              type="button"
              className={`h-8 px-3 text-xs rounded-md border shadow-sm ${
                stackedWorkspaceTab === 'preview' ? 'border-neutral-900 bg-neutral-100 text-neutral-900' : 'border-neutral-300 text-neutral-600'
              }`}
              onClick={() => setStackedWorkspaceTab('preview')}
            >
              Preview
            </button>
            <button
              type="button"
              className={`h-8 px-3 text-xs rounded-md border shadow-sm ${
                stackedWorkspaceTab === 'inspector' ? 'border-neutral-900 bg-neutral-100 text-neutral-900' : 'border-neutral-300 text-neutral-600'
              }`}
              onClick={() => setStackedWorkspaceTab('inspector')}
            >
              Inspector
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            {stackedWorkspaceTab === 'editor' && (
              <EditorPanel
                content={content}
                onChange={setContent}
                isDocumentLoaded={isDocumentLoaded}
                onNewDocument={() => {
                  setShowEditor(true);
                  setDocumentName('');
                  setContent('');
                }}
                onImportFile={handleImportFile}
              />
            )}
            {stackedWorkspaceTab === 'preview' && (
              <PreviewPanel
                content={content}
                layoutFormat={layoutFormat}
                fullBookPreview={fullBookPreview}
                previewPageCount={previewPageCount}
                activePresetName={activePresetName}
              />
            )}
            {stackedWorkspaceTab === 'inspector' && <InspectorPanel />}
          </div>
        </div>
      );
    }

    return (
      <ResizablePanelGroup direction="horizontal">
        {/* Editor */}
        <ResizablePanel defaultSize={25} minSize={20}>
          <EditorPanel
            content={content}
            onChange={setContent}
            isDocumentLoaded={isDocumentLoaded}
            onNewDocument={() => {
              setShowEditor(true);
              setDocumentName('');
              setContent('');
            }}
            onImportFile={handleImportFile}
          />
        </ResizablePanel>

        <ResizableHandle className="w-px bg-neutral-200" />

        {/* Preview */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <PreviewPanel
            content={content}
            layoutFormat={layoutFormat}
            fullBookPreview={fullBookPreview}
            previewPageCount={previewPageCount}
            activePresetName={activePresetName}
          />
        </ResizablePanel>

        <ResizableHandle className="w-px bg-neutral-200" />

        {/* Inspector */}
        <ResizablePanel defaultSize={25} minSize={20}>
          <InspectorPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  };

  if (isPhone) {
    return (
      <div className="h-screen w-full max-w-full overflow-hidden bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
        <MobileWorkspace
          content={content}
          onContentChange={setContent}
          documentName={documentName}
          onDocumentNameChange={setDocumentName}
          onImportFile={handleImportFile}
          onNewDocument={() => {
            setShowEditor(true);
            setDocumentName('');
            setContent('');
          }}
          onOpenTemplates={() => setActiveNav('templates')}
          onOpenSavedDocs={() => setActiveNav('saved')}
          onOpenSettings={() => setActiveNav('settings')}
          onOpenExport={() => setExportModalOpen(true)}
        />

        <ExportModal
          open={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          content={content}
          onReviewLayout={() => {
            setShowEditor(true);
            setActiveNav('paginator');
          }}
        />

        <Toaster />
      </div>
    );
  }

  if (isTabletPortrait || isTabletLandscape) {
    return (
      <div className="h-screen w-full max-w-full overflow-hidden bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
        <TabletWorkspace
          mode={isTabletLandscape ? 'landscape' : 'portrait'}
          content={content}
          onContentChange={setContent}
          documentName={documentName}
          onDocumentNameChange={setDocumentName}
          onImportFile={handleImportFile}
          onNewDocument={() => {
            setShowEditor(true);
            setDocumentName('');
            setContent('');
          }}
          onOpenTemplates={() => setActiveNav('templates')}
          onOpenSavedDocs={() => setActiveNav('saved')}
          onOpenSettings={() => setActiveNav('settings')}
          onOpenExport={() => setExportModalOpen(true)}
        />

        <ExportModal
          open={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          content={content}
          onReviewLayout={() => {
            setShowEditor(true);
            setActiveNav('paginator');
          }}
        />

        <Toaster />
      </div>
    );
  }

  return (
    <div className="relative h-screen flex bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left Sidebar */}
      <div className={`${!isDesktopLayout ? 'absolute inset-y-0 left-0 z-40' : 'relative'} transition-all duration-200 ease-out overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
        {isSidebarOpen && (
          <LeftSidebar
            activeNav={activeNav}
            onNavChange={(nav) => {
              setActiveNav(nav);
              if (!isDesktopLayout) setIsSidebarOpen(false);
            }}
            onExportClick={() => setExportModalOpen(true)}
            onImportFile={handleImportFile}
          />
        )}
      </div>
      {!isDesktopLayout && isSidebarOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="absolute inset-0 z-30 bg-black/25"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Area */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          isStackedLayout={isStackedLayout}
          onToggleStackedLayout={() => setIsStackedLayout((prev) => !prev)}
          documentName={documentName}
          onDocumentNameChange={setDocumentName}
          onExportClick={() => setExportModalOpen(true)}
        />

        {/* Main Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {renderMainContent()}
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        content={content}
        onReviewLayout={() => {
          setShowEditor(true);
          setActiveNav('paginator');
        }}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
