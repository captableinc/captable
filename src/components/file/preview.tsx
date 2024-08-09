import EmptyState from "@/components/common/empty-state";
import { OfficeViewer } from "@/components/file/office-viewer";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PdfViewer } from "@/components/ui/pdf-viewer";
import { fileType } from "@/lib/mime";

type FilePreviewProps = {
  name: string;
  url: string;
  mimeType?: string;
};

const ImagePreview = ({ url, name }: FilePreviewProps) => {
  return <img className="rounded" src={url} alt={name} />;
};

const AuditPreview = ({ url, name, mimeType }: FilePreviewProps) => {
  return (
    // biome-ignore lint/a11y/useMediaCaption: <explanation>
    <audio controls className="w-full">
      <source src={url} type={mimeType} />
      Your browser does not support the audio element.
    </audio>
  );
};

const VideoPreview = ({ url, name, mimeType }: FilePreviewProps) => {
  return (
    // biome-ignore lint/a11y/useMediaCaption: <explanation>
    <video controls className="w-full rounded">
      <source src={url} type={mimeType} />
      Your browser does not support the video type.
    </video>
  );
};

const UnknownPreview = ({ url, name, mimeType }: FilePreviewProps) => {
  return (
    <EmptyState
      title="Preview not available"
      subtitle={`This file type - ${mimeType} is not yet supported by the previewer. You can download the file by clicking the button below.`}
      icon={<UnknownFileIcon />}
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Button>Download {name}</Button>
      </a>
    </EmptyState>
  );
};

const FilePreview = ({ url, name, mimeType }: FilePreviewProps) => {
  mimeType = mimeType || "";
  const type = fileType(mimeType);

  switch (type) {
    case "pdf":
      return <PdfViewer file={url} />;
    case "image":
      return <ImagePreview url={url} name={name} />;
    case "audio":
      return <AuditPreview url={url} name={name} mimeType={mimeType} />;
    case "video":
      return <VideoPreview url={url} name={name} mimeType={mimeType} />;
    case "doc":
    case "excel":
    case "powerpoint":
      return <OfficeViewer url={url} />;
    default:
      return <UnknownPreview url={url} name={name} mimeType={mimeType} />;
  }
};

export default FilePreview;
