"use client";

import { dayjsExt } from "@/common/dayjs";
import Loading from "@/components/common/loading";
import ShareModal, {
  type ExtendedRecipientType,
} from "@/components/common/share-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownButton } from "@/components/ui/dropdown-button";
import { useToast } from "@/components/ui/use-toast";
import type { ShareContactType, ShareRecipientType } from "@/schema/contacts";
import { api } from "@/trpc/react";
import type { Block } from "@blocknote/core";
import type { Update } from "@prisma/client";
import { RiArrowDownSLine } from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import "@/styles/editor.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { env } from "next-runtime-env";

type UpdatesEditorProps = {
  update?: Update;
  mode: "edit" | "new";
  contacts?: ShareContactType[];
  recipients?: ExtendedRecipientType[];
  companyPublicId?: string;
};

const UpdatesEditor = ({
  mode,
  update,
  contacts,
  recipients,
  companyPublicId,
}: UpdatesEditorProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const baseUrl = env("NEXT_PUBLIC_BASE_URL");

  const date = new Date();
  const formattedDate = dayjsExt(date).format("MMM YYYY");

  const defaultContent: Block[] = [
    {
      id: "1",
      type: "paragraph",
      props: {
        textColor: "default",
        textAlignment: "left",
        backgroundColor: "default",
      },
      content: [
        {
          text: "Hello, investors! 👋",
          type: "text",
          styles: {
            bold: true,
          },
        },
      ],
      children: [],
    },
    {
      id: "2",
      type: "paragraph",
      props: {
        textColor: "default",
        textAlignment: "left",
        backgroundColor: "default",
      },
      content: [],
      children: [],
    },
    {
      id: "3",
      type: "paragraph",
      props: {
        textColor: "default",
        textAlignment: "left",
        backgroundColor: "default",
      },
      content: [
        {
          text: "Here's a quick update on what's been happening at Captable, Inc. this month. We're excited to share that we've hit a major milestone! Our team has been hard at work and we're proud to announce that we've successfully launched our new product feature.",
          type: "text",
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: "4",
      type: "paragraph",
      props: {
        textColor: "default",
        textAlignment: "left",
        backgroundColor: "default",
      },
      content: [],
      children: [],
    },
    {
      id: "5",
      type: "paragraph",
      props: {
        textColor: "default",
        textAlignment: "left",
        backgroundColor: "default",
      },
      content: [
        {
          text: "We're grateful for your continued support and we're looking forward to sharing more updates with you soon.",
          type: "text",
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: "6",
      type: "paragraph",
      props: {
        textColor: "default",
        textAlignment: "left",
        backgroundColor: "default",
      },
      content: [],
      children: [],
    },
    {
      id: "7",
      type: "paragraph",
      props: {
        textColor: "default",
        textAlignment: "left",
        backgroundColor: "default",
      },
      content: [
        {
          text: "Best,",
          type: "text",
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: "8",
      type: "paragraph",
      props: {
        textColor: "default",
        textAlignment: "left",
        backgroundColor: "default",
      },
      content: [
        {
          text: "The Captable, Inc. Team",
          type: "text",
          styles: {},
        },
      ],
      children: [],
    },
  ];

  const [title, setTitle] = useState<string>(update?.title ?? "");
  const [content, setContent] = useState<Block[]>(
    (update?.content as Block[]) ?? defaultContent,
  );
  const [html, setHtml] = useState<string>(update?.html ?? "");
  const [loading, setLoading] = useState<boolean>(false);

  const editor = useCreateBlockNote({
    initialContent: content,
  });

  const draftMutation = api.update.save.useMutation({
    onSuccess: ({ publicId, success, message }) => {
      toast({
        variant: success ? "default" : "destructive",
        title: success
          ? "🎉 Successfully saved"
          : "Uh oh! Something went wrong.",
        description: message,
      });

      if (!success) return;

      if (update) {
        router.refresh();
      } else {
        router.push(`/${companyPublicId}/updates/${publicId}`);
      }
    },

    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },

    onSettled: () => {
      setLoading(false);
    },
  });

  const cloneMutation = api.update.clone.useMutation({
    onSuccess: ({ publicId, success, message }) => {
      toast({
        variant: success ? "default" : "destructive",
        title: success
          ? "🎉 Successfully cloned"
          : "Uh oh! Something went wrong.",
        description: message,
      });

      if (!success) return;

      router.push(`/${companyPublicId}/updates/${publicId}`);
    },

    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },

    onSettled: () => {
      setLoading(false);
    },
  });

  const saveAsDraft = () => {
    setLoading(true);

    const data = {
      title,
      html,
      content,
      publicId: update?.publicId,
    };

    draftMutation.mutate(data);
  };

  const cloneUpdate = () => {
    setLoading(true);

    const data = {
      title,
      html,
      content,
    };

    cloneMutation.mutate(data);
  };

  const { mutateAsync: shareUpdateMutation } = api.update.share.useMutation({
    onSuccess: () => {
      router.refresh();

      toast({
        title: "Successfully shared!",
        description: "Update successfully shared.",
      });
    },

    onError: (error) => {
      toast({
        title: "Oops! Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutateAsync: unshareUpdateMutation } = api.update.unShare.useMutation(
    {
      onSuccess: (r) => {
        router.refresh();

        toast({
          title: "Removed access!",
          description: r.message,
        });
      },

      onError: (error: { message: string }) => {
        toast({
          title: "Oops! Something went wrong.",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );

  return (
    <div className="flex flex-col gap-y-3">
      <form className="flex items-center justify-between gap-y-2">
        <div className="gap-y-3">
          <div className="flex w-full font-medium">
            <Badge variant="warning" className="mr-2">
              Draft
            </Badge>
            <Link
              href={`/${companyPublicId}/updates`}
              className="h4 text-primary/70 hover:underline"
            >
              Updates /{" "}
            </Link>
            <input
              name="title"
              required
              type="text"
              className="h4 min-w-[300px] bg-transparent px-2 text-gray-800 outline-none focus:ring-0	focus:ring-offset-0"
              placeholder={`Investor update - ${formattedDate}`}
              defaultValue={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>

          {update && (
            <p className="ml-[60px] min-h-5 text-sm text-muted-foreground">
              Last saved {dayjsExt().to(update.updatedAt)}
            </p>
          )}
        </div>

        <div>
          <DropdownButton
            buttonSlot={
              <Fragment>
                <span className="sr-only">Save and continue</span>
                Save and continue
                <RiArrowDownSLine className="ml-1 h-5 w-5" />
              </Fragment>
            }
          >
            <ul>
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  type="submit"
                  onClick={saveAsDraft}
                >
                  Save as draft
                </Button>
              </li>

              {/* TODO - implement this feature */}
              {/* <li>
                <Button variant="ghost" size="sm">
                  Make it public
                </Button>
              </li> */}

              {update && mode === "edit" && recipients && contacts && (
                <li>
                  <ShareModal
                    recipients={recipients}
                    contacts={contacts}
                    baseLink={`${baseUrl}/updates/${update?.publicId}`}
                    title={`Share - "${title}"`}
                    subtitle="Share this update with team members, stakeholders and others."
                    onShare={async ({ selectedContacts, others }) => {
                      await shareUpdateMutation({
                        updateId: update?.id,
                        selectedContacts:
                          selectedContacts as ShareRecipientType[],
                        others: others as ShareRecipientType[],
                      });
                    }}
                    removeAccess={async ({ recipientId }) => {
                      await unshareUpdateMutation({
                        updateId: update?.id,
                        recipientId,
                      });
                    }}
                    trigger={
                      <Button variant="ghost" size="sm">
                        Share this update
                      </Button>
                    }
                  />
                </li>
              )}

              {update && (
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="submit"
                    onClick={cloneUpdate}
                  >
                    Clone this update
                  </Button>
                </li>
              )}
            </ul>
          </DropdownButton>
        </div>
      </form>

      <Card className="mx-auto mt-3 min-h-[80vh] w-[28rem] sm:w-[38rem] md:w-full	">
        <BlockNoteView
          className="py-5"
          editor={editor}
          theme="light"
          onChange={async () => {
            setContent(editor.document);
            const html = await editor.blocksToHTMLLossy(editor.document);
            setHtml(html);
          }}
        />
      </Card>

      {loading && <Loading />}
    </div>
  );
};

export default UpdatesEditor;
