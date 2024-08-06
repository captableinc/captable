"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type React from "react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { downloadFile } from "@/lib/download-file";
import { api } from "@/trpc/react";
import { RiDownload2Line, RiMailLine } from "@remixicon/react";
import { toast } from "sonner";
import { CaptableLogo } from "../common/logo";
import { SecurityList } from "../security/SecurityList";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { RecoveryCodeList } from "./recovery-code-list";

export const ZEnable2FAForm = z.object({
  code: z.string().min(6),
});

export type TEnable2FAForm = z.infer<typeof ZEnable2FAForm>;

export type EnableTwoFactorAppDialogProps = {
  onSuccess?: () => void;
};

export const EnableTwoFactorAppDialog = ({
  onSuccess,
}: EnableTwoFactorAppDialogProps) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [hasEmailSent, setHasEmailSent] = useState<boolean>(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);

  const { mutateAsync: enable2FA } = api.twoFactorAuth.enable.useMutation();
  const { mutateAsync: sendRecoveryCodes } =
    api.twoFactorAuth.sendRecoveryCodes.useMutation({
      onError: () => {
        toast.error("Unable to send 2FA recovery codes.");
      },
    });

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
    const { data: recoveryCodes, message, success } = await enable2FA({ code });
    if (success) {
      toast.success(message);
      setRecoveryCodes(recoveryCodes);
      onSuccess?.();
      setTimeout(() => {
        toast.success(
          "You will now be required to enter a code from your authenticator app when signing in.",
        );
      }, 3000);
    } else {
      toast.error(message);
    }
  };

  const downloadRecoveryCodes = () => {
    if (recoveryCodes) {
      const blob = new Blob([recoveryCodes.join("\n")], {
        type: "text/plain",
      });
      downloadFile({
        filename: "recovery_codes_2fa.txt",
        data: blob,
      });
    }
  };

  const onSendRecoveryCodes = async () => {
    try {
      if (recoveryCodes) {
        const { success, message } = await sendRecoveryCodes({ recoveryCodes });
        if (success) {
          toast.success(message);
          setHasEmailSent(success);
        } else {
          toast.error(message);
        }
      }
    } catch (error) {
      toast.error(
        //@ts-ignore
        error?.message ?? "Something went out. Please try again later.",
      );
    }
  };

  const handleEnable2FA = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!setup2FAData) {
      const { success, message } = await setup2FA();
      if (success) {
        setIsOpen(true);
      } else {
        toast.error(message);
      }
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    form.reset();
    if (!isOpen && recoveryCodes && recoveryCodes.length > 0) {
      setRecoveryCodes(null);
      setIsOpen(false);
      router.refresh();
    }
  }, [isOpen]);

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
              onClick={handleEnable2FA}
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
              <>
                <header className="border-b border-gray-200 py-2 px-5">
                  <DialogHeader>
                    <div className="flex justify-center">
                      <CaptableLogo className="mb-3 h-8 w-8 rounded" />
                    </div>
                    <DialogTitle className="mb-4 text-center">
                      Recovery codes
                    </DialogTitle>
                    <DialogDescription className="text-center">
                      Your recovery codes are listed below. Please store them in
                      a safe place.
                    </DialogDescription>
                  </DialogHeader>
                </header>
                <div className="mt-4">
                  <RecoveryCodeList recoveryCodes={recoveryCodes} />
                </div>
                <DialogFooter className="mt-4 w-full">
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <Button
                        disabled={hasEmailSent}
                        variant="outline"
                        onClick={onSendRecoveryCodes}
                      >
                        <RiMailLine />
                        Send to my email
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="secondary"
                        onClick={downloadRecoveryCodes}
                      >
                        <RiDownload2Line />
                        Download
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              </>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)}>
                  <header className="border-b border-gray-200 py-2 px-5">
                    <DialogHeader>
                      <div className="flex justify-center">
                        <CaptableLogo className="mb-3 h-8 w-8 rounded" />
                      </div>
                      <DialogTitle className="mb-1 text-center">
                        Enable Authenticator App
                      </DialogTitle>
                    </DialogHeader>
                  </header>

                  <fieldset
                    disabled={isEnabling2FA}
                    className="mt-4 flex flex-col gap-y-4"
                  >
                    <p className="text-muted-foreground text-sm">
                      You can use this code instead if QR code is not supported
                      in your authenticator app.
                    </p>

                    <p className="bg-muted/60 text-muted-foreground rounded-lg p-2 text-center font-mono tracking-widest">
                      {setup2FAData?.data?.secret}
                    </p>

                    <DialogHeader>
                      <DialogDescription>
                        To enable two-factor authentication, scan the following
                        QR code using your authenticator app.
                      </DialogDescription>
                    </DialogHeader>

                    <div
                      className="flex h-36 mt-5 justify-center"
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                      dangerouslySetInnerHTML={{
                        __html: renderSVG(setup2FAData.data?.uri ?? ""),
                      }}
                    />

                    <p className="text-muted-foreground text-sm">
                      Please provide the OTP code from your authenticator app.
                    </p>

                    <FormField
                      name="code"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <>
                              <FormItem>
                                <InputOTP maxLength={6} {...field}>
                                  <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                  </InputOTPGroup>
                                </InputOTP>
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

                      <Button
                        type="submit"
                        disabled={isEnabling2FA}
                        loading={isEnabling2FA}
                      >
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
