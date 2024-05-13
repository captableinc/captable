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
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type PasskeyModalType = {
  title: string;
  subtitle: string;
  trigger: React.ReactNode;
  passkeyId: string;
  prevPasskeyName: string;
  dialogProps: {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
  };
};

const ZUpdatePasskeyNameFormSchema = z.object({
  newPasskeyName: z.string().min(3),
});

type TUpdatePasskeyNameFormSchema = z.infer<
  typeof ZUpdatePasskeyNameFormSchema
>;

const UpdatePasskeyNameModal = ({
  title,
  subtitle,
  trigger,
  passkeyId,
  prevPasskeyName,
  dialogProps: { open, setOpen },
}: PasskeyModalType) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<TUpdatePasskeyNameFormSchema>({
    resolver: zodResolver(ZUpdatePasskeyNameFormSchema),
  });

  const { mutateAsync: updatePasskeyMutation } = api.passkey.update.useMutation(
    {
      onSuccess: () => {
        toast({
          variant: "default",
          title: "🎉 Successfully updated the passkey",
          description: " Provide description more on it.",
        });
        router.refresh();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Failed updation",
          description: "Cannot update the required passkey name",
        });
      },
      onSettled: () => {
        form.reset();
        setOpen(false);
      },
    },
  );

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async ({ newPasskeyName }: TUpdatePasskeyNameFormSchema) => {
    try {
      await updatePasskeyMutation({
        passkeyId,
        name: newPasskeyName,
      });
    } catch (err) {
      console.log({ err });
      toast({
        title: "Error",
        // @ts-expect-error error
        description:
          err?.message ??
          "Something went wrong, please reload the page and try again.",
        duration: 5000,
      });
    }
  };

  return (
    <Modal
      size="lg"
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
            name="newPasskeyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passkey name</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder={prevPasskeyName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button loading={isSubmitting} className="mt-5">
            Update Passkey
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default UpdatePasskeyNameModal;
