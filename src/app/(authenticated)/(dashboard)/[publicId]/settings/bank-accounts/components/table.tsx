"use client";

import type { BankAccount } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiMore2Fill } from "@remixicon/react";
import { Card } from "@/components/ui/card";
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

import { Allow } from "@/components/rbac/allow";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface BankAccountType {
  id: string;
  bankName: string;
  accountNumber: string;
}

interface DeleteDialogProps {
  id: string;
  open: boolean;
  setOpen: (val: boolean) => void;
}

function DeleteKey({ id, open, setOpen }: DeleteDialogProps) {
  const router = useRouter();

  const deleteMutation = api.bankAccounts.delete.useMutation({
    onSuccess: (message) => {
      toast.success(message?.message);
      router.refresh();
    },

    onError: (error) => {
      console.error(error);
      toast.error("An error occurred while creating the API key.");
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this key? This action cannot be
            undone and you will loose the access if this API key is currently
            being used.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteMutation.mutateAsync({ id })}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const BankAccountsTable = ({
  bankAccounts,
}: {
  bankAccounts: BankAccountType[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bank Name</TableHead>
            <TableHead>Account Number</TableHead>
            <TableHead> </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bankAccounts.map((bank) => (
            <TableRow key={bank.id}>
              <TableCell>{bank.accountNumber}</TableCell>
              <TableCell>{bank.accountNumber}</TableCell>
              <TableCell>success</TableCell>

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

                      <Allow action="delete" subject="api-keys">
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
                    id={bank.id}
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

export default BankAccountsTable;
