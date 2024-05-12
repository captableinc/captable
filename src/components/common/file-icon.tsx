'use client'

import {
  RiFileCloudFill,
  RiFileExcelFill,
  RiFileImageFill,
  RiFileMusicFill,
  RiFilePdf2Fill,
  RiFilePptFill,
  RiFileVideoFill,
  RiFileWordFill,
} from '@remixicon/react'

type FileIconProps = {
  type: string
}

const FileIcon = ({ type }: FileIconProps) => {
  switch (true) {
    case type.includes('image'):
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-pink-100">
          <RiFileImageFill className="h-5 w-5 text-pink-500" />
        </div>
      )

    case type.includes('audio'):
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-100">
          <RiFileMusicFill className="h-5 w-5 text-indigo-500" />
        </div>
      )

    case type.includes('video'):
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-rose-100">
          <RiFileVideoFill className="h-5 w-5 text-rose-500" />
        </div>
      )

    case type.includes('powerpoint') || type.includes('presentation'):
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-100">
          <RiFilePptFill className="h-5 w-5 text-orange-500" />
        </div>
      )

    case type.includes('rtf'):
    case type.includes('doc'):
    case type.includes('word'):
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100">
          <RiFileWordFill className="h-5 w-5 text-blue-500" />
        </div>
      )

    case type.includes('csv'):
    case type.includes('excel'):
    case type.includes('sheet'):
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100">
          <RiFileExcelFill className="h-5 w-5 text-emerald-500" />
        </div>
      )

    case type.includes('pdf'):
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-100">
          <RiFilePdf2Fill className="h-5 w-5 text-red-500" />
        </div>
      )

    default:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100">
          <RiFileCloudFill className="h-5 w-5 text-blue-500" />
        </div>
      )
  }
}

export default FileIcon
