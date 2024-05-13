"use server";
import type { ExtendedRecipientType } from "@/components/common/share-modal";
import Editor from "@/components/update/editor";
import { db } from "@/server/db";
import { api } from "@/trpc/server";

const getUpdate = async (publicId: string) => {
  return await db.update.findFirstOrThrow({
    where: { publicId },
  });
};

const getContacts = async () => {
  return await api.common.getContacts.query();
};

const UpdatePage = async ({
  params: { publicId, updatePublicId },
}: {
  params: { publicId: string; updatePublicId: string };
}) => {
  const contacts = await getContacts();

  if (updatePublicId === "new") {
    return <Editor companyPublicId={publicId} contacts={contacts} mode="new" />;
  } else {
    const update = await getUpdate(updatePublicId);
    const recipients = await api.update.getRecipiants.query({
      updateId: update?.id,
      publicUpdateId: update.publicId,
    });

    return (
      <Editor
        companyPublicId={publicId}
        update={update}
        contacts={contacts}
        recipients={recipients as object[] as ExtendedRecipientType[]}
        mode="edit"
      />
    );
  }
};

export default UpdatePage;
