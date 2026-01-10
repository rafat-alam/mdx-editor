'use client'
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
import { Textarea } from "../ui2/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/router"

interface AskAIProps {
  content: string
  setcontent: React.Dispatch<React.SetStateAction<string>>
  setloading: React.Dispatch<React.SetStateAction<boolean>>
  disabled: boolean
}

export function AskAIOLD({
  content,
  setcontent,
  setloading,
  disabled,
}: AskAIProps) {
  const [query, setquery] = useState("")
  const [model, setmodel] = useState<string>("gemini-2.5-flash")


  const handleSend = async (e: React.FormEvent) => {
    const router = useRouter();
    e.preventDefault()

    setloading(true)
    try {
      const res = await axios.post("/api/ai/gemini", {
        content,
        query,
        model,
      })
      setquery("")

      setcontent(res.data.message);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (!status) {
          toast.error("Network error!");
          return;
        }

        if (status === 400) toast.error(error.response?.data?.message ?? "Bad request");
        else if (status === 401) router.push("/signin");
        else if (status === 403) router.push("/");
        else if (status === 404) router.push("/404");
        else router.push("/");
      } else {
        toast.error("Unexpected error occurred!");
      }
    } finally {
      setloading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Ask AI
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSend}>
          <DialogHeader>
            <DialogTitle>Ask AI</DialogTitle>
            <DialogDescription>
              Ask AI to make changes to the document
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label>Select Model</Label>
              <Select value={model} onValueChange={setmodel}>
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

            <div className="grid gap-3">
              <Label htmlFor="query">Query</Label>
              <Textarea
                id="query"
                placeholder="Describe your query here..."
                value={query}
                onChange={(e) => setquery(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" disabled={!query.trim()}>
                Submit
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
