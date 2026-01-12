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

interface SeeProfilesDialogProps {
  isOpen: boolean;
  username: string;
  nameRegex: RegExp;
  onOpenChange: (open: boolean) => void;
  onUsernameChange: (username: string) => void;
  onOpen: () => void;
}

export function SeeProfilesDialog({
  isOpen,
  username,
  nameRegex,
  onOpenChange,
  onUsernameChange,
  onOpen,
}: SeeProfilesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg">See Profiles...</DialogTitle>
          <DialogDescription className="text-sm">
            Discover public profiles by entering a handle or username.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className="pr-10 text-sm"
          />
          <div className="h-0 text-red-500 text-xs">
            {username.length === 0 || nameRegex.test(username)
              ? ""
              : "Error: Username is not in valid format"}
          </div>
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
