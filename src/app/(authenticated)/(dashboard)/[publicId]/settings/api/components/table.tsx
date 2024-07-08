"use client";

import { dayjsExt } from "@/common/dayjs";
import Tldr from "@/components/common/tldr";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { RiMore2Fill } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/common/confirmDialog";
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

interface ApiKey {
  keyId: string;
  createdAt: Date;
  lastUsed: Date | null;
}

const ApiKeysTable = ({ keys }: { keys: ApiKey[] }) => {
  const router = useRouter();

  const deleteMutation = api.apiKey.delete.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
    },

    onError: (error) => {
      console.error(error);
      toast.error("An error occurred while creating the API key.");
    },

    onSettled: () => {
      router.refresh();
    },
  });

  const dialogTitle = "Are you sure?";
  const dialogBody =
    "Are you sure you want to delete this key? This action cannot be undone and you will loose the access if this API key is currently being used.";
  const dialogTrigger = <div className="text-rose-600">Delete key</div>;

  return (
    <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
      <div className="mx-3">
        <Tldr
          message="
          For security reasons, we have no ways to retrieve your complete API keys. If you lose your API key, you will need to create or rotate and replace with a new one.
        "
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last used</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((key) => (
            <TableRow key={key.keyId}>
              <TableCell className="flex cursor-pointer items-center">
                <code className="text-xs">
                  {`${key.keyId.slice(0, 3)}...${key.keyId.slice(-3)}:****`}
                </code>
              </TableCell>
              <TableCell suppressHydrationWarning>
                {dayjsExt().to(key.createdAt)}
              </TableCell>
              <TableCell suppressHydrationWarning>
                {key.lastUsed ? dayjsExt().to(key.lastUsed) : "Never"}
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

                      <ConfirmDialog
                        key={key.keyId}
                        title={dialogTitle}
                        body={dialogBody}
                        trigger={dialogTrigger}
                        onConfirm={() => {
                          deleteMutation.mutate({ keyId: key.keyId });
                        }}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ApiKeysTable;
