"use server";

import { db } from "@/server/db";
import Editor from "@/components/update/editor";

const getUpdate = async (publicId: string) => {
  return await db.update.findFirstOrThrow({
    where: { publicId },
  });
};

const UpdatePage = async ({
  params: { publicId, updatePublicId },
}: {
  params: { publicId: string; updatePublicId: string };
}) => {
  const update = await getUpdate(updatePublicId);
  return <Editor companyPublicId={publicId} update={update} />;
};

export default UpdatePage;
