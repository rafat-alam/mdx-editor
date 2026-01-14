import { Input } from '@/components/ui2/input';
import { Button } from '@/components/ui2/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui2/dialog";

interface MDXEditorDialogProps {
  isOpen: boolean;
  mdxPath: string;
  onOpenChange: (open: boolean) => void;
  onPathChange: (path: string) => void;
  onOpen: () => void;
}

export function MDXEditorDialog({
  isOpen,
  mdxPath,
  onOpenChange,
  onPathChange,
  onOpen,
}: MDXEditorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg">MDX Editor</DialogTitle>
          <DialogDescription className="text-sm">
            Enter a file path to open, edit, and enhance your MDX document using the AI-powered MDX Editor.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Input
            type="text"
            placeholder="e.g. rafat/repo/file.mdx"
            value={mdxPath}
            onChange={(e) => onPathChange(e.target.value)}
            className="text-sm"
          />
        </div>
        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={false}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onOpen}
            disabled={false}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            Open
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
