"use client";

import { Button } from "@/components/ui/button";
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
import { OtpStyledInput } from "@/components/ui/extension/otp-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SecurityList } from "../security/SecurityList";

export const Disable2FAForm = z.object({
  code: z.string(),
});

export type TDisable2FAForm = z.infer<typeof Disable2FAForm>;

export const DisableTwoFactorDialog = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync: disable2FA } = api.twoFactorAuth.disable.useMutation();

  const form = useForm<TDisable2FAForm>({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(Disable2FAForm),
  });

  const { isSubmitting: isDisable2FASubmitting } = form.formState;

  const onDisable2FAFormSubmit = async ({ code }: TDisable2FAForm) => {
    try {
      await disable2FA({ code });

      console.log({ code }, "Disabled clicked");

      toast.success("Two factor authentication disabled");

      router.refresh();
    } catch (_err) {
      toast.error("Unable to disable two factor authentication");
    }
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
          children={<Button className="flex-shrink-0">Disable 2FA</Button>}
        />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disable 2FA</DialogTitle>

          <DialogDescription>
            Please provide a token from the authenticator, or a backup code. If
            you do not have a backup code available, please contact support.
          </DialogDescription>
        </DialogHeader>

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
                  <FormItem>
                    <FormControl>
                      <>
                        <FormItem>
                          <OtpStyledInput
                            numInputs={5}
                            inputType="number"
                            {...field}
                          />
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
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                  variant="destructive"
                  loading={isDisable2FASubmitting}
                >
                  Disable 2FA
                </Button>
              </DialogFooter>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
