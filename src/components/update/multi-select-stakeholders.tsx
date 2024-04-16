"use client";

import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import {
  checkEmailUnsending,
  extractStakeholderIds,
  getFormattedRecipients,
  getFormattedStakeholders,
  getNewSelectedRecipients,
  isEditingPlaygorund,
  isNewPlayground,
  joinIdAndNameByHash,
  objectifyIdAndEmail,
} from "@/lib/utils";
import { api } from "@/trpc/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TeamIcon } from "../shared/icons";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";

const ALL_STAKEHOLDERS = "all-stakeholders";
const TRASH_STAKEHOLDERS = "trash-stakeholders";

type Stakeholders = {
  id: string;
  email: string;
};
type dataProps = { stakeholders: Stakeholders[] | [] };
interface MultiSelectStakeholderProps {
  callback: (data: dataProps) => void;
  publicId: string | undefined;
}
const MultiSelectStakeholder: React.FC<MultiSelectStakeholderProps> = ({
  callback,
  publicId,
}) => {
  const { toast } = useToast();
  const pathname = usePathname();

  const updates = api.update.getRecipients.useQuery(
    { publicId },
    { enabled: true },
  );
  const _stakeholders = api.stakeholder.getStakeholders.useQuery();

  const [smellAllSelection, setSmell] = useState<boolean>(false);
  const [canSend, setcanSend] = useState<boolean>(false);
  const [loading, _setLoading] = useState<boolean>(false);
  const [selectedRecpients, setSelectedRecpients] = useState<string[] | []>([]);

  const dbRecipients = updates?.data?.data[0]?.recipients ?? [];
  const stakeholders = _stakeholders?.data?.data ?? [];
  const dbPublicId = updates?.data?.data[0]?.publicId ?? ("" as string);
  const isDisabled = stakeholders?.length === 0;
  const isAllStakeholdersSelected =
    selectedRecpients.length === stakeholders?.length;

  useEffect(() => {
    function cloneDbRecipientsToState() {
      if (dbRecipients?.length) {
        setSelectedRecpients(getFormattedRecipients(dbRecipients));
      }
    }
    cloneDbRecipientsToState();
  }, [dbRecipients]);

  useEffect(() => {
    const onSelectAllStakeholders = () => {
      if (stakeholders?.length) {
        const formatted = getFormattedStakeholders(stakeholders);
        setSelectedRecpients(formatted);
        setcanSend(true);
      }
    };
    onSelectAllStakeholders();
  }, [smellAllSelection]);

  useEffect(() => {
    function UpdatingPageSendPermission() {
      // No recipients yet
      if (!dbRecipients?.length) {
        if (selectedRecpients.length) {
          setcanSend(true);
        } else {
          setcanSend(false);
        }
      } else {
        // presence of recipients already
        const newFreshSelection = getNewSelectedRecipients(
          dbRecipients,
          selectedRecpients,
        );
        if (newFreshSelection?.length) {
          setcanSend(true);
        } else {
          setcanSend(false);
        }
      }
    }

    function NewPageSendPermission() {
      if (selectedRecpients.length) {
        setcanSend(true);
      } else {
        setcanSend(false);
      }
    }
    // check inside /updates/new page
    if (isNewPlayground(pathname, "/updates/new")) {
      NewPageSendPermission();
    }
    // check inside /updates/[updatedPublicId] page
    if (dbPublicId && isEditingPlaygorund(pathname, dbPublicId)) {
      UpdatingPageSendPermission();
    }

    // Check for illegal deselect
    if (dbRecipients.length) {
      const isIllegalDeselect = checkEmailUnsending(
        dbRecipients,
        selectedRecpients,
      );
      if (isIllegalDeselect) {
        toast({
          variant: "destructive",
          title: "Uh ohh! Cannot deselect the recipient.",
          description: "Sorry, you cannot unsend email updates.",
        });
        return setSelectedRecpients(getFormattedRecipients(dbRecipients));
      }
    }
  }, [selectedRecpients, smellAllSelection]);

  function saveAndSend() {
    const stakeholderIds = extractStakeholderIds(selectedRecpients);
    if (stakeholders?.length && stakeholderIds?.length) {
      const formattedStakeholders = objectifyIdAndEmail(
        stakeholderIds,
        stakeholders,
      );
      callback({ stakeholders: formattedStakeholders });
      return;
    }
    callback({ stakeholders: [] });
  }
  function sendOnly(newRecipients: string[]) {
    if (!newRecipients.length) return;
    const stakeholderIds = extractStakeholderIds(newRecipients);
    if (stakeholders?.length && stakeholderIds?.length) {
      const formattedStakeholders = objectifyIdAndEmail(
        stakeholderIds,
        stakeholders,
      );
      callback({ stakeholders: formattedStakeholders });
      return;
    }
    callback({ stakeholders: [] });
  }
  const onSendUpdate = async () => {
    // both save and send for (/updates/new) page
    if (isNewPlayground(pathname, "/updates/new")) {
      if (!dbRecipients.length && selectedRecpients.length) {
        saveAndSend();
      }
    }
    // Neglect saving content again for (/updates/[updatePublicId]) page
    if (dbPublicId && isEditingPlaygorund(pathname, dbPublicId)) {
      if (dbRecipients?.length) {
        const newSelection = getNewSelectedRecipients(
          dbRecipients,
          selectedRecpients,
        );
        if (newSelection?.length) {
          sendOnly(newSelection);
        }
      } else {
        if (selectedRecpients.length) {
          sendOnly(selectedRecpients);
        }
      }
    }
  };
  const onValuesChange = (val: string[]) => {
    // deselect_all
    if (val.includes(TRASH_STAKEHOLDERS)) {
      return setSelectedRecpients([]);
    }
    // select_all
    if (val.includes(ALL_STAKEHOLDERS)) {
      setSmell((prev: boolean) => !prev);
      return null;
    }
    // Check_illegal_Deselect
    if (dbRecipients.length) {
      const isIllegalDeselect = checkEmailUnsending(dbRecipients, val);
      if (isIllegalDeselect) {
        toast({
          variant: "destructive",
          title: "Uh ohh! Cannot deselect the recipient.",
          description: "Sorry, you cannot unsend email updates.",
        });
        return setSelectedRecpients(getFormattedRecipients(dbRecipients));
      }
    }
    return setSelectedRecpients(val);
  };
  return (
    <>
      <div>
        <div className="my-1 ml-4 flex items-center space-x-2">
          <Label className="font-semibold" htmlFor="terms">
            Send email updates to investors
          </Label>
        </div>
      </div>
      <div className="flex h-[80vh] flex-row-reverse items-start space-x-3">
        <div className="mt-2">
          <Button
            className="mx-1 bg-teal-500 hover:bg-teal-600"
            disabled={!canSend}
            loading={loading}
            loadingText="Sharing.."
            onClick={onSendUpdate}
          >
            Send update
          </Button>
        </div>
        <MultiSelector
          className="flex-grow"
          customPayload={getFormattedRecipients(dbRecipients)}
          values={selectedRecpients}
          onValuesChange={onValuesChange}
          loop={false}
        >
          <MultiSelectorTrigger>
            <MultiSelectorInput
              placeholder={`${
                selectedRecpients?.length
                  ? ""
                  : "Select stakeholders for sending updates"
              }`}
            />
          </MultiSelectorTrigger>
          <MultiSelectorContent>
            <MultiSelectorList>
              <>
                {stakeholders?.map((sh, i) => (
                  <MultiSelectorItem
                    key={i}
                    value={`${joinIdAndNameByHash(sh.id, sh.name)}`}
                  >
                    {sh.name}
                  </MultiSelectorItem>
                ))}
                <MultiSelectorItem
                  disabled={isDisabled}
                  className="flex items-center justify-start space-x-4 font-semibold"
                  value={
                    isAllStakeholdersSelected
                      ? TRASH_STAKEHOLDERS
                      : ALL_STAKEHOLDERS
                  }
                >
                  <TeamIcon className="mr-3 h-4 w-4" />
                  {isAllStakeholdersSelected
                    ? "Unselect all stakeholders"
                    : "Select all stakeholders"}
                </MultiSelectorItem>
              </>
            </MultiSelectorList>
          </MultiSelectorContent>
        </MultiSelector>
      </div>
    </>
  );
};

export default MultiSelectStakeholder;
