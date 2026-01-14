import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui2/textarea"

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
}

export function QueryInput({ query, setQuery }: QueryInputProps) {
  return (
    <div className="grid gap-3">
      <Label htmlFor="query">Query</Label>
      <Textarea
        id="query"
        placeholder="Describe your query here..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
