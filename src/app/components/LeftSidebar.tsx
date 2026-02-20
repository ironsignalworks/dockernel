import React from 'react';
import { FileText, Layout, Save, Settings, Info, Download, Upload } from 'lucide-react';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import logoIcon from '../../../icon.svg';

interface LeftSidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  onExportClick: () => void;
  onImportFile: (file: File) => void;
}

export function LeftSidebar({ activeNav, onNavChange, onExportClick, onImportFile }: LeftSidebarProps) {
  const navItems = [
    { id: 'new', label: 'Document', subtext: 'Content & structure', icon: FileText },
    { id: 'templates', label: 'Templates', subtext: 'Layout starting points', icon: Layout },
    { id: 'export', label: 'Export Presets', subtext: 'Output quality & format', icon: Upload },
    { id: 'saved', label: 'Saved Documents', subtext: 'Local workspace files', icon: Save },
    { id: 'settings', label: 'Settings', subtext: 'Fonts, defaults, behaviour', icon: Settings },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="w-64 h-screen min-h-0 bg-white border-r border-neutral-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <img src={logoIcon} alt="DocKernel logo" className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">DocKernel</h1>
            <p className="text-xs text-neutral-500 mt-1">Publishing Tool</p>
          </div>
        </div>
      </div>

      <Separator className="bg-neutral-200" />

      {/* Navigation */}
      <nav className="flex-1 min-h-0 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left ${
                activeNav === item.id
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="flex flex-col">
                <span className="text-sm leading-tight">{item.label}</span>
                {'subtext' in item && item.subtext ? (
                  <span className="text-[11px] leading-tight text-neutral-500 mt-0.5">{item.subtext}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </nav>

      <Separator className="bg-neutral-200" />

      <div className="shrink-0 p-4 space-y-2">
        <Button
          variant="outline"
          className="w-full justify-center gap-2 rounded-lg text-center"
          onClick={() => document.getElementById('doc-import-input')?.click()}
        >
          <Download className="w-4 h-4" />
          Import File
        </Button>
        <input
          id="doc-import-input"
          type="file"
          className="hidden"
          accept=".md,.markdown,.txt,.rtf,.csv,.json,.xml,.html,.htm,.yml,.yaml,.png,.jpg,.jpeg,.webp,.gif,.svg,image/*,text/plain,text/markdown,text/csv,application/json,application/xml,text/xml,text/html"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImportFile(file);
            e.currentTarget.value = '';
          }}
        />
        <Button
          onClick={onExportClick}
          className="w-full justify-center gap-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-center"
        >
          <Upload className="w-4 h-4" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}
