"use client";

import { createPushModal } from "pushmodal";
import { BankAccountModal } from "./bank-account-modal";
import { EditBankAccountModal } from "./edit-bank-account-modal";
import { DocumentUploadModal } from "./document-upload-modal";
import { EquityPlanModal } from "./equity-pan/equity-plan-modal";
import { ExistingSafeModal } from "./existing-safe-modal";
import { IssueShareModal } from "./issue-share-modal";
import { IssueStockOptionModal } from "./issue-stock-option-modal";
import { NewSafeModal } from "./new-safe-modal";
import { RoleCreateUpdateModal } from "./role-create-update-modal";
import { ShareClassModal } from "./share-class/share-class-modal";
import { ShareDataRoomModal } from "./share-dataroom-modal";
import { ShareUpdateModal } from "./share-update-modal";
import { MultipleStakeholdersModal } from "./stakeholder/multiple-stakeholders-modal";
import { SingleStakeholdersModal } from "./stakeholder/single-stake-holder-modal";
import { UpdateSingleStakeholderModal } from "./stakeholder/update-stakeholder-modal";
import { TeamMemberModal } from "./team-member/team-member-modal";
import { WipModal } from "./wip-modal";

import { AddEsignDocumentModal } from "./esign-doc";
import { InvestorModal } from "./investor/add-investor-modal";

export const { pushModal, popModal, ModalProvider } = createPushModal({
  modals: {
    WipModal,
    ShareClassModal,
    TeamMemberModal,
    UpdateSingleStakeholderModal,
    ShareUpdateModal,
    ShareDataRoomModal,
    RoleCreateUpdate: RoleCreateUpdateModal,
    SingleStakeholdersModal,
    MultipleStakeholdersModal,
    DocumentUploadModal,
    EquityPlanModal,
    IssueShareModal,
    IssueStockOptionModal,
    AddEsignDocumentModal,
    BankAccountModal,
    EditBankAccountModal,

    // Safe modals
    NewSafeModal,
    ExistingSafeModal,
    InvestorModal,
  },
});
