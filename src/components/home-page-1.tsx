import React from "react";
import { Button } from "@/components/ui/button";

export function HomePage1() {
  return (
    <section className="bg-background text-foreground flex items-center px-8 md:px-16">
      <div className="container px-48 py-5 mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8">
        
        {/* Left content */}
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-bold">MDX Editor</h1>
          <p className="text-lg text-foreground">
            Create, Organize, and Share Knowledge
          </p>
          <p className="text-sm text-muted-foreground max-w-md">
            The intelligent platform for creating structured lesson plans with
            rich MDX content, powered by advanced RAG technology.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">Sign In</Button>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-accent/100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              Up-to-date content
            </span>
            <span className="bg-accent/100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              AI-powered generation
            </span>
            <span className="bg-accent/100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              Community sharing
            </span>
            <span className="bg-accent/100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              Free to use
            </span>
          </div>
        </div>

        {/* Right content - editor mockup */}
        <div className="flex-1">
          <div className="bg-popover rounded-xl shadow-xl w-full h-96 md:h-[32rem] relative overflow-hidden">
            {/* Top window controls */}
            <div className="flex space-x-2 p-3">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>

            {/* Content placeholders */}
            <div className="p-6 space-y-3">
              <div className="h-4 bg-border/20 rounded w-3/4"> fuuhughtuhg</div>
              <div className="h-4 bg-border/20 rounded w-full"></div>
              <div className="h-4 bg-border/20 rounded w-5/6"></div>
              <div className="h-16 bg-border/10 rounded p-2"></div>
              <div className="h-4 bg-border/20 rounded w-2/3"></div>
              <div className="h-4 bg-border/20 rounded w-full"></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
