"use client";

import { ACTIONS, SUBJECTS } from "@/constants/rbac";
import {
  defaultInputPermissionInputs,
  permissionInputSchema,
} from "@/lib/rbac/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "../common/modal";
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

const formSchema = z.object({
  name: z.string().min(1),
  permissions: permissionInputSchema,
});

type TFormSchema = z.infer<typeof formSchema>;

export function CreateRbacModal() {
  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      permissions: defaultInputPermissionInputs,
    },
  });

  const onSubmit = (data: TFormSchema) => {
    console.log({ data });
  };
  return (
    <Modal
      size="4xl"
      title="create roles"
      trigger={<Button>Create Role</Button>}
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-y-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permissions</TableHead>
                  {ACTIONS.map((item) => (
                    <TableHead key={item}>{item}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {SUBJECTS.map((subject) => (
                  <TableRow key={subject}>
                    <TableCell className="font-medium">{subject}</TableCell>

                    {ACTIONS.map((action) => (
                      <TableCell key={action}>
                        <FormField
                          control={form.control}
                          name={`permissions.${subject}.${action}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="sr-only">
                                <FormLabel>{action}</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
