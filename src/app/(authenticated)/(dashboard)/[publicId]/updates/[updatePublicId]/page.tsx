"use server";
import { db } from "@/server/db";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("../../../../../../components/update/editor"),
  { ssr: false },
);

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
  if (updatePublicId === "new") {
    return <Editor companyPublicId={publicId} mode="new" />;
  }
  const update = await getUpdate(updatePublicId);

  return <Editor companyPublicId={publicId} update={update} mode="edit" />;
};

export default UpdatePage;
