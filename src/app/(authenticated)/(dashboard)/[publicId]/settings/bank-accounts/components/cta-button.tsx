"use client";

import { pushModal } from "@/components/modals";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const CtaButton = () => {
  return (
    <Button
      onClick={() => {
        pushModal("BankAccountModal", {
          title: "Add a bank account",
          subtitle: "Add a bank account to receive funds",
        });
      }}
    >
      <Icon name="add-line" className="inline-block h-5 w-5" />
      Add a bank account
    </Button>
  );
};

export default CtaButton;
