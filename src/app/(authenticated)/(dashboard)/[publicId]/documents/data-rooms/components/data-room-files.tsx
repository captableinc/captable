"use client";

import EmptyState from "@/components/common/empty-state";
import type { ExtendedDataRoomRecipientType } from "@/components/common/share-modal";
import DataRoomFileExplorer from "@/components/documents/data-room/explorer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ShareContactType } from "@/schema/contacts";
import { api } from "@/trpc/react";

import { Icon } from "@/components/ui/icon";
import type { Bucket, DataRoom } from "@prisma/client";
import { RiShareLine } from "@remixicon/react";
import { useDebounceCallback } from "usehooks-ts";

import { pushModal } from "@/components/modals";
import {
  RiFolder3Fill as FolderIcon,
  RiAddFill,
  RiUploadCloudLine,
} from "@remixicon/react";
import Link from "next/link";
import DataRoomUploader from "./data-room-uploader";

type DataRoomFilesProps = {
  dataRoom: DataRoom;
  documents: Bucket[];
  companyPublicId: string;
  contacts: ShareContactType[];
};

const DataRoomFiles = ({
  dataRoom,
  documents,
  contacts,
  companyPublicId,
}: DataRoomFilesProps) => {
  const { mutateAsync: saveDataRoomMutation } = api.dataRoom.save.useMutation();

  const debounced = useDebounceCallback(async (name) => {
    await saveDataRoomMutation({
      name,
      publicId: dataRoom.publicId,
    });
  }, 500);

  return (
    <div className="mt-2">
      <div className="flex flex-col gap-y-8">
        <div className="container mx-auto flex items-center justify-between gap-y-2 px-4">
          <form>
            <div className="gap-y-3">
              <div className="flex w-full font-medium">
                <FolderIcon
                  className="mr-3 h-6 w-6 text-primary/60"
                  aria-hidden="true"
                />
                <Link
                  href={`/${companyPublicId}/documents/data-rooms`}
                  className="h4 text-primary/70 hover:underline"
                >
                  Data room
                </Link>
                <span className="h4 ml-2 text-primary/70">/</span>
                <input
                  name="title"
                  required
                  type="text"
                  className="h4 min-w-[300px] bg-transparent px-2 text-gray-800 outline-none focus:ring-0	focus:ring-offset-0"
                  placeholder={`Data room's folder name`}
                  defaultValue={dataRoom.name}
                  onChange={async (e) => {
                    const name = e.target.value;
                    await debounced(name);
                  }}
                />
              </div>
            </div>
          </form>

          {documents.length > 0 && (
            <div className="flex gap-3">
              <Button
                variant={"outline"}
                onClick={() => {
                  pushModal("ShareDataRoomModal", {
                    contacts: contacts,
                    dataRoom: dataRoom,
                  });
                }}
              >
                <Icon name="share-line" className="mr-2 h-5 w-5" />
                Share
              </Button>

              <DataRoomUploader
                dataRoom={dataRoom}
                companyPublicId={companyPublicId}
                trigger={
                  <Button>
                    <Icon name="add-fill" className="mr-2 h-5 w-5" />
                    Upload
                  </Button>
                }
              />
            </div>
          )}
        </div>

        <div>
          {documents.length > 0 ? (
            <Card className="p-4">
              <DataRoomFileExplorer
                documents={documents}
                companyPublicId={companyPublicId}
                dataRoomPublicId={dataRoom.publicId}
              />
            </Card>
          ) : (
            <EmptyState
              icon={<Icon name="upload-cloud-line" />}
              title="Data room is empty!"
              subtitle="Upload one or many documents to get started."
            >
              <DataRoomUploader
                dataRoom={dataRoom}
                companyPublicId={companyPublicId}
                trigger={
                  <Button>
                    <Icon name="add-fill" className="mr-2 h-5 w-5" />
                    Upload documents
                  </Button>
                }
              />
            </EmptyState>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataRoomFiles;
