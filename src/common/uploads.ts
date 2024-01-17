import {
  getPresignedPutUrl,
  type getPresignedUrlOptions,
} from "@/server/file-uploads";

/**
 * usage
 * ```js
 * import { uploadFile } from '@/common/uploads'
 *
* const handleUpload = async (file: File) => {
*   const { uploadKey } = await uploadFile(file);
*
*   // save to the database
*   saveDB({ uploadKey });
* };
* ```

 */
export const uploadFile = async (
  file: File,
  options?: Pick<getPresignedUrlOptions, "expiresIn" | "keyPrefix">,
) => {
  const { url, key } = await getPresignedPutUrl({
    contentType: file.type,
    fileName: file.name,
    ...(options && { ...options }),
  });

  const body = await file.arrayBuffer();

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body,
  });

  if (!res.ok) {
    throw new Error(
      `Failed to upload file "${file.name}", failed with status code ${res.status}`,
    );
  }

  return {
    uploadKey: key,
  };
};
