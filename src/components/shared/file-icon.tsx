import {
  RiFileUnknowLine,
  RiFileWordLine,
  RiFileExcelLine,
  RiFilePdf2Line,
  RiFileImageLine,
  RiFileGifLine,
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
    case "gif":
    case "svg":
      return <RiFileImageLine className={className} />;
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
