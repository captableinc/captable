"use client";

import { Button } from "./button";
import { api } from "@/trpc/react";

import { uploadFile } from "@/common/uploads";

import React, { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  useDropzone,
  type FileWithPath,
  type DropzoneOptions,
} from "react-dropzone";
import { type TDocumentType } from "@/trpc/routers/document-router/schema";
import { type RouterOutputs } from "@/trpc/shared";

type UploadReturn = RouterOutputs["document"]["create"];

type DocumentUploadDropzone = Omit<
  DropzoneOptions,
  "noClick" | "noKeyboard" | "onDrop"
>;

type UploaderProps = {
  header?: React.ReactNode;

  // should be companyPublicId or membershipId or userId
  identifier: string;

  keySuffix: string;
  type: TDocumentType;
  onSuccess?: (data: UploadReturn) => void | Promise<void>;
} & DocumentUploadDropzone;

export function Uploader({
  header,
  identifier,
  keySuffix,
  type,
  onSuccess,
  ...rest
}: UploaderProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const { mutateAsync } = api.document.create.useMutation();

  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    try {
      setUploading(true);
      for (const file of acceptedFiles) {
        const upload = await uploadFile(file, { identifier, keySuffix });

        const data = await mutateAsync({ ...upload, type });

        if (onSuccess) {
          await onSuccess(data);
        }

        toast({
          variant: "default",
          title: "🎉 Successfully uploaded",
          description: "Your document(s) has been uploaded.",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please reload the page and try again later.",
      });
    } finally {
      setUploading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    ...rest,
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onDrop,
  });

  return (
    <section className="w-full">
      <div
        {...getRootProps({ className: "dropzone" })}
        className="flex w-full flex-col items-center justify-center  rounded-md border border-dashed border-border px-5 py-10"
      >
        {header}
        <input {...getInputProps()} multiple={false} />
        <p className="text-center text-neutral-500">
          Drop & drop, or select a file to upload
        </p>
        <Button
          onClick={open}
          variant={"default"}
          className="mt-5"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Select a file"}
        </Button>
      </div>
    </section>
  );
}

export default Uploader;
