import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AddConvertibleNotesModal } from "./add-convertible-notes-modal";

export function AddConvertibleNotesButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Convertible Note</Button>
      </DialogTrigger>
      <AddConvertibleNotesModal title="Create a new convertible note" />
    </Dialog>
  );
}
