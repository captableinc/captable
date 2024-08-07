import { Fragment } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  type Recipient,
  RecipientsManager,
} from "@/components/ui/recipient-manager";
import type { RouterOutputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type OnDelete = {
  recipientId: string;
  email: string;
};
export type OnSave = {
  name: string;
  email: string;
};

export type TGetRecipients = RouterOutputs["template"]["getRecipients"];

type ManageEsignRecipientsFormProps =
  | {
      type: "create";
      payload?: never;
      onSubmit: (data: TFormSchema) => void;
      onSave?: () => void;
      onDelete?: () => void;
      onToggleOrderedDelivery?: () => void;
    }
  | {
      type: "update";
      payload: TGetRecipients;
      onSubmit: () => void;
      onSave: (data: OnSave) => void;
      onDelete: (data: OnDelete) => void;
      onToggleOrderedDelivery: (newStatus: boolean) => void;
    };

const formSchema = z.object({
  recipients: z.array(
    z.object({
      recipientId: z.string().optional(),
      email: z.string().email(),
      name: z.string().optional(),
    }),
  ),
  orderedDelivery: z.boolean(),
});

export type TFormSchema = z.infer<typeof formSchema>;

export function ManageEsignRecipientsForm({
  type,
  onSubmit,
  onToggleOrderedDelivery,
  onSave,
  onDelete,
  payload,
}: ManageEsignRecipientsFormProps) {
  const isUpdate = type === "update";
  const fieldName = "recipients";
  const defaultField = { recipientId: "", name: "", email: "" };

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipients: [defaultField],
      orderedDelivery: false,
    },
  });

  const onContinue = (newStatusValue: boolean) => {
    if (onToggleOrderedDelivery) {
      onToggleOrderedDelivery(newStatusValue);
    }
  };
  return (
    <>
      <FormProvider {...methods}>
        <form
          id="esign-recipients-form"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          {isUpdate && (
            <Fragment>
              <div className="flex items-center space-x-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Checkbox checked={payload?.orderedDelivery} />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {payload?.orderedDelivery
                          ? "This will disable recipients to sign in the order they are added."
                          : "This feature make compulsion for recipients to sign in the order they are added."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onContinue(!payload.orderedDelivery)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <div className="leading-none w-full flex justify-between item-center ">
                  <FormLabel>
                    Require recipients to sign in the order they are added
                  </FormLabel>
                </div>
              </div>
            </Fragment>
          )}

          {isUpdate ? (
            <RecipientsManager
              type="update"
              name={fieldName}
              existingRecipients={
                payload?.recipients.map((x) => ({
                  recipientId: x.id,
                  name: x.name,
                  email: x.email,
                })) as Recipient[]
              }
              onSave={onSave}
              onDelete={onDelete}
            />
          ) : (
            <RecipientsManager
              type="create"
              name={fieldName}
              defaulField={defaultField}
            />
          )}

          <div hidden={isUpdate} className="w-full">
            <FormField
              control={methods.control}
              name="orderedDelivery"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none w-full flex justify-between item-center ">
                    <FormLabel>
                      Require recipients to sign in the order they are added
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </form>
      </FormProvider>
    </>
  );
}
