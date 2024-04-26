import {
  RiFileExcelLine,
  RiFileImageLine,
  RiFilePdf2Line,
  RiFilePptLine,
  RiFileUnknowLine,
  RiFileWordLine,
} from "@remixicon/react";

type FileIconProps = {
  type: string;
};

const FileIcon = ({ type }: FileIconProps) => {
  switch (type) {
    case "image/jpeg":
    case "image/png":
    case "image/webp":
    case "image/svg+xml":
    case "image/gif":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-pink-100">
          <RiFileImageLine className="h-5 w-5 text-pink-500" />
        </div>
      );

    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-100">
          <RiFilePptLine className="h-5 w-5 text-orange-500" />
        </div>
      );

    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100">
          <RiFileWordLine className="h-5 w-5 text-blue-500" />
        </div>
      );

    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "text/csv":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100">
          <RiFileExcelLine className="h-5 w-5 text-emerald-500" />
        </div>
      );

    case "application/pdf":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-100">
          <RiFilePdf2Line className="h-5 w-5 text-red-500" />
        </div>
      );

    default:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100">
          <RiFileUnknowLine className="h-5 w-5 text-gray-500" />
        </div>
      );
  }
};

export default FileIcon;
