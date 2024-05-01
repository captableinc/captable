"use client";

import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useToast } from "@/components/ui/use-toast";
import { getSanitizedDateTime } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { useSession } from "next-auth/react";
import React, { type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type Recipients = RouterOutputs["template"]["get"]["recipients"];

interface Payload {
  completedOn: Date | null;
  name: string;
  templateId: string;
  recipients: Recipients;
  company: {
    name: string;
    logo: string | null;
  };
}
type MemberModalType = {
  payload: Payload;
  title: string;
  subtitle: string;
  dialogProps: {
    open: boolean;
    onOpenChange: React.Dispatch<SetStateAction<boolean>>;
  };
};

export const OptionalMessageModal = ({
  payload,
  title,
  subtitle,
  dialogProps,
}: MemberModalType) => {
  const { toast } = useToast();
  const { data: session } = useSession();

  const sendEsignMail = api.template.sendEsignMail.useMutation({
    onSuccess: ({ success, message }) => {
      if (!success) return;
      toast({
        variant: "default",
        title: "🎉 Sent!",
        description: message,
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error.message,
        description: "",
      });
    },
    onSettled: () => {
      dialogProps.onOpenChange((prev) => !prev);
    },
  });
  const form = useForm();
  const optionalMessage: string = form.watch("optionalMessage");
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async () => {
    try {
      const optionalMessage: string = form.getValues("optionalMessage");
      const expiryDate: string = form.getValues("expiryDate");

      if (!optionalMessage && !expiryDate) {
        toast({
          variant: "destructive",
          title: "Required",
          description: "Please add expiry date for default message.",
        });
        return;
      }
      if (session) {
        const _payload = {
          optionalMessage: optionalMessage ?? null,
          completedOn: payload.completedOn ?? null,
          documentName: payload.name,
          templateId: payload.templateId,
          recipients: payload.recipients,
          company: {
            name: payload.company.name,
            logo:
              payload.company.logo ??
              "https://avatars.githubusercontent.com/u/163377635?s=48&v=4",
          },
          expiryDate: expiryDate ? getSanitizedDateTime(expiryDate) : undefined,
        };
        await sendEsignMail.mutateAsync(_payload);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Modal
      trigger={<p></p>}
      title={title}
      subtitle={subtitle}
      dialogProps={dialogProps}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <FormField
            control={form.control}
            name="optionalMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Optional message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type email body here instead of default message..."
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />

          <FormField
            disabled={!!optionalMessage}
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Set expiry date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage className="text-xs font-light" />
              </FormItem>
            )}
          />

          <Button loading={isSubmitting} onSubmit={onSubmit} className="mt-5">
            Send E-sign Email
          </Button>

          <p className="py-1 text-center text-xs text-gray-500">
            We{`'`}ll send an email with a link to e-sign templates.
          </p>
        </form>
      </Form>
    </Modal>
  );
};
