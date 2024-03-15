"use client";

import Uploader from "@/components/ui/uploader";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type Documents = {
  bucketId: string;
  name: string;
};

export const Documents = () => {
  const form = useFormContext();
  //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const documents: [Documents] = form.watch("documents");

  return (
    <>
      <Uploader
        identifier={"documenter"}
        keyPrefix="equity-doc"
        allowMultiple={true}
        onSuccess={async (bucketData) => {
          form.setValue("documents", [
            //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ...(form.getValues("documents") || []),
            {
              bucketId: bucketData.id,
              name: bucketData.name,
            },
          ]);
        }}
        accept={{
          "application/pdf": [".pdf"],
        }}
      />
      {documents?.length ? (
        <Alert className="bg-teal-600" variant="default">
          <AlertTitle>
            {documents.length > 1
              ? `${documents.length} documents uploaded`
              : `${documents.length} document uploaded`}
          </AlertTitle>
          <AlertDescription>
            You can submit the form to proceed.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertTitle> 0 document uploaded </AlertTitle>
          <AlertDescription>
            Please upload necessary documents to continue.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
