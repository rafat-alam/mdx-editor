import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import type { Session } from 'next-auth';

interface HomeCtaSectionProps {
  session: Session | null;
}

export function HomeCTASection({ session }: HomeCtaSectionProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-background">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {session
            ? 'Continue Your Documentation Journey'
            : 'Ready to Create Your First Repository?'}
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {session
            ? 'Create new repositories or explore content shared by the community.'
            : 'Join MDX Editor today and start creating structured, high-quality documentation with our powerful tools.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {session ? (
            <Button asChild size="lg" className="text-base px-8">
              <a href={`/u/${session.user.username}`}>
                Create New Repository
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          ) : (
            <Button asChild size="lg" className="text-base px-8">
              <a href="/signin">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          )}
          <Button asChild variant="outline" size="lg" className="text-base">
            <a href="/public-repos">
              Browse Public Repositories
              <ChevronRight className="ml-1 h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
