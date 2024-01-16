"use server";
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { customId } from "@/common/id";
import path from "node:path";
import slugify from "@sindresorhus/slugify";
import { env } from "@/env";

const region = env.UPLOAD_REGION;
const endpoint = env.UPLOAD_ENDPOINT;
const accessKeyId = env.UPLOAD_ACCESS_KEY_ID;
const secretAccessKey = env.UPLOAD_SECRET_ACCESS_KEY;
const hasCredentials = accessKeyId && secretAccessKey;

const S3 = new S3Client({
  region,
  endpoint,
  credentials: hasCredentials
    ? {
        secretAccessKey,
        accessKeyId,
      }
    : undefined,
});

interface getPresignedUrlOptions {
  contentType: string;
  expiresIn?: number;
  fileName: string;
  keyPrefix?: string;
}

const TEN_MINUTES_IN_SECONDS = 10 * 60;

export const getPresignedUrl = async ({
  contentType,
  expiresIn,
  fileName,
  keyPrefix,
}: getPresignedUrlOptions) => {
  const { name, ext } = path.parse(fileName);

  const Key = `${keyPrefix ? keyPrefix + "/" : ""}${customId(12)}/${slugify(
    name,
  )}${ext}`;

  const putObjectCommand = new PutObjectCommand({
    Bucket: "bucket",
    Key,
    ContentType: contentType,
  });

  const url: string = await getSignedUrl(S3, putObjectCommand, {
    expiresIn: expiresIn ?? TEN_MINUTES_IN_SECONDS,
  });

  return url;
};

export const deleteBucketFile = (key: string) => {
  return S3.send(
    new DeleteObjectCommand({
      Bucket: process.env.NEXT_PRIVATE_UPLOAD_BUCKET,
      Key: key,
    }),
  );
};
