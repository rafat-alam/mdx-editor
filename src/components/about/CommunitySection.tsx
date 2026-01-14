import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';

interface CommunitySectionProps {
  isAuthenticated: boolean;
}

export function CommunitySection({ isAuthenticated }: CommunitySectionProps) {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Become part of our growing community of developers, content creators, and knowledge enthusiasts building better documentation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {!isAuthenticated && (
            <Button asChild size="lg" className="text-base px-8">
              <a href="/signup">
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          )}
          <Button asChild variant="outline" size="lg" className="text-base">
            <a href="/public-repos">Explore Public Repositories</a>
          </Button>
        </div>

        <div className="flex justify-center space-x-6">
          <a
            href="https://x.com/_rafat_17"
            target="_blank"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
          </a>
          <a
            href="https://github.com/rafat-alam/mdx-editor"
            target="_blank"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
          </a>
          <a
            href="mailto:Rafat.Alam.RA@gmail.com"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="h-6 w-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
