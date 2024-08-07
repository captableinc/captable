"use client";

import Modal from "@/components/common/push-modal";
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
import { api } from "@/trpc/react";
import { toast } from "sonner";

import { popModal } from "@/components/modals";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RouterOutputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ZodTeamMemberSchema = z.object({
  name: z.string(),
  loginEmail: z.string(),
  workEmail: z.string(),
  title: z.string(),
  roleId: z.string().optional(),
});

type TypeZodTeamMemberSchema = z.infer<typeof ZodTeamMemberSchema>;

type Roles = RouterOutputs["rbac"]["listRoles"]["rolesList"];

type MemberModalType = {
  title: string;
  subtitle: string;
  member: TypeZodTeamMemberSchema;
  roles: Roles;
} & editModeType;

type editModeType =
  | { isEditMode: true; memberId: string }
  | { isEditMode?: false; memberId?: never };

export const TeamMemberModal = ({
  title,
  subtitle,
  member,
  roles,
  ...rest
}: MemberModalType) => {
  const router = useRouter();
  const inviteMember = api.member.inviteMember.useMutation({
    onSuccess: () => {
      popModal("TeamMemberModal");
      toast.success("You have successfully invited the member.");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMember = api.member.updateMember.useMutation({
    onSuccess: () => {
      popModal("TeamMemberModal");
      toast.success("You have successfully updated the member.");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<TypeZodTeamMemberSchema>({
    resolver: zodResolver(ZodTeamMemberSchema),
    defaultValues: {
      name: member.name ?? "",
      loginEmail: member.loginEmail ?? "",
      workEmail: member.workEmail ?? "",
      title: member.title ?? "",
      roleId: member.roleId ?? "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: TypeZodTeamMemberSchema) => {
    const { name, title, workEmail, loginEmail, roleId } = values;
    try {
      if (rest.isEditMode) {
        await updateMember.mutateAsync({
          name,
          title,
          workEmail,
          memberId: rest.memberId,
          roleId,
        });
      } else {
        await inviteMember.mutateAsync({
          name,
          title,
          email: loginEmail,
          roleId,
        });
      }
    } catch (_error) {}
  };

  return (
    <Modal title={title} subtitle={subtitle}>
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
            name={rest.isEditMode ? "workEmail" : "loginEmail"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {rest.isEditMode ? "Work email" : "Login email"}
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting || rest.isEditMode}
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

          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
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
