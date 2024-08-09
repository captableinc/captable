"use client";

import { dayjsExt } from "@/common/dayjs";
import Loading from "@/components/common/loading";
import Modal from "@/components/common/modal";
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
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

interface DeleteDialogProps {
  accessToken: string;
  openAlert: boolean;
  setOpenAlert: (val: boolean) => void;
  setLoading: (val: boolean) => void;
}

function DeleteKeyAlert({
  accessToken,
  openAlert,
  setOpenAlert,
  setLoading,
}: DeleteDialogProps) {
  const router = useRouter();

  const { mutateAsync: deleteApiKey } = api.accessToken.delete.useMutation({
    onSuccess: ({ success, message }) => {
      if (success) {
        toast.success(message);
        router.refresh();
      }
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
    <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
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
            onClick={async () => {
              setLoading(true);
              await deleteApiKey({ tokenId: accessToken });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type TokenViewerModalProps = Omit<
  DeleteDialogProps,
  "openAlert" | "setOpenAlert" | "setLoading"
> & {
  openViewer: boolean;
  setOpenViewer: (val: boolean) => void;
};

function TokenViewerModal({
  accessToken,
  openViewer,
  setOpenViewer,
}: TokenViewerModalProps) {
  const [_copied, copy] = useCopyToClipboard();

  return (
    <Modal
      title="Access token rotated"
      subtitle={
        <Tldr
          message="
            You will not see this key again, so please make sure to copy and store it in a safe place.
          "
        />
      }
      dialogProps={{
        defaultOpen: openViewer,
        open: openViewer,
        onOpenChange: (val) => {
          setOpenViewer(val);
        },
      }}
    >
      <Fragment>
        <span className="font-semibold">Your API Key</span>
        <Card
          className="cursor-copy break-words p-3 mt-2"
          onClick={() => {
            copy(accessToken as string);
            toast.success("Access token copied to clipboard!");
          }}
        >
          <code className="text-sm font-mono text-rose-600">{accessToken}</code>
        </Card>
        <span className="text-xs text-gray-700">
          Click the access token above to copy
        </span>
      </Fragment>
    </Modal>
  );
}

interface RotateKeyProps extends DeleteDialogProps {
  setOpenViewer: (val: boolean) => void;
  setAccessToken: (key: string) => void;
}

function RotateKeyAlert({
  accessToken,
  openAlert,
  setOpenAlert,
  setOpenViewer,
  setAccessToken,
  setLoading,
}: RotateKeyProps) {
  const router = useRouter();
  const [_copied, copy] = useCopyToClipboard();

  const { mutateAsync: rotateApiKey } = api.accessToken.rotate.useMutation({
    onSuccess: ({ success, token }) => {
      if (success && token) {
        toast.promise(copy(token), {
          loading: "Rotating access token",
          success: "Successfully rotated the api key.",
          error: "Error rotating the access token",
        });
        setAccessToken(token);
        setOpenViewer(true);
        router.refresh();
      }
    },

    onError: (error) => {
      console.error(error);
      toast.error("An error occurred while creating the API key.");
    },

    onSettled: () => {
      setLoading(false);
    },
  });
  return (
    <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to rotate this key? please make sure to
            replace existing API keys if you have used it anywhere.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              setLoading(true);
              await rotateApiKey({ tokenId: accessToken });
            }}
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
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [openRotateAlert, setOpenRotateAlert] = useState<boolean>(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);
  const [showTokenViewerModal, setShowTokenViewerModal] =
    useState<boolean>(false);

  const handleDeleteKey = (key: string) => {
    setSelectedToken(key);
    setOpenDeleteAlert(true);
  };
  const handleRotateKey = (key: string) => {
    setSelectedToken(key);
    setOpenRotateAlert(true);
  };

  return (
    <>
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
                  <code className="text-xs">{`${token.clientId}:***`}</code>
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

                        <Allow action="update" subject="developer">
                          {(allow) => (
                            <DropdownMenuItem
                              disabled={!allow}
                              onSelect={() => handleRotateKey(token.id)}
                            >
                              Rotate key
                            </DropdownMenuItem>
                          )}
                        </Allow>

                        <Allow action="delete" subject="developer">
                          {(allow) => (
                            <DropdownMenuItem
                              disabled={!allow}
                              onSelect={() => handleDeleteKey(token.id)}
                            >
                              Delete key
                            </DropdownMenuItem>
                          )}
                        </Allow>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DeleteKeyAlert
          openAlert={openDeleteAlert}
          setOpenAlert={(val) => setOpenDeleteAlert(val)}
          accessToken={selectedToken}
          setLoading={setLoading}
        />
        <RotateKeyAlert
          openAlert={openRotateAlert}
          setOpenAlert={(val: boolean) => setOpenRotateAlert(val)}
          setOpenViewer={setShowTokenViewerModal}
          accessToken={selectedToken}
          setAccessToken={setAccessToken}
          setLoading={setLoading}
        />
        <TokenViewerModal
          accessToken={accessToken}
          openViewer={showTokenViewerModal}
          setOpenViewer={setShowTokenViewerModal}
        />
      </Card>
      {loading && <Loading />}
    </>
  );
};

export default AccessTokenTable;
