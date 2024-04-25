export const ALL_RECIPIENT_VALUE = "all-recipient";

export const generateAllRecipientGroup = (recipientId: string) => {
  return `${ALL_RECIPIENT_VALUE}-${recipientId}`;
};

export const RECIPIENT_COLORS = [
  "bg-[#1f77b4]",
  "bg-[#ff7f0e]",
  "bg-[#2ca02c]",
  "bg-[#d62728]",
  "bg-[#9467bd]",
  "bg-[#8c564b]",
  "bg-[#e377c2]",
  "bg-[#3366E6]",
  "bg-[#bcbd22]",
  "bg-[#17becf]",
  "bg-[#aec7e8]",
  "bg-[#ffbb78]",
  "bg-[#98df8a]",
  "bg-[#ff9896]",
  "bg-[#c5b0d5]",
  "bg-[#c49c94]",
];
