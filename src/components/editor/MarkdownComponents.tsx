export const MarkdownComponents = {
  h1: ({ ...props }) => (
    <h1
      className="text-2xl sm:text-3xl md:text-4xl font-bold mt-6 mb-4"
      {...props}
    />
  ),
  h2: ({ ...props }) => (
    <h2
      className="text-xl sm:text-2xl md:text-3xl font-semibold mt-5 mb-3"
      {...props}
    />
  ),
  h3: ({ ...props }) => (
    <h3
      className="text-lg sm:text-xl md:text-2xl font-medium mt-4 mb-2"
      {...props}
    />
  ),
  pre: ({ ...props }) => (
    <pre
      className="text-xs sm:text-sm md:text-base p-2 sm:p-4 rounded-md overflow-x-auto max-w-full"
      {...props}
    />
  ),
  code: ({ ...props }) => (
    <code
      className="text-xs sm:text-sm font-mono"
      style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
      {...props}
    />
  ),
  img: ({ ...props }) => (
    <img
      className="max-w-full h-auto rounded-md my-4"
      {...props}
    />
  ),
  table: ({ ...props }) => (
    <div className="overflow-x-auto my-4">
      <table
        className="min-w-full text-xs sm:text-sm md:text-base border-collapse"
        {...props}
      />
    </div>
  ),
  p: ({ ...props }) => (
    <p
      className="my-2 sm:my-3 md:my-4 text-sm sm:text-base"
      {...props}
    />
  ),
  ul: ({ ...props }) => (
    <ul
      className="my-2 sm:my-3 md:my-4 pl-5 sm:pl-6 list-disc"
      {...props}
    />
  ),
  ol: ({ ...props }) => (
    <ol
      className="my-2 sm:my-3 md:my-4 pl-5 sm:pl-6 list-decimal"
      {...props}
    />
  ),
  li: ({ ...props }) => (
    <li
      className="my-1 sm:my-2 text-sm sm:text-base"
      {...props}
    />
  ),
  blockquote: ({ ...props }) => (
    <blockquote
      className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 sm:pl-4 my-3 sm:my-4 italic text-sm sm:text-base"
      {...props}
    />
  )
};
