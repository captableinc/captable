"use server";

import Editor from "@/components/update/editor";
import { db } from "@/server/db";

const getUpdate = async (publicId: string) => {
  return await db.update.findFirstOrThrow({
    where: { publicId },
    include: {
      _count: {
        select: {
          recipients: true,
        },
      },
    },
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
