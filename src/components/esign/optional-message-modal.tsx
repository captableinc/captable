"use client";

import Modal from "@/components/common/modal";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { type RouterOutputs } from "@/trpc/shared";
import React, { type SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

type Recipients = RouterOutputs["template"]["get"]["recipients"];

interface Payload {
  name: string;
  recipients: Recipients;
}
type MemberModalType = {
  callback: (canSubmit: boolean) => void;
  title: string;
  subtitle: string;
  dialogProps: {
    open: boolean;
    onOpenChange: React.Dispatch<SetStateAction<boolean>>;
  };
};

export const OptionalMessageModal = ({
  title,
  subtitle,
  dialogProps,
  callback,
}: MemberModalType) => {
  const form = useFormContext();
  const isSubmitting = form.formState.isSubmitting;

  const onSendEsignEmail = () => callback(true);

  return (
    <Modal
      trigger={<></>}
      title={title}
      subtitle={subtitle}
      dialogProps={dialogProps}
    >
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
