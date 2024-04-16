"use client";

import {
  privateToggleWarning,
  publicToggleWarning,
  UpdateType,
} from "@/lib/constants";
import {
  BadgeColorProvider,
  BadgeStatusProvider,
  getShareableUpdateLink,
  isEditingPlaygorund,
  isNewPlayground,
  onCopyClipboard,
  StatusActionProvider,
} from "@/lib/utils";

import { dayjsExt } from "@/common/dayjs";
import Loading from "@/components/shared/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownButton } from "@/components/ui/dropdown-button";
import { useToast } from "@/components/ui/use-toast";
import { UpdateStatusEnum } from "@/prisma-enums";
import "@/styles/editor.css";
import { api } from "@/trpc/react";
import { type Block } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import type { Update } from "@prisma/client";
import { RiArrowDownSLine } from "@remixicon/react";
import { usePathname, useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { CopyToClipboard } from "./copy-to-clipboard";
import { defaultContent } from "./data";
import InvestorUpdateModal from "./investor-update-modal";
import { ToggleStatusAlertDialog } from "./toggle-status-alert";

const companyLogo = `
https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSByNdl13RmMtZBskJJp1ZU6zY1a_oGqv_7shJQzveLraz2H-7VmteLWeohoRySB-jwUNo&usqp=CAU
`;
const avatar = `
https://media.istockphoto.com/id/1399565382/photo/young-happy-mixed-race-businessman-standing-with-his-arms-crossed-working-alone-in-an-office.webp?b=1&s=170667a&w=0&k=20&c=ZAXJYLesh6gSd9huAgpy6rjpR4z-IFVH9MpxrKIXCrs=
`;

interface EnrichedUpdate extends Update {
  _count: {
    recipients: number;
  };
}

type UpdatesEditorProps = {
  update?: EnrichedUpdate;
  companyPublicId?: string;
};

const UpdatesEditor = ({ update, companyPublicId }: UpdatesEditorProps) => {
  console.log({ update });
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();

  const date = new Date();
  const formattedDate = dayjsExt(date).format("MMM YYYY");
  const [title, setTitle] = useState<string>(
    update?.title ?? "Cash-Dividend-2024",
  );
  const [content, setContent] = useState<Block[]>(
    (update?.content as Block[]) ?? defaultContent,
  );

  const [showClipboard, setShowClipBoard] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [html, setHtml] = useState<string>(update?.html ?? "<p></p>");
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const authorProfile = api.member.getProfile.useQuery();

  const author = authorProfile?.data;
  const status = update?.status;
  const publicId = update?.publicId;
  const recipientsCount = update?._count?.recipients;
  const emailSentAt = update?.sentAt;
  const hasRecipientsCount = !!recipientsCount;
  const hasFirstEmailSent = !!emailSentAt;
  const canEdit =
    (!hasRecipientsCount && !hasFirstEmailSent) || !hasRecipientsCount; // @TODO(some concerns here)
  const isDraft = status === UpdateStatusEnum.DRAFT;
  const isUpdatePage = isEditingPlaygorund(pathname, publicId);
  const isNewPage = isNewPlayground(pathname, "/updates/new");
  const isDisabled = !isDraft && isUpdatePage;
  const isTogglingAllowed = status && status !== UpdateStatusEnum.DRAFT;

  console.log({
    hasRecipientsCount,
    hasFirstEmailSent,
    canEdit,
    isNewPage,
    isUpdatePage,
  });

  const editor = useCreateBlockNote({
    initialContent: content,
  });

  useEffect(() => {
    // check content editing permission
    if (pathname && isNewPage) {
      setIsEditable(true);
    } else {
      isUpdatePage && canEdit ? setIsEditable(true) : setIsEditable(false);
    }
  }, [update, pathname]);

  useEffect(() => {
    // check clipboard visibility
    if (status) {
      status === UpdateStatusEnum.PUBLIC
        ? setShowClipBoard(true)
        : setShowClipBoard(false);
    }
  }, [status]);

  const draftMutation = api.update.save.useMutation({
    onSuccess: async ({ publicId, success, message }) => {
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

  const statusMutation = api.update.toggleStatus.useMutation({
    onSuccess: async ({ success, message, updatedStatus }) => {
      if (!success || !message || !updatedStatus) return;
      toast({
        variant: "default",
        title: "🎉 Success",
        description: message,
      });
      if (
        updatedStatus === UpdateStatusEnum.PUBLIC ||
        updatedStatus === UpdateStatusEnum.PRIVATE
      ) {
        router.refresh();
      }
    },
    onError: async () => {
      toast({
        variant: "destructive",
        title: "Toggle failed.",
        description: "Uh oh! Something went wrong.",
      });
    },
  });

  const sendMutation = api.update.share.useMutation({
    onSuccess: async ({ publicId, success, message }) => {
      toast({
        variant: success ? "default" : "destructive",
        title: success
          ? "🎉 Successfully shared."
          : "Uh oh! Something went wrong.",
        description: message,
      });
      if (!success) return;
      if (update) {
        setOpen(false);
        setIsEditable(false);
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
  });

  const saveAsDraft = async () => {
    setLoading(true);
    const data = {
      title,
      html,
      content,
      publicId: update?.publicId,
    };
    draftMutation.mutate(data);
  };

  type sendThisUpdateProps = {
    stakeholders:
      | {
          id: string;
          email: string;
        }[]
      | [];
  };
  const sendThisUpdate = async (data: sendThisUpdateProps) => {
    if (!data.stakeholders.length) return;
    if (!author) return;
    const { stakeholders } = data;
    if (update) {
      const _data = {
        publicId: update.publicId,
        updateId: update.id,
        newStakeholders: stakeholders,
        html,
        title,
        content,
        isDraft,
        authorName: author.fullName,
        authorImage: author.avatarUrl || avatar,
        authorTitle: author.jobTitle ?? "Co-founder & Ceo",
        authorWorkEmail: author.workEmail,
        companyName: author.companyName,
        companyLogo: author.companyLogo ?? companyLogo,
        isFirstEmailSent: !!update?.sentAt,
      };
      await sendMutation.mutateAsync({
        type: UpdateType.SEND_ONLY,
        payload: _data,
      });
    } else {
      const _data = {
        html,
        title,
        content,
        stakeholders,
        authorName: author.fullName,
        authorImage: author.avatarUrl || avatar,
        authorTitle: author.jobTitle ?? "Founder & Ceo",
        authorWorkEmail: author.workEmail ?? author.loginEmail,
        companyName: author.companyName,
        companyLogo: author.companyLogo ?? companyLogo,
        isFirstEmailSent: false, // content not saved yet (impossible to be true)
      };
      await sendMutation.mutateAsync({
        type: UpdateType.SAVE_AND_SEND,
        payload: _data,
      });
    }
  };

  async function makeStatusPublic(publicId: string) {
    await statusMutation.mutateAsync({
      currentStatus: UpdateStatusEnum.PRIVATE,
      desireStatus: UpdateStatusEnum.PUBLIC,
      publicId,
    });
  }

  async function makeStatusPrivate(publicId: string) {
    await statusMutation.mutateAsync({
      currentStatus: UpdateStatusEnum.PUBLIC,
      desireStatus: UpdateStatusEnum.PRIVATE,
      publicId,
    });
  }

  const onContinue = async () => {
    if (publicId) {
      const currentStatus = status;
      currentStatus === UpdateStatusEnum.PUBLIC
        ? await makeStatusPrivate(publicId)
        : await makeStatusPublic(publicId);
    }
  };

  return (
    <div className="flex flex-col gap-y-3">
      <form className="flex items-center justify-between gap-y-2">
        <div className="gap-y-3">
          <div className="flex w-full font-medium">
            <Badge
              variant={BadgeColorProvider(status ?? UpdateStatusEnum.DRAFT)}
              className="mr-2"
            >
              {BadgeStatusProvider(status ?? UpdateStatusEnum.DRAFT)}
            </Badge>
            <span className="h4">Updates / </span>
            <input
              name="title"
              disabled={!canEdit}
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
        <div className="flex items-center space-x-2">
          <CopyToClipboard
            open={showClipboard}
            status={status}
            onCopy={async (e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              if (companyPublicId && update) {
                await onCopyClipboard(
                  getShareableUpdateLink(companyPublicId, update?.publicId),
                );
                toast({
                  title: "Copied to clipboard",
                  description: "🎉 Enjoy sharing the links.",
                });
              }
            }}
          />
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
                  disabled={isDisabled}
                  variant="ghost"
                  size="sm"
                  type="submit"
                  onClick={saveAsDraft}
                >
                  Save as draft
                </Button>
              </li>
              <li>
                <InvestorUpdateModal
                  size="3xl"
                  title="Email updates to fellow stakeholders"
                  subtitle="Tip: You can allow public access and create shareable link for updates."
                  callback={sendThisUpdate}
                  publicId={publicId}
                  dialogProps={{
                    open,
                    onOpenChange: (val) => {
                      setOpen(val);
                    },
                  }}
                  trigger={
                    <Button variant="ghost" size="sm">
                      Send this update
                    </Button>
                  }
                />
              </li>
              {isTogglingAllowed ? (
                <li>
                  <ToggleStatusAlertDialog
                    status={status}
                    privateToggleWarning={privateToggleWarning}
                    publicToggleWarning={publicToggleWarning}
                    onContinue={onContinue}
                    trigger={
                      <Button
                        className="border-none outline-none"
                        variant="outline"
                      >
                        {StatusActionProvider(status)}
                      </Button>
                    }
                  />
                </li>
              ) : null}
              <li>
                <Button variant="ghost" size="sm">
                  Clone this update
                </Button>
              </li>
            </ul>
          </DropdownButton>
        </div>
      </form>
      <Card className="mx-auto mt-3 min-h-[80vh] w-[28rem] sm:w-[38rem] md:w-full	">
        <BlockNoteView
          className="py-5"
          editor={editor}
          theme="light"
          editable={isEditable}
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
