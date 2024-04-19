"use client";

import Loading from "@/components/common/loading";
import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fragment, useState } from "react";

export type RecipientUserType = {
  id?: string;
  name?: string;
  email: string;
};

export type ShareRecipientsType = {
  others: Array<RecipientUserType>;
  members: Array<RecipientUserType>;
  stakeholders: Array<RecipientUserType>;
};

export type DefaultShareProps = {
  title: string;
  subtitle: string;
  trigger: React.ReactNode;
};

const Share = ({ title, subtitle, trigger }: DefaultShareProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Modal
      size="lg"
      title={title}
      subtitle={subtitle}
      trigger={trigger}
      dialogProps={{
        open,
        onOpenChange: (val) => {
          setOpen(val);
        },
      }}
    >
      <Fragment>
        {loading ? (
          <Loading />
        ) : (
          <div className="my-3">
            <Input
              type="text"
              placeholder="Search stakeholders, members or add email addresses"
              className="w-full px-5 py-6"
            />

            <h5 className="mb-3 mt-6">People with access</h5>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <img
                  src="https://randomuser.me/api/portraits/men/41.jpg"
                  alt="User"
                  className="h-8 w-8 rounded-full"
                />
                <span className="font-medium">John Doe</span>

                <span className="text-gray-500">
                  <span className="text-xs">
                    <span className="font-medium">
                      <span className="text-gray-900">Owner</span>
                    </span>
                  </span>
                </span>

                <button className="text-blue-500">Remove</button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <div className="space-x-4">
                <Button variant={"outline"}>Cancel</Button>

                <Button type="submit">Send</Button>
              </div>
            </div>
          </div>
        )}
      </Fragment>
    </Modal>
  );
};

export default Share;
