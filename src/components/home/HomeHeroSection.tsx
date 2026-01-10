import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import type { Session } from 'next-auth';

interface HomeHeroSectionProps {
  session: Session | null;
}

export function HomeHeroSection({ session }: HomeHeroSectionProps) {
  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-background to-background/80">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                MDX Editor
              </h1>
              <p className="text-3xl font-semibold mb-6">
                Create, Organize, and Share Documentation
              </p>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl">
                The intelligent platform for managing MDX repositories with folders, files, and live preview editing—powered by advanced RAG technology.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {session ? (
                <>
                  <Button asChild size="lg" className="text-base px-8">
                    <a href={`/u/${session.user.username}`}>Go to Dashboard</a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-base">
                    <a href={`/u/${session.user.username}`}>Create Repository</a>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="text-base px-8">
                    <a href="/signup">Get Started</a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-base">
                    <a href="/signin">Sign In</a>
                  </Button>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-sm">
                <CheckCircle2 className="h-4 w-4 mr-1.5 text-primary" />
                <span>Up-to-date content</span>
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-sm">
                <CheckCircle2 className="h-4 w-4 mr-1.5 text-primary" />
                <span>AI-powered generation</span>
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-sm">
                <CheckCircle2 className="h-4 w-4 mr-1.5 text-primary" />
                <span>Community sharing</span>
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-sm">
                <CheckCircle2 className="h-4 w-4 mr-1.5 text-primary" />
                <span>Free to use</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-xl blur-xl opacity-30"></div>
            <div className="relative bg-background/90 border border-border/40 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-muted-foreground">MDX Editor</div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-muted/50 rounded w-3/4"></div>
                  <div className="h-4 bg-muted/50 rounded w-full"></div>
                  <div className="h-4 bg-muted/50 rounded w-5/6"></div>
                  <div className="h-4 bg-muted/50 rounded w-4/5"></div>
                  <div className="h-20 bg-muted/30 rounded w-full border border-border/40 p-3">
                    <div className="h-3 bg-primary/20 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-primary/20 rounded w-3/4"></div>
                  </div>
                  <div className="h-4 bg-muted/50 rounded w-5/6"></div>
                  <div className="h-4 bg-muted/50 rounded w-full"></div>
                  <div className="h-4 bg-muted/50 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
