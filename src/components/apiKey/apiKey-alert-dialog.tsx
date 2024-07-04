"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import React from "react";

interface ApiKeyAlertDialogProps {
  keyId: string;
}

export function ApiKeyAlertDialog({ keyId }: ApiKeyAlertDialogProps) {
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

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-zinc-100"
        asChild={true}
      >
        <div className="text-rose-600">Delete key</div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{"Are you absolutely sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {
              "Are you sure you want to delete this key? This action cannot be undone and you will loose the access if this you are currently using this API key."
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteMutation.mutate({ keyId });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
