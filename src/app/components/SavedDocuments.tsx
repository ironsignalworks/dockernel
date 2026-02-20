import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Clock, MoreVertical, Copy, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { splitContentIntoPages } from '../lib/paging';
import ReactMarkdown from 'react-markdown';
import { markdownUrlTransform } from '../lib/markdown';

export interface SavedDocumentRecord {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  pageCount: number;
}

interface SavedDocumentsProps {
  documents?: SavedDocumentRecord[];
  onOpenDocument?: (id: string) => void;
  onDuplicateDocument?: (id: string) => void;
  onDeleteDocument?: (id: string) => void;
}

export function SavedDocuments({
  documents = [],
  onOpenDocument,
  onDuplicateDocument,
  onDeleteDocument,
}: SavedDocumentsProps) {
  const renderPreview = (content: string) => {
    const firstPage = splitContentIntoPages(content, 1300)[0]?.trim() ?? '';
    if (!firstPage) {
      return <div className="text-xs text-neutral-400">No content</div>;
    }
    return (
      <div className="prose prose-sm max-w-none text-neutral-700 pointer-events-none">
        <ReactMarkdown urlTransform={markdownUrlTransform}>{firstPage}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900">Saved Documents</h2>
        <p className="text-sm text-neutral-500 mt-1">Local workspace files</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {documents.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5">
              <h3 className="text-sm font-semibold text-neutral-900">No saved documents yet</h3>
              <p className="mt-1 text-sm text-neutral-600">Documents saved in this browser will appear here for quick access.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-neutral-200 hover:border-neutral-300"
                  onClick={() => onOpenDocument?.(doc.id)}
                >
                  <div className="aspect-[3/4] bg-white rounded-lg mb-4 border border-neutral-200 overflow-hidden p-3">
                    <div className="h-full w-full overflow-hidden">
                      {renderPreview(doc.content)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-neutral-900 flex-1 line-clamp-2">{doc.title}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 -mt-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4 text-neutral-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicateDocument?.(doc.id);
                            }}
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteDocument?.(doc.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Clock className="w-3 h-3" />
                      {new Date(doc.updatedAt).toLocaleString()}
                    </div>

                    <div className="text-sm text-neutral-500">{doc.pageCount} pages</div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
