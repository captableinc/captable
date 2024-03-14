"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import Uploader from "@/components/ui/uploader";
import { RiAddFill } from "@remixicon/react";

import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SafeActionsProps {
  companyPublicId: string;
}

const SafeActions = ({ companyPublicId }: SafeActionsProps) => {
  const router = useRouter();

  const { mutateAsync } = api.template.create.useMutation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <span className="sr-only">Manage SAFE</span>
          <RiAddFill className="mr-2 h-5 w-5" />
          Manage SAFE
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <ul>
          <li>
            <Modal
              title="Create a new SAFE agreement"
              trigger={
                <Button variant="ghost" size="sm">
                  Create new SAFE
                </Button>
              }
            >
              <span>Multi-step form</span>
            </Modal>
          </li>

          <li>
            <Modal
              title="Add an existing SAFE agreement"
              trigger={
                <Button variant="ghost" size="sm">
                  Add existing SAFE
                </Button>
              }
            >
              <Uploader
                identifier={companyPublicId}
                keyPrefix="safe-agreement"
                onSuccess={async (bucketData) => {
                  const equityTemplate = await mutateAsync({
                    bucketId: bucketData.id,
                    name: bucketData.name,
                  });

                  router.push(
                    `/${companyPublicId}/templates/${equityTemplate.publicId}`,
                  );
                }}
                accept={{
                  "application/pdf": [".pdf"],
                }}
              />
            </Modal>
          </li>
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SafeActions;
