import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui2/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "./ui2/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { useState } from "react"
import axios, { AxiosError } from "axios"

interface AskAIProps {
  content: string;
  setcontent: React.Dispatch<React.SetStateAction<string>>;
  setloading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AskAI({ content, setcontent, setloading } : AskAIProps) {
  const [query, setquery] = useState("");

  const handleSend = async () => {
    setloading(true);
    try {
      const res = await axios.post('/api/ai/', {
        content,
        query
      });
      setquery("");
      setcontent(res.data.response);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error.response?.data?.message || 'Query not sended');
    }
    setloading(false);
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Ask AI</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ask AI</DialogTitle>
            <DialogDescription>
              Ask AI to make changes on document
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="model">Select Model</Label>
              <div id="model">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>LLMs</SelectLabel>
                      <SelectItem value="Gemini">Gemini</SelectItem>
                      <SelectItem value="o4" disabled>o4</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="query">Query</Label>
              <Textarea
                id="query"
                name="query"
                placeholder="Describe your query here..."
                value={query}
                onChange={e => setquery(e.target.value)
              }/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={handleSend}>Submit</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
