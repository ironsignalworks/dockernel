import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  AlertTriangle,
  BookTemplate,
  Download,
  FileSearch,
  FileText,
  LayoutTemplate,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  SquarePen,
  Upload,
} from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { SavedDocuments } from './SavedDocuments';
import { SettingsPanel } from './SettingsPanel';
import { TemplateGrid } from './TemplateGrid';
import { analyzeDocument } from '../lib/preflight';
import { toast } from 'sonner';
import { markdownUrlTransform } from '../lib/markdown';

type TabletMode = 'edit' | 'preview' | 'layout' | 'export';
type UtilityView = 'none' | 'templates' | 'saved' | 'settings';
type LandscapeSheet = 'none' | 'layout' | 'templates' | 'preflight';
type LandscapeFocus = 'editor' | 'split' | 'preview';

interface TabletWorkspaceProps {
  mode: 'portrait' | 'landscape';
  content: string;
  onContentChange: (content: string) => void;
  documentName: string;
  onDocumentNameChange: (value: string) => void;
  onImportFile: (file: File) => void;
  onNewDocument: () => void;
  onOpenTemplates: () => void;
  onOpenSavedDocs: () => void;
  onOpenSettings: () => void;
  onOpenExport: () => void;
}

export function TabletWorkspace({
  mode,
  content,
  onContentChange,
  documentName,
  onDocumentNameChange,
  onImportFile,
  onNewDocument,
  onOpenTemplates,
  onOpenSavedDocs,
  onOpenSettings,
  onOpenExport,
}: TabletWorkspaceProps) {
  const [tabletMode, setTabletMode] = React.useState<TabletMode>('edit');
  const [utilityView, setUtilityView] = React.useState<UtilityView>('none');
  const [showOutline, setShowOutline] = React.useState(false);
  const [showMargins, setShowMargins] = React.useState(true);
  const [spreadView, setSpreadView] = React.useState(false);
  const [columns, setColumns] = React.useState<1 | 2>(1);
  const [isRenamingTitle, setIsRenamingTitle] = React.useState(false);
  const [landscapeSheet, setLandscapeSheet] = React.useState<LandscapeSheet>('none');
  const [landscapeFocus, setLandscapeFocus] = React.useState<LandscapeFocus>('split');
  const [activePreviewPage, setActivePreviewPage] = React.useState<number | null>(null);
  const [landscapeFormat, setLandscapeFormat] = React.useState<'Book' | 'Zine' | 'Catalogue' | 'Report'>('Book');
  const headings = React.useMemo(
    () =>
      content
        .split('\n')
        .filter((line) => /^#{1,6}\s+/.test(line))
        .map((line) => line.replace(/^#{1,6}\s+/, '').trim())
        .slice(0, 8),
    [content],
  );
  const preflight = analyzeDocument(content);
  const title = documentName.trim() || 'Untitled Document';
  const hasContent = content.trim().length > 0;

  const openLandscapeSheet = (value: LandscapeSheet) => setLandscapeSheet(value);

  const renderTopBar = () => (
    <header className="border-b border-neutral-200 bg-white px-3 py-2">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[70%] max-w-sm p-0">
            <SheetHeader className="border-b border-neutral-200">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="space-y-2 p-4">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setTabletMode('edit');
                    setUtilityView('none');
                    onNewDocument();
                  }}
                >
                  <SquarePen className="h-4 w-4" />
                  New document
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setUtilityView('templates');
                    onOpenTemplates();
                  }}
                >
                  <BookTemplate className="h-4 w-4" />
                  Templates
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setUtilityView('saved');
                    onOpenSavedDocs();
                  }}
                >
                  <FileText className="h-4 w-4" />
                  Saved docs
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setUtilityView('settings');
                    onOpenSettings();
                  }}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => document.getElementById('tablet-import-input')?.click()}
                >
                  <Download className="h-4 w-4" />
                  Import File
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>

        <div className="min-w-0">
          <div className="mb-1 flex items-center justify-center gap-1.5">
            <img src="/icon.svg" alt="DocKernel" className="h-4 w-4 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">DocKernel</span>
          </div>
          {isRenamingTitle ? (
            <input
              autoFocus
              value={documentName}
              onChange={(e) => onDocumentNameChange(e.target.value)}
              onBlur={() => setIsRenamingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsRenamingTitle(false);
              }}
              className="h-8 w-full rounded-md border border-neutral-300 px-2 text-center text-sm text-neutral-700 outline-none focus:border-neutral-900"
            />
          ) : (
            <button
              type="button"
              className="w-full truncate text-center text-sm font-medium text-neutral-700"
              onClick={() => setIsRenamingTitle(true)}
              title="Tap to rename"
            >
              {title}
            </button>
          )}
        </div>

        <Button
          className="h-9 gap-2 bg-neutral-900 px-3 text-xs hover:bg-neutral-800"
          aria-label="Export PDF"
          onClick={onOpenExport}
        >
          <Upload className="h-4 w-4" />
          Export PDF
        </Button>
      </div>
    </header>
  );

  const renderPortraitMode = () => {
    if (utilityView === 'templates') return <TemplateGrid />;
    if (utilityView === 'saved') return <SavedDocuments />;
    if (utilityView === 'settings') return <SettingsPanel />;

    if (tabletMode === 'edit') {
      return (
        <div className="flex h-full min-h-0 flex-col">
          <div className="border-b border-neutral-200 bg-white px-4 py-3 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-neutral-500">Content</span>
            <Button variant="outline" size="sm" onClick={() => setShowOutline((prev) => !prev)}>
              {showOutline ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              Outline
            </Button>
          </div>
          {showOutline && (
            <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Outline</div>
              <div className="space-y-1">
                {headings.length > 0 ? headings.map((h) => (
                  <div key={h} className="text-sm text-neutral-700 truncate">{h}</div>
                )) : <div className="text-sm text-neutral-500">Add headings to build your outline.</div>}
              </div>
            </div>
          )}
          <div className="flex-1 min-h-0 p-4">
            <Textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="h-full min-h-[48vh] rounded-lg border-neutral-300 bg-white text-sm leading-relaxed"
              placeholder="Start writing or paste Markdown..."
            />
          </div>
        </div>
      );
    }

    if (tabletMode === 'preview') {
      return (
        <div className="flex h-full min-h-0 flex-col bg-neutral-100">
          <div className="border-b border-neutral-200 bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-neutral-500">Layout Preview</p>
            <p className="mt-1 text-xs text-neutral-500">Matches export output.</p>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" className={showMargins ? 'bg-neutral-100 border-neutral-900' : ''} onClick={() => setShowMargins((p) => !p)}>Show margins</Button>
              <Button variant="outline" size="sm" className={spreadView ? 'bg-neutral-100 border-neutral-900' : ''} onClick={() => setSpreadView((p) => !p)}>Spread view</Button>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setActivePreviewPage(n);
                    toast.info(`Jumped to page ${n}`);
                  }}
                  className={`h-14 w-12 shrink-0 rounded-md border text-xs transition-colors ${
                    activePreviewPage === n
                      ? 'border-neutral-900 bg-neutral-100 text-neutral-900'
                      : 'border-neutral-300 bg-white text-neutral-600'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <div className="mx-auto max-w-xl space-y-4">
              {[1, 2].map((page) => (
                <button
                  key={page}
                  type="button"
                  className="relative w-full rounded-lg bg-white p-6 text-left shadow-sm"
                  onClick={() => {
                    setActivePreviewPage(page);
                    window.setTimeout(() => setActivePreviewPage(null), 900);
                  }}
                >
                  <div className="prose prose-sm max-w-none text-neutral-700">
                    {hasContent ? <ReactMarkdown urlTransform={markdownUrlTransform}>{content}</ReactMarkdown> : <p className="text-sm text-neutral-500">Preview will appear here as content is added.</p>}
                  </div>
                  {showMargins && <div className="pointer-events-none absolute inset-0 rounded-lg border-[18px] border-neutral-100" />}
                  {activePreviewPage === page && (
                    <div className="absolute right-3 bottom-3 rounded-md bg-neutral-900 px-2 py-1 text-xs text-white">Page {page}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (tabletMode === 'layout') {
      return (
        <div className="h-full min-h-0 overflow-y-auto bg-white p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-neutral-900">Template</h3>
              <select className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm">
                <option>Book</option>
                <option>Zine</option>
                <option>Catalogue</option>
                <option>Report</option>
              </select>
              <p className="text-xs text-neutral-500">Switch layout format. Content stays unchanged.</p>
            </div>
            <div className="rounded-lg border border-neutral-200 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-neutral-900">Typography</h3>
              <select className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm">
                <option>Editorial</option>
                <option>Technical</option>
                <option>Compact</option>
              </select>
              <select className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm">
                <option>Balanced scale</option>
                <option>Comfortable scale</option>
                <option>Dense scale</option>
              </select>
            </div>
            <div className="rounded-lg border border-neutral-200 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-neutral-900">Page Setup</h3>
              <select className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm">
                <option>A4</option>
                <option>Letter</option>
                <option>Legal</option>
              </select>
              <div>
                <div className="mb-2 text-xs uppercase tracking-wide text-neutral-500">Margins</div>
                <Slider defaultValue={[24]} min={8} max={48} step={1} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className={columns === 1 ? 'bg-neutral-100 border-neutral-900' : ''} onClick={() => setColumns(1)}>1 Column</Button>
                <Button variant="outline" size="sm" className={columns === 2 ? 'bg-neutral-100 border-neutral-900' : ''} onClick={() => setColumns(2)}>2 Columns</Button>
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-neutral-900">Advanced</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Keep headings with next</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Avoid breaks in blocks</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Header/footer</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full min-h-0 flex-col bg-white">
        <div className="border-b border-neutral-200 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-neutral-500">Final preview</p>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
            {[1, 2, 3].map((page) => (
              <div key={page} className="aspect-[1/1.414] w-[220px] shrink-0 snap-center rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="text-xs text-neutral-400">Page {page}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">Estimated file size: 1.8 MB</div>
          <Button className="w-full bg-neutral-900 hover:bg-neutral-800" onClick={onOpenExport}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
    );
  };

  const renderLandscapeSheetContent = () => {
    if (landscapeSheet === 'templates') return <TemplateGrid />;

    if (landscapeSheet === 'preflight') {
      return (
        <div className="space-y-4 p-4">
          <h3 className="text-sm font-semibold text-neutral-900">Preflight</h3>
          <p className="text-sm text-neutral-600">Jump to sections that need attention.</p>
          {preflight.issues.length === 0 ? (
            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
              Layout ready for export.
            </div>
          ) : (
            <div className="space-y-2">
              {preflight.issues.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => toast.info(issue.title)}
                  className="w-full rounded-md border border-neutral-200 bg-white p-3 text-left hover:border-neutral-300 hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-neutral-800">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    {issue.title}
                  </div>
                  <p className="mt-1 text-xs text-neutral-600">{issue.text}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4 p-4">
        <h3 className="text-sm font-semibold text-neutral-900">Layout</h3>
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-wide text-neutral-500">Format</label>
          <div className="grid grid-cols-2 gap-2">
            {(['Book', 'Zine', 'Catalogue', 'Report'] as const).map((f) => (
              <Button
                key={f}
                variant="outline"
                size="sm"
                className={landscapeFormat === f ? 'bg-neutral-100 border-neutral-900' : ''}
                onClick={() => {
                  setLandscapeFormat(f);
                  toast.success(`Format set to ${f}`);
                }}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-wide text-neutral-500">Page</label>
          <select className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm">
            <option>A4</option>
            <option>Letter</option>
          </select>
          <Slider defaultValue={[24]} min={8} max={48} step={1} />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-neutral-500">Flow rules</label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700">Keep headings with next</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-700">Avoid breaks in blocks</span>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    );
  };

  const renderLandscapeMode = () => (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-neutral-200 bg-white px-3 py-2">
        <div className="inline-flex rounded-md border border-neutral-200 bg-white p-1 gap-1">
          <Button variant="outline" size="sm" className={landscapeFocus === 'editor' ? 'bg-neutral-100 border-neutral-900' : ''} onClick={() => setLandscapeFocus('editor')}>Focus: Editor</Button>
          <Button variant="outline" size="sm" className={landscapeFocus === 'split' ? 'bg-neutral-100 border-neutral-900' : ''} onClick={() => setLandscapeFocus('split')}>Split</Button>
          <Button variant="outline" size="sm" className={landscapeFocus === 'preview' ? 'bg-neutral-100 border-neutral-900' : ''} onClick={() => setLandscapeFocus('preview')}>Focus: Preview</Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex overflow-hidden">
        {landscapeFocus !== 'preview' && (
          <div className={`${landscapeFocus === 'split' ? 'w-[45%]' : 'w-full'} border-r border-neutral-200 bg-white min-h-0 p-4`}>
            <div className="mb-2 text-xs uppercase tracking-wide text-neutral-500">Content</div>
            <Textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="h-full min-h-[360px] rounded-lg border-neutral-300 bg-white text-sm leading-relaxed"
              placeholder="Write in Markdown or plain text..."
            />
          </div>
        )}
        {landscapeFocus !== 'editor' && (
          <div className={`${landscapeFocus === 'split' ? 'w-[55%]' : 'w-full'} min-h-0 overflow-y-auto bg-neutral-100 p-4`}>
            <div className="mx-auto max-w-2xl space-y-4">
              {[1, 2].map((page) => (
                <div key={page} className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                  <div className="text-xs text-neutral-400 mb-2">Page {page}</div>
                  <div className="prose prose-sm max-w-none text-neutral-700">
                    {hasContent ? <ReactMarkdown urlTransform={markdownUrlTransform}>{content}</ReactMarkdown> : <p className="text-sm text-neutral-500">Preview will appear here.</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-neutral-200 bg-white p-2">
        <Button variant="outline" size="sm" className="h-10" onClick={() => openLandscapeSheet('layout')}>
          <LayoutTemplate className="h-4 w-4" />
          Layout
        </Button>
        <Button variant="outline" size="sm" className="h-10" onClick={() => openLandscapeSheet('templates')}>
          <BookTemplate className="h-4 w-4" />
          Templates
        </Button>
        <Button variant="outline" size="sm" className="h-10" onClick={() => openLandscapeSheet('preflight')}>
          <FileSearch className="h-4 w-4" />
          Preflight
        </Button>
      </div>

      <Sheet open={landscapeSheet !== 'none'} onOpenChange={(open) => setLandscapeSheet(open ? landscapeSheet : 'none')}>
        <SheetContent side="right" className="w-[420px] max-w-[90vw] p-0">
          <SheetHeader className="border-b border-neutral-200">
            <SheetTitle>
              {landscapeSheet === 'layout' ? 'Layout' : landscapeSheet === 'templates' ? 'Templates' : 'Preflight'}
            </SheetTitle>
          </SheetHeader>
          <div className="h-full min-h-0 overflow-y-auto">{renderLandscapeSheetContent()}</div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <div className="flex h-full w-full max-w-full flex-col overflow-hidden">
      {renderTopBar()}
      <main className="min-h-0 flex-1 overflow-hidden">
        {mode === 'portrait' ? renderPortraitMode() : renderLandscapeMode()}
      </main>
      {mode === 'portrait' && (
        <nav className="grid grid-cols-3 gap-2 border-t border-neutral-200 bg-white p-2">
          <Button variant="outline" size="sm" className={`h-11 flex-col ${tabletMode === 'edit' ? 'bg-neutral-100 border-neutral-900' : ''}`} onClick={() => { setUtilityView('none'); setTabletMode('edit'); }}>
            <SquarePen className="h-4 w-4" />
            <span className="text-[11px]">Edit</span>
          </Button>
          <Button variant="outline" size="sm" className={`h-11 flex-col ${tabletMode === 'preview' ? 'bg-neutral-100 border-neutral-900' : ''}`} onClick={() => { setUtilityView('none'); setTabletMode('preview'); }}>
            <FileText className="h-4 w-4" />
            <span className="text-[11px]">Preview</span>
          </Button>
          <Button variant="outline" size="sm" className={`h-11 flex-col ${tabletMode === 'layout' ? 'bg-neutral-100 border-neutral-900' : ''}`} onClick={() => { setUtilityView('none'); setTabletMode('layout'); }}>
            <LayoutTemplate className="h-4 w-4" />
            <span className="text-[11px]">Layout</span>
          </Button>
        </nav>
      )}
      <input
        id="tablet-import-input"
        type="file"
        className="hidden"
        accept=".md,.markdown,.txt,.rtf,.csv,.json,.xml,.html,.htm,.yml,.yaml,.png,.jpg,.jpeg,.webp,.gif,.svg,image/*,text/plain,text/markdown,text/csv,application/json,application/xml,text/xml,text/html"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImportFile(file);
          e.currentTarget.value = '';
        }}
      />
    </div>
  );
}
