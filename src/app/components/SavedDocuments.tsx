import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { FileText, Clock, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface Document {
  id: string;
  title: string;
  lastEdited: string;
  pageCount: number;
}

const mockDocuments: Document[] = [
  { id: '1', title: 'Product Catalogue 2026', lastEdited: '2 hours ago', pageCount: 24 },
  { id: '2', title: 'Annual Report Draft', lastEdited: 'Yesterday', pageCount: 48 },
  { id: '3', title: 'Design Zine #3', lastEdited: '3 days ago', pageCount: 16 },
  { id: '4', title: 'Technical Documentation', lastEdited: '1 week ago', pageCount: 32 },
  { id: '5', title: 'Portfolio Lookbook', lastEdited: '2 weeks ago', pageCount: 20 },
];

export function SavedDocuments() {
  const documents = mockDocuments;

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900">Recent Documents</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Your recent projects and exports
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {documents.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5">
              <h3 className="text-sm font-semibold text-neutral-900">No saved documents yet</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Documents saved in this browser will appear here for quick access.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-neutral-200 hover:border-neutral-300"
                  onClick={() => toast.success(`Opened "${doc.title}"`)}
                >
                  {/* Preview Thumbnail */}
                  <div className="aspect-[3/4] bg-neutral-100 rounded-lg mb-4 flex items-center justify-center border border-neutral-200">
                    <FileText className="w-8 h-8 text-neutral-400" />
                  </div>

                  {/* Document Info */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-neutral-900 flex-1">
                        {doc.title}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 -mt-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info('Document actions menu coming soon');
                        }}
                      >
                        <MoreVertical className="w-4 h-4 text-neutral-500" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Clock className="w-3 h-3" />
                      {doc.lastEdited}
                    </div>

                    <div className="text-sm text-neutral-500">
                      {doc.pageCount} pages
                    </div>
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
