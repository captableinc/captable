"use client";

import { useForm } from "react-hook-form";
import { RiShieldCheckLine } from "@remixicon/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  email: z.string().email().min(1, {
    message: "Email is required",
  }),
});

export const AccessRequestForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <Card className="flex w-full max-w-lg flex-col items-center justify-center py-4">
        <CardHeader className="flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-400">
            <RiShieldCheckLine className="h-12 w-12 text-gray-600" />
          </div>
          <CardTitle>Request Document Access</CardTitle>

          <CardDescription>This document is email protected.</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button size="sm" className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};
