"use client";

import EmptyState from "@/components/common/empty-state";
import ShareModal, {
  type ExtendedRecipientType,
} from "@/components/common/share-modal";
import DataRoomFileExplorer from "@/components/documents/data-room/explorer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ShareContactType, ShareRecipientType } from "@/schema/contacts";
import { api } from "@/trpc/react";
import { toast } from "sonner";

import type { Bucket, DataRoom } from "@prisma/client";
import { RiShareLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";

import {
  RiFolder3Fill as FolderIcon,
  RiAddFill,
  RiUploadCloudLine,
} from "@remixicon/react";
import { env } from "next-runtime-env";
import Link from "next/link";
import DataRoomUploader from "./data-room-uploader";

type DataRoomFilesProps = {
  dataRoom: DataRoom;
  documents: Bucket[];
  recipients: ExtendedRecipientType[];
  companyPublicId: string;
  contacts: ShareContactType[];
};

const DataRoomFiles = ({
  dataRoom,
  documents,
  contacts,
  recipients,
  companyPublicId,
}: DataRoomFilesProps) => {
  const router = useRouter();
  const baseUrl = env("NEXT_PUBLIC_BASE_URL");
  const { mutateAsync: saveDataRoomMutation } = api.dataRoom.save.useMutation();
  const { mutateAsync: shareDataRoomMutation } = api.dataRoom.share.useMutation(
    {
      onSuccess: () => {
        router.refresh();
        toast.success("Data room successfully shared.");
      },

      onError: (error) => {
        toast.error(error.message);
      },
    },
  );

  const { mutateAsync: unShareDataRoomMutation } =
    api.dataRoom.unShare.useMutation({
      onSuccess: () => {
        router.refresh();
        toast.success("Successfully removed access to data room.");
      },

      onError: (error) => {
        toast.error(error.message);
      },
    });

  const debounced = useDebounceCallback(async (name) => {
    await saveDataRoomMutation({
      name,
      publicId: dataRoom.publicId,
    });
  }, 500);

  return (
    <div className="mt-2">
      <div className="flex flex-col gap-y-8">
        <form className="container mx-auto flex items-center justify-between gap-y-2 px-4">
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

          {documents.length > 0 && (
            <div className="flex gap-3">
              <ShareModal
                recipients={recipients}
                contacts={contacts}
                baseLink={`${baseUrl}/data-rooms/${dataRoom.publicId}`}
                title={`Share data room - "${dataRoom.name}"`}
                subtitle="Share this data room with others."
                onShare={async ({ selectedContacts, others }) => {
                  await shareDataRoomMutation({
                    dataRoomId: dataRoom.id,
                    selectedContacts: selectedContacts as ShareRecipientType[],
                    others: others as ShareRecipientType[],
                  });
                }}
                removeAccess={async ({ recipientId }) => {
                  await unShareDataRoomMutation({
                    dataRoomId: dataRoom.id,
                    recipientId,
                  });
                }}
                trigger={
                  <Button variant={"outline"}>
                    <RiShareLine className="mr-2 h-5 w-5" />
                    Share
                  </Button>
                }
              />

              <DataRoomUploader
                dataRoom={dataRoom}
                companyPublicId={companyPublicId}
                trigger={
                  <Button>
                    <RiAddFill className="mr-2 h-5 w-5" />
                    Upload
                  </Button>
                }
              />
            </div>
          )}
        </form>

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
              icon={<RiUploadCloudLine />}
              title="Data room is empty!"
              subtitle="Upload one or many documents to get started."
            >
              <DataRoomUploader
                dataRoom={dataRoom}
                companyPublicId={companyPublicId}
                trigger={
                  <Button size="lg">
                    <RiAddFill className="mr-2 h-5 w-5" />
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
