"use server";

import Editor from "@/components/update/editor";

const NewUpdatePage = async ({
  params: { publicId },
}: {
  params: { publicId: string };
}) => {
  return <Editor companyPublicId={publicId} />;
};

export default NewUpdatePage;
