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
import { useRouter } from "next/navigation"
import { ModelSelector } from "./ModelSelector"
import { QueryInput } from "./QueryInput"
import { Input } from "../ui2/input"

interface AskAIProps {
  content: string
  setcontent: React.Dispatch<React.SetStateAction<string>>
  setloading: React.Dispatch<React.SetStateAction<boolean>>
  disabled: boolean
  selectedText: string
  path: string []
}

export function AskAIRAG({
  content,
  setcontent,
  setloading,
  disabled,
  selectedText,
  path,
}: AskAIProps) {
  const router = useRouter();
  const [query, setQuery] = useState("")
  const [model, setModel] = useState<string>("gemini-2.5-flash")
  const MAX_LINKS = 5
  const [links, setLinks] = useState<string[]>([''])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()

    setloading(true)
    try {
      if(model == 'rag-repo') {
        const res = await axios.post("/api/rag/repo", {
          username: path[0],
          repo: path[1],
          query,
        })
        setQuery("")
        setLinks([''])
        
        setcontent(res.data.message);

      } else if(model == 'rag-web') {
        const res = await axios.post("/api/rag/web", {
          query,
        })
        setQuery("")
        setLinks([''])
        
        setcontent(res.data.message);

      } else if(model == 'rag-url') {
      console.log(path);
        const res = await axios.post("/api/rag/url", {
          url: links.filter(Boolean),
          query,
        })
        setQuery("")
        setLinks([''])
        
        setcontent(res.data.message);

      } else if(model == 'gpt-5.2') {
        const res = await axios.post("/api/ai/gpt", {
          content: selectedText && selectedText.trim() !== '' ? selectedText : content,
          query,
          model,
        })
        setQuery("")
        setLinks([''])
        
        setcontent(res.data.message);
      } else {
        const res = await axios.post("/api/ai/gemini", {
          content: selectedText && selectedText.trim() !== '' ? selectedText : content,
          query,
          model,
        })
        setQuery("")
        setLinks([''])

        setcontent(res.data.message);
      }
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

  const normalizeLinks = (values: string[]) => {
    const filled = values.filter((v) => v.trim() !== '')

    const limited = filled.slice(0, MAX_LINKS)

    if (limited.length < MAX_LINKS) {
      limited.push('')
    }

    return limited
  }

  const truncateMiddle = (text: string, limit = 25) => {
    if (text.length <= limit * 2) return text

    const start = text.slice(0, limit)
    const end = text.slice(-limit)

    return `${start}...${end}`
  }

  const handleChange = (index: number, value: string) => {
    setLinks((prev) => {
      const updated = [...prev]
      updated[index] = value
      return normalizeLinks(updated)
    })
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Ask AI / RAG
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSend}>
          <DialogHeader>
            <DialogTitle>Ask AI / RAG</DialogTitle>
            <DialogDescription>
              1. Select text otherwise whole document is considered
              <br />
              2. ASK AI / RAG to make changes on document
              {selectedText.trim() !== '' && 
              <span>
                <br/> <br />
                Selected Text : {truncateMiddle(selectedText.trim())}
              </span>}
              {selectedText.trim() == '' && !model.startsWith('rag') && 
              <span className="text-red-500">
                <br/> <br />
                No text Selected, whole document considered.
              </span>}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <ModelSelector model={model} setModel={setModel} />
            {(model === "rag-url") &&
              links.map((link, index) => (
                <Input
                  key={index}
                  placeholder={
                    index === links.length - 1
                      ? 'Paste link'
                      : `Link ${index + 1}`
                  }
                  value={link}
                  onChange={(e) => handleChange(index, e.target.value)}
                  disabled={index >= MAX_LINKS}
                />
              ))}
            <QueryInput query={query} setQuery={setQuery} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" disabled={!query.trim() || (model == 'rag-url' && links.length == 1)}>
                Submit
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
