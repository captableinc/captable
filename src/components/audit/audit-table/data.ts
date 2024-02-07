import { AUDIT_ACTIONS } from "@/server/audit/actions";

export const actionValues = Object.keys(AUDIT_ACTIONS).reduce<
  { label: string; value: string }[]
>((acc, curr) => {
  const actions = AUDIT_ACTIONS[curr as keyof typeof AUDIT_ACTIONS];

  for (const action of actions) {
    acc.push({ label: `${curr}.${action}`, value: `${curr}.${action}` });
  }

  return acc;
}, []);
