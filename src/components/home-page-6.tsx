import { Button } from "@/components/ui/button"; // Assuming Button is a Shadcn UI component
import Link from "next/link"; // Assuming you're using React Router for navigation

export default function HomePage6() {
  return (
    <footer className="py-8 bg-background dark:bg-gray-900 text-foreground dark:text-white">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="text-left">
          <h2 className="text-2xl font-bold">MDX Editor</h2>
          <p className="text-sm text-gray-400 dark:text-gray-300">
            Create, organize, and share knowledge
          </p>
        </div>

        <div className="space-x-4">
          <Link href="/about" className="text-sm text-blue-500 hover:text-blue-300">
            About
          </Link>
          <Link href="/public-content" className="text-sm text-blue-500 hover:text-blue-300">
            Public Content
          </Link>
        </div>

        <div className="text-sm text-gray-400 dark:text-gray-500">
          <p>© 2025 MDX Editor</p>
        </div>
      </div>
    </footer>
  );
}
