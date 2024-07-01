"use client";

import { ACTIONS, SUBJECTS } from "@/constants/rbac";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const formSchema = z.object({
  name: z.string(),
});

type TFormSchema = z.infer<typeof formSchema>;

export function CreateRbacModal() {
  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: TFormSchema) => {};
  return (
    <Modal
      size="4xl"
      title="create roles"
      trigger={<Button>Create Role</Button>}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
              <TableHead>Permissions</TableHead>
              {ACTIONS.map((item) => (
                <TableHead key={item}>{item}</TableHead>
              ))}
            </TableHeader>
            {SUBJECTS.map((item) => (
              <TableRow key={item}>
                <TableCell className="font-medium">{item}</TableCell>

                {ACTIONS.map((action) => (
                  <TableCell key={action}>
                    <Checkbox />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </Table>
        </form>
      </Form>
    </Modal>
  );
}
