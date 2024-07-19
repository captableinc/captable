"use client";

import { pushModal } from "@/components/modals";
import { LinearCombobox } from "@/components/ui/combobox";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";

import {
  RiLoader5Line as LoadingIcon,
  RiAddLine,
  RiRefreshLine,
} from "@remixicon/react";

type MemberSelectorType = {
  onSelect: (memberId: string) => void;
};

export function MemberSelector({ onSelect }: MemberSelectorType) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    [],
  );

  const {
    data: members,
    isLoading,
    refetch,
  } = api.member.getMembers.useQuery();

  const { data: roles, isLoading: loadingRoles } =
    api.rbac.listRoles.useQuery();

  useEffect(() => {
    if (members) {
      setOptions(
        members.data.map((member) => ({
          value: member.id,
          label: (member.user.name || member.user.email) as string,
        })),
      );
    }
  }, [members]);

  return (
    <LinearCombobox
      placeholder="Select or add a bank account"
      options={options}
      onValueChange={(option) => {
        onSelect(option.value);
      }}
    >
      <div>
        {!isLoading && (
          <button
            type="button"
            className="cursor-pointer w-full text-left hover:underline"
            disabled={isLoading}
            onClick={() => {
              refetch();
            }}
          >
            <div className="flex items-center my-1 gap-x-2">
              <span>
                {isLoading || loadingRoles ? (
                  <LoadingIcon className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <RiRefreshLine className="h-4 w-4" aria-hidden />
                )}
              </span>
              <div>
                {isLoading || loadingRoles
                  ? "Loading members"
                  : "Reload members"}
              </div>
            </div>
          </button>
        )}

        <button
          type="button"
          className="cursor-pointer w-full text-left hover:underline"
          disabled={isLoading}
          onClick={() => {
            pushModal("TeamMemberModal", {
              title: "Invite a team member",
              subtitle: "Invite a team member to your company.",
              member: {
                name: "",
                loginEmail: "",
                title: "",
                workEmail: "",
                roleId: "",
              },
              roles: roles?.rolesList || [],
            });
          }}
        >
          <div className="flex items-center my-1 gap-x-2">
            <span>
              {isLoading || loadingRoles ? (
                <LoadingIcon className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <RiAddLine className="h-4 w-4" aria-hidden />
              )}
            </span>
            <div>
              {isLoading || loadingRoles
                ? "Loading members"
                : "Add a team member"}
            </div>
          </div>
        </button>
      </div>
    </LinearCombobox>
  );
}
