import React from 'react';
import { Search, PanelLeftClose, PanelLeftOpen, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface TopBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isStackedLayout: boolean;
  onToggleStackedLayout: () => void;
  documentName: string;
  onDocumentNameChange: (value: string) => void;
  onExportClick: () => void;
  pageSize: 'a4' | 'a5' | 'letter' | 'legal';
  onPageSizeChange: (value: 'a4' | 'a5' | 'letter' | 'legal') => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}

export function TopBar({
  isSidebarOpen,
  onToggleSidebar,
  isStackedLayout,
  onToggleStackedLayout,
  documentName,
  onDocumentNameChange,
  onExportClick,
  pageSize,
  onPageSizeChange,
  searchQuery,
  onSearchQueryChange,
}: TopBarProps) {
  return (
    <header className="bg-white border-b border-neutral-200 px-4 lg:px-6 py-3 overflow-x-hidden">
      <div className="flex items-center gap-2 min-w-0">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Hide menu' : 'Show menu'}
          aria-label={isSidebarOpen ? 'Hide menu' : 'Show menu'}
        >
          {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </Button>

        <div className="flex-1 min-w-0 md:w-[260px] md:flex-none lg:w-[320px]">
          <Input
            type="text"
            value={documentName}
            onChange={(e) => onDocumentNameChange(e.target.value)}
            placeholder="Untitled Document"
            title="Name your document."
            className="h-10 bg-white"
          />
        </div>

        <div className="hidden lg:block w-[130px] shrink-0">
          <Select value={pageSize} onValueChange={(value) => onPageSizeChange(value as TopBarProps['pageSize'])}>
            <SelectTrigger title="Page size" className="h-10 bg-white">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a4">A4</SelectItem>
              <SelectItem value="a5">A5</SelectItem>
              <SelectItem value="letter">Letter</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="hidden md:block relative w-[220px] lg:w-[300px] shrink-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input type="text" value={searchQuery} onChange={(e) => onSearchQueryChange(e.target.value)} placeholder="Search document..." className="h-10 bg-white pl-9" />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleStackedLayout}
          className={`hidden md:inline-flex ${isStackedLayout ? 'bg-neutral-100 border-neutral-900 text-neutral-900' : ''}`}
          title={isStackedLayout ? 'Switch to split panels' : 'Switch to stacked panels'}
          aria-label={isStackedLayout ? 'Switch to split panels' : 'Switch to stacked panels'}
        >
          {isStackedLayout ? 'Split panels' : 'Stacked panels'}
        </Button>

        <Button onClick={onExportClick} className="inline-flex h-10 shrink-0 gap-2 bg-neutral-900 hover:bg-neutral-800">
          <Upload className="w-4 h-4" />
          Export PDF
        </Button>
      </div>
    </header>
  );
}
