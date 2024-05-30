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

import {
  type TypeZodConnectGoogleMutationSchema,
  ZodConnectGoogleMutationSchema,
} from "@/trpc/routers/security-router/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ConnectGoogleModalType = {
  title: string;
  subtitle: string;
  trigger: React.ReactNode;
  loggedInEmail: string;
};

const ConnectGoogleAccountModal = ({
  title,
  subtitle,
  trigger,
  loggedInEmail,
}: ConnectGoogleModalType) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { mutateAsync: connectGoogle } = api.security.connectGoogle.useMutation(
    {
      onSuccess: ({ message, success }) => {
        if (success) {
          toast.success(message);
          setOpen(false);
          router.refresh();
        } else {
          toast.error(message);
        }
      },
      onError: (error) => {
        console.log({ error });
        toast.error(error.message);
      },
    },
  );

  const form = useForm<TypeZodConnectGoogleMutationSchema>({
    resolver: zodResolver(ZodConnectGoogleMutationSchema),
    defaultValues: {
      email: loggedInEmail,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async ({ email }: TypeZodConnectGoogleMutationSchema) => {
    await connectGoogle({ email });
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} type="email" {...field} />
                </FormControl>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button loading={isSubmitting} className="mt-5 mx-auto">
              Proceed now
            </Button>
          </div>

          <p className="text-center mt-3 text-xs text-gray-500">
            You can now login with your google account with this setup.
          </p>
        </form>
      </Form>
    </Modal>
  );
};

export default ConnectGoogleAccountModal;
