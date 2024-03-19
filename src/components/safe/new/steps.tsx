import { type stepsType } from "@/components/shared/multistep-modal";

type SafeStepsType = {
  companyId: string;
};

const useSafeSteps = ({ companyId: string }: SafeStepsType) => {
  const steps: Array<stepsType> = [
    {
      id: 1,
      title: "General details",
      fields: [
        "safeId",
        "safeTemplate",
        "valuationCap",
        "discountRate",
        "proRata",
      ],
      component: () => {
        return <div>General info form</div>;
      },
    },

    {
      id: 2,
      title: "Investment details",
      fields: [
        "capital",
        "issueDate",
        "boardApprovalDate",
        "stakeholderId",
        "investorName",
        "investorEmail",
        "investorInstitutionName",
      ],
      component: () => {
        return <div>Investor info form</div>;
      },
    },

    {
      id: 3,
      title: "Sign & send documents",
      fields: ["documents"],
      component: () => {
        return <div>Review and send form</div>;
      },
    },
  ];

  return steps;
};

export default useSafeSteps;
