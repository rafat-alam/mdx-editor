import { Button } from "@/components/ui/button"; // Assuming Button is a Shadcn UI component

export default function HomePage5() {
  return (
    <section className="py-16 bg-background dark:bg-gray-900 text-foreground dark:text-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">
          Ready to Create Your First Lesson Plan?
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Join Topic Marker today and start creating structured, high-quality lesson
          plans with our powerful tools.
        </p>

        <div className="flex justify-center gap-4 mt-6">
          {/* Get Started Button */}
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md">
            Get Started Free
          </Button>

          {/* Explore Public Content Button */}
          <Button
            variant="outline"
            size="lg"
            className="border-gray-600 hover:border-gray-700 text-white hover:bg-gray-700 px-6 py-3 rounded-md"
          >
            Explore Public Content
          </Button>
        </div>
      </div>
    </section>
  );
}
