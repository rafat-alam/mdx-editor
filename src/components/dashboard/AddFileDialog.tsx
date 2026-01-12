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
import { Loader2 } from 'lucide-react';

interface AddFileDialogProps {
  isOpen: boolean;
  isAdding: boolean;
  fileName: string;
  nameRegex: RegExp;
  onOpenChange: (open: boolean) => void;
  onFileNameChange: (name: string) => void;
  onConfirm: () => void;
}

export function AddFileDialog({
  isOpen,
  isAdding,
  fileName,
  nameRegex,
  onOpenChange,
  onFileNameChange,
  onConfirm,
}: AddFileDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg">Add File</DialogTitle>
          <DialogDescription className="text-sm">
            Create a new file by entering a name and confirming to add it to the current location.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter file name"
              value={fileName}
              onChange={(e) => onFileNameChange(e.target.value)}
              className="pr-10 text-sm"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">
              .mdx
            </span>
          </div>

          <div className="h-0 text-red-500 text-xs">
            {fileName.length === 0 || nameRegex.test(fileName)
              ? ""
              : "Error: File name is not in valid format"}
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAdding}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            disabled={isAdding || !nameRegex.test(fileName)}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            {isAdding ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                Adding...
              </>
            ) : (
              'Add File'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
