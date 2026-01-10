import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ModelSelectorProps {
  model: string;
  setModel: (model: string) => void;
}

export function ModelSelector({ model, setModel }: ModelSelectorProps) {
  return (
    <div className="grid gap-3">
      <Label>Select Model</Label>
      <Select value={model} onValueChange={setModel}>
        <SelectTrigger>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Gemini Models</SelectLabel>
            <SelectItem value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite</SelectItem>
            <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
            <SelectItem value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</SelectItem>
            <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
            <SelectItem value="gemini-3-flash-preview">Gemini 3 Flash (Preview)</SelectItem>
            <SelectLabel>OpenAI Models</SelectLabel>
            <SelectItem value="gpt5.2" disabled>ChatGPT 5.2</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
