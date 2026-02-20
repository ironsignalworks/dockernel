import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  BookTemplate,
  Download,
  FileText,
  ImagePlus,
  LayoutTemplate,
  Menu,
  Settings,
  SquarePen,
  Upload,
} from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { toast } from 'sonner';
import { SavedDocuments } from './SavedDocuments';
import { SettingsPanel } from './SettingsPanel';
import { TemplateGrid } from './TemplateGrid';

type MobileMode = 'edit' | 'preview' | 'layout';
type UtilityView = 'none' | 'templates' | 'saved' | 'settings';

interface MobileWorkspaceProps {
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

export function MobileWorkspace({
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
}: MobileWorkspaceProps) {
  const [mode, setMode] = React.useState<MobileMode>('edit');
  const [isRenamingTitle, setIsRenamingTitle] = React.useState(false);
  const [showMargins, setShowMargins] = React.useState(true);
  const [spreadView, setSpreadView] = React.useState(false);
  const [columns, setColumns] = React.useState<1 | 2>(1);
  const [utilityView, setUtilityView] = React.useState<UtilityView>('none');
  const [activePreviewPage, setActivePreviewPage] = React.useState<number | null>(null);
  const editorRef = React.useRef<HTMLTextAreaElement | null>(null);

  const resolvedTitle = documentName.trim() || 'Untitled Document';
  const trimmedContent = content.trim();
  const hasContent = trimmedContent.length > 0;
  const previewPages = hasContent ? [1, 2, 3] : [1];

  const applyInlineWrap = (prefix: string, suffix = '') => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    const nextValue = `${content.slice(0, start)}${prefix}${selected}${suffix}${content.slice(end)}`;
    onContentChange(nextValue);

    window.requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + prefix.length + selected.length + suffix.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const renderEditorMode = () => (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="border-b border-neutral-200 bg-white px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-neutral-500">Content</p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <Textarea
          ref={editorRef}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="h-full min-h-[52vh] rounded-lg border-neutral-300 bg-white text-sm leading-relaxed"
          placeholder="Start writing or paste Markdown..."
        />
        <p className="mt-2 text-xs text-neutral-500">Layout updates automatically in Preview mode.</p>
      </div>

      <div className="border-t border-neutral-200 bg-white px-4 py-2">
        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" size="sm" onClick={() => applyInlineWrap('# ')}>
            H1
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyInlineWrap('**', '**')}>
            Bold
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyInlineWrap('- ')}>
            List
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyInlineWrap('![Image](' , ')')}>
            <ImagePlus className="h-4 w-4" />
            Image
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPreviewMode = () => (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-neutral-100">
      <div className="border-b border-neutral-200 bg-white px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-neutral-500">Layout Preview</p>
        <p className="mt-1 text-xs text-neutral-500">Matches export output.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className={showMargins ? 'bg-neutral-100 border-neutral-900' : ''}
            onClick={() => setShowMargins((prev) => !prev)}
          >
            Show margins
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={spreadView ? 'bg-neutral-100 border-neutral-900' : ''}
            onClick={() => setSpreadView((prev) => !prev)}
          >
            Spread view
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className={`mx-auto w-full max-w-md ${spreadView ? 'space-y-3' : 'space-y-4'}`}>
          {previewPages.map((page) => (
            <button
              key={page}
              type="button"
              className="relative block w-full rounded-lg bg-white p-6 text-left shadow-sm"
              onClick={() => {
                setActivePreviewPage(page);
                window.setTimeout(() => setActivePreviewPage(null), 1000);
              }}
            >
              <div className="prose prose-sm max-w-none text-neutral-700">
                {hasContent ? (
                  <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                  <div className="space-y-2 text-center text-sm text-neutral-500">
                    <h3 className="text-base font-semibold text-neutral-800">Preview will appear here</h3>
                    <p>As you add content, DocKernel will format it into pages automatically.</p>
                  </div>
                )}
              </div>
              {showMargins && (
                <div className="pointer-events-none absolute inset-0 rounded-lg border-[18px] border-neutral-100" />
              )}
              {activePreviewPage === page && (
                <div className="absolute right-3 bottom-3 rounded-md bg-neutral-900 px-2 py-1 text-xs text-white">
                  Page {page}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLayoutMode = () => (
    <div className="h-full min-h-0 overflow-y-auto bg-white px-4 py-3">
      <Accordion type="multiple" defaultValue={['template', 'setup', 'typography']} className="w-full">
        <AccordionItem value="template">
          <AccordionTrigger>Template</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <select className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm">
              <option>Book</option>
              <option>Zine</option>
              <option>Catalogue</option>
              <option>Report</option>
            </select>
            <p className="text-xs text-neutral-500">Switch layout format. Content stays unchanged.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="setup">
          <AccordionTrigger>Page Setup</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-neutral-500">Page size</label>
              <select className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm">
                <option>A4</option>
                <option>Letter</option>
                <option>Legal</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-neutral-500">Margins</label>
              <Slider defaultValue={[24]} min={8} max={48} step={1} />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-neutral-500">Columns</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={columns === 1 ? 'bg-neutral-100 border-neutral-900' : ''}
                  onClick={() => setColumns(1)}
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={columns === 2 ? 'bg-neutral-100 border-neutral-900' : ''}
                  onClick={() => setColumns(2)}
                >
                  2
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="typography">
          <AccordionTrigger>Typography</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-neutral-500">Typeface preset</label>
              <select className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm">
                <option>Editorial</option>
                <option>Technical</option>
                <option>Compact</option>
                <option>Resume</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-neutral-500">Scale preset</label>
              <select className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm">
                <option>Balanced</option>
                <option>Comfortable</option>
                <option>Dense</option>
              </select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="advanced">
          <AccordionTrigger>Advanced</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-neutral-500">Flow rules</label>
              <select className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm">
                <option>Balanced</option>
                <option>Keep sections tight</option>
                <option>Allow breaks</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-neutral-500">Page numbering</label>
              <select className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm">
                <option>Bottom center</option>
                <option>Bottom right</option>
                <option>None</option>
              </select>
            </div>
            <div className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 p-3">
              <span className="text-sm text-neutral-700">Header/footer</span>
              <Switch defaultChecked />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  const renderModeContent = () => {
    if (utilityView === 'templates') return <TemplateGrid />;
    if (utilityView === 'saved') return <SavedDocuments />;
    if (utilityView === 'settings') return <SettingsPanel />;

    if (mode === 'edit') return renderEditorMode();
    if (mode === 'preview') return renderPreviewMode();
    return renderLayoutMode();
  };

  return (
    <div className="flex h-full w-full max-w-full flex-col overflow-hidden">
      <header className="border-b border-neutral-200 bg-white px-3 py-2">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[84%] max-w-xs p-0">
              <SheetHeader className="border-b border-neutral-200">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="space-y-2 p-4">
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      setUtilityView('none');
                      setMode('edit');
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
                    onClick={() => document.getElementById('mobile-import-input')?.click()}
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
                {resolvedTitle}
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

      <main className="min-h-0 flex-1 overflow-hidden">{renderModeContent()}</main>

      <nav className="grid grid-cols-3 gap-2 border-t border-neutral-200 bg-white p-2">
        <Button
          variant="outline"
          size="sm"
          className={`h-11 flex-col ${mode === 'edit' && utilityView === 'none' ? 'bg-neutral-100 border-neutral-900' : ''}`}
          onClick={() => {
            setUtilityView('none');
            setMode('edit');
          }}
        >
          <SquarePen className="h-4 w-4" />
          <span className="text-[11px]">Edit</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`h-11 flex-col ${mode === 'preview' && utilityView === 'none' ? 'bg-neutral-100 border-neutral-900' : ''}`}
          onClick={() => {
            setUtilityView('none');
            setMode('preview');
          }}
        >
          <FileText className="h-4 w-4" />
          <span className="text-[11px]">Preview</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`h-11 flex-col ${mode === 'layout' && utilityView === 'none' ? 'bg-neutral-100 border-neutral-900' : ''}`}
          onClick={() => {
            setUtilityView('none');
            setMode('layout');
          }}
        >
          <LayoutTemplate className="h-4 w-4" />
          <span className="text-[11px]">Layout</span>
        </Button>
      </nav>

      <input
        id="mobile-import-input"
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
