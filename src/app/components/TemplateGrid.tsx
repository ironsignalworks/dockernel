import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { FileText, BookOpen, Grid3x3 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

export type TemplateId =
  | 'zine-a5'
  | 'zine-half'
  | 'zine-folded'
  | 'book-print'
  | 'book-manuscript'
  | 'book-trade'
  | 'cat-product'
  | 'cat-lookbook'
  | 'cat-editorial';

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  category: 'zine' | 'book' | 'catalogue';
  description: string;
  icon: React.ReactNode;
  starterContent: string;
}

const templates: TemplateDefinition[] = [
  {
    id: 'zine-a5',
    name: 'A5 Booklet',
    category: 'zine',
    description: 'Folded A4 into A5 booklet format',
    icon: <FileText className="w-6 h-6" />,
    starterContent: '# A5 Booklet\n\n## Intro\n\nStart writing your zine content here.',
  },
  {
    id: 'zine-half',
    name: 'Half-Letter Zine',
    category: 'zine',
    description: 'US Letter folded in half',
    icon: <FileText className="w-6 h-6" />,
    starterContent: '# Half-Letter Zine\n\n## Section 1\n\nAdd content for each spread.',
  },
  {
    id: 'zine-folded',
    name: 'Folded A4 Zine',
    category: 'zine',
    description: 'Classic folded zine layout',
    icon: <FileText className="w-6 h-6" />,
    starterContent: '# Folded A4 Zine\n\n## Cover\n\nAdd cover text and intro copy.',
  },
  {
    id: 'book-print',
    name: 'Print Book',
    category: 'book',
    description: 'Standard print book with margins',
    icon: <BookOpen className="w-6 h-6" />,
    starterContent: '# Print Book\n\n## Chapter 1\n\nWrite the opening chapter.',
  },
  {
    id: 'book-manuscript',
    name: 'Manuscript',
    category: 'book',
    description: 'Double-spaced manuscript format',
    icon: <BookOpen className="w-6 h-6" />,
    starterContent: '# Manuscript Draft\n\n## Chapter 1\n\nBegin your manuscript draft.',
  },
  {
    id: 'book-trade',
    name: 'Trade Paperback',
    category: 'book',
    description: '6x9 trade paperback format',
    icon: <BookOpen className="w-6 h-6" />,
    starterContent: '# Trade Paperback\n\n## Front Matter\n\nSubtitle, author, and opening text.',
  },
  {
    id: 'cat-product',
    name: 'Product Catalogue',
    category: 'catalogue',
    description: 'Grid-based product showcase',
    icon: <Grid3x3 className="w-6 h-6" />,
    starterContent: '# Product Catalogue\n\n## Featured Items\n\n- Item A\n- Item B\n- Item C',
  },
  {
    id: 'cat-lookbook',
    name: 'Lookbook',
    category: 'catalogue',
    description: 'Fashion and photography layout',
    icon: <Grid3x3 className="w-6 h-6" />,
    starterContent: '# Lookbook\n\n## Collection\n\nAdd image pages and captions.',
  },
  {
    id: 'cat-editorial',
    name: 'Editorial Grid',
    category: 'catalogue',
    description: 'Magazine-style editorial layout',
    icon: <Grid3x3 className="w-6 h-6" />,
    starterContent: '# Editorial Grid\n\n## Story\n\nAdd editorial content and visuals.',
  },
];

interface TemplateGridProps {
  selectedTemplateId?: TemplateId | null;
  onSelectTemplate?: (template: TemplateDefinition) => void;
}

export function TemplateGrid({ selectedTemplateId = null, onSelectTemplate }: TemplateGridProps) {
  const categories = [
    { id: 'zine', label: 'Zine Templates' },
    { id: 'book', label: 'Book Templates' },
    { id: 'catalogue', label: 'Catalogue Templates' },
  ] as const;

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900">Apply Template</h2>
        <p className="text-sm text-neutral-500 mt-1">Start with a pre-configured layout</p>
      </div>

      {!selectedTemplateId && (
        <div className="mx-6 mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <h3 className="text-sm font-semibold text-neutral-900">Choose a layout template</h3>
          <p className="mt-1 text-sm text-neutral-600">Templates define page structure, numbering, and spacing rules.</p>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {categories.map((category) => {
            const categoryTemplates = templates.filter((t) => t.category === category.id);

            return (
              <div key={category.id} className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">{category.label}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className={`p-5 border-neutral-200 transition-shadow ${
                        selectedTemplateId === template.id ? 'ring-1 ring-neutral-900 border-neutral-900 shadow-sm' : 'hover:shadow-md hover:border-neutral-300'
                      }`}
                    >
                      <div className="aspect-[3/4] bg-neutral-100 rounded-lg mb-4 flex items-center justify-center border border-neutral-200">
                        <div className="text-neutral-400">{template.icon}</div>
                      </div>

                      <div className="space-y-1 mb-4">
                        <h4 className="font-semibold text-neutral-900">{template.name}</h4>
                        <p className="text-sm text-neutral-500">{template.description}</p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          onSelectTemplate?.(template);
                          toast.success(`Applied ${template.name}`);
                        }}
                      >
                        Apply template
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
