import { FileUploader } from "@/components/ui/file-uploader";

export function UploadDocumentStep() {
  return (
    <FileUploader
      accept={{
        "application/pdf": [".pdf"],
      }}
      multiple
      maxSize={1024 * 1024 * 50}
      // biome-ignore lint/style/useNumberNamespace: <explanation>
      maxFileCount={Infinity}
    />
  );
}
