"use client";

import { Fragment } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import Uploader from "@/components/ui/uploader";
import CreateNewSafeModal from "./new/modal";
import { RiAddFill } from "@remixicon/react";
import { DropdownButton } from "@/components/ui/dropdown-button";
import CreateExistingSafe from "./existing/modal";

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
            subtitle="Create and send a new SAFE agreement to your investors."
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
