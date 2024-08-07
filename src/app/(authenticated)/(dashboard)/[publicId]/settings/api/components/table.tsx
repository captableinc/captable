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
import { RiMore2Fill } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

interface DeleteDialogProps {
  keyId: string;
  open: boolean;
  setOpen: (val: boolean) => void;
}
interface RotateKeyProps extends DeleteDialogProps {
  setShowModal: (val: boolean) => void;
  setApiKey: (key: string) => void;
  setLoading: (val: boolean) => void;
}
type KeyModalProps = Omit<DeleteDialogProps, "keyId"> & {
  apiKey: string;
};

interface ApiKey {
  keyId: string;
  createdAt: Date;
  lastUsed: Date | null;
}

function DeleteKeyAlert({ keyId, open, setOpen }: DeleteDialogProps) {
  const router = useRouter();

  const deleteMutation = api.apiKey.delete.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
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
          <AlertDialogAction
            onClick={() => deleteMutation.mutateAsync({ keyId })}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RotateKeyAlert({
  keyId,
  open,
  setOpen,
  setShowModal,
  setApiKey,
  setLoading,
}: RotateKeyProps) {
  const router = useRouter();
  const [_copied, copy] = useCopyToClipboard();

  const { mutateAsync: rotateApiKey } = api.apiKey.rotate.useMutation({
    onSuccess: ({ token, keyId }) => {
      const key = `${keyId}:${token}` as string;
      toast.success("Successfully rotated the api key.");
      copy(key);
      setApiKey(key);
      setShowModal(true);
      router.refresh();
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
    <AlertDialog open={open} onOpenChange={setOpen}>
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
              await rotateApiKey({ keyId });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CopyKeyModal({ apiKey, open, setOpen }: KeyModalProps) {
  const [_copied, copy] = useCopyToClipboard();
  return (
    <Modal
      title="API key rotated"
      subtitle={
        <Tldr
          message="
            You will not see this key again, so please make sure to copy and store it in a safe place.
          "
        />
      }
      dialogProps={{
        defaultOpen: open,
        open,
        onOpenChange: (val) => {
          setOpen(val);
        },
      }}
    >
      <Fragment>
        <span className="font-semibold">Your API Key</span>
        <Card
          className="cursor-copy break-words p-3 mt-2"
          onClick={() => {
            copy(apiKey as string);
            toast.success("API key copied to clipboard!");
          }}
        >
          <code className="text-sm font-mono text-rose-600">{apiKey}</code>
        </Card>
        <span className="text-xs text-gray-700">
          Click the API key above to copy
        </span>
      </Fragment>
    </Modal>
  );
}

const ApiKeysTable = ({ keys }: { keys: ApiKey[] }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] =
    useState<boolean>(false);
  const [openRotateAlertDialog, setOpenRotateAlertDialog] =
    useState<boolean>(false);
  const [copyApiKeyModal, showCopyApiKeyModal] = useState<boolean>(false);

  const [apiKey, setApiKey] = useState<string>("");
  const [selectedKey, setSelected] = useState<string>("");

  const handleDeleteKey = (key: string) => {
    setSelected(key);
    setOpenDeleteAlertDialog(true);
  };
  const handleRotateKey = (key: string) => {
    setSelected(key);
    setOpenRotateAlertDialog(true);
  };

  return (
    <>
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

                        <Allow action="update" subject="api-keys">
                          {(allow) => (
                            <DropdownMenuItem
                              disabled={!allow}
                              onSelect={() => handleRotateKey(key.keyId)}
                            >
                              Rotate key
                            </DropdownMenuItem>
                          )}
                        </Allow>

                        <Allow action="delete" subject="api-keys">
                          {(allow) => (
                            <DropdownMenuItem
                              disabled={!allow}
                              onSelect={() => handleDeleteKey(key.keyId)}
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
          open={openDeleteAlertDialog}
          setOpen={(val) => setOpenDeleteAlertDialog(val)}
          keyId={selectedKey}
        />
        <RotateKeyAlert
          open={openRotateAlertDialog}
          setOpen={(val: boolean) => setOpenRotateAlertDialog(val)}
          setShowModal={showCopyApiKeyModal}
          setApiKey={setApiKey}
          keyId={selectedKey}
          setLoading={setLoading}
        />
        <CopyKeyModal
          apiKey={apiKey}
          open={copyApiKeyModal}
          setOpen={showCopyApiKeyModal}
        />
      </Card>
      {loading && <Loading />}
    </>
  );
};

export default ApiKeysTable;
