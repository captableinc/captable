"use client";

import { dayjsExt } from "@/common/dayjs";
import Tldr from "@/components/common/tldr";
import { Allow } from "@/components/rbac/allow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { RiMore2Fill } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteDialogProps {
  tokenId: string;
  open: boolean;
  setOpen: (val: boolean) => void;
}

function DeleteKey({ tokenId, open, setOpen }: DeleteDialogProps) {
  const router = useRouter();

  const deleteMutation = api.accessToken.delete.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
      router.refresh();
    },

    onError: (error) => {
      console.error(error);
      toast.error("An error occurred while creating the access token.");
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this access token? This action
            cannot be undone and you will loose the access if this access token
            is currently being used.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutateAsync({ tokenId })}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type AccessTokens = RouterOutputs["accessToken"]["listAll"]["accessTokens"];

const AccessTokenTable = ({ tokens }: { tokens: AccessTokens }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
      <div className="mx-3">
        <Tldr
          message="
          For security reasons, we have no ways to retrieve your complete access token. If you lose your access key, you will need to create or rotate and replace with a new one.
        "
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Access token</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last used</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token: AccessTokens[number]) => (
            <TableRow key={token.id}>
              <TableCell className="flex cursor-pointer items-center">
                <code className="text-xs">{token.partialToken}</code>
              </TableCell>
              <TableCell suppressHydrationWarning>
                {dayjsExt().to(token.createdAt)}
              </TableCell>
              <TableCell suppressHydrationWarning>
                {token.lastUsed ? dayjsExt().to(token.lastUsed) : "Never"}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <RiMore2Fill className="cursor-pointer text-muted-foreground hover:text-primary/80" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => {}}>
                        Rotate key
                      </DropdownMenuItem>

                      <Allow action="delete" subject="developer">
                        {(allow) => (
                          <DropdownMenuItem
                            disabled={!allow}
                            onSelect={() => setOpen(true)}
                          >
                            Delete key
                          </DropdownMenuItem>
                        )}
                      </Allow>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DeleteKey
                    open={open}
                    setOpen={(val) => setOpen(val)}
                    tokenId={token.id}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default AccessTokenTable;
