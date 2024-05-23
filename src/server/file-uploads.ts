"use server";

import path from "node:path";
import { customId } from "@/common/id";
import { env } from "@/env";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import slugify from "@sindresorhus/slugify";

const region = env.UPLOAD_REGION;
const endpoint = env.UPLOAD_ENDPOINT;
const accessKeyId = env.UPLOAD_ACCESS_KEY_ID;
const secretAccessKey = env.UPLOAD_SECRET_ACCESS_KEY;
const hasCredentials = accessKeyId && secretAccessKey;
const PrivateBucket = env.UPLOAD_BUCKET_PRIVATE;
const PublicBucket = env.UPLOAD_BUCKET_PUBLIC;

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

export type TypeKeyPrefixes =
  | "safes"
  | "signed-esign-doc"
  | "unsigned-esign-doc"
  | "stock-option-docs"
  | "company-logos"
  | "profile-avatars";

export interface getPresignedUrlOptions {
  contentType: string;
  expiresIn?: number;
  fileName: string;
  keyPrefix: TypeKeyPrefixes;
  // should be companyPublicId or memberId or userId
  identifier: string;
  bucketMode: "privateBucket" | "publicBucket";
}

const TEN_MINUTES_IN_SECONDS = 10 * 60;

export const getPresignedPutUrl = async ({
  contentType,
  expiresIn,
  fileName,
  keyPrefix,
  identifier,
  bucketMode,
}: getPresignedUrlOptions) => {
  const { name, ext } = path.parse(fileName);

  const Key = `${identifier}/${keyPrefix}-${slugify(name)}-${customId(
    12,
  )}${ext}`;

  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketMode === "privateBucket" ? PrivateBucket : PublicBucket,
    Key,
    ContentType: contentType,
    ACL: bucketMode === "privateBucket" ? "private" : "public-read",
  });

  const url: string = await getSignedUrl(S3, putObjectCommand, {
    expiresIn: expiresIn ?? TEN_MINUTES_IN_SECONDS,
  });

  const bucketUrl = new URL(url);
  bucketUrl.search = "";

  return { url, key: Key, bucketUrl: bucketUrl.toString() };
};

export const getPresignedGetUrl = async (key: string) => {
  const getObjectCommand = new GetObjectCommand({
    Bucket: PrivateBucket,
    Key: key,
    // ResponseContentDisposition: `attachment; filename="${key}"`,
    ResponseContentDisposition: "inline",
  });

  const url = await getSignedUrl(S3, getObjectCommand, {
    expiresIn: TEN_MINUTES_IN_SECONDS,
  });

  return { key, url };
};

export const deleteBucketFile = (key: string) => {
  return S3.send(
    new DeleteObjectCommand({
      Bucket: process.env.UPLOAD_BUCKET_PRIVATE,
      Key: key,
    }),
  );
};
