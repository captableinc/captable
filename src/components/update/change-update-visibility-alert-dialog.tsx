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
import { env } from "@/env";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import type React from "react";
import { type SetStateAction, useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

type ChangeUpdateVisibilityProps = {
  updateId: string;
  updatePublicId: string;
  isPublic: boolean;
  trigger: React.ReactNode;
  dialogProps: {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
  };
};

export function ChangeUpdateVisibilityAlertDialog({
  updateId,
  updatePublicId,
  isPublic,
  trigger,
  dialogProps: { open, setOpen },
}: ChangeUpdateVisibilityProps) {
  const NEXT_PUBLIC_BASE_URL = env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const [_copiedText, copy] = useCopyToClipboard();
  const [_copiedId, setCopiedId] = useState<string | null>(null);

  const { mutateAsync: toggleUpdateVisibilityMutation } =
    api.update.toggleVisibility.useMutation({
      onSuccess: ({ success, message }) => {
        if (success) {
          if (message === "PUBLIC") {
            copyToClipboard(
              "",
              `${NEXT_PUBLIC_BASE_URL}/updates/${updatePublicId}`,
            );
            toast.success(
              "Update is now public, link has been copied to your clipboard",
            );
          }
          if (message === "PRIVATE") {
            toast.success(
              "Update is now private, public users cannot view it.",
            );
          }
          router.refresh();
        }
      },
    });

  const toggleStatus = async () => {
    try {
      await toggleUpdateVisibilityMutation({ updateId });
      setOpen(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    copy(text)
      .then(() => {
        setCopiedId(id);

        setTimeout(() => {
          setCopiedId(null);
        }, 1000);
      })
      .catch(() => {
        setCopiedId(null);
      });
  };

  return (
    <AlertDialog open={open} defaultOpen={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isPublic
              ? "Are you sure you want to make this update private?"
              : "Are you sure you want to publicly share this update?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isPublic
              ? "Making it private prevents public users from accessing it."
              : "Publicly sharing this update allows public users to view it, it may also be indexed by search engines."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={toggleStatus}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
