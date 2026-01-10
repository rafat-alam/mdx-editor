'use client'
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { MarkdownComponents } from './MarkdownComponents';
import { RenderError } from './RenderError';

interface MDXRendererProps {
  content: string;
}

export function MDXRenderer({ content }: MDXRendererProps) {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return <RenderError error={error} />;
  }

  try {
    return (
      <div
        className="prose prose-sm sm:prose-base md:prose-lg dark:prose-invert w-full max-w-full"
        style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
      >
        <div style={{ maxWidth: '100%', wordBreak: 'break-word' }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeHighlight, rehypeKatex]}
            components={MarkdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    );
  } catch (err) {
    console.error('Error rendering markdown:', err);
    setError(err instanceof Error ? err.message : 'Unknown error rendering markdown');
    return null;
  }
}
