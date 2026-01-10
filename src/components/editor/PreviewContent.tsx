'use client'
import { MDXRenderer } from '@/components/editor/-MDXRendererOLD';

interface PreviewContentProps {
  mdxContent: string;
  isPreviewFullscreen: boolean;
  divRef: React.RefObject<HTMLDivElement | null>;
}

export function PreviewContent({
  mdxContent,
  isPreviewFullscreen,
  divRef,
}: PreviewContentProps) {
  return (
    <div 
      className={`overflow-auto h-[calc(100%-3.5rem)] w-full ${isPreviewFullscreen ? 'p-6' : 'p-4'}`} 
      ref={divRef}
    >
      <div className="prose prose-sm sm:prose dark:prose-invert w-full max-w-none prose-headings:text-inherit prose-p:text-inherit prose-a:text-blue-600 prose-strong:font-bold prose-em:italic prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded prose-pre:overflow-auto prose-code:text-red-500 prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-img:max-w-full">
        <MDXRenderer content={mdxContent} />
      </div>
    </div>
  );
}
