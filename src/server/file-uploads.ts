"use server";
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
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
const Bucket = env.UPLOAD_BUCKET;
const PublicBucket = env.PUBLIC_UPLOAD_BUCKET;

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

export interface getPresignedUrlOptions {
  contentType: string;
  expiresIn?: number;
  fileName: string;
  keyPrefix: string;
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
    Bucket: bucketMode === "privateBucket" ? Bucket : PublicBucket,
    Key,
    ContentType: contentType,
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
    Bucket,
    Key: key,
    // ResponseContentDisposition: `attachment; filename="${key}"`,
    ResponseContentDisposition: `inline`,
  });

  const url = await getSignedUrl(S3, getObjectCommand, {
    expiresIn: TEN_MINUTES_IN_SECONDS,
  });

  return { key, url };
};

export const deleteBucketFile = (key: string) => {
  return S3.send(
    new DeleteObjectCommand({
      Bucket: process.env.NEXT_PRIVATE_UPLOAD_BUCKET,
      Key: key,
    }),
  );
};
