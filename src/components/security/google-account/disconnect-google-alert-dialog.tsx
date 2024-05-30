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

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DisconnectGoogleAccountAlertDialogProps {
  disabled: boolean;
}
export default function DisconnectGoogleAccountAlertDialog({
  disabled,
}: DisconnectGoogleAccountAlertDialogProps) {
  const router = useRouter();
  const { mutateAsync: disconnectGoogle } =
    api.security.disconnectGoogle.useMutation({
      onSuccess: ({ success, message }) => {
        if (success) {
          toast.success(message);
          router.refresh();
        } else {
          toast.error(message);
        }
      },
      onError: (error) => {
        console.error({ error });
        toast.error(error?.message ?? "Something went wrong");
      },
    });

  const handleDisconnectGoogle = async () => {
    await disconnectGoogle();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button disabled={disabled}>Disconnect Google</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            By continue, you will no longer be able to login via your google
            credentials further. But you can re-connect with your preferred
            email later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDisconnectGoogle}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
