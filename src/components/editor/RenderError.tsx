interface RenderErrorProps {
  error: string;
}

export function RenderError({ error }: RenderErrorProps) {
  return (
    <div className="text-red-500 p-3 sm:p-4 border border-red-300 rounded bg-red-50 text-sm sm:text-base">
      <h3 className="font-bold text-base sm:text-lg">Error rendering MDX:</h3>
      <pre className="mt-2 whitespace-pre-wrap text-xs sm:text-sm overflow-auto">{error}</pre>
    </div>
  );
}
