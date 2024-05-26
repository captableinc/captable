"use client";

import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { startRegistration } from "@simplewebauthn/browser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UAParser } from "ua-parser-js";
import { z } from "zod";

type PasskeyModalType = {
  title: string;
  subtitle: string;
  trigger: React.ReactNode;
};

const ZCreatePasskeyFormSchema = z.object({
  passkeyName: z.string().min(3),
});

type TCreatePasskeyFormSchema = z.infer<typeof ZCreatePasskeyFormSchema>;

const PasskeyModal = ({ title, subtitle, trigger }: PasskeyModalType) => {
  const parser = new UAParser();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<TCreatePasskeyFormSchema>({
    resolver: zodResolver(ZCreatePasskeyFormSchema),
  });

  const { mutateAsync: createPasskeyRegistrationOptions } =
    api.passkey.createRegistrationOptions.useMutation();

  const { mutateAsync: createPasskey } = api.passkey.create.useMutation({
    onSuccess: () => {
      toast.success("🎉 Successfully created passkey");
      router.refresh();
      setOpen(false);
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const extractDefaultPasskeyName = () => {
      if (!window || !window.navigator) {
        return;
      }
      parser.setUA(window.navigator.userAgent);

      const result = parser.getResult();
      const operatingSystem = result.os.name;
      const browser = result.browser.name;

      let passkeyName = "";

      if (operatingSystem && browser) {
        passkeyName = `${browser} (${operatingSystem})`;
      }

      return passkeyName;
    };

    if (!open) {
      const defaultPasskeyName = extractDefaultPasskeyName();

      form.reset({
        passkeyName: defaultPasskeyName,
      });
    }
  }, [open, form]);

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async ({ passkeyName }: TCreatePasskeyFormSchema) => {
    try {
      const passkeyRegistrationOptions =
        await createPasskeyRegistrationOptions();

      const registrationResult = await startRegistration(
        passkeyRegistrationOptions,
      );

      await createPasskey({
        passkeyName,
        verificationResponse: registrationResult,
      });
    } catch (err) {
      console.log({ err });
      toast.error(
        "Something went wrong, please reload the page and try again.",
      );
    }
  };

  return (
    <Modal
      title={title}
      subtitle={subtitle}
      trigger={trigger}
      dialogProps={{
        open,
        onOpenChange: (val) => {
          setOpen(val);
          form.reset();
        },
      }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-3"
        >
          <FormField
            control={form.control}
            name="passkeyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passkey name</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder="eg. Mac"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Alert className="bg-teal-50">
            <AlertDescription>
              By clicking continue, you&apos;ll be prompted to add the first
              available authenticator on your system. This will enhance your
              account&apos;s security.
            </AlertDescription>

            <AlertDescription className="mt-2">
              If you prefer not to use the prompted authenticator, you can
              simply close it. This will then display the next available option
              for you to choose from.
            </AlertDescription>
          </Alert>

          <Button loading={isSubmitting} className="mt-5">
            Create Passkey
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default PasskeyModal;
