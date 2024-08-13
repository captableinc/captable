import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { StepperModalFooter, StepperPrev } from "@/components/ui/stepper";

export function UploadDocumentStep() {
  return (
    <div>
      <FileUploader
        accept={{
          "application/pdf": [".pdf"],
        }}
        multiple
        maxSize={1024 * 1024 * 50}
        // biome-ignore lint/style/useNumberNamespace: <explanation>
        maxFileCount={Infinity}
      />

      <StepperModalFooter className="pt-6">
        <StepperPrev>Back</StepperPrev>
        <Button type="submit">Save & Continue</Button>
      </StepperModalFooter>
    </div>
  );
}
