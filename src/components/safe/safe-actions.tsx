"use client";

import { pushModal } from "@/components/modals";
import { Button } from "@/components/ui/button";
import { RiAddFill, RiSafe2Fill, RiSafeFill } from "@remixicon/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const SafeActions = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <RiAddFill className="mr-2 h-5 w-5" />
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
                pushModal("SafeModal", {
                  type: "create",
                });
              }}
            >
              <RiSafeFill className="mr-2 h-4 w-4" />
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
                pushModal("SafeModal", {
                  type: "import",
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
};
