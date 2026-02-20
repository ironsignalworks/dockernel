import React from 'react';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

export function AboutPage() {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900">About DocKernel</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Browser-native publishing for Markdown and plain text.
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <Card className="max-w-3xl p-6 border-neutral-200 space-y-5">
            <div>
              <h3 className="text-base font-semibold text-neutral-900">What it does</h3>
              <p className="text-sm text-neutral-600 mt-2">
                DocKernel helps you edit, preview, and export print-friendly PDFs
                from Markdown, plain text, and image pages.
              </p>
            </div>

            <Separator className="bg-neutral-200" />

            <div>
              <h3 className="text-base font-semibold text-neutral-900">Core features</h3>
              <ul className="text-sm text-neutral-600 mt-2 list-disc pl-5 space-y-1">
                <li>Live Markdown editing and preview</li>
                <li>Fixed-page document preview with zoom controls</li>
                <li>Template-based document starts</li>
                <li>Export presets for repeatable output</li>
              </ul>
            </div>

            <Separator className="bg-neutral-200" />

            <p className="text-xs text-neutral-500">
              All content shown in this prototype runs locally in your browser.
            </p>
            <p className="text-xs text-neutral-500">
              Built by ironsignalworks.
            </p>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
