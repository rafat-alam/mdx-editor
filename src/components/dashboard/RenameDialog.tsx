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

interface RenameDialogProps {
  isOpen: boolean;
  isRenaming: boolean;
  rename: string;
  nameRegex: RegExp;
  onOpenChange: (open: boolean) => void;
  onRenameChange: (name: string) => void;
  onConfirm: () => void;
}

export function RenameDialog({
  isOpen,
  isRenaming,
  rename,
  nameRegex,
  onOpenChange,
  onRenameChange,
  onConfirm,
}: RenameDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg">Rename</DialogTitle>
          <DialogDescription className="text-sm">
            Rename the file, folder, or repository by entering a new name and confirming the change.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Input
            type="text"
            placeholder="Enter new name"
            value={rename}
            onChange={(e) => onRenameChange(e.target.value)}
            className="pr-10 text-sm"
          />

          <div className="h-0 text-red-500 text-xs">
            {rename.length === 0 || nameRegex.test(rename)
              ? ""
              : "Error: Item name is not in valid format"}
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isRenaming}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            disabled={isRenaming || !nameRegex.test(rename)}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            {isRenaming ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                Renaming...
              </>
            ) : (
              'Rename'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
