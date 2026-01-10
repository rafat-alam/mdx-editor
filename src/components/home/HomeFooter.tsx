export function HomeFooter() {
  return (
    <footer className="py-8 px-4 border-t">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-xl font-bold">MDX Editor</p>
            <p className="text-sm text-muted-foreground">Create, organize, and share knowledge</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
            <a
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="/public-repos"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Public Repositories
            </a>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MDX Editor
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
