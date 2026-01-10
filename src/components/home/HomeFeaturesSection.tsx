import {
  Share2,
  Code,
  Search,
  Layers,
  FileText,
  Globe
} from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Hierarchical Repository Structure',
    description: 'Create organized repositories with folders and MDX files structured in a clear hierarchy for easy navigation.',
  },
  {
    icon: FileText,
    title: 'Rich MDX Editing',
    description: 'Create beautiful documentation with Markdown, JSX, code blocks, and more using our MDX editor with live preview.',
  },
  {
    icon: Code,
    title: 'RAG Technology',
    description: 'Leverage Retrieval Augmented Generation to create high-quality, up-to-date MDX content automatically.',
  },
  {
    icon: Search,
    title: 'Content Refinement',
    description: 'Refine your documentation with intelligent suggestions and improvements powered by AI.',
  },
  {
    icon: Share2,
    title: 'Share Your Knowledge',
    description: 'Publish your repositories to share with the community or keep them private for personal use.',
  },
  {
    icon: Globe,
    title: 'Community Learning',
    description: 'Browse and learn from repositories shared by other community members.',
  },
];

export function HomeFeaturesSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create, organize, and share your documentation effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-background rounded-xl p-6 shadow-sm border border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
