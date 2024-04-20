export type ContactsType = {
  others: {
    email: string;
    selected?: boolean;
  }[];
  members?: {
    id: string;
    name: string;
    email: string;
    selected?: boolean;
  }[];
  stakeholders?: {
    id: string;
    name: string;
    email: string;
    institutionName: string;
    selected?: boolean;
  }[];
};
