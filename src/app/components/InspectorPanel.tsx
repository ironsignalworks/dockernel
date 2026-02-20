import React from 'react';
import { Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

export function InspectorPanel() {
  const [addSignature, setAddSignature] = React.useState(false);
  const [signatureFileName, setSignatureFileName] = React.useState('');
  const [columnCount, setColumnCount] = React.useState<1 | 2>(1);
  const [typePreset, setTypePreset] = React.useState('Editorial');

  return (
    <div className="h-full bg-white border-l border-neutral-200 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="text-sm font-semibold text-neutral-900">Inspector</h2>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="layout" className="flex-1 min-h-0 flex flex-col min-w-0">
        <TabsList className="grid h-auto w-full grid-cols-2 border-b border-neutral-200 bg-transparent p-2 gap-2">
          <TabsTrigger
            value="layout"
            className="h-10 rounded-md border border-neutral-300 bg-white shadow-sm data-[state=active]:border-neutral-900 data-[state=active]:bg-neutral-100"
          >
            Layout
          </TabsTrigger>
          <TabsTrigger
            value="typography"
            className="h-10 rounded-md border border-neutral-300 bg-white shadow-sm data-[state=active]:border-neutral-900 data-[state=active]:bg-neutral-100"
          >
            Typography
          </TabsTrigger>
          <TabsTrigger
            value="header"
            className="h-10 rounded-md border border-neutral-300 bg-white shadow-sm data-[state=active]:border-neutral-900 data-[state=active]:bg-neutral-100"
          >
            Header/Footer
          </TabsTrigger>
          <TabsTrigger
            value="export"
            className="h-10 rounded-md border border-neutral-300 bg-white shadow-sm data-[state=active]:border-neutral-900 data-[state=active]:bg-neutral-100"
          >
            Export
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 min-h-0">
          {/* Layout Tab */}
          <TabsContent value="layout" className="p-6 space-y-6 mt-0">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-900">Page layout</h3>
              <p className="text-xs text-neutral-500">Adjust document dimensions and structure.</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Margins</Label>
              <p className="text-xs text-neutral-500">Space around content on every page.</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-700">Top</span>
                    <span className="text-sm text-neutral-500">25mm</span>
                  </div>
                  <Slider defaultValue={[25]} max={50} step={1} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-700">Bottom</span>
                    <span className="text-sm text-neutral-500">25mm</span>
                  </div>
                  <Slider defaultValue={[25]} max={50} step={1} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-700">Left</span>
                    <span className="text-sm text-neutral-500">20mm</span>
                  </div>
                  <Slider defaultValue={[20]} max={50} step={1} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-700">Right</span>
                    <span className="text-sm text-neutral-500">20mm</span>
                  </div>
                  <Slider defaultValue={[20]} max={50} step={1} />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Columns</Label>
              <p className="text-xs text-neutral-500">Split content into multiple reading columns.</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 ${columnCount === 1 ? 'bg-neutral-100 border-neutral-900' : ''}`}
                  onClick={() => {
                    setColumnCount(1);
                    toast.success('Columns set to 1');
                  }}
                >
                  1 Column
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 ${columnCount === 2 ? 'bg-neutral-100 border-neutral-900' : ''}`}
                  onClick={() => {
                    setColumnCount(2);
                    toast.success('Columns set to 2');
                  }}
                >
                  2 Columns
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Spacing rules</Label>
              <p className="text-xs text-neutral-500">Controls gaps between sections and paragraphs.</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-700">Section gap</span>
                    <span className="text-sm text-neutral-500">24px</span>
                  </div>
                  <Slider defaultValue={[24]} min={8} max={64} step={2} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-700">Paragraph gap</span>
                    <span className="text-sm text-neutral-500">12px</span>
                  </div>
                  <Slider defaultValue={[12]} min={4} max={40} step={1} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="p-6 space-y-6 mt-0">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-900">Type system</h3>
              <p className="text-xs text-neutral-500">Controls font scale, spacing, and hierarchy.</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Primary font</Label>
              <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white">
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
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-700">Scale factor</span>
                  <span className="text-sm text-neutral-500">1.5</span>
                </div>
                <Slider defaultValue={[15]} min={10} max={25} step={1} />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Body rhythm</Label>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-700">Paragraph spacing</span>
                  <span className="text-sm text-neutral-500">1.6</span>
                </div>
                <Slider defaultValue={[16]} min={10} max={25} step={1} />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Editorial', 'Technical', 'Compact', 'Resume'].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    className={typePreset === preset ? 'bg-neutral-100 border-neutral-900' : ''}
                    onClick={() => {
                      setTypePreset(preset);
                      toast.success(`${preset} preset applied`);
                    }}
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Header/Footer Tab */}
          <TabsContent value="header" className="p-6 space-y-6 mt-0">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-900">Running elements</h3>
              <p className="text-xs text-neutral-500">Content repeated across pages.</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Header content</Label>
              <p className="text-xs text-neutral-500">Shown at the top of each page.</p>
              <input
                type="text"
                placeholder="Document title"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm"
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Footer content</Label>
              <p className="text-xs text-neutral-500">Often used for page numbers or metadata.</p>
              <input
                type="text"
                placeholder="Page number and metadata"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm"
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs uppercase tracking-wide text-neutral-500">Add signature</Label>
                  <p className="mt-1 text-xs text-neutral-500">Insert a signature line on the final page.</p>
                </div>
                <Switch checked={addSignature} onCheckedChange={setAddSignature} />
              </div>
              {addSignature && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Signature label (e.g., Approved by)"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('signature-import-input')?.click()}
                    >
                      <Download className="w-4 h-4" />
                      Import signature
                    </Button>
                    {signatureFileName && (
                      <span className="text-xs text-neutral-500 truncate">{signatureFileName}</span>
                    )}
                    <input
                      id="signature-import-input"
                      type="file"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setSignatureFileName(file?.name ?? '');
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
              <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white">
                <option>Bottom Center</option>
                <option>Bottom Right</option>
                <option>Top Right</option>
                <option>None</option>
              </select>
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="p-6 space-y-6 mt-0">
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-neutral-500">Quality</Label>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-700">Print Quality</span>
                  <span className="text-sm text-neutral-500">High</span>
                </div>
                <Slider defaultValue={[80]} max={100} step={10} />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label className="text-sm text-neutral-700">Compression</Label>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-neutral-700">Watermark</Label>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-neutral-700">Include Metadata</Label>
              <Switch defaultChecked />
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
