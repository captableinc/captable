"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepperModalFooter, StepperPrev } from "@/components/ui/stepper";
import Uploader from "@/components/ui/uploader";
import { toTitleCase } from "@/lib/string";
import { SafeTemplateEnum } from "@/prisma/enums";
import { useFormValueState } from "@/providers/form-value-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { FileWithPath } from "react-dropzone";
import {
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { z } from "zod";

import { uploadFile } from "@/common/uploads";
import { Checkbox } from "@/components/ui/checkbox";
import { LinearCombobox } from "@/components/ui/combobox";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { invariant } from "@/lib/error";
import { TAG } from "@/lib/tags";
import { api } from "@/trpc/react";
import { ZodTemplateFieldRecipientSchema } from "@/trpc/routers/template-router/schema";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { TFormSchema as TGeneralDetailsFormSchema } from "./general-details";
import type { TFormSchema as TInvestorDetailsFormSchema } from "./investor-details";

type TFormValueState = TGeneralDetailsFormSchema & TInvestorDetailsFormSchema;

const safeTemplateKeys = Object.keys(SafeTemplateEnum).filter(
  (item) => item !== "CUSTOM",
) as [Exclude<keyof typeof SafeTemplateEnum, "CUSTOM">];

const formSchema = z.discriminatedUnion("templateType", [
  z
    .object({
      templateType: z.literal("custom-template"),
      safeTemplate: z.literal("CUSTOM"),
    })
    .merge(ZodTemplateFieldRecipientSchema),

  z
    .object({
      templateType: z.literal("predefined-template"),
      safeTemplate: z.enum(safeTemplateKeys),
    })
    .merge(ZodTemplateFieldRecipientSchema),
]);
const templateTypes = safeTemplateKeys.map((val) => ({
  label: toTitleCase(val.replaceAll("_", " ")),
  value: val,
}));

type TFormSchema = z.infer<typeof formSchema>;

export function SafeTemplate() {
  const router = useRouter();
  const formValues = useFormValueState<TFormValueState>();
  const { data: session } = useSession();
  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateType: "predefined-template",
      orderedDelivery: false,
      recipients: [{ email: "", name: "" }],
    },
  });

  const [documentsList, setDocumentsList] = useState<FileWithPath[]>([]);
  const { mutateAsync: handleBucketUpload } = api.bucket.create.useMutation();
  const { mutateAsync: handleCreateSafe } = api.safe.create.useMutation({
    onSuccess: (payload) => {
      if (payload.success) {
        toast.success("🎉 SAFEs created successfully.");
        router.push(
          `/${session?.user.companyPublicId}/documents/esign/${payload.template.publicId}`,
        );
      } else {
        toast.error("Failed creating SAFEs. Please try again.");
      }
    },
  });
  const type = useWatch({ control: form.control, name: "templateType" });

  const handleSubmit = async (formData: TFormSchema) => {
    const { templateType, ...rest } = formData;
    invariant(session, "session not found");

    if (rest.safeTemplate === "CUSTOM" && documentsList.length) {
      const doc = documentsList?.[0];

      invariant(doc, "document not found");

      const { key, mimeType, name, size } = await uploadFile(doc, {
        identifier: session.user.companyPublicId,
        keyPrefix: "new-safes",
      });

      const { id: bucketId, name: docName } = await handleBucketUpload({
        key,
        mimeType,
        name,
        size,
        tags: [TAG.SAFE],
      });

      const document = { bucketId, name: docName };

      await handleCreateSafe({
        ...formValues,
        ...rest,
        document,
      });
    }

    if (rest.safeTemplate !== "CUSTOM") {
      await handleCreateSafe({
        ...formValues,
        ...rest,
      });
    }
  };

  const handleDocuments = (docs: FileWithPath[]) => {
    setDocumentsList(docs);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-y-4"
      >
        <div className="flex flex-col gap-y-4">
          <Recipients />
          <FormField
            control={form.control}
            name="templateType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Template type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(val) => {
                      if (val === "custom-template") {
                        form.setValue("safeTemplate", "CUSTOM");
                      }

                      field.onChange(val);
                    }}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="predefined-template" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Pre-defined safe template
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="custom-template" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Custom safe template
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === "predefined-template" ? (
            <PredefinedTemplateSelect />
          ) : (
            <CustomTemplateField
              setDocumentsList={handleDocuments}
              documentsList={documentsList}
            />
          )}
        </div>
        <StepperModalFooter>
          <StepperPrev>Back</StepperPrev>
          <Button
            disabled={type === "custom-template" && documentsList.length === 0}
            type="submit"
          >
            Save
          </Button>
        </StepperModalFooter>
      </form>
    </Form>
  );
}

function PredefinedTemplateSelect() {
  const form = useFormContext<TFormSchema>();
  return (
    <FormField
      control={form.control}
      name="safeTemplate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Safe template</FormLabel>
          <div>
            <LinearCombobox
              options={templateTypes}
              onValueChange={(option) => field.onChange(option.value)}
            />
          </div>
          <FormMessage className="text-xs font-light" />
        </FormItem>
      )}
    />
  );
}

interface CustomTemplateFieldProps {
  documentsList: FileWithPath[];
  setDocumentsList: (arg: FileWithPath[]) => void;
}

function CustomTemplateField({
  documentsList,
  setDocumentsList,
}: CustomTemplateFieldProps) {
  return (
    <div>
      <Uploader
        shouldUpload={false}
        onSuccess={(bucketData) => {
          setDocumentsList(bucketData);
        }}
        accept={{
          "application/pdf": [".pdf"],
        }}
      />
      {documentsList?.length ? (
        <Alert className="mt-5 bg-teal-100" variant="default">
          <AlertTitle>
            {documentsList.length > 1
              ? `${documentsList.length} documents uploaded`
              : `${documentsList.length} document uploaded`}
          </AlertTitle>
          <AlertDescription>
            You can submit the form to proceed.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive" className="mt-5">
          <AlertTitle>0 document uploaded</AlertTitle>
          <AlertDescription>
            Please upload necessary documents to continue.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function Recipients() {
  const form = useFormContext<TFormSchema>();
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "recipients",
  });

  const isDeleteDisabled = fields.length === 1;
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col">
        {fields.map((item, index) => (
          <div
            className="my-3 flex items-end justify-between gap-x-2"
            key={item.id}
          >
            <div className="flex items-center gap-x-10">
              <FormField
                control={form.control}
                name={`recipients.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input className="h-8 min-w-16" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`recipients.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="h-8 min-w-16"
                        type="email"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center">
              {fields.length > 1 && (
                <Button
                  disabled={isDeleteDisabled}
                  onClick={() => {
                    remove(index);
                  }}
                  variant="ghost"
                  size="sm"
                  className="group h-8 w-8 p-2"
                >
                  <Icon
                    name="delete-bin-line"
                    aria-hidden
                    className="h-8 w-8 text-red-500/70 group-hover:text-red-500"
                  />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <FormField
          control={form.control}
          name="orderedDelivery"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="leading-none">
                <FormLabel>
                  Require recipients to sign in the order they are added
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>

      <div>
        <Button
          type="button"
          variant={"secondary"}
          size="sm"
          onClick={() => {
            append({ email: "", name: "" });
          }}
        >
          Add more recipient
        </Button>
      </div>
    </div>
  );
}
