import React, { useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { FileDown, Settings, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { openPdfPrintPreview } from '../lib/export';

interface ExportPreset {
  id: string;
  name: string;
  description: string;
  settings: {
    dpi: number;
    compression: string;
    quality: string;
  };
}

const initialPresets: ExportPreset[] = [
  {
    id: '1',
    name: 'High Quality Print',
    description: 'Best for professional printing',
    settings: { dpi: 300, compression: 'Low', quality: 'Maximum' },
  },
  {
    id: '2',
    name: 'Screen PDF',
    description: 'Optimized for digital viewing',
    settings: { dpi: 150, compression: 'Medium', quality: 'Good' },
  },
  {
    id: '3',
    name: 'Press Ready',
    description: 'Commercial print specifications',
    settings: { dpi: 300, compression: 'None', quality: 'Maximum' },
  },
  {
    id: '4',
    name: 'Compressed',
    description: 'Smaller file size for sharing',
    settings: { dpi: 72, compression: 'High', quality: 'Standard' },
  },
];

export function ExportPresets() {
  const [presets, setPresets] = useState<ExportPreset[]>(initialPresets);
  const [activePresetId, setActivePresetId] = useState<string>(initialPresets[0]?.id ?? '');

  const handleSaveCurrentPreset = () => {
    const nextIndex = presets.length + 1;
    const newPreset: ExportPreset = {
      id: crypto.randomUUID(),
      name: `Current Preset ${nextIndex}`,
      description: 'Saved from current export configuration',
      settings: { dpi: 150, compression: 'Medium', quality: 'High' },
    };
    setPresets((prev) => [newPreset, ...prev]);
    toast.success('Preset saved');
  };

  const handleDeletePreset = (presetId: string) => {
    setPresets((prev) => prev.filter((preset) => preset.id !== presetId));
    toast.success('Preset removed');
  };

  const handleDuplicatePreset = (preset: ExportPreset) => {
    const duplicate: ExportPreset = {
      ...preset,
      id: crypto.randomUUID(),
      name: `${preset.name} Copy`,
    };
    setPresets((prev) => [duplicate, ...prev]);
    toast.success('Preset duplicated');
  };

  const handleCopyPresetSettings = async (preset: ExportPreset) => {
    const text = `Preset: ${preset.name}\nDPI: ${preset.settings.dpi}\nCompression: ${preset.settings.compression}\nQuality: ${preset.settings.quality}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Preset settings copied');
    } catch {
      toast.error('Could not copy preset settings');
    }
  };

  const handleExportWithPreset = (preset: ExportPreset) => {
    const quality = preset.settings.quality.toLowerCase() === 'maximum' ? 95 : preset.settings.quality.toLowerCase() === 'good' ? 75 : 60;
    const compression = preset.settings.compression.toLowerCase() !== 'none';
    const ok = openPdfPrintPreview('', {
      title: preset.name,
      quality,
      compression,
      includeMetadata: true,
      watermark: false,
    });
    if (!ok) {
      toast.error('Popup blocked. Allow popups to export PDF.');
      return;
    }
    toast.success(`Export started with "${preset.name}"`);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Export Presets</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Manage your saved export configurations
          </p>
        </div>
        <Button
          size="sm"
          className="bg-neutral-900 hover:bg-neutral-800"
          onClick={handleSaveCurrentPreset}
        >
          Save current preset
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {presets.map((preset) => (
            <Card
              key={preset.id}
              className="p-6 border-neutral-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 mb-1">
                      {preset.name}
                    </h3>
                  <p className="text-sm text-neutral-500">{preset.description}</p>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${activePresetId === preset.id ? 'bg-neutral-100' : ''}`}
                    onClick={() => {
                      setActivePresetId(preset.id);
                      toast.success(`Selected "${preset.name}"`);
                    }}
                    title="Use preset"
                    aria-label={`Use preset ${preset.name}`}
                  >
                    <Settings className="w-4 h-4 text-neutral-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDuplicatePreset(preset)}
                    title="Duplicate preset"
                    aria-label={`Duplicate preset ${preset.name}`}
                  >
                    <Copy className="w-4 h-4 text-neutral-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDeletePreset(preset.id)}
                    title="Delete preset"
                    aria-label={`Delete preset ${preset.name}`}
                  >
                    <Trash2 className="w-4 h-4 text-neutral-500" />
                  </Button>
                </div>
              </div>

              {/* Settings Summary */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    DPI
                  </div>
                  <div className="text-sm font-medium text-neutral-900">
                    {preset.settings.dpi}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    Compression
                  </div>
                  <div className="text-sm font-medium text-neutral-900">
                    {preset.settings.compression}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    Quality
                  </div>
                  <div className="text-sm font-medium text-neutral-900">
                    {preset.settings.quality}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => handleCopyPresetSettings(preset)}
                >
                  <Copy className="w-4 h-4" />
                  Copy settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => handleExportWithPreset(preset)}
                >
                <FileDown className="w-4 h-4" />
                  Export PDF
                </Button>
              </div>
            </Card>
          ))}

          {/* Custom Preset Card */}
          <Card
            className="p-8 border-2 border-dashed border-neutral-300 hover:border-neutral-400 transition-colors cursor-pointer"
            onClick={handleSaveCurrentPreset}
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                <FileDown className="w-6 h-6 text-neutral-500" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">
                Save current preset
              </h3>
              <p className="text-sm text-neutral-500">
                Capture the current settings for reuse
              </p>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
