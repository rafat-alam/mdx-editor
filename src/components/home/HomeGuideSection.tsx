import {
  BookOpen,
  Search,
  Sparkles,
  PenLine,
  Save,
  Share2,
  Lightbulb
} from 'lucide-react';

const guideSteps = [
  {
    icon: BookOpen,
    title: '1. Create a New Repository',
    description: 'After signing in, navigate to the "Lesson Plan" page from your dashboard or the navigation menu.',
    additionalInfo: 'Click on "Create New Lesson" to start a fresh repository or continue working on a saved one.',
  },
  {
    icon: Search,
    title: '2. Search for a Topic',
    description: 'Use the search bar in the left sidebar to find a main topic for your repository.',
    additionalInfo: 'The system will generate a hierarchy of related subtopics that you can customize by adding, removing, or reordering.',
  },
  {
    icon: Sparkles,
    title: '3. Generate Content with RAG',
    description: 'Select a topic or subtopic from the hierarchy, then use one of the three content generation methods:',
    listItems: [
      'Web Crawling: Automatically searches and retrieves relevant content from the web',
      'URL-based: Generate content from specific URLs you provide',
      'LLM-only: Create content using only the language model\'s knowledge',
    ],
  },
  {
    icon: PenLine,
    title: '4. Edit and Refine Content',
    description: 'Use the MDX editor to modify the generated content. You can view it in code, preview, or split view modes.',
    additionalInfo: 'Select text and use the refinement options to improve specific sections with additional web content or LLM assistance.',
  },
  {
    icon: Save,
    title: '5. Save Your MDX Files',
    description: 'Click "Save MDX" to save the content for the current topic. Topics with saved content will be highlighted in the hierarchy.',
    additionalInfo: 'When you\'re ready to save the entire repository, click "Save Lesson" at the top of the page.',
  },
  {
    icon: Share2,
    title: '6. Share Your Knowledge',
    description: 'Toggle the "Public" option when saving to make your repository available to the community.',
    additionalInfo: 'Public repositories can be viewed by anyone through the "Public Lessons" page, helping others learn from your expertise.',
  },
];

const proTips = [
  {
    title: 'Content Generation',
    description: 'Our RAG system combines web content with LLM capabilities to ensure up-to-date and accurate information. For the most current content, use the web crawling or URL-based methods.',
  },
  {
    title: 'Collaborative Learning',
    description: 'Browse public repositories to learn from others and get inspiration for your own content. You can also use the "View Combined" option to see all topics in a single document.',
  },
];

export function HomeGuideSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How to Use MDX Editor</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A step-by-step guide to get the most out of our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {guideSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="bg-background rounded-xl p-6 shadow-sm border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-3">{step.description}</p>
                    {step.additionalInfo && (
                      <p className="text-muted-foreground">{step.additionalInfo}</p>
                    )}
                    {step.listItems && (
                      <ul className="text-muted-foreground list-disc pl-5 space-y-1 mt-3">
                        {step.listItems.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-background rounded-xl p-6 shadow-sm border border-border/50">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Pro Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {proTips.map((tip, index) => (
                  <div key={index}>
                    <h4 className="font-medium mb-1">{tip.title}</h4>
                    <p className="text-muted-foreground text-sm">{tip.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
