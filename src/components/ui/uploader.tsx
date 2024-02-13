"use client";
import { Button } from "./button";
import React, { useCallback, useState } from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import { getFileSizeSuffix } from "@/lib/utils";

type uploadProps = {
  header?: React.ReactNode;
  uploadType?: "avatar" | "document";
};

function Uploader({ uploadType, header }: uploadProps) {
  const [uploading, setUploading] = useState(false);
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    // Do something with the files
    console.log(acceptedFiles, uploadType);
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  //Shows a list of files that have been accepted
  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {`${file.path} - ${file.size} ${getFileSizeSuffix(file.size)}`}
    </li>
  ));

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

      {files.length > 0 && (
        <aside className="mt-5">
          <h5 className="font-medium">Files</h5>
          <ul>{files}</ul>
        </aside>
      )}
    </section>
  );
}

export default Uploader;
