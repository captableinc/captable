"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Uploader from "@/components/ui/uploader";
import { TAG } from "@/constants/bucket-tags";
import { useSession } from "next-auth/react";
import { useFormContext } from "react-hook-form";

type Documents = {
  bucketId: string;
  name: string;
};

export const DocumentsFields = ["documents"];

export const Documents = () => {
  const { data: session } = useSession();
  const form = useFormContext();
  //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const documents: [Documents] = form.watch("documents");
  // document=uploaders are happy format then///
  return (
    <>
      <Uploader
        multiple={false}
        // biome-ignore lint/style/noNonNullAssertion: warning
        identifier={session?.user.companyPublicId!}
        tags={[TAG.SAFE]}
        keyPrefix="equity-doc"
        onSuccess={(bucketData) => {
          if (bucketData.length > 0 && bucketData[0]) {
            form.setValue("documents", [
              {
                bucketId: bucketData[0].id,
                name: bucketData[0].name,
              },
            ]);
          }
        }}
        accept={{
          "application/pdf": [".pdf"],
        }}
      />
      {documents?.length ? (
        <Alert className="mt-5 bg-teal-100" variant="default">
          <AlertTitle>Successfully uploaded the template.</AlertTitle>
          <AlertDescription>
            You can submit the form to proceed.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive" className="mt-5">
          <AlertTitle>No template uploaded</AlertTitle>
          <AlertDescription>
            Please upload necessary template to continue.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
