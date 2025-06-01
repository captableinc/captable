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
import { Switch } from "@/components/ui/switch";
import { api } from "@/trpc/react";
import {
  ACTIONS,
  SUBJECTS,
  type TActions,
  type TSubjects,
} from "@captable/rbac/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const RoleSchema = z.object({
  name: z.string().min(1, { message: "Role name is required" }),
  permissions: z.record(z.array(z.string())),
});

type RoleFormData = z.infer<typeof RoleSchema>;

const defaultPermissions = SUBJECTS.reduce(
  (acc, subject) => {
    acc[subject] = [];
    return acc;
  },
  {} as Record<TSubjects, TActions[]>,
);

const isActionsSelected = (actions: TActions[], action: TActions) => {
  return actions.includes(action) || actions.includes("*");
};

function RoleCreateUpdateForm({
  isEditMode,
  roleData,
  onClose,
}: {
  isEditMode: boolean;
  roleData?: {
    id?: string;
    name: string;
    permissions: Record<string, string[]>;
  };
  onClose: () => void;
}) {
  const router = useRouter();
  const { pending } = useFormStatus();

  const form = useForm<RoleFormData>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: roleData?.name || "",
      permissions: roleData?.permissions || defaultPermissions,
    },
  });

  const createRole = api.rbac.createRole.useMutation({
    onSuccess: () => {
      toast.success("Role created successfully");
      onClose();
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Failed to create role: ${error.message}`);
    },
  });

  const updateRole = api.rbac.updateRole.useMutation({
    onSuccess: () => {
      toast.success("Role updated successfully");
      onClose();
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Failed to update role: ${error.message}`);
    },
  });

  const toggleAction = (subject: TSubjects, action: TActions) => {
    const currentPermissions = form.getValues("permissions");
    const subjectActions = (currentPermissions[subject] || []) as TActions[];

    let newActions: TActions[];
    if (action === "*") {
      newActions = subjectActions.includes("*") ? [] : ["*"];
    } else {
      if (subjectActions.includes("*")) {
        newActions = subjectActions.filter((a) => a !== "*");
        if (!subjectActions.includes(action)) {
          newActions.push(action);
        }
      } else {
        newActions = subjectActions.includes(action)
          ? subjectActions.filter((a) => a !== action)
          : [...subjectActions, action];
      }
    }

    form.setValue(`permissions.${subject}`, newActions as string[]);
  };

  const onSubmit = async (data: RoleFormData) => {
    if (isEditMode && roleData?.id) {
      await updateRole.mutateAsync({
        roleId: roleData.id,
        name: data.name,
        permissions: data.permissions,
      });
    } else {
      await createRole.mutateAsync({
        name: data.name,
        permissions: data.permissions,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter role name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Permissions</FormLabel>
          <FormDescription>
            Select permissions for this role by toggling the switches below.
          </FormDescription>

          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2 text-sm font-medium">
              <div>Subject</div>
              {ACTIONS.map((item: TActions) => (
                <div key={item} className="text-center capitalize">
                  {item}
                </div>
              ))}
            </div>

            {SUBJECTS.map((subject: TSubjects) => (
              <div
                key={subject}
                className="grid grid-cols-5 gap-2 items-center"
              >
                <div className="font-medium capitalize">{subject}</div>
                {ACTIONS.map((action: TActions) => (
                  <div key={action} className="flex justify-center">
                    <Switch
                      checked={isActionsSelected(
                        (form.watch(`permissions.${subject}`) ||
                          []) as TActions[],
                        action,
                      )}
                      onCheckedChange={() => toggleAction(subject, action)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {isEditMode ? "Update Role" : "Create Role"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export interface RoleCreateUpdateModalProps {
  isEditMode?: boolean;
  roleData?: {
    id?: string;
    name: string;
    permissions: Record<string, string[]>;
  };
  trigger?: React.ReactNode;
  disabled?: boolean;
}

export default function RoleCreateUpdateModal({
  isEditMode = false,
  roleData,
  trigger,
  disabled = false,
}: RoleCreateUpdateModalProps) {
  return (
    <Modal
      title={isEditMode ? "Update Role" : "Create New Role"}
      subtitle={
        isEditMode
          ? "Update the role permissions"
          : "Create a new role with custom permissions"
      }
      size="4xl"
      trigger={trigger || <Button disabled={disabled}>Create Role</Button>}
    >
      <RoleCreateUpdateForm
        isEditMode={isEditMode}
        roleData={roleData}
        onClose={() => {
          // Handle close - this would be managed by the modal component
        }}
      />
    </Modal>
  );
}
