import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, FileText, Upload, Share2 } from "lucide-react"; // You can use other icons as needed

export default function HomePage3() {
  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="mt-2 text-gray-400">
          Create comprehensive lesson plans in just a few simple steps
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Step 1 */}
        <Card className="bg-gray-800 border border-gray-700 hover:shadow-2xl transition">
          <CardContent className="flex flex-col gap-4 text-center">
            <div className="bg-gray-700 p-4 rounded-full inline-block">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Create a Topic Hierarchy</h3>
            <p className="text-gray-400">
              Search for a main topic and build a structured hierarchy of subtopics.
            </p>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="bg-gray-800 border border-gray-700 hover:shadow-2xl transition">
          <CardContent className="flex flex-col gap-4 text-center">
            <div className="bg-gray-700 p-4 rounded-full inline-block">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Generate MDX Content</h3>
            <p className="text-gray-400">
              Use our RAG technology to automatically generate rich content for each topic.
            </p>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="bg-gray-800 border border-gray-700 hover:shadow-2xl transition">
          <CardContent className="flex flex-col gap-4 text-center">
            <div className="bg-gray-700 p-4 rounded-full inline-block">
              <Share2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Save and Share</h3>
            <p className="text-gray-400">
              Save your lesson plan and optionally publish it for others to learn from.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
