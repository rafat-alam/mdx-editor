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
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/router"
import { ModelSelector } from "./ModelSelector"
import { QueryInput } from "./QueryInput"

interface AskAIProps {
  content: string
  setcontent: React.Dispatch<React.SetStateAction<string>>
  setloading: React.Dispatch<React.SetStateAction<boolean>>
  disabled: boolean
}

export function AskAI({
  content,
  setcontent,
  setloading,
  disabled,
}: AskAIProps) {
  const [query, setQuery] = useState("")
  const [model, setModel] = useState<string>("gemini-2.5-flash")

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
      setQuery("")

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
            <ModelSelector model={model} setModel={setModel} />
            <QueryInput query={query} setQuery={setQuery} />
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
