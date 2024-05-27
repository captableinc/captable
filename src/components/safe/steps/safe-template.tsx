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
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

const formSchema = z.discriminatedUnion("templateType", [
  z.object({
    templateType: z.literal("custom-template"),
  }),

  z.object({
    templateType: z.literal("predefined-template"),
    safeTemplate: z.nativeEnum(SafeTemplateEnum),
  }),
]);
const templateTypes = Object.values(SafeTemplateEnum)
  .filter((item) => item !== "CUSTOM")
  .map((val) => ({
    label: toTitleCase(val.replaceAll("_", " ")),
    value: val,
  }));

type TFormSchema = z.infer<typeof formSchema>;

export function SafeTemplate() {
  const formValues = useFormValueState();
  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateType: "predefined-template",
    },
  });

  const [documentsList, setDocumentsList] = useState<FileWithPath[]>([]);
  const type = useWatch({ control: form.control, name: "templateType" });

  const handleSubmit = (data: TFormSchema) => {};

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
          <FormField
            control={form.control}
            name="templateType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Template type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
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

          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {templateTypes.map((item) => (
                <SelectItem key={item.label} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        identifier={""}
        keyPrefix="new-safes"
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
