"use client";

import { useParams } from "next/navigation";
import ShareClassForm from "../components/form";

const NewShareClass = () => {
  const params = useParams<{ publicId: string }>();
  const { publicId } = params;

  return (
    <>
      <header>
        <h3 className="font-medium">Create an equity plan</h3>
        <p className="text-sm text-muted-foreground">
          Create a new equity plan for your company
        </p>
      </header>

      <ShareClassForm publicId={publicId} />
    </>
  );
};

export default NewShareClass;
