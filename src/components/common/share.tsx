"use client";
import Loading from "@/components/common/loading";
import { Fragment, useState } from "react";

export type RecipientUserType = {
  id?: string;
  name?: string;
  email: string;
};

export type RecipientsType = {
  others: Array<RecipientUserType>;
  members: Array<RecipientUserType>;
  stakeholders: Array<RecipientUserType>;
};

const Share = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [recipients, setRecipients] = useState<RecipientsType>({
    others: [],
    members: [],
    stakeholders: [],
  });

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <div className="my-3">
          <span>Shares</span>
        </div>
      )}
    </Fragment>
  );
};

export default Share;
