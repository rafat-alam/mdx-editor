import { BookOpen } from 'lucide-react';

export function StorySection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-lg">
              <p>
                MDX Editor began with a simple observation: creating well-structured documentation and educational content is time-consuming, especially when maintaining consistency across multiple repositories and files.
              </p>
              <p>
                Our platform was built to streamline this process by combining the power of Retrieval Augmented Generation (RAG) technology with an intuitive MDX editor interface for organizing knowledge repositories.
              </p>
              <p>
                What started as a tool for technical documentation quickly evolved into a comprehensive platform that serves developers, educators, content creators, and knowledge workers across various domains.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-xl opacity-50"></div>
            <div className="relative bg-card border rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <BookOpen className="h-10 w-10 text-primary mr-4" />
                <h3 className="text-2xl font-semibold">Our Mission</h3>
              </div>
              <p className="text-lg">
                To democratize knowledge creation by providing intelligent tools that make it easier to organize, generate, and manage high-quality MDX documentation within structured repository environments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
