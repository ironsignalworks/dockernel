import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { FileText, Layout, Zap, BookOpen } from 'lucide-react';

interface NewDocumentViewProps {
  onStartBlank: () => void;
  onOpenTemplates: () => void;
}

export function NewDocumentView({ onStartBlank, onOpenTemplates }: NewDocumentViewProps) {
  const [step, setStep] = useState(0);
  const onboardingSteps = [
    {
      label: 'STEP 1 - Editor',
      title: 'Write or import content',
      text: 'DocKernel formats Markdown and plain text into structured pages as you type.',
    },
    {
      label: 'STEP 2 - Preview',
      title: 'Live layout preview',
      text: 'This view shows exactly how your document will appear when exported.',
    },
    {
      label: 'STEP 3 - Layout',
      title: 'Adjust page setup',
      text: 'Tune page structure and formatting in Layout and Inspector controls.',
    },
    {
      label: 'STEP 4 - Templates',
      title: 'Try different layouts',
      text: 'Templates instantly reflow your document into new formats without changing the content.',
    },
    {
      label: 'STEP 5 - Export',
      title: 'Finalize output',
      text: 'Open the export preview to download a print-ready PDF that matches the layout exactly.',
    },
  ] as const;

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Markdown & Plain Text',
      description: 'Write in familiar formats, export professional documents',
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: 'Page Layout Tools',
      description: 'Adjust structure and spacing for print-ready output',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Real-time Preview',
      description: 'See your formatted document as you type',
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Print-ready Output',
      description: 'Generate high-quality PDFs for any purpose',
    },
  ];

  return (
    <div className="h-full bg-neutral-50">
      <div className="h-full overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center min-h-full flex flex-col justify-center">
          <div className="w-full max-w-2xl mx-auto">
            <div className="mb-12 px-1 sm:px-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-900 mb-4 leading-tight break-words [overflow-wrap:anywhere]">
                Welcome to DocKernel
              </h1>
              <p className="text-base sm:text-lg text-neutral-600 break-words [overflow-wrap:anywhere]">
                A browser-native publishing tool that transforms Markdown and plain text
                into structured documents and PDFs
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center items-stretch md:items-center mb-12 sm:mb-16">
              <Button
                onClick={onStartBlank}
                size="lg"
                className="bg-neutral-900 hover:bg-neutral-800 px-8 w-full md:w-auto"
              >
                Start from Blank
              </Button>
              <Button
                onClick={onOpenTemplates}
                variant="outline"
                size="lg"
                className="px-8 w-full md:w-auto"
              >
                Apply Template
              </Button>
            </div>
          </div>

          <div className="mb-12">
            <Card className="max-w-2xl mx-auto p-5 text-left border-neutral-200 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-neutral-500">{onboardingSteps[step].label}</p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900">{onboardingSteps[step].title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{onboardingSteps[step].text}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {onboardingSteps.map((_, i) => (
                    <span
                      key={i}
                      className={`h-2 w-2 rounded-full ${i === step ? 'bg-neutral-900' : 'bg-neutral-300'}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                    disabled={step === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep((prev) => Math.min(onboardingSteps.length - 1, prev + 1))}
                    disabled={step === onboardingSteps.length - 1}
                  >
                    Next
                  </Button>
                  <Button size="sm" onClick={onStartBlank}>
                    Start editing
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 text-left border-neutral-200 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center mb-4 text-neutral-700">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-neutral-200">
            <p className="text-sm text-neutral-500">
              All processing happens locally in your browser. Your documents stay private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
