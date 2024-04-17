export type DataRoomRecipientType = {
  id: string;
  email?: string | null;
  member?: {
    id: string;
    name: string;
    email: string;
  };
  stakeholder?: {
    id: string;
    name: string;
    email: string;
    institutionName: string;
  };
};
