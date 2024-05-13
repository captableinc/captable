"use client";

import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";

import {
  type TypeZodInviteMemberMutationSchema,
  ZodInviteMemberMutationSchema,
} from "@/trpc/routers/member-router/schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type MemberModalType = {
  title: string;
  subtitle: string;
  member: TypeZodInviteMemberMutationSchema;
  children: React.ReactNode;
} & editModeType;

type editModeType =
  | { isEditMode: true; memberId: string }
  | { isEditMode?: false; memberId?: never };

const MemberModal = ({
  title,
  subtitle,
  member,
  children,
  ...rest
}: MemberModalType) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const inviteMember = api.member.inviteMember.useMutation({
    onSuccess: () => {
      setOpen(false);
      toast({
        variant: "default",
        title: "🎉 Invited!",
        description: "You have successfully invited the stakeholder.",
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

  const updateMember = api.member.updateMember.useMutation({
    onSuccess: () => {
      setOpen(false);
      toast({
        variant: "default",
        title: "🎉 Updated!",
        description: "You have successfully updated the stakeholder.",
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
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: TypeZodInviteMemberMutationSchema) => {
    try {
      if (rest.isEditMode) {
        await updateMember.mutateAsync({
          ...values,
          memberId: rest.memberId,
        });
      } else {
        await inviteMember.mutateAsync(values);
      }
      // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
    } catch (error) {}
  };

  return (
    <Modal
      title={title}
      subtitle={subtitle}
      trigger={children}
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting || rest.isEditMode === true}
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job title</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Eg: Co-Founder & CTO, Lawyer at Law Firm LLP
                </FormDescription>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />

          <Button
            loading={isSubmitting}
            loadingText={
              rest.isEditMode === true ? "Updating..." : "Sending invite..."
            }
            className="mt-5"
          >
            {rest.isEditMode === true ? "Update team member" : "Send an invite"}
          </Button>

          <p className="text-center text-xs text-gray-500">
            We{`'`}ll send an email to your team member with a link to create an
            account.
          </p>
        </form>
      </Form>
    </Modal>
  );
};

export default MemberModal;
