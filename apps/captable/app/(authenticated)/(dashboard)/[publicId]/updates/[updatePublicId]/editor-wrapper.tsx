"use client";

import type { Update } from "@captable/db";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("../../../../../../components/update/editor"),
  { ssr: false },
);

type EditorWrapperProps = {
  companyPublicId: string;
  mode: "new" | "edit";
  update?: Update;
};

const EditorWrapper = ({
  companyPublicId,
  mode,
  update,
}: EditorWrapperProps) => {
  return (
    <Editor companyPublicId={companyPublicId} update={update} mode={mode} />
  );
};

export default EditorWrapper;
