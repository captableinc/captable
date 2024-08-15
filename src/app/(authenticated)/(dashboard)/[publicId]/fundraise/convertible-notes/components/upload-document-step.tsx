"use client";

import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { StepperModalFooter, StepperPrev } from "@/components/ui/stepper";
import { invariant } from "@/lib/error";
import { useFormValueState } from "@/providers/form-value-provider";
import {
  type TCreateConvertibleNoteParams,
  type TCreateConvertibleNoteRes,
  createConvertibleNote,
} from "@/server/api/client-handlers/convertible-note";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { TFormSchema } from "./add-convertible-notes-form";

const Schema = z.object({
  files: z.array(z.instanceof(File)).min(1, "Add one or more files"),
});

type TSchema = z.infer<typeof Schema>;

export function UploadDocumentStep() {
  const router = useRouter();
  const { data: session } = useSession();
  const formData = useFormValueState<TFormSchema>();

  const form = useForm<TSchema>({
    resolver: zodResolver(Schema),
    defaultValues: {
      files: [],
    },
  });

  const { mutateAsync: createNote } = useMutation<
    TCreateConvertibleNoteRes,
    Error,
    TCreateConvertibleNoteParams
  >(
    (params) => {
      return createConvertibleNote(params);
    },
    {
      onSuccess: () => {
        router.refresh();
        toast.success("Convertible note created successfully");
      },
    },
  );

  const onSubmit = async (data: TSchema) => {
    invariant(session, "session not found");
    await createNote({
      urlParams: { companyId: session.user.companyId },
      json: {
        ...formData,
        ...(formData.boardApprovalDate && {
          boardApprovalDate: new Date(formData.boardApprovalDate).toISOString(),
        }),
        ...(formData.issueDate && {
          issueDate: new Date(formData.issueDate).toISOString(),
        }),
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="sr-only">files</FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  accept={{
                    "application/pdf": [".pdf"],
                  }}
                  multiple
                  maxSize={1024 * 1024 * 50}
                  // biome-ignore lint/style/useNumberNamespace: <explanation>
                  maxFileCount={Infinity}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <StepperModalFooter className="pt-6">
          <StepperPrev>Back</StepperPrev>
          <Button type="submit">Save & Continue</Button>
        </StepperModalFooter>
      </form>
    </Form>
  );
}
