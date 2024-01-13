"use client";
import React from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import { Button } from "./button";

function Uploader() {
  const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
  });

  //Shows a list of files that have been accepted
  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="w-full p-5">
      <div
        {...getRootProps({ className: "dropzone" })}
        className="flex w-full flex-col items-center justify-center  rounded-md border border-dashed border-border px-5 py-10"
      >
        <input {...getInputProps()} />
        <p className="text-center text-[#777777]">
          Drag and drop some files here, or click the button to select files
        </p>
        <Button onClick={open} variant={"default"} className="mt-5">
          Select file
        </Button>
      </div>
      <aside className="mt-5">
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

export default Uploader;
