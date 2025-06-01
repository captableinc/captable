"use server";

import { db, eq, updates } from "@captable/db";
import EditorWrapper from "./editor-wrapper";

const getUpdate = async (publicId: string) => {
  const result = await db.query.updates.findFirst({
    where: eq(updates.publicId, publicId),
  });

  if (!result) {
    throw new Error(`Update with publicId ${publicId} not found`);
  }

  return result;
};

const UpdatePage = async ({
  params,
}: {
  params: Promise<{ publicId: string; updatePublicId: string }>;
}) => {
  const { publicId, updatePublicId } = await params;
  if (updatePublicId === "new") {
    return <EditorWrapper companyPublicId={publicId} mode="new" />;
  }
  const update = await getUpdate(updatePublicId);

  return (
    <EditorWrapper companyPublicId={publicId} update={update} mode="edit" />
  );
};

export default UpdatePage;
