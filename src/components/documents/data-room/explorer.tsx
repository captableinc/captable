import FileIcon from "@/components/common/file-icon";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Bucket } from "@prisma/client";
import Link from "next/link";

type DocumentExplorerProps = {
  companyPublicId: string;
  dataRoomPublicId: string;
  documents: Bucket[];
};

const DataRoomFileExplorer = ({
  documents,
  companyPublicId,
  dataRoomPublicId,
}: DocumentExplorerProps) => {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <ul
        role="list"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
      >
        {documents.map((document) => (
          <li key={document.id}>
            <Link
              href={`/${companyPublicId}/documents/${document.id}`}
              className="col-span-1 flex cursor-pointer rounded-md shadow-sm hover:shadow-lg"
            >
              <div
                className={cn(
                  "flex w-14 flex-shrink-0 items-center justify-center rounded-l-md border text-sm font-medium ",
                )}
              >
                <FileIcon type={document.mimeType} />
              </div>
              <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-y border-r border-gray-200 bg-white">
                <div className="text-md flex-1 truncate px-4 py-2">
                  <span className="font-medium text-gray-900 hover:text-gray-600">
                    {document.name}
                  </span>
                  <p className="text-xs text-gray-500">{`${(
                    document.size /
                    1024 /
                    1024
                  ).toFixed(2)} MB`}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default DataRoomFileExplorer;
