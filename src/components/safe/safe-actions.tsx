import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { pushModal } from "../modals";

export function SafeActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Icon name="add-fill" className="mr-2 h-5 w-5" />
          Manage SAFE
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col text-start">
        <ul>
          <li>
            <Button
              variant="link"
              className="hover:no-underline hover:text-gray-700"
              size="sm"
              type="submit"
              onClick={() => {
                pushModal("NewSafeModal", {
                  title: "Create a new SAFE agreement",
                  subtitle:
                    "Create, sign and send a new SAFE agreement to your investors.",
                });
              }}
            >
              <Icon name="safe-fill" className="mr-2 h-4 w-4" />
              Create a new SAFE
            </Button>
          </li>
          <li>
            <Button
              variant="link"
              className="hover:no-underline hover:text-gray-900"
              size="sm"
              type="submit"
              onClick={() => {
                pushModal("ExistingSafeModal", {
                  title: "Create an existing SAFE agreement",
                  subtitle:
                    "Record an existing SAFE agreement to keep track of it in your captable.",
                });
              }}
            >
              <RiSafe2Fill className="mr-2 h-4 w-4" />
              Import existing SAFE
            </Button>
          </li>
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
