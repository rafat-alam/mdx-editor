'use client'
import { PreviewHeader } from './PreviewHeader';
import { PreviewContent } from './PreviewContent';

interface PreviewPanelProps {
  mdxContent: string;
  isPreviewFullscreen: boolean;
  togglePreviewFullscreen: () => void;
  getPreviewWidth: () => string;
  isMobileView: boolean;
  activeTab: 'editor' | 'preview';
  divRef: React.RefObject<HTMLDivElement | null>;
}

export function PreviewPanel({
  mdxContent,
  isPreviewFullscreen,
  togglePreviewFullscreen,
  getPreviewWidth,
  isMobileView,
  activeTab,
  divRef,
}: PreviewPanelProps) {
  return (
    <div
      className={`${getPreviewWidth()} h-full overflow-auto transition-all duration-300 ${
        isMobileView && activeTab !== 'preview' ? 'hidden' : ''
      } ${isPreviewFullscreen ? 'w-full' : ''}`}
    >
      <PreviewHeader
        isPreviewFullscreen={isPreviewFullscreen}
        togglePreviewFullscreen={togglePreviewFullscreen}
      />
      
      <PreviewContent
        mdxContent={mdxContent}
        isPreviewFullscreen={isPreviewFullscreen}
        divRef={divRef}
      />
    </div>
  );
}
