"use client";

import { Button } from "@/components/ui/button";
import { DropdownButton } from "@/components/ui/dropdown-button";
import { api } from "@/trpc/react";
import { RiAddFill } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import CreateExistingSafe from "./existing/modal";
import CreateNewSafeModal from "./new/modal";

interface SafeActionsProps {
  companyPublicId: string;
}

const SafeActions = ({ companyPublicId }: SafeActionsProps) => {
  const router = useRouter();

  const { mutateAsync } = api.template.create.useMutation();

  return (
    <DropdownButton
      buttonSlot={
        <Fragment>
          <span className="sr-only">Manage SAFE</span>
          <RiAddFill className="mr-2 h-5 w-5" />
          Manage SAFE
        </Fragment>
      }
    >
      <ul>
        <li>
          <CreateNewSafeModal
            companyId={companyPublicId}
            trigger={
              <Button variant="ghost" size="sm">
                Create new SAFE
              </Button>
            }
          />
        </li>

        <li>
          <CreateExistingSafe
            title="Create an existing SAFE agreement"
            subtitle="Record an existing SAFE agreement to keep track of it in your captable."
            companyId={companyPublicId}
            trigger={
              <Button variant="ghost" size="sm">
                Add existing SAFE
              </Button>
            }
          />
        </li>
      </ul>
    </DropdownButton>
  );
};

export default SafeActions;
