import { type stepsType } from "@/components/shared/multistep-modal";

type SafeStepsType = {
  companyId: string;
};

const useSafeSteps = ({ companyId: string }: SafeStepsType) => {
  const steps: Array<stepsType> = [
    {
      id: 1,
      title: "General information",
      fields: ["name", "company", "valuationCap", "discountRate"],
      component: () => {
        return <div>General info form</div>;
      },
    },

    {
      id: 2,
      title: "Investor information",
      fields: ["investorName", "investorEmail", "investorAddress"],
      component: () => {
        return <div>Investor info form</div>;
      },
    },

    {
      id: 3,
      title: "Review and send",
      fields: ["review"],
      component: () => {
        return <div>Review and send form</div>;
      },
    },
  ];

  return steps;
};

export default useSafeSteps;
