import type { BankAccount } from "@prisma/client";

const BankAccountsTable = ({ accounts }: BankAccount[]) => {
  return (
    <>
      Table
      <pre>{JSON.stringify(accounts, null, 2)}</pre>
    </>
  );
};

export default BankAccountsTable;
