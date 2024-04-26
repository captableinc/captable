export type ContactsType = {
  id?: string;
  name?: string;
  email: string;
  value: string;
  image?: string;
  selected?: boolean;
  institutionName?: string;
  type: "member" | "stakeholder" | "other";
}[];
