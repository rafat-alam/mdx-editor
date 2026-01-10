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

interface Props {
  isSeeProfilesDialogOpen: boolean;
  setIsSeeProfilesDialogOpen: (open: boolean) => void;
  seeProfilesUsername: string;
  setSeeProfilesUsername: (username: string) => void;
  nameRegex: RegExp;
}

export function SeeProfilesDialog({
  isSeeProfilesDialogOpen,
  setIsSeeProfilesDialogOpen,
  seeProfilesUsername,
  setSeeProfilesUsername,
  nameRegex,
}: Props) {
  return (
    <Dialog open={isSeeProfilesDialogOpen} onOpenChange={setIsSeeProfilesDialogOpen}>
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
            value={seeProfilesUsername}
            onChange={(e) => setSeeProfilesUsername(e.target.value)}
            className="pr-10 text-sm"
          />
          <div className="h-0 text-red-500 text-xs">
            {seeProfilesUsername.length === 0 || nameRegex.test(seeProfilesUsername)
              ? ""
              : "Error: Username is not in valid format"}
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsSeeProfilesDialogOpen(false)}
            disabled={false}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => {
              window.open(`/u/${seeProfilesUsername}`, "_blank");
              setIsSeeProfilesDialogOpen(false);
            }}
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
