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

interface AddFolderDialogProps {
  isOpen: boolean;
  isAdding: boolean;
  folderName: string;
  nameRegex: RegExp;
  onOpenChange: (open: boolean) => void;
  onFolderNameChange: (name: string) => void;
  onConfirm: () => void;
}

export function AddFolderDialog({
  isOpen,
  isAdding,
  folderName,
  nameRegex,
  onOpenChange,
  onFolderNameChange,
  onConfirm,
}: AddFolderDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg">Add Folder</DialogTitle>
          <DialogDescription className="text-sm">
            Create a new folder by entering a name and confirming to add it to the current location.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Input
            type="text"
            placeholder="Enter Folder name..."
            value={folderName}
            onChange={(e) => onFolderNameChange(e.target.value)}
            className="text-sm"
          />
          <div className='h-0 text-red-500 text-xs'>
            {folderName.length == 0 || nameRegex.test(folderName) ? ``: `Error : Folder name is not in format`}
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
            disabled={isAdding || !nameRegex.test(folderName)}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            {isAdding ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Folder'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
