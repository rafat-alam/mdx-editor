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

interface Props {
  isAddRepoDialogOpen: boolean;
  setIsAddRepoDialogOpen: (open: boolean) => void;
  repoName: string;
  setRepoName: (name: string) => void;
  isAddingRepo: boolean;
  handleAddRepo: () => void;
  nameRegex: RegExp;
}

export function AddRepoDialog({
  isAddRepoDialogOpen,
  setIsAddRepoDialogOpen,
  repoName,
  setRepoName,
  isAddingRepo,
  handleAddRepo,
  nameRegex,
}: Props) {
  return (
    <Dialog open={isAddRepoDialogOpen} onOpenChange={setIsAddRepoDialogOpen}>
      <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg">Add Repo</DialogTitle>
          <DialogDescription className="text-sm">
            Create a new repo by entering a name and confirming to add it to the current location.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Input
            type="text"
            placeholder="Enter Repo name..."
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            className="text-sm"
          />
          <div className='h-0 text-red-500 text-xs'>
            {repoName.length == 0 || nameRegex.test(repoName) 
              ? ``
              : `Error : Repo name is not in format`}
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAddRepoDialogOpen(false)}
            disabled={isAddingRepo}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleAddRepo}
            disabled={isAddingRepo || !nameRegex.test(repoName)}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            {isAddingRepo ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Repo'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
