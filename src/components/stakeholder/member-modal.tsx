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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";

import {
  ZodInviteMemberMutationSchema,
  type TypeZodInviteMemberMutationSchema,
} from "@/trpc/routers/stakeholder-router/schema";

import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
type InviteMemberMutationSchema = z.infer<typeof ZodInviteMemberMutationSchema>;
type MemberModalType = {
  title: string;
  subtitle: string;
  member: InviteMemberMutationSchema;
  children: React.ReactNode;
};

const MemberModal = ({
  title,
  subtitle,
  member,
  children,
}: MemberModalType) => {
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
      name: member.name ?? "",
      email: member.email ?? "",
      title: member.title ?? "",
      access: member.access ?? "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: TypeZodInviteMemberMutationSchema) {
    inviteMember.mutate(values);
  }

  return (
    <Modal
      title={title}
      subtitle={subtitle}
      trigger={children}
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <div className="mb-2 grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job title</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="access"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin access</SelectItem>
                      <SelectItem value="stakeholder">
                        Limited access
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
};

export default MemberModal;
