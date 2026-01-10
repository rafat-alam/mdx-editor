'use client'
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

interface PreviewHeaderProps {
  isPreviewFullscreen: boolean;
  togglePreviewFullscreen: () => void;
}

export function PreviewHeader({
  isPreviewFullscreen,
  togglePreviewFullscreen,
}: PreviewHeaderProps) {
  return (
    <div className="p-3 h-14 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
      <h2 className="text-lg font-semibold">Preview</h2>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePreviewFullscreen}
          className="h-8 w-8 p-0"
          title={isPreviewFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isPreviewFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </Button>
      </div>
    </div>
  );
}
