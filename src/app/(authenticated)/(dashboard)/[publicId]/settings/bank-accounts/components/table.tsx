"use client";

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
import { pushModal } from "@/components/modals";
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

function DeleteBankAccount({ id, open, setOpen }: DeleteDialogProps) {
  const router = useRouter();

  const deleteMutation = api.bankAccounts.delete.useMutation({
    onSuccess: ({message}) => {
      toast.success(message);
      router.refresh();
    },

    onError: (error) => {
      console.error("Error deleting Bank Account", error);
      toast.error("An error occurred while deleting bank account.");
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this bank account? This action cannot be
            undone and you will loose the access if this bank account is currently
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
              <TableCell>{bank.bankName}</TableCell>
              <TableCell>{bank.accountNumber}</TableCell>
              <TableCell>{bank.id ? "success" : "unsuccessful"}</TableCell>

              <TableCell>
                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <RiMore2Fill className="cursor-pointer text-muted-foreground hover:text-primary/80" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => {
                        pushModal("EditBankAccountModal", {
                          title: "Edit a bank account",
                          subtitle: "Edit a bank account to receive funds",
                          data: bank
                        });
                      }}>
                        Edit Bank Account
                      </DropdownMenuItem>

                      <Allow action="delete" subject="bank-accounts">
                        {(allow) => (
                          <DropdownMenuItem
                            disabled={!allow}
                            onSelect={() => setOpen(true)}
                          >
                            Delete Bank Account
                          </DropdownMenuItem>
                        )}
                      </Allow>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DeleteBankAccount
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
