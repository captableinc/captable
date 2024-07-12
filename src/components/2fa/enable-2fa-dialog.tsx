"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { renderSVG } from "uqr";
import { z } from "zod";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { send2FARecoveryCodesEmail } from "@/jobs/2fa-recovery-codes-email";
import { downloadFile } from "@/lib/download-file";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { SecurityList } from "../security/SecurityList";
import { OtpStyledInput } from "../ui/extension/otp-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RecoveryCodeList } from "./recovery-code-list";

export const ZEnable2FAForm = z.object({
  code: z.string(),
});

export type TEnable2FAForm = z.infer<typeof ZEnable2FAForm>;

export type EnableTwoFactorAppDialogProps = {
  onSuccess?: () => void;
};

export const EnableTwoFactorAppDialog = ({
  onSuccess,
}: EnableTwoFactorAppDialogProps) => {
  const _router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);

  const { mutateAsync: enable2FA } = api.twoFactorAuth.enable.useMutation();

  const {
    mutateAsync: setup2FA,
    data: setup2FAData,
    isLoading: isSettingUp2FA,
  } = api.twoFactorAuth.setup.useMutation({
    onError: () => {
      toast.error("Unable to setup two-factor authentication");
    },
  });

  const form = useForm<TEnable2FAForm>({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(ZEnable2FAForm),
  });

  const { isSubmitting: isEnabling2FA } = form.formState;

  const onFormSubmit = async ({ code }: TEnable2FAForm) => {
    try {
      console.log({ code });

      const { recoveryCodes } = await enable2FA({ code });

      console.log({ recoveryCodes });

      if (recoveryCodes) {
        setRecoveryCodes(recoveryCodes);
        onSuccess?.();
      }

      toast.success("Two factor authentication enabled.");

      setTimeout(() => {
        toast.success(
          "You will now be required to enter a code from your authenticator app when signing in.",
        );
      }, 2000);
    } catch (_err) {
      toast.error("Unable to setup two-factor authentication");
    }
  };

  const downloadRecoveryCodes = () => {
    if (recoveryCodes) {
      const blob = new Blob([recoveryCodes.join("\n")], {
        type: "text/plain",
      });
      downloadFile({
        filename: "documenso-2FA-recovery-codes.txt",
        data: blob,
      });
    }
  };

  const onSendRecoveryCodes = async () => {
    if (recoveryCodes) {
      await send2FARecoveryCodesEmail({
        email: "rajukadel27@gmail.com",
        recoveryCodes,
      });
    }
  };

  const handleEnable2FA = async () => {
    if (!setup2FAData) {
      await setup2FA();
    }
    setIsOpen(true);
  };

  // useEffect(() => {
  //   enable2FAForm.reset();
  //   if (!isOpen && recoveryCodes && recoveryCodes.length > 0) {
  //     setRecoveryCodes(null);
  //     router.refresh();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild={true}>
        <SecurityList
          href="/"
          title={"Two factor authentication"}
          description={"Add an extra layer of security to your account."}
          buttonDisplayName={"Enable 2FA"}
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={
            <Button
              className="flex-shrink-0"
              loading={isSettingUp2FA}
              onClick={async (e) => {
                e.preventDefault();
                console.log("Enabling 2fa");
                await handleEnable2FA();
              }}
            >
              Enable 2FA
            </Button>
          }
        />
      </DialogTrigger>

      <DialogContent>
        {setup2FAData && (
          <>
            {recoveryCodes ? (
              <div>
                <DialogHeader>
                  <DialogTitle>Backup codes</DialogTitle>
                  <DialogDescription>
                    Your recovery codes are listed below. Please store them in a
                    safe place.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                  <RecoveryCodeList recoveryCodes={recoveryCodes} />
                </div>

                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button variant="secondary">Close</Button>
                  </DialogClose>

                  <div className="flex space-between items-center">
                    <Button onClick={onSendRecoveryCodes}>
                      Backup in my email
                    </Button>
                    <Button onClick={downloadRecoveryCodes}>Download</Button>
                  </div>
                </DialogFooter>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)}>
                  <DialogHeader>
                    <DialogTitle>Enable Authenticator App</DialogTitle>
                    <DialogDescription>
                      To enable two-factor authentication, scan the following QR
                      code using your authenticator app.
                    </DialogDescription>
                  </DialogHeader>

                  <fieldset
                    disabled={isEnabling2FA}
                    className="mt-4 flex flex-col gap-y-4"
                  >
                    <div
                      className="flex h-36 justify-center"
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                      dangerouslySetInnerHTML={{
                        __html: renderSVG(setup2FAData.data?.uri ?? ""),
                      }}
                    />

                    <p className="text-muted-foreground text-sm">
                      If your authenticator app does not support QR codes, you
                      can use the following code instead:
                    </p>

                    <p className="bg-muted/60 text-muted-foreground rounded-lg p-2 text-center font-mono tracking-widest">
                      {setup2FAData?.data?.secret}
                    </p>

                    <p className="text-muted-foreground text-sm">
                      Once you have scanned the QR code or entered the code
                      manually, enter the code provided by your authenticator
                      app below.
                    </p>

                    <FormField
                      name="code"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">
                            Token
                          </FormLabel>

                          <FormControl>
                            <>
                              <FormItem>
                                <OtpStyledInput numInputs={6} {...field} />
                              </FormItem>
                              <FormMessage />
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>

                      <Button type="submit" loading={isEnabling2FA}>
                        Enable 2FA
                      </Button>
                    </DialogFooter>
                  </fieldset>
                </form>
              </Form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
