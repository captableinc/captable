"use client";
import Tldr from "@/components/common/tldr";
import { pushModal } from "@/components/modals";
import MultipleStakeholdersModal from "@/components/stakeholder/multiple-stakeholders-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiAddFill, RiGroupLine, RiUserLine } from "@remixicon/react";

export default function StakeholderDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>
          <RiAddFill className="mr-2 h-5 w-5" />
          Add stakeholders
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          asChild
          onClick={() => {
            pushModal("SingleStakeholdersModal", {
              title: "Add Stakeholder",
              subtitle: (
                <Tldr
                  message="Manage stakeholders by adding them. 
          Categorize, assign roles, and maintain contact info for investors, partners, and clients."
                  cta={{
                    label: "Learn more",
                    href: "https://captable.inc/help",
                  }}
                />
              ),
            });
          }}
        >
          <div className="flex cursor-default items-center rounded-sm py-1.5 pr-2 text-sm">
            <RiUserLine className="mr-2 h-5 w-5" />
            Create one stakeholder
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <MultipleStakeholdersModal
            title="Add or Import Stakeholders"
            subtitle={
              <Tldr
                message="Manage stakeholders by adding or importing them. 
          Categorize, assign roles, and maintain contact info for investors, partners, and clients."
                cta={{
                  label: "Learn more",
                  // TODO - this link should be updated to the correct URL
                  href: "https://captable.inc/help",
                }}
              />
            }
            trigger={
              <div className="flex cursor-default items-center rounded-sm py-1.5 pr-2 text-sm">
                <RiGroupLine className="mr-2 h-5 w-5" />
                Import multiple stakeholders
              </div>
            }
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
