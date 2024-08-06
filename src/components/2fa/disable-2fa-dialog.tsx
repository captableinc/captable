"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SecurityList } from "../security/SecurityList";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RiRotateLockFill } from "@remixicon/react";
import { CaptableLogo } from "../common/logo";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "../ui/input";

export const Disable2FAForm = z.object({
  code: z.string().min(6),
});

export type TDisable2FAForm = z.infer<typeof Disable2FAForm>;

export const DisableTwoFactorDialog = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [twoFAMethod, setTwoFAMethod] = useState<"totp" | "recovery">("totp");

  const { mutateAsync: disable2FA } = api.twoFactorAuth.disable.useMutation({
    onError: () => {
      toast.error("Unable to disable two factor authentication");
    },
  });

  const form = useForm<TDisable2FAForm>({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(Disable2FAForm),
  });

  const { isSubmitting: isDisable2FASubmitting } = form.formState;

  const onDisable2FAFormSubmit = async ({ code }: TDisable2FAForm) => {
    const { success, message } = await disable2FA({ code });
    console.log({ success, message });
    if (success) {
      toast.success(message);
      router.refresh();
    } else {
      toast.error(message);
    }
  };

  const handleDisable2FA = () => {
    setIsOpen(true);
  };

  const onToggle2FAMethod = () => {
    const newMethod = twoFAMethod === "recovery" ? "totp" : "recovery";
    form.setValue("code", "");
    setTwoFAMethod(newMethod);
  };

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
              onClick={(e) => {
                e.preventDefault();
                handleDisable2FA();
              }}
              className="flex-shrink-0"
            >
              Disable 2FA
            </Button>
          }
        />
      </DialogTrigger>

      <DialogContent>
        <header className="border-b border-gray-200 py-5 px-5">
          <DialogHeader>
            <div className="flex justify-center">
              <CaptableLogo className="mb-3 h-8 w-8 rounded" />
            </div>
            <DialogTitle className="mb-4 text-center">Disable 2FA</DialogTitle>
            <DialogDescription className="text-center mx-auto">
              {twoFAMethod === "totp"
                ? "Please provide a token from the authenticator app."
                : "Please provide one of your recovery code."}
            </DialogDescription>
          </DialogHeader>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onDisable2FAFormSubmit)}>
            <fieldset
              className="flex flex-col gap-y-4"
              disabled={isDisable2FASubmitting}
            >
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormControl>
                    <FormItem className="flex justify-center items-center w-full">
                      <>
                        {twoFAMethod === "totp" ? (
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
                        ) : (
                          <>
                            <Input
                              placeholder="xxx-xxx"
                              type="text"
                              autoFocus
                              required
                              disabled={form.formState.isSubmitting}
                              {...field}
                            />
                            <FormMessage className="text-xs font-light" />
                          </>
                        )}
                        <FormMessage />
                      </>
                      <FormMessage />
                    </FormItem>
                  </FormControl>
                )}
              />

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onToggle2FAMethod}
                >
                  <RiRotateLockFill />
                  {twoFAMethod === "totp"
                    ? "Use Backup Code"
                    : "Use Authenticator"}
                </Button>

                <Button
                  variant="destructive"
                  type="submit"
                  loading={isDisable2FASubmitting}
                >
                  {isDisable2FASubmitting ? "Disabling..." : "Disable 2FA"}
                </Button>
              </DialogFooter>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
