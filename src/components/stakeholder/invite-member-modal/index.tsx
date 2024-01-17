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
import { api } from "@/trpc/react";

import {
  ZodInviteMemberMutationSchema,
  type TypeZodInviteMemberMutationSchema,
} from "@/trpc/routers/stakeholder-router/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function InviteMemberModal() {
  const [open, setOpen] = useState(false);
  const inviteMember = api.stakeholder.inviteMember.useMutation({
    onSuccess: () => {
      setOpen(false);
    },
  });
  const form = useForm<TypeZodInviteMemberMutationSchema>({
    resolver: zodResolver(ZodInviteMemberMutationSchema),
    defaultValues: {
      email: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: TypeZodInviteMemberMutationSchema) {
    inviteMember.mutate(values);
  }

  return (
    <Modal
      title="Invite members"
      subtitle="invite a member to join your stakeholders."
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

          <Button disabled={isSubmitting}>Send Invite</Button>
        </form>
      </Form>
    </Modal>
  );
}
