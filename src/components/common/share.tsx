"use client";

// import Fuse from 'fuse.js'
import Loading from "@/components/common/loading";
import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import MultipleSelector, { type Option } from "@/components/ui/multi-selector";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
import { type ContactsType } from "@/types/contacts";
import {
  RiCheckLine as CheckIcon,
  RiDeleteBin2Line as DeleteIcon,
  RiLink as LinkIcon,
} from "@remixicon/react";
import { Fragment, useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";

export type Props = {
  title: string;
  subtitle: string;
  trigger: React.ReactNode;
  contacts: ContactsType;
};

const Share = ({ title, subtitle, trigger, contacts }: Props) => {
  // const fuse = new Fuse(
  //   contacts
  //   , {
  //     keys: ["name", "email"],
  //     includeScore: true,
  //   }
  // );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedText, copy] = useCopyToClipboard();
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [selected, setSelected] = useState<Option[]>([]);

  const copyToClipboard = (idx: number, text: string) => {
    copy(text)
      .then(() => {
        setCopiedIdx(idx);

        setTimeout(() => {
          setCopiedIdx(null);
        }, 1000);
      })
      .catch(() => {
        setCopiedIdx(null);
      });
  };

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
            <MultipleSelector
              className="bg-white py-3"
              selected={selected}
              setSelected={setSelected}
              options={[
                { label: "nextjs", value: "nextjs" },
                { label: "React", value: "react" },
                { label: "Remix", value: "remix" },
                { label: "Vite", value: "vite" },
                { label: "Nuxt", value: "nuxt" },
                { label: "Vue", value: "vue" },
                { label: "Svelte", value: "svelte" },
                { label: "Angular", value: "angular" },
                { label: "Ember", value: "ember", disable: true },
                { label: "Gatsby", value: "gatsby", disable: true },
                { label: "Astro", value: "astro" },
              ]}
              placeholder="Search stakeholders, members or add email addresses"
              creatable
              emptyIndicator={
                <p className="text-center text-sm leading-10 text-gray-600 dark:text-gray-400">
                  no results found.
                </p>
              }
            />

            <h5 className="mt-6 font-medium">People with access</h5>

            <ul>
              <li className="group flex items-center justify-between gap-x-2 py-2">
                <div className="flex items-center gap-2">
                  <img
                    src="https://randomuser.me/api/portraits/men/41.jpg"
                    alt="User"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="flex flex-col font-medium">
                    <span className="text-sm">John Doe</span>
                    <span className="text-xs text-primary/50">Member</span>
                  </span>
                </div>

                <div className="ml-auto content-end justify-end object-right">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant={"secondary"}
                      className=" hidden text-sm font-medium text-red-500/70 hover:text-red-500 group-hover:flex"
                    >
                      <DeleteIcon className="h-4 w-4" />
                      Remove
                    </Button>
                    <Button
                      size="sm"
                      variant={"secondary"}
                      className="flex text-sm font-medium text-primary/70 hover:text-primary/90"
                      onClick={() =>
                        copyToClipboard(1, "https://example.com/2")
                      }
                    >
                      <Fragment>
                        {copiedIdx === 1 ? (
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <LinkIcon className="h-4 w-4" />
                        )}
                        Copy link
                      </Fragment>
                    </Button>
                  </div>
                </div>
              </li>

              {/*  */}
              <li className="group flex items-center justify-between gap-x-2 py-2">
                <div className="flex items-center gap-2">
                  <img
                    src="https://randomuser.me/api/portraits/men/41.jpg"
                    alt="User"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="flex flex-col font-medium">
                    <span className="text-sm">John Doe</span>
                    <span className="text-xs text-primary/50">Member</span>
                  </span>
                </div>

                <div className="ml-auto content-end justify-end object-right">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant={"secondary"}
                      className=" hidden text-sm font-medium text-red-500/70 hover:text-red-500 group-hover:flex"
                    >
                      <DeleteIcon className="h-4 w-4" />
                      Remove
                    </Button>
                    <Button
                      size="sm"
                      variant={"secondary"}
                      className="flex text-sm font-medium text-primary/70 hover:text-primary/90"
                      onClick={() =>
                        copyToClipboard(2, "https://example.com/1")
                      }
                    >
                      <Fragment>
                        {copiedIdx === 2 ? (
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <LinkIcon className="h-4 w-4" />
                        )}
                        Copy link
                      </Fragment>
                    </Button>
                  </div>
                </div>
              </li>
            </ul>

            <div className="mt-6 flex justify-end">
              <div className="space-x-4">
                <Button
                  variant={"outline"}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>

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
