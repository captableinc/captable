"use client";

import { type MEMBERHIP_STATUS } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { RiMore2Line, RiUserSettingsLine } from "@remixicon/react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface MemberCardProps {
  userEmail: string | undefined | null;
  name?: string | undefined | null;
  email?: string | undefined | null;
  status: MEMBERHIP_STATUS;
  membershipId: string;
}

export function MemberCard({
  email,
  name,
  userEmail,
  status,
  membershipId,
}: MemberCardProps) {
  const { update } = useSession();
  const router = useRouter();
  const removeMember = api.stakeholder.removeMember.useMutation();
  const revokeInvite = api.stakeholder.revokeInvite.useMutation();

  const isCurrentUser =
    typeof userEmail === "string" &&
    typeof email === "string" &&
    userEmail === email;

  const handleDeactivateStakeholder = async () => {
    try {
      await removeMember.mutateAsync({ membershipId });
      if (status === "pending" && email) {
        await revokeInvite.mutateAsync({ email, membershipId });
      }
      if (isCurrentUser) {
        await update();
      }
      router.refresh();
    } catch (error) {}
  };

  return (
    <div className="flex w-full items-center justify-between space-x-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${
              name ?? email
            }`}
          />
          <AvatarFallback>{name ?? email}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">{name ?? email}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-x-4">
        <div>CEO</div>
        <div>2 days ago</div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="more">
                <RiUserSettingsLine className="h-5 w-5" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={handleDeactivateStakeholder}
                className="cursor-pointer"
              >
                {isCurrentUser
                  ? "Leave company"
                  : status === "accepted"
                    ? "Deactivate stakeholder"
                    : "Revoke invite"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
