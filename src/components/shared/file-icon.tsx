import {
  RiFileGifLine,
  RiFileWordLine,
  RiFilePdf2Line,
  RiFileExcelLine,
  RiFileImageLine,
  RiFileUnknowLine,
} from "@remixicon/react";

type FileIconProps = {
  type: string;
  className?: string;
};

const FileIcon = ({ type, className }: FileIconProps) => {
  switch (type) {
    case "jpeg":
    case "jpg":
    case "png":
    case "svg":
      return <RiFileImageLine className={className} />;
    case "gif":
      return <RiFileGifLine className={className} />;
    case "doc":
    case "docx":
      return <RiFileWordLine className={className} />;
    case "xls":
    case "xlsx":
    case "csv":
      return <RiFileExcelLine className={className} />;
    case "pdf":
      return <RiFilePdf2Line className={className} />;
    default:
      return <RiFileUnknowLine className={className} />;
  }
};

export default FileIcon;
