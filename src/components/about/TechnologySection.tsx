import { Code, Layers } from 'lucide-react';

const technologies = [
  {
    icon: Code,
    name: 'Next.js',
    description: 'React framework',
  },
  {
    icon: Layers,
    name: 'NextAuth',
    description: 'Authentication',
  },
  {
    icon: Code,
    name: 'Drizzle ORM',
    description: 'Database access',
  },
  {
    icon: Layers,
    name: 'React Markdown',
    description: 'MDX rendering',
  },
];

export function TechnologySection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              {technologies.map((tech, index) => {
                const IconComponent = tech.icon;
                return (
                  <div key={index} className="bg-card rounded-lg p-4 border shadow-sm">
                    <IconComponent className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold mb-1">{tech.name}</h4>
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold mb-6">Our Technology</h2>
            <div className="space-y-4 text-lg">
              <p>
                MDX Editor is built on a modern tech stack that combines the best of Next.js, React, and database technologies to deliver a seamless repository management and editing experience.
              </p>
              <p>
                At the core of our platform is our proprietary RAG (Retrieval Augmented Generation) system that intelligently generates high-quality MDX content based on topics and subtopics within your repositories.
              </p>
              <p>
                While LLMs are powerful, they often lack up-to-date knowledge for all topics. Our RAG system addresses this by fetching relevant URLs, scraping the latest content, and feeding it to the LLM as context. This ensures that the generated MDX files are both accurate and current.
              </p>
              <p>
                We leverage Next.js for our full-stack architecture, with Drizzle ORM powering our database layer and React Markdown enabling rich MDX rendering with live preview capabilities. This combination delivers a fast, responsive, and reliable platform for managing your documentation repositories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
