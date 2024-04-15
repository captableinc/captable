import React from "react";

type MoneyProps = {
  value: number;
};

export const Money: React.FC<MoneyProps> = ({ value }) => {
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

  return <span>{formattedValue}</span>;
};
