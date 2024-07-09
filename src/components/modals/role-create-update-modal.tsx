"use client";

import Modal from "@/components/common/push-modal";

import {
  ACTIONS,
  SUBJECTS,
  type TActions,
  type TSubjects,
} from "@/lib/rbac/constants";

import { api } from "@/trpc/react";
import {
  type TypeZodCreateRoleMutationSchema,
  ZodCreateRoleMutationSchema,
} from "@/trpc/routers/rbac-router/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { popModal, pushModal } from ".";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const formSchema = ZodCreateRoleMutationSchema;
type TFormSchema = TypeZodCreateRoleMutationSchema;

export const defaultInputPermissionInputs = SUBJECTS.reduce<
  TFormSchema["permissions"]
>((prev, curr) => {
  const actions = ACTIONS.reduce<Partial<Record<TActions, boolean>>>(
    (prev, curr) => {
      prev[curr] = false;

      return prev;
    },
    {},
  );

  prev[curr] = actions;

  return prev;
}, {});

const humanizedAction: Record<TActions, string> = {
  "*": "All",
  create: "Create",
  delete: "Delete",
  read: "Read",
  update: "Update",
};

type FormProps =
  | { type: "create"; defaultValues?: never; roleId?: never }
  | { type: "edit"; defaultValues: TFormSchema; roleId: string }
  | { type: "view"; defaultValues: TFormSchema; roleId?: never };

type RoleCreateUpdateModalProps = {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
} & FormProps;

export const RoleCreateUpdateModal = ({
  title,
  subtitle,
  ...rest
}: RoleCreateUpdateModalProps) => {
  return (
    <Modal size="4xl" title={title} subtitle={subtitle}>
      <RoleForm {...rest} />
    </Modal>
  );
};

function RoleForm(props: FormProps) {
  const router = useRouter();
  const { mutateAsync: createRole } = api.rbac.createRole.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
      form.reset();
      popModal("RoleCreateUpdate");
      router.refresh();
    },
  });

  const { mutateAsync: updateRole } = api.rbac.updateRole.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
      form.reset();
      popModal("RoleCreateUpdate");
      router.refresh();
    },
  });

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: props?.defaultValues
      ? props.defaultValues
      : {
          name: "",
          permissions: defaultInputPermissionInputs,
        },
  });

  const onSubmit = async (data: TFormSchema) => {
    if (props.type === "create") {
      await createRole(data);
    }

    if (props.type === "edit") {
      await updateRole({ ...data, roleId: props.roleId });
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          {props.type !== "view" ? (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permissions</TableHead>
                {ACTIONS.map((item) => (
                  <TableHead key={item}>{humanizedAction[item]}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {SUBJECTS.map((subject) => (
                <TableRow key={subject}>
                  <TableCell className="font-medium">{subject}</TableCell>

                  {ACTIONS.map((action) => (
                    <PermissionCheckBox
                      key={action}
                      action={action}
                      subject={subject}
                      isReadOnlyMode={props.type === "view"}
                    />
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {props.type !== "view" ? (
          <div>
            <Button type="submit">Save</Button>
          </div>
        ) : null}
      </form>
    </Form>
  );
}

interface RoleCreateUpdateModalActionProps extends ComponentProps<"button"> {}

export const RoleCreateUpdateModalAction = (
  props: RoleCreateUpdateModalActionProps,
) => {
  return (
    <Button
      {...props}
      onClick={() => {
        pushModal("RoleCreateUpdate", {
          title: "Create roles",
          type: "create",
        });
      }}
    >
      Create Role
    </Button>
  );
};

interface PermissionCheckBoxProps {
  action: TActions;
  subject: TSubjects;
  isReadOnlyMode: boolean;
}

function PermissionCheckBox({
  action,
  subject,
  isReadOnlyMode,
}: PermissionCheckBoxProps) {
  const form = useFormContext<TFormSchema>();

  const allValue = useWatch({
    control: form.control,
    name: `permissions.${subject}.*`,
    exact: true,
  });

  return (
    <TableCell>
      <FormField
        control={form.control}
        name={`permissions.${subject}.${action}`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Checkbox
                checked={allValue || field.value}
                onCheckedChange={field.onChange}
                disabled={isReadOnlyMode}
                aria-readonly={isReadOnlyMode}
              />
            </FormControl>
            <div className="sr-only">
              <FormLabel>{action}</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </TableCell>
  );
}
