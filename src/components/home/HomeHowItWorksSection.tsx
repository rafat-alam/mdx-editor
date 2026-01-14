const steps = [
  {
    number: 1,
    title: 'Create a Topic Hierarchy',
    description: 'Search for a main topic and build a structured hierarchy of subtopics for your repository.',
    animated: true,
  },
  {
    number: 2,
    title: 'Generate MDX Content',
    description: 'Use our RAG technology to automatically generate rich MDX content for each topic.',
    animated: false,
  },
  {
    number: 3,
    title: 'Save and Share',
    description: 'Save your repository and optionally publish it for others to learn from.',
    animated: false,
  },
];

export function HomeHowItWorksSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create comprehensive documentation repositories in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
                <span className="text-2xl font-bold text-primary">{step.number}</span>
                {step.animated && (
                  <div className="absolute h-full w-full rounded-full border-2 border-primary/20 animate-ping opacity-20"></div>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
