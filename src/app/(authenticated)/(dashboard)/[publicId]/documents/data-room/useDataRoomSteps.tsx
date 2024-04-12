import { type stepsType } from "@/components/shared/multistep-modal";

const ExistingDocuments = () => {
  return (
    <div>
      <span>Existing Documents</span>
    </div>
  );
};

const UploadDocuments = () => {
  return (
    <div>
      <span>Upload Documents</span>
    </div>
  );
};

const SelectRecipients = () => {
  return (
    <div>
      <span>Select Recipients</span>
    </div>
  );
};

type DataRoomStepsType = {
  companyId: string;
};

const useDataRoomSteps = ({ companyId: string }: DataRoomStepsType) => {
  const steps: Array<stepsType> = [
    {
      id: 1,
      title: "General information",
      component: ExistingDocuments,
      fields: [],
    },
    {
      id: 2,
      title: "Additional documents",
      component: UploadDocuments,
      fields: [],
    },
    {
      id: 3,
      title: "Share this data room",
      component: SelectRecipients,
      fields: [],
    },
  ];

  return steps;
};

export default useDataRoomSteps;
