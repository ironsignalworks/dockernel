import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { analyzeDocument } from '../lib/preflight';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface LayoutPreset {
  id: string;
  name: string;
  format: 'zine' | 'book' | 'catalogue' | 'report' | 'custom';
  fullBookPreview: boolean;
  previewPageCount: number;
}

export interface PaginatorAsset {
  id: string;
  name: string;
  kind: 'image' | 'text' | 'other';
  sizeLabel: string;
}

interface PaginatorPanelProps {
  content?: string;
  selectedFormat?: 'zine' | 'book' | 'catalogue' | 'report' | 'custom';
  onFormatChange?: (format: 'zine' | 'book' | 'catalogue' | 'report' | 'custom') => void;
  fullBookPreview?: boolean;
  onFullBookPreviewChange?: (value: boolean) => void;
  previewPageCount?: number;
  onPreviewPageCountChange?: (value: number) => void;
  activePresetName?: string;
  onActivePresetNameChange?: (value: string) => void;
  assets?: PaginatorAsset[];
  onImportAssets?: (files: FileList | null) => void;
  onRemoveAsset?: (assetId: string) => void;
  onCompilePreview?: () => void;
}

export function PaginatorPanel({
  content = '',
  selectedFormat = 'zine',
  onFormatChange,
  fullBookPreview = false,
  onFullBookPreviewChange,
  previewPageCount = 12,
  onPreviewPageCountChange,
  activePresetName = 'Default',
  onActivePresetNameChange,
  assets = [],
  onImportAssets,
  onRemoveAsset,
  onCompilePreview,
}: PaginatorPanelProps) {
  const [resetSeed, setResetSeed] = useState(0);
  const [selectedCatalogueCols, setSelectedCatalogueCols] = useState<'2' | '3' | '4'>('3');
  const [savedPresets, setSavedPresets] = useState<LayoutPreset[]>([]);
  const hasDocumentStructure = content.trim().length > 0 && /^#{1,6}\s|\n{2,}|^[-*]\s|^\d+\.\s/m.test(content);
  const hasCatalogueItems = /!\[[^\]]*]\([^)]+\)|^[-*]\s|^\d+\.\s/m.test(content);
  const preflight = analyzeDocument(content);
  const preflightMeta =
    preflight.severity === 'major'
      ? {
          state: 'Major issues',
          title: 'Layout requires attention',
          subtext: 'Resolve overflow or missing assets before exporting.',
          tone: 'text-amber-700',
          icon: AlertCircle,
        }
      : preflight.severity === 'minor'
        ? {
            state: 'Minor issues',
            title: 'Export possible with warnings',
            subtext: 'Some sections may not flow cleanly across pages.',
            tone: 'text-amber-700',
            icon: AlertCircle,
          }
        : {
            state: 'All good',
            title: 'Layout ready for export',
            subtext: 'No issues detected in page flow or assets.',
            tone: 'text-green-700',
            icon: CheckCircle2,
          };
  const StatusIcon = preflightMeta.icon;
  const recentDocs = [
    { id: '1', title: 'Product Catalogue 2026', updated: '2 hours ago', pages: 24 },
    { id: '2', title: 'Annual Report Draft', updated: 'Yesterday', pages: 48 },
    { id: '3', title: 'Design Zine #3', updated: '3 days ago', pages: 16 },
    { id: '4', title: 'Technical Documentation', updated: '1 week ago', pages: 32 },
  ];

  const applyFormat = (format: 'zine' | 'book' | 'catalogue' | 'report' | 'custom') => {
    onFormatChange?.(format);
    toast.success(`Format set to ${format.charAt(0).toUpperCase() + format.slice(1)}`);
  };
  const formatButtonBase =
    'h-12 px-4 py-3 rounded-md border shadow-sm text-sm font-medium transition-colors';
  const formatButtonActive = 'border-neutral-900 bg-neutral-100 text-neutral-900';
  const formatButtonIdle = 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400';
  const topControlClass = 'h-10 w-full justify-center';

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('dockernel_layout_presets');
      if (!raw) return;
      const parsed = JSON.parse(raw) as LayoutPreset[];
      if (Array.isArray(parsed)) setSavedPresets(parsed);
    } catch {
      // no-op: local preset hydration is best-effort
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('dockernel_layout_presets', JSON.stringify(savedPresets));
  }, [savedPresets]);

  const saveCurrentPreset = () => {
    const nextIndex = savedPresets.length + 1;
    const preset: LayoutPreset = {
      id: crypto.randomUUID(),
      name: `Layout Preset ${nextIndex}`,
      format: selectedFormat,
      fullBookPreview,
      previewPageCount,
    };
    setSavedPresets((prev) => [preset, ...prev]);
    onActivePresetNameChange?.(preset.name);
    toast.success(`Saved ${preset.name}`);
  };

  const applyPresetById = (presetId: string) => {
    const preset = savedPresets.find((item) => item.id === presetId);
    if (!preset) return;
    onFormatChange?.(preset.format);
    onFullBookPreviewChange?.(preset.fullBookPreview);
    onPreviewPageCountChange?.(preset.previewPageCount);
    onActivePresetNameChange?.(preset.name);
    toast.success(`Applied ${preset.name}`);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <Tabs defaultValue="controls" className="flex-1 min-h-0 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-neutral-900">Pagination Engine</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Set output format and page-flow rules
            </p>
          </div>
          <TabsList className="mt-3 grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0">
            <Button
              variant="outline"
              size="sm"
              className={`${topControlClass} border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50`}
              onClick={() => {
                setResetSeed((prev) => prev + 1);
                toast.success('Flow rules applied');
              }}
            >
              Reset Layout
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${topControlClass} border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50`}
              onClick={saveCurrentPreset}
            >
              Save layout preset
            </Button>
            <TabsTrigger value="controls" className={`${topControlClass} rounded-md border border-neutral-300 bg-white px-3 shadow-sm text-neutral-700 data-[state=active]:border-neutral-900 data-[state=active]:bg-neutral-100 data-[state=active]:text-neutral-900`}>
              Controls
            </TabsTrigger>
            <TabsTrigger value="recent" className={`${topControlClass} rounded-md border border-neutral-300 bg-white px-3 shadow-sm text-neutral-700 data-[state=active]:border-neutral-900 data-[state=active]:bg-neutral-100 data-[state=active]:text-neutral-900`}>
              Recent documents
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="controls" className="mt-0 flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div key={resetSeed} className="p-6 space-y-8">
          <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <div className="text-xs uppercase tracking-wide text-neutral-500">Layout presets</div>
            <div className="text-sm text-neutral-700">Active preset: {activePresetName}</div>
            <div className="flex gap-2">
              <select
                className="h-9 flex-1 rounded-md border border-neutral-300 bg-white px-3 text-sm"
                onChange={(e) => applyPresetById(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  Select a saved preset
                </option>
                {savedPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-neutral-500">Asset pipeline</div>
                <div className="text-sm text-neutral-700 mt-1">
                  Load files, compile into selected template, and preview result.
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onCompilePreview}>
                Compile preview
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('paginator-file-input')?.click()}
              >
                Load files
              </Button>
              <input
                id="paginator-file-input"
                type="file"
                className="hidden"
                multiple
                accept=".md,.markdown,.txt,.csv,.json,.xml,.html,.htm,.yml,.yaml,.png,.jpg,.jpeg,.webp,.gif,.svg,image/*,text/plain,text/markdown"
                onChange={(e) => {
                  onImportAssets?.(e.target.files);
                  e.currentTarget.value = '';
                }}
              />
              <span className="text-xs text-neutral-500">{assets.length} loaded</span>
            </div>
            <div className="max-h-40 overflow-auto space-y-2">
              {assets.length === 0 ? (
                <div className="text-xs text-neutral-500">No files loaded yet.</div>
              ) : (
                assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                    <div className="min-w-0">
                      <div className="truncate text-xs font-medium text-neutral-800">{asset.name}</div>
                      <div className="text-[11px] text-neutral-500">{asset.kind} • {asset.sizeLabel}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => onRemoveAsset?.(asset.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-neutral-700">Full book preview</Label>
              <Switch checked={fullBookPreview} onCheckedChange={onFullBookPreviewChange} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Preview pages</Label>
                <span className="text-xs text-neutral-500">{previewPageCount} pages</span>
              </div>
              <Slider
                value={[previewPageCount]}
                min={4}
                max={40}
                step={1}
                onValueChange={(value) => onPreviewPageCountChange?.(value[0] ?? 12)}
              />
            </div>
          </div>

          {!hasDocumentStructure && (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <h3 className="text-sm font-semibold text-neutral-900">Paginator ready</h3>
              <p className="mt-1 text-sm text-neutral-600">
                As your document grows, page flow rules will apply automatically.
              </p>
            </div>
          )}

          {!hasCatalogueItems && (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <h3 className="text-sm font-semibold text-neutral-900">No catalogue items detected</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Add sections with images or lists to enable catalogue layout options.
              </p>
            </div>
          )}

          {/* Format Section */}
          <div className="space-y-4">
            <Label className="text-xs uppercase tracking-wide text-neutral-500">Output Format</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  applyFormat('zine');
                }}
                className={`${formatButtonBase} ${
                  selectedFormat === 'zine'
                    ? formatButtonActive
                    : formatButtonIdle
                }`}
              >
                Zine
              </button>
              <button
                type="button"
                onClick={() => {
                  applyFormat('book');
                }}
                className={`${formatButtonBase} ${
                  selectedFormat === 'book'
                    ? formatButtonActive
                    : formatButtonIdle
                }`}
              >
                Book
              </button>
              <button
                type="button"
                onClick={() => {
                  applyFormat('catalogue');
                }}
                className={`${formatButtonBase} ${
                  selectedFormat === 'catalogue'
                    ? formatButtonActive
                    : formatButtonIdle
                }`}
              >
                Catalogue
              </button>
              <button
                type="button"
                onClick={() => {
                  applyFormat('report');
                }}
                className={`${formatButtonBase} ${
                  selectedFormat === 'report'
                    ? formatButtonActive
                    : formatButtonIdle
                }`}
              >
                Report
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  applyFormat('custom');
                }}
                className={`${formatButtonBase} col-span-2 ${
                  selectedFormat === 'custom'
                    ? formatButtonActive
                    : formatButtonIdle
                }`}
              >
                Custom
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white">
                <option>A5 (148 × 210mm)</option>
                <option>Half-Letter (5.5 × 8.5in)</option>
                <option>A6 (105 × 148mm)</option>
                <option>Custom</option>
              </select>

              <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white">
                <option>1 Column</option>
                <option>2 Columns</option>
                <option>3 Columns</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label className="text-sm text-neutral-700">Spread Preview</Label>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-neutral-700">Inside/Outside Margins</Label>
              <Switch />
            </div>
          </div>

          <Separator />

          {/* Flow Rules Section */}
          <div className="space-y-4">
            <Label className="text-xs uppercase tracking-wide text-neutral-500">Flow Rules</Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Keep headings with next paragraph</Label>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Avoid widows/orphans</Label>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Avoid breaks in tables/images/code</Label>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Start chapters on right page</Label>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Insert blank pages automatically</Label>
                <Switch />
              </div>
            </div>
          </div>

          <Separator />

          {/* Front Matter Section */}
          <div className="space-y-4">
            <Label className="text-xs uppercase tracking-wide text-neutral-500">Front Matter</Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Title page</Label>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Auto-generate table of contents</Label>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Page numbering style</Label>
                <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white">
                  <option>1, 2, 3...</option>
                  <option>i, ii, iii...</option>
                  <option>a, b, c...</option>
                  <option>No numbers</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Switch to Arabic at page</Label>
                <input
                  type="number"
                  defaultValue={5}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Catalogue Mode (Conditional) */}
          <div className="space-y-4 opacity-50 pointer-events-none">
            <Label className="text-xs uppercase tracking-wide text-neutral-500">Catalogue Mode</Label>
            <p className="text-xs text-neutral-500">Available when Catalogue format is selected</p>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Grid layout</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={selectedCatalogueCols === '2' ? 'bg-neutral-100 border-neutral-900' : ''}
                    onClick={() => {
                      setSelectedCatalogueCols('2');
                      toast.success('Catalogue grid set to 2 columns');
                    }}
                  >
                    2 Col
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={selectedCatalogueCols === '3' ? 'bg-neutral-100 border-neutral-900' : ''}
                    onClick={() => {
                      setSelectedCatalogueCols('3');
                      toast.success('Catalogue grid set to 3 columns');
                    }}
                  >
                    3 Col
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={selectedCatalogueCols === '4' ? 'bg-neutral-100 border-neutral-900' : ''}
                    onClick={() => {
                      setSelectedCatalogueCols('4');
                      toast.success('Catalogue grid set to 4 columns');
                    }}
                  >
                    4 Col
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Lock image + caption together</Label>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Auto index page</Label>
                <Switch />
              </div>
            </div>
          </div>

          <Separator />

          {/* Preflight Panel */}
          <div className="space-y-4">
            <Label className="text-xs uppercase tracking-wide text-neutral-500">Check Preflight</Label>
            
            <div className="rounded-lg border border-neutral-200 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <StatusIcon className={`w-4 h-4 ${preflightMeta.tone}`} />
                <span className="text-xs uppercase tracking-wide text-neutral-500">{preflightMeta.state}</span>
              </div>
              <div className={`text-sm font-medium ${preflightMeta.tone}`}>{preflightMeta.title}</div>
              <p className="text-sm text-neutral-600">{preflightMeta.subtext}</p>

              {preflight.issues.map((issue) => (
                <div key={issue.id} className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
                  <div className="text-sm font-medium text-neutral-800">{issue.title}</div>
                  <p className="mt-1 text-xs text-neutral-600">{issue.text}</p>
                </div>
              ))}

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-neutral-500">Page count</div>
                  <div className="font-semibold text-neutral-900">24 pages</div>
                </div>
                <div>
                  <div className="text-neutral-500">Export safe</div>
                  <div className="font-semibold text-green-600">Ready</div>
                </div>
              </div>
            </div>
          </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="recent" className="mt-0 flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-3">
              {recentDocs.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  className="w-full rounded-lg border border-neutral-200 bg-white p-4 text-left hover:border-neutral-300 hover:shadow-sm transition-colors"
                  onClick={() => toast.success(`Opened "${doc.title}"`)}
                >
                  <div className="text-sm font-semibold text-neutral-900">{doc.title}</div>
                  <div className="mt-1 text-xs text-neutral-500">
                    {doc.updated} • {doc.pages} pages
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
