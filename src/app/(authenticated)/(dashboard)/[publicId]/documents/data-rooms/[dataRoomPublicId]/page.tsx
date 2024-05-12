'use server'

import { type ExtendedRecipientType } from '@/components/common/share-modal'
import { api } from '@/trpc/server'
import type { Bucket, DataRoom } from '@prisma/client'
import { notFound } from 'next/navigation'
import DataRoomFiles from '../components/data-room-files'

const DataRoomSettinsPage = async ({
  params: { publicId, dataRoomPublicId },
}: {
  params: { publicId: string; dataRoomPublicId: string }
}) => {
  const { dataRoom, documents, recipients } =
    await api.dataRoom.getDataRoom.query({
      dataRoomPublicId,
      include: {
        company: false,
        recipients: true,
        documents: true,
      },
    })
  const contacts = await api.common.getContacts.query()

  if (!dataRoom) {
    return notFound()
  }

  return (
    <DataRoomFiles
      contacts={contacts}
      dataRoom={dataRoom as DataRoom}
      recipients={recipients as ExtendedRecipientType[]}
      documents={documents as Bucket[]}
      companyPublicId={publicId}
    />
  )
}

export default DataRoomSettinsPage
