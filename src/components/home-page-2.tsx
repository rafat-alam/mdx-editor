import { Card, CardContent } from "@/components/ui/card";
import { LayoutGrid, FileText, Code, Search, Share2, Globe } from "lucide-react";

export default function HomePage2() {
  const features = [
    {
      title: "Hierarchical Lesson Plans",
      description: "Create structured lesson plans with topics and subtopics organized in a clear hierarchy",
      icon: <LayoutGrid className="w-6 h-6" />,
    },
    {
      title: "Rich MDX Content",
      description: "Create beautiful content with Markdown, JSX, code blocks, and more using our MDX editor",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      title: "RAG Technology",
      description: "Leverage Retrieval Augmented Generation to create high-quality content automatically",
      icon: <Code className="w-6 h-6" />,
    },
    {
      title: "Content Refinement",
      description: "Refine your content with intelligent suggestions and improvements",
      icon: <Search className="w-6 h-6" />,
    },
    {
      title: "Share Your Knowledge",
      description: "Publish your lesson plans to share with the community or keep them private",
      icon: <Share2 className="w-6 h-6" />,
    },
    {
      title: "Community Learning",
      description: "Browse and learn from lesson plans shared by other community members",
      icon: <Globe className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-[#1a1a1a] text-foreground dark:text-white">
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl font-bold">Powerful Features</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Everything you need to create, organize, and share your knowledge effectively
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="bg-background border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition"
          >
            <CardContent className="flex flex-col gap-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md w-max">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
