"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import EmptyOverview from "@/components/overview/empty";

const OverviewPage = () => {
  const params = useParams<{ publicId: string }>();
  const { data } = useSession();
  const firstName = data?.user.name?.split(" ")[0];
  const publicCompanyId = params.publicId;

  return (
    <>
      <EmptyOverview firstName={firstName} publicCompanyId={publicCompanyId} />
    </>
  );
};

export default OverviewPage;
