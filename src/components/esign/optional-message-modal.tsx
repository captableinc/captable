"use client";

import Modal from "@/components/common/modal";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { getSanitizedDateTime } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/shared";
import { useSession } from "next-auth/react";
import React, { type SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type Recipients = RouterOutputs["template"]["get"]["recipients"];

interface Payload {
  completedOn: Date | null;
  name: string;
  recipients: Recipients;
  company: {
    name: string;
    logo: string | null;
  };
}
type MemberModalType = {
  callback: (canSubmit: boolean) => void;
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
  callback,
}: MemberModalType) => {
  const { data: session } = useSession();
  const form = useFormContext();
  const isSubmitting = form.formState.isSubmitting;

  const onSendEsignEmail = async () => {
    const optionalMessage = form.getValues("emailPayload.optionalMessage") as
      | string
      | undefined;
    const expiryDate = form.getValues("emailPayload.expiryDate") as
      | string
      | undefined;
    if (session) {
      const email_payload = {
        optionalMessage: optionalMessage ?? "",
        completedOn: payload.completedOn,
        documentName: payload.name,
        company: {
          name: payload.company.name,
          logo:
            payload.company.logo ??
            "https://avatars.githubusercontent.com/u/163377635?s=48&v=4",
        },
        expiryDate: expiryDate ? getSanitizedDateTime(expiryDate) : null,
      };
      form.setValue("emailPayload", email_payload);
      callback(true);
    }
  };

  return (
    <Modal
      trigger={<></>}
      title={title}
      subtitle={subtitle}
      dialogProps={dialogProps}
    >
      <FormField
        control={form.control}
        name="emailPayload.optionalMessage"
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
        disabled={isSubmitting}
        control={form.control}
        name="emailPayload.expiryDate"
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
      <div className="flex w-full items-center justify-center">
        <Button
          onClick={onSendEsignEmail}
          loading={isSubmitting}
          className="mx-auto mt-5"
        >
          Send E-sign Email
        </Button>
      </div>
      <p className="py-1 text-center text-xs text-gray-500">
        We{`'`}ll send an email with a link to e-sign templates.
      </p>
    </Modal>
  );
};
