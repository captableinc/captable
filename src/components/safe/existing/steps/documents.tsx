'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Uploader from '@/components/ui/uploader'
import { useFormContext } from 'react-hook-form'

type Documents = {
  bucketId: string
  name: string
}

export const DocumentsFields = ['documents']

export const Documents = () => {
  const form = useFormContext()
  //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const documents: [Documents] = form.watch('documents')
  // document=uploaders are happy format then //
  return (
    <>
      <Uploader
        multiple={true}
        identifier={'safes'}
        keyPrefix="safes-key"
        onSuccess={async (bucketData) => {
          form.setValue('documents', [
            //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ...(form.getValues('documents') || []),
            {
              bucketId: bucketData.id,
              name: bucketData.name,
            },
          ])
        }}
        accept={{
          'application/pdf': ['.pdf'],
        }}
      />
      {documents?.length ? (
        <Alert className="mt-5 bg-teal-100" variant="default">
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
        <Alert variant="destructive" className="mt-5">
          <AlertTitle>0 document uploaded</AlertTitle>
          <AlertDescription>
            Please upload necessary documents to continue.
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
