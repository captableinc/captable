"use client";

import Modal from "@/components/shared/modal";
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

import {
  ZodInviteMemberMutationSchema,
  type TypeZodInviteMemberMutationSchema,
} from "@/trpc/routers/stakeholder-router/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface InviteMemberModalProps {
  inviteeName: string | null | undefined;
}

export function InviteMemberModal({ inviteeName }: InviteMemberModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const inviteMember = api.stakeholder.inviteMember.useMutation({
    onSuccess: () => {
      setOpen(false);
      toast({
        variant: "default",
        title: "🎉 Invitation successfully sent!",
        description: "",
      });
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error.message,
        description: "",
      });
    },
  });
  const form = useForm<TypeZodInviteMemberMutationSchema>({
    resolver: zodResolver(ZodInviteMemberMutationSchema),
    defaultValues: {
      email: "",
      inviteeName: inviteeName ?? "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: TypeZodInviteMemberMutationSchema) {
    inviteMember.mutate(values);
  }

  return (
    <Modal
      title="Add a stakeholder"
      subtitle="Invite a stakeholder to your company."
      trigger={<Button className="w-full md:w-auto">Invite</Button>}
      dialogProps={{
        open,
        onOpenChange: setOpen,
      }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-3"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button loading={isSubmitting} loadingText="Sending invite...">
            Send an invite
          </Button>

          <p className="text-xs text-gray-500">
            We{`'`}ll send an email to your stakeholder with a link to create an
            account.
          </p>
        </form>
      </Form>
    </Modal>
  );
}
