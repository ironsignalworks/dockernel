import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

export interface WorkspaceSettings {
  autoSave: boolean;
  editorFontSize: 12 | 14 | 16 | 18;
  defaultTemplate: 'book' | 'zine' | 'catalogue' | 'report' | 'custom';
  defaultPageSize: 'a4' | 'a5' | 'letter' | 'legal';
  theme: 'light' | 'dark' | 'auto';
  uiScale: 'small' | 'medium' | 'large';
}

interface SettingsPanelProps {
  settings?: WorkspaceSettings;
  onChange?: (next: WorkspaceSettings) => void;
}

const fallbackSettings: WorkspaceSettings = {
  autoSave: true,
  editorFontSize: 14,
  defaultTemplate: 'book',
  defaultPageSize: 'a4',
  theme: 'light',
  uiScale: 'medium',
};

export function SettingsPanel({ settings = fallbackSettings, onChange }: SettingsPanelProps) {
  const setValue = <K extends keyof WorkspaceSettings>(key: K, value: WorkspaceSettings[K]) => {
    onChange?.({ ...settings, [key]: value });
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900">Workspace Settings</h2>
        <p className="text-sm text-neutral-500 mt-1">Configure your workspace preferences</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">Editor</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-neutral-700">Auto-save</Label>
                <Switch checked={settings.autoSave} onCheckedChange={(v) => setValue('autoSave', v)} />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Font size</Label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white"
                  value={`${settings.editorFontSize}px`}
                  onChange={(e) => setValue('editorFontSize', Number.parseInt(e.target.value.replace('px', ''), 10) as 12 | 14 | 16 | 18)}
                >
                  <option>12px</option>
                  <option>14px</option>
                  <option>16px</option>
                  <option>18px</option>
                </select>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">Document Defaults</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Default template</Label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white"
                  value={settings.defaultTemplate}
                  onChange={(e) => setValue('defaultTemplate', e.target.value as WorkspaceSettings['defaultTemplate'])}
                >
                  <option value="book">Book layout</option>
                  <option value="zine">Zine layout</option>
                  <option value="catalogue">Catalogue grid</option>
                  <option value="report">Report format</option>
                  <option value="custom">Custom layout</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Default page size</Label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white"
                  value={settings.defaultPageSize}
                  onChange={(e) => setValue('defaultPageSize', e.target.value as WorkspaceSettings['defaultPageSize'])}
                >
                  <option value="a4">A4</option>
                  <option value="a5">A5</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">Appearance</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Theme</Label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white"
                  value={settings.theme}
                  onChange={(e) => setValue('theme', e.target.value as WorkspaceSettings['theme'])}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">UI scale</Label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white"
                  value={settings.uiScale}
                  onChange={(e) => setValue('uiScale', e.target.value as WorkspaceSettings['uiScale'])}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
