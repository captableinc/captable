"use client";

import { uploadFile } from "@/common/uploads";
import { Button } from "@/components/ui/button";
import { useDialogState } from "@/components/ui/dialog";
import { FileUploader } from "@/components/ui/file-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  StepperModalFooter,
  StepperPrev,
  useStepper,
} from "@/components/ui/stepper";
import { invariant } from "@/lib/error";
import { TAG } from "@/lib/tags";
import { useFormValueState } from "@/providers/form-value-provider";
import {
  type TCreateConvertibleNoteParams,
  type TCreateConvertibleNoteRes,
  createConvertibleNote,
} from "@/server/api/client-handlers/convertible-note";
import { api } from "@/trpc/react";
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
  const { onOpenChange } = useDialogState();
  const { reset } = useStepper();
  const { mutateAsync: bucketUpload } = api.bucket.create.useMutation();
  const { mutateAsync: documentUpload } = api.document.create.useMutation();
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
  >((params) => {
    return createConvertibleNote(params);
  });

  const onSubmit = (data: TSchema) => {
    invariant(session, "session not found");

    const handleSubmit = async () => {
      const note = await createNote({
        urlParams: { companyId: session.user.companyId },
        json: {
          ...formData,
          ...(formData.boardApprovalDate && {
            boardApprovalDate: new Date(
              formData.boardApprovalDate,
            ).toISOString(),
          }),
          ...(formData.issueDate && {
            issueDate: new Date(formData.issueDate).toISOString(),
          }),
        },
      });

      for (const file of data.files) {
        const { key, mimeType, name, size } = await uploadFile(file, {
          identifier: session.user.companyPublicId,
          keyPrefix: "convertible-note",
        });

        const data = await bucketUpload({
          key,
          mimeType,
          name,
          size,
          tags: [TAG.CONVERTIBLE_NOTE],
        });

        await documentUpload({
          bucketId: data.id,
          name: data.name,
          convertibleNoteId: note.data.id,
        });
      }
    };

    onOpenChange(false);
    reset();

    toast.promise(handleSubmit, {
      loading: "Creating Convertible Note...",
      success: () => {
        router.refresh();

        return "Convertible note created successfully";
      },
      error: "Failed to create convertible note",
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
