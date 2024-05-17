"use client";
import { fileType } from "@/lib/mime";

import {
  RiFileCloudFill,
  RiFileExcelFill,
  RiFileImageFill,
  RiFileMusicFill,
  RiFilePdf2Fill,
  RiFilePptFill,
  RiFileVideoFill,
  RiFileWordFill,
} from "@remixicon/react";

type FileIconProps = {
  type: string;
};

const FileIcon = ({ type }: FileIconProps) => {
  const _type = fileType(type);

  switch (_type) {
    case "image":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-pink-100">
          <RiFileImageFill className="h-5 w-5 text-pink-500" />
        </div>
      );

    case "audio":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-100">
          <RiFileMusicFill className="h-5 w-5 text-indigo-500" />
        </div>
      );

    case "video":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-rose-100">
          <RiFileVideoFill className="h-5 w-5 text-rose-500" />
        </div>
      );

    case "powerpoint":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-100">
          <RiFilePptFill className="h-5 w-5 text-orange-500" />
        </div>
      );

    case "doc":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100">
          <RiFileWordFill className="h-5 w-5 text-blue-500" />
        </div>
      );

    case "excel":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100">
          <RiFileExcelFill className="h-5 w-5 text-emerald-500" />
        </div>
      );

    case "pdf":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-100">
          <RiFilePdf2Fill className="h-5 w-5 text-red-500" />
        </div>
      );

    default:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100">
          <RiFileCloudFill className="h-5 w-5 text-blue-500" />
        </div>
      );
  }
};

export default FileIcon;
