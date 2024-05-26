import { RiAddFill } from "@remixicon/react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ExistingSafeModal } from "./existing-safe-modal";
import { NewSafeModal } from "./new-safe-modal";

export function SafeActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <RiAddFill className="mr-2 h-5 w-5" />
          Manage SAFE
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ExistingSafeModal
          title="Create an existing SAFE agreement"
          subtitle="Record an existing SAFE agreement to keep track of it in your captable."
          trigger={
            <DropdownMenuItem asChild>
              <Button variant="ghost" size="sm">
                Add existing SAFE
              </Button>
            </DropdownMenuItem>
          }
        />
        <NewSafeModal
          title="Create a new SAFE agreement"
          subtitle="Create, sign and send a new SAFE agreement to your investors."
          trigger={
            <DropdownMenuItem asChild>
              <Button variant="ghost" size="sm">
                Add new SAFE
              </Button>
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
