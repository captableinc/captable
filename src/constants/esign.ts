export const ALL_RECIPIENT_VALUE = "all-recipient";

export const generateAllRecipientGroup = (recipientId: string) => {
  return `${ALL_RECIPIENT_VALUE}-${recipientId}`;
};
