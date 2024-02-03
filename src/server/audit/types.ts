import { type AUDIT_ACTIONS } from "./actions";

type ActionList = typeof AUDIT_ACTIONS;

export type AuditActions = {
  [Key in keyof ActionList]: `${Key}.${ActionList[Key][number]}`;
}[keyof ActionList];

type Overwrite<Base, Overrides> = Omit<Base, keyof Overrides> & Overrides;
type ActionType = "user" | "company";

interface ActionTypeData {
  type: ActionType;
  id?: string | null;
}

export type AuditActor = ActionTypeData;

export type AuditTarget = ActionTypeData[];

export type AuditContext = Overwrite<
  Record<string, string>,
  {
    location?: string;
    user_agent?: string;
  }
>;
