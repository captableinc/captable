"use client";
import { Button } from "./button";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { uploadFile } from "@/common/uploads";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useDropzone, type FileWithPath } from "react-dropzone";

type UploadProps = {
  header?: React.ReactNode;
  setOpen?: (val: boolean) => void;
  uploadType?: "avatar" | "document";
};

function Uploader({ header, setOpen }: UploadProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const publicId = session?.user.companyPublicId;
  const uploader = api.document.create.useMutation();

  const processFiles = async (acceptedFiles: FileWithPath[]) => {
    for (const file of acceptedFiles) {
      const upload = await uploadFile(file, { keyPrefix: publicId });
      await uploader.mutateAsync(upload);
    }
  };

  const uploadFiles = async (acceptedFiles: FileWithPath[]) => {
    try {
      setUploading(true);
      await processFiles(acceptedFiles);
      router.refresh();
      setOpen && setOpen(false);
      toast({
        variant: "default",
        title: "🎉 Successfully uploaded",
        description: "Your document(s) has been uploaded.",
      });
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
  };

  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    await uploadFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
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
