// Import the necessary libraries
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";

export const DocumentUploadFields = ["documents"];

export const DocumentUpload = () => {
  const form = useFormContext();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      form.setValue("documents", acceptedFiles);
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>
          Drag &rsquo;n&rsquo; drop some files here, or click to select files
        </p>
      )}
    </div>
  );
};
