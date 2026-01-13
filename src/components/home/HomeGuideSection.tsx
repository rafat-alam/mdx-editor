import {
  BookOpen,
  Sparkles,
  PenLine,
  Save,
  Share2,
  Lightbulb,
  FolderTree
} from 'lucide-react';

const guideSteps = [
  {
    icon: BookOpen,
    title: '1. Create a New Repository',
    description:
      'After signing in, navigate to the “Your Repos” section from your dashboard or the navigation menu.',
    additionalInfo:
      'Click on “Create New Repository” to start a fresh repository or continue working on an existing one.',
  },
  {
    icon: FolderTree,
    title: '2. Create Files & Folders as Topics',
    description:
      'Build a file–folder hierarchy in the left sidebar, where folders represent main topics and files act as individual subtopics.',
    additionalInfo:
      'You can add, rename, delete, or reorder files and folders to organize your content exactly the way you want.',
  },
  {
    icon: Sparkles,
    title: '3. Generate Initial Content with RAG',
    description:
      'Choose a file or topic and generate a first draft by combining repository context, web data, or model knowledge.',
    listItems: [
      'Repo-Wide: Builds content using context from the entire repository',
      'Web Crawling: Collects and synthesizes relevant information from the web',
      'URL-based: Generates content from specific external sources you provide',
      'LLM-only: Produces content solely from the language model’s knowledge',
    ],
  },
  {
    icon: PenLine,
    title: '4. Edit, Review & Refine',
    description:
      'Manually edit the draft and iteratively improve it using the MDX editor with real-time previews.',
    additionalInfo:
      'Apply targeted refinements to selected sections for better accuracy, structure, and clarity:',
    listItems: [
      'Enhance weak sections with additional repository context',
      'Augment content with fresh or authoritative web sources',
      'Refine specific parts using trusted URLs',
      'Polish language and structure using LLM-only refinement',
    ],
  },
  {
    icon: Save,
    title: '5. Validate & Save MDX Content',
    description:
      'Review the final output, validate formatting and structure, and save the MDX file to persist your work.',
    additionalInfo:
      'Saved content is versioned and can be revisited, updated, or published at any time.',
  },
  {
    icon: Share2,
    title: '6. Share Your Knowledge',
    description:
      'Enable the “Public” option while saving to make your repository accessible to the community.',
    additionalInfo:
      'Public repositories can be viewed by anyone from the “Public Repos” page, helping others learn from your knowledge.',
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
