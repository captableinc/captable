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
import { RiMore2Line } from "@remixicon/react";
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

  const handleRemoveMember = async () => {
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
      <div className="flex items-center gap-x-2">
        <Select defaultValue="edit">
          <SelectTrigger className="ml-auto w-[110px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="edit">Can edit</SelectItem>
            <SelectItem value="view">Can view</SelectItem>
          </SelectContent>
        </Select>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="more">
                <RiMore2Line className="h-4 w-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={handleRemoveMember}>
                {isCurrentUser
                  ? "Leave project"
                  : status === "accepted"
                    ? "Remove Member"
                    : "Revoke invite"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
