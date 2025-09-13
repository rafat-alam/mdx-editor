import { Card, CardContent } from "@/components/ui/card";
import { FileText, Search, GitBranch, Edit, Save, Share2, Lightbulb } from "lucide-react";

export default function HomePage4() {
  const steps = [
    {
      title: "Create a New Lesson Plan",
      description: "After signing in, navigate to the 'Lesson Plan' page from your dashboard or the navigation menu. Click on 'Create New Lesson' to start a fresh lesson plan or continue working on a saved one.",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      title: "Search for a Topic",
      description: "Use the search bar in the left sidebar to find a main topic for your lesson plan. The system will generate a hierarchy of related subtopics that you can customize by adding, removing, or reordering.",
      icon: <Search className="w-6 h-6" />,
    },
    {
      title: "Generate Content with RAG",
      description: "Select a topic or subtopic from the hierarchy, then use one of the three content generation methods: Web Crawling, URL-based, or LLM-only to generate content.",
      icon: <GitBranch className="w-6 h-6" />,
    },
    {
      title: "Edit and Refine Content",
      description: "Use the MDX editor to modify the generated content. You can view it in code, preview, or split view modes. Select text and use the refinement options to improve specific sections.",
      icon: <Edit className="w-6 h-6" />,
    },
    {
      title: "Save Your Lesson Plan",
      description: "Click 'Save MDX' to save the content for the current topic. Topics with saved content will be highlighted in the hierarchy. When ready, click 'Save Lesson' at the top.",
      icon: <Save className="w-6 h-6" />,
    },
    {
      title: "Share Your Knowledge",
      description: "Toggle the 'Public' option when saving to make your lesson available to the community. Public lessons can be viewed by anyone through the 'Public Lessons' page.",
      icon: <Share2 className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl font-bold">How to Use Topic Marker</h2>
        <p className="mt-2 text-gray-400">
          A step-by-step guide to get the most out of our platform
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="bg-gray-800 border border-gray-700 hover:shadow-2xl transition"
          >
            <CardContent className="flex flex-col gap-4 text-center p-6">
              <div className="p-4 bg-gray-700 rounded-full inline-block">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pro Tips Section */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <Card className="bg-gray-800 border border-gray-700 hover:shadow-2xl transition">
          <CardContent className="flex flex-col gap-4 text-center p-6">
            <div className="p-4 bg-gray-700 rounded-full inline-block">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Pro Tips</h3>
            <p className="text-gray-400">
              Content Generation: Our RAG system combines web content with LLM capabilities to ensure up-to-date and accurate information. For the most current content, use the web crawling or URL-based methods.
            </p>
            <p className="text-gray-400">
              Collaborative Learning: Browse public lessons to learn from others and get inspiration. You can also use the 'View Combined' option to see all topics in a single document.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
