"use server";
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
    return <Editor companyPublicId={publicId} contacts={contacts} />;
  } else {
    const update = await getUpdate(updatePublicId);

    return (
      <Editor companyPublicId={publicId} update={update} contacts={contacts} />
    );
  }
};

export default UpdatePage;
