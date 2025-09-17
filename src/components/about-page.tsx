import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  Target,
  Lightbulb,
  Code,
  Layers,
  ArrowRight,
  Mail,
  Linkedin
} from 'lucide-react';
import teamMembersData from '@/data/team_members_data.json';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authoptions';

export async function AboutPage() {
  const session = await getServerSession(authOptions);
  

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About MDX Editor</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Empowering educators and content creators with intelligent tools for structured knowledge sharing
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-lg">
                <p>
                  MDX Editor began with a simple observation: creating well-structured educational content is time-consuming and often challenging, especially when trying to maintain consistency and quality across multiple topics.
                </p>
                <p>
                  Our platform was built to address this challenge by combining the power of Retrieval Augmented Generation (RAG) technology with an intuitive interface for organizing and sharing knowledge.
                </p>
                <p>
                  What started as a tool for educators quickly evolved into a comprehensive platform that serves content creators, researchers, and knowledge workers across various domains.
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
                  To democratize knowledge creation and sharing by providing intelligent tools that make it easier to organize, generate, and distribute high-quality educational content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously explore new technologies and approaches to improve the way knowledge is created and shared.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
              <p className="text-muted-foreground">
                We believe that powerful tools for knowledge creation should be accessible to everyone, regardless of technical expertise.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-muted-foreground">
                We are committed to helping users create high-quality, accurate, and well-structured content that truly adds value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4 border shadow-sm">
                  <Code className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">React</h4>
                  <p className="text-sm text-muted-foreground">Modern UI framework</p>
                </div>
                <div className="bg-card rounded-lg p-4 border shadow-sm">
                  <Layers className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">TanStack Router</h4>
                  <p className="text-sm text-muted-foreground">Type-safe routing</p>
                </div>
                <div className="bg-card rounded-lg p-4 border shadow-sm">
                  <Code className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">Hono</h4>
                  <p className="text-sm text-muted-foreground">Backend framework</p>
                </div>
                <div className="bg-card rounded-lg p-4 border shadow-sm">
                  <Layers className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">Drizzle ORM</h4>
                  <p className="text-sm text-muted-foreground">Database access</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6">Our Technology</h2>
              <div className="space-y-4 text-lg">
                <p>
                  MDX Editor is built on a modern tech stack that combines the best of frontend and backend technologies to deliver a seamless user experience.
                </p>
                <p>
                  At the core of our platform is our proprietary RAG (Retrieval Augmented Generation) system that intelligently generates high-quality MDX content based on topics and subtopics.
                </p>
                <p>
                  While LLMs are powerful, they often lack up-to-date knowledge for all topics. Our RAG system addresses this by fetching relevant URLs, scraping the latest content, and feeding it to the LLM as context. This ensures that the generated content is both accurate and current.
                </p>
                <p>
                  We leverage the power of React and TanStack Router for our frontend, with Hono and Drizzle ORM powering our backend services. This combination allows us to deliver a fast, responsive, and reliable platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembersData.map((member, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-sm border text-center">
                {member.image_url ? (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      className="object-cover w-full h-full"
                      width={96}
                      height={96}
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary/60" />
                  </div>
                )}
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-primary mb-2">{member.role}</p>
                <p className="text-muted-foreground mb-4">
                  {member.about}
                </p>
                <div className="flex justify-center space-x-4">
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {member.github_url && (
                    <a
                      href={member.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Become part of our growing community of educators, content creators, and knowledge enthusiasts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {!session && (
              <Button asChild size="lg" className="text-base px-8">
                <a href="/signup">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            )}
            <Button asChild variant="outline" size="lg" className="text-base">
              <a href="/public-lessons">
                Explore Public Lessons
              </a>
            </Button>
          </div>

          <div className="flex justify-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            </a>
            <a href="mailto:contact@mdxeditor.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}