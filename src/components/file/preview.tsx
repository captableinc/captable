import EmptyState from '@/components/common/empty-state'
import { Button } from '@/components/ui/button'
import { PdfViewer } from '@/components/ui/pdf-viewer'
import { RiFileUnknowFill as UnknownFileIcon } from '@remixicon/react'

type FilePreviewProps = {
  name: string
  url: string
  mimeType?: string
}

const ImagePreview = ({ url, name }: FilePreviewProps) => {
  return <img className="rounded" src={url} alt={name} />
}

const AuditPreview = ({ url, name, mimeType }: FilePreviewProps) => {
  return (
    <audio controls className="w-full">
      <source src={url} type={mimeType} />
      Your browser does not support the audio element.
    </audio>
  )
}

const VideoPreview = ({ url, name, mimeType }: FilePreviewProps) => {
  return (
    <video controls className="w-full rounded">
      <source src={url} type={mimeType} />
      Your browser does not support the video type.
    </video>
  )
}

const UnknownPreview = ({ url, name, mimeType }: FilePreviewProps) => {
  return (
    <EmptyState
      title="File type not supported"
      subtitle={`This file type - ${mimeType} is not yet supported by the previewer. You can download the file by clicking the button below.`}
      icon={<UnknownFileIcon />}
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Button>Download {name}</Button>
      </a>
    </EmptyState>
  )
}

const FilePreview = ({ url, name, mimeType }: FilePreviewProps) => {
  mimeType = mimeType || ''

  switch (true) {
    case mimeType.includes('pdf'):
      return <PdfViewer file={url} />
    case mimeType.startsWith('image'):
      return <ImagePreview url={url} name={name} />
    case mimeType.startsWith('audio'):
      return <AuditPreview url={url} name={name} mimeType={mimeType} />
    case mimeType.startsWith('video'):
      return <VideoPreview url={url} name={name} mimeType={mimeType} />
    default:
      return <UnknownPreview url={url} name={name} mimeType={mimeType} />
  }
}

export default FilePreview
