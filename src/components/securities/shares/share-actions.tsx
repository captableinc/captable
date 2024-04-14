"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Tldr from "@/components/shared/tldr";
import { type Share } from "@prisma/client";
import { RiMore2Line } from "@remixicon/react";
import ShareModal from "./shares-modal";

type ActionCellProps = {
  share: Share;
};

const ActionCell: React.FC<ActionCellProps> = ({ share }) => {
  return (
    <>
      <DropdownMenu>
        <div className="items-end justify-end text-right">
          <DropdownMenuTrigger
            className="border-0 border-white outline-none focus:outline-none"
            asChild
          >
            <Button variant="ghost" className="h-8 w-8 p-0">
              <>
                <span className="sr-only">Open menu</span>
                <RiMore2Line aria-hidden className="h-4 w-4" />
              </>
            </Button>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <ShareModal
              title="Modify Share"
              subtitle={
                <Tldr
                  message="Manage shares by adding them. 
               Add approval dates, notes, certificateId for the stakeholders. "
                  cta={{
                    label: "Learn more",
                    href: "https://opencap.co/help/stakeholder-shares",
                  }}
                />
              }
              trigger={<span>Modify Share</span>}
              initialValues={share}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionCell;
