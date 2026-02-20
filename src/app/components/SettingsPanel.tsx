import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { toast } from 'sonner';

export function SettingsPanel() {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900">Workspace Settings</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Configure your workspace preferences
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {/* Editor Settings */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
              Editor
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Show line numbers</Label>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Enable scroll sync</Label>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Auto-save</Label>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Font size</Label>
                <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white">
                  <option>12px</option>
                  <option selected>14px</option>
                  <option>16px</option>
                  <option>18px</option>
                </select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Preview Settings */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
              Preview
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Show margins</Label>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Show page breaks</Label>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Enable zoom controls</Label>
                <Switch />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Default view</Label>
                <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white">
                  <option>Single page</option>
                  <option>Spread view</option>
                  <option>Continuous scroll</option>
                </select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Export Settings */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
              Export
            </h3>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Default export format</Label>
                <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white">
                  <option>High Quality Print</option>
                  <option>Screen PDF</option>
                  <option>Press Ready</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Output directory</Label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="/Downloads/DocKernel"
                    readOnly
                    className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-neutral-50"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info('Output directory selection will be added soon')}
                  >
                    Browse
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
              Appearance
            </h3>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Theme</Label>
                <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>Auto</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">UI Scale</Label>
                <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white">
                  <option>Small</option>
                  <option selected>Medium</option>
                  <option>Large</option>
                </select>
              </div>
            </div>
          </div>

          <Separator />

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
              About
            </h3>

            <div className="space-y-2 text-sm text-neutral-600">
              <div>DocKernel v1.0.0</div>
              <div>Browser-native publishing tool</div>
              <div>Built by ironsignalworks</div>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success('You are on the latest version')}
                >
                  Check for Updates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
