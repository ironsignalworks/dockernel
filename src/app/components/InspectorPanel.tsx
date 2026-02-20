import React from 'react';
import { Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

export interface InspectorSettings {
  margins: { top: number; bottom: number; left: number; right: number };
  columns: 1 | 2;
  sectionGap: number;
  paragraphGap: number;
  primaryFont: string;
  headingScale: number;
  bodyRhythm: number;
  typePreset: string;
  headerContent: string;
  footerContent: string;
  addSignature: boolean;
  signatureLabel: string;
  signatureFileName: string;
  numberingFormat: 'bottom-center' | 'bottom-right' | 'top-right' | 'none';
  exportQuality: number;
  compression: boolean;
  watermark: boolean;
  includeMetadata: boolean;
}

interface InspectorPanelProps {
  settings: InspectorSettings;
  onChange: (next: InspectorSettings) => void;
}

export function InspectorPanel({ settings, onChange }: InspectorPanelProps) {
  const setValue = <K extends keyof InspectorSettings>(key: K, value: InspectorSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="h-full bg-white border-l border-neutral-200 flex flex-col">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="text-sm font-semibold text-neutral-900">Inspector</h2>
      </div>

      <Tabs defaultValue="layout" className="flex-1 min-h-0 flex flex-col min-w-0">
        <TabsList className="grid h-auto w-full grid-cols-2 border-b border-neutral-200 bg-transparent p-2 gap-2">
          <TabsTrigger value="layout" className="h-10 rounded-md border border-neutral-300 bg-white shadow-sm data-[state=active]:border-neutral-900 data-[state=active]:bg-neutral-100">Layout</TabsTrigger>
          <TabsTrigger value="typography" className="h-10 rounded-md border border-neutral-300 bg-white shadow-sm data-[state=active]:border-neutral-900 data-[state=active]:bg-neutral-100">Typography</TabsTrigger>
          <TabsTrigger value="header" className="h-10 rounded-md border border-neutral-300 bg-white shadow-sm data-[state=active]:border-neutral-900 data-[state=active]:bg-neutral-100">Header/Footer</TabsTrigger>
          <TabsTrigger value="export" className="h-10 rounded-md border border-neutral-300 bg-white shadow-sm data-[state=active]:border-neutral-900 data-[state=active]:bg-neutral-100">Export</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 min-h-0">
          <TabsContent value="layout" className="p-6 space-y-6 mt-0">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-900">Page layout</h3>
              <p className="text-xs text-neutral-500">Adjust document dimensions and structure.</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Margins</Label>
              <p className="text-xs text-neutral-500">Space around content on every page.</p>
              {(['top', 'bottom', 'left', 'right'] as const).map((edge) => (
                <div key={edge}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-700">{edge[0].toUpperCase() + edge.slice(1)}</span>
                    <span className="text-sm text-neutral-500">{settings.margins[edge]}mm</span>
                  </div>
                  <Slider
                    value={[settings.margins[edge]]}
                    onValueChange={(value) => onChange({ ...settings, margins: { ...settings.margins, [edge]: value[0] ?? settings.margins[edge] } })}
                    max={50}
                    step={1}
                  />
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Columns</Label>
              <p className="text-xs text-neutral-500">Split content into multiple reading columns.</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className={`flex-1 ${settings.columns === 1 ? 'bg-neutral-100 border-neutral-900' : ''}`} onClick={() => setValue('columns', 1)}>1 Column</Button>
                <Button variant="outline" size="sm" className={`flex-1 ${settings.columns === 2 ? 'bg-neutral-100 border-neutral-900' : ''}`} onClick={() => setValue('columns', 2)}>2 Columns</Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Spacing rules</Label>
              <p className="text-xs text-neutral-500">Controls gaps between sections and paragraphs.</p>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-700">Section gap</span>
                  <span className="text-sm text-neutral-500">{settings.sectionGap}px</span>
                </div>
                <Slider value={[settings.sectionGap]} onValueChange={(value) => setValue('sectionGap', value[0] ?? settings.sectionGap)} min={8} max={64} step={2} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-700">Paragraph gap</span>
                  <span className="text-sm text-neutral-500">{settings.paragraphGap}px</span>
                </div>
                <Slider value={[settings.paragraphGap]} onValueChange={(value) => setValue('paragraphGap', value[0] ?? settings.paragraphGap)} min={4} max={40} step={1} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="p-6 space-y-6 mt-0">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-900">Type system</h3>
              <p className="text-xs text-neutral-500">Controls font scale, spacing, and hierarchy.</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Primary font</Label>
              <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white" value={settings.primaryFont} onChange={(e) => setValue('primaryFont', e.target.value)}>
                <option>Inter</option>
                <option>IBM Plex Sans</option>
                <option>Source Sans Pro</option>
                <option>Georgia</option>
                <option>Times New Roman</option>
              </select>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Heading scale</Label>
              <div className="flex justify-between mb-2"><span className="text-sm text-neutral-700">Scale factor</span><span className="text-sm text-neutral-500">{(settings.headingScale / 10).toFixed(1)}</span></div>
              <Slider value={[settings.headingScale]} onValueChange={(value) => setValue('headingScale', value[0] ?? settings.headingScale)} min={10} max={25} step={1} />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Body rhythm</Label>
              <div className="flex justify-between mb-2"><span className="text-sm text-neutral-700">Paragraph spacing</span><span className="text-sm text-neutral-500">{(settings.bodyRhythm / 10).toFixed(1)}</span></div>
              <Slider value={[settings.bodyRhythm]} onValueChange={(value) => setValue('bodyRhythm', value[0] ?? settings.bodyRhythm)} min={10} max={25} step={1} />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Editorial', 'Technical', 'Compact', 'Resume'].map((preset) => (
                  <Button key={preset} variant="outline" size="sm" className={settings.typePreset === preset ? 'bg-neutral-100 border-neutral-900' : ''} onClick={() => setValue('typePreset', preset)}>{preset}</Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="header" className="p-6 space-y-6 mt-0">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-900">Running elements</h3>
              <p className="text-xs text-neutral-500">Content repeated across pages.</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Header content</Label>
              <p className="text-xs text-neutral-500">Shown at the top of each page.</p>
              <input type="text" value={settings.headerContent} onChange={(e) => setValue('headerContent', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm" />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Footer content</Label>
              <p className="text-xs text-neutral-500">Often used for page numbers or metadata.</p>
              <input type="text" value={settings.footerContent} onChange={(e) => setValue('footerContent', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm" />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs uppercase tracking-wide text-neutral-500">Add signature</Label>
                  <p className="mt-1 text-xs text-neutral-500">Insert a signature line on the final page.</p>
                </div>
                <Switch checked={settings.addSignature} onCheckedChange={(v) => setValue('addSignature', v)} />
              </div>
              {settings.addSignature && (
                <div className="space-y-2">
                  <input type="text" value={settings.signatureLabel} onChange={(e) => setValue('signatureLabel', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm" />
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('signature-import-input')?.click()}>
                      <Download className="w-4 h-4" />
                      Import signature
                    </Button>
                    {settings.signatureFileName && <span className="text-xs text-neutral-500 truncate">{settings.signatureFileName}</span>}
                    <input
                      id="signature-import-input"
                      type="file"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setValue('signatureFileName', file?.name ?? '');
                        e.currentTarget.value = '';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Numbering format</Label>
              <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white" value={settings.numberingFormat} onChange={(e) => setValue('numberingFormat', e.target.value as InspectorSettings['numberingFormat'])}>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-right">Top Right</option>
                <option value="none">None</option>
              </select>
            </div>
          </TabsContent>

          <TabsContent value="export" className="p-6 space-y-6 mt-0">
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Quality</Label>
              <div className="flex justify-between mb-2"><span className="text-sm text-neutral-700">Print Quality</span><span className="text-sm text-neutral-500">{settings.exportQuality}%</span></div>
              <Slider value={[settings.exportQuality]} onValueChange={(value) => setValue('exportQuality', value[0] ?? settings.exportQuality)} max={100} step={5} />
            </div>

            <Separator />

            <div className="flex items-center justify-between"><Label className="text-sm text-neutral-700">Compression</Label><Switch checked={settings.compression} onCheckedChange={(v) => setValue('compression', v)} /></div>
            <div className="flex items-center justify-between"><Label className="text-sm text-neutral-700">Watermark</Label><Switch checked={settings.watermark} onCheckedChange={(v) => setValue('watermark', v)} /></div>
            <div className="flex items-center justify-between"><Label className="text-sm text-neutral-700">Include Metadata</Label><Switch checked={settings.includeMetadata} onCheckedChange={(v) => setValue('includeMetadata', v)} /></div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
