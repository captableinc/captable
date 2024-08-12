"use client";

import { pushModal } from "@/components/modals";
import { Button } from "@/components/ui/button";

export function AddConvertibleNotesButton() {
  return (
    <Button
      onClick={() => {
        pushModal("AddConvertibleNotes", {
          title: "Create a new convertible note",
        });
      }}
    >
      Add Convertible Note
    </Button>
  );
}
