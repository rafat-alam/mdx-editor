import { Lightbulb, Users, Target } from 'lucide-react';

const coreValues = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously explore new technologies and approaches to improve how documentation and knowledge are created, organized, and shared.',
  },
  {
    icon: Users,
    title: 'Accessibility',
    description: 'We believe powerful tools for content creation and repository management should be accessible to everyone, regardless of technical expertise.',
  },
  {
    icon: Target,
    title: 'Quality',
    description: 'We are committed to helping users create high-quality, accurate, and well-structured MDX content that truly adds value to their projects.',
  },
];

export function CoreValuesSection() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div key={index} className="bg-card rounded-xl p-6 shadow-sm border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
