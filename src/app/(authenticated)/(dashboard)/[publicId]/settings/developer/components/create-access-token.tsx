"use client";

import Modal from "@/components/common/modal";
import Tldr from "@/components/common/tldr";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { RiAddLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

const CreateAccessToken = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [_copied, copy] = useCopyToClipboard();

  const createMutation = api.accessToken.create.useMutation({
    onSuccess: ({ token }) => {
      setAccessToken(token);

      toast.promise(copy(token), {
        loading: "Copying token...",
        success: "Access token copied to clipboard.",
        error: "Error copying token",
      });
      setOpen(true);
      setLoading(false);
    },

    onError: (error) => {
      console.error(error);
      toast.error("An error occurred while creating the access token.");
    },

    onSettled: () => {
      setLoading(false);
    },
  });

  return (
    <Fragment>
      <Button
        onClick={async () => {
          setLoading(true);
          await createMutation.mutateAsync({
            typeEnum: "api",
          });
        }}
        loading={loading}
      >
        <RiAddLine className="inline-block h-5 w-5" />
        Create an access token
      </Button>

      <Modal
        size="lg"
        title="Access token created"
        subtitle={
          <Tldr
            message="
            You will not see this complete access token again, so please make sure to copy and store it in a safe place.
          "
          />
        }
        dialogProps={{
          open,
          onOpenChange: (val) => {
            setOpen(val);
            if (!val) {
              router.refresh();
            }
          },
        }}
      >
        <Fragment>
          <span className="font-semibold">Your access token</span>
          <Card
            className="cursor-copy break-words p-3 mt-2"
            onClick={() => {
              toast.promise(copy(accessToken), {
                loading: "Copying token...",
                success: "Access token copied to clipboard.",
                error: "Error copying token",
              });
            }}
          >
            <code className="text-sm font-mono text-rose-600">
              {accessToken}
            </code>
          </Card>
          <span className="text-xs text-gray-700">
            Click the access token above to copy
          </span>
        </Fragment>
      </Modal>
    </Fragment>
  );
};

export default CreateAccessToken;
