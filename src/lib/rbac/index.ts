import { z } from "zod";
import { Ok, type Result } from "../error";
import { BaseError } from "../error/errors/base";

const Actions = ["create", "read", "update", "delete", "*"] as const;
const Subjects = ["billing", "invite"] as const;

type TSubjects = (typeof Subjects)[number];
type TActions = (typeof Actions)[number];
type Effect = "allow" | "deny";

const PermissionSchema = z.object({
  actions: z.array(z.enum(Actions)),
  subject: z.enum(Subjects),
});

export type TPermission = z.infer<typeof PermissionSchema>;

export type addPolicyOption = Partial<
  Record<TSubjects, { allow: TActions[]; deny?: TActions[] }>
>;

class RBACError extends BaseError {
  public name = "RBACError";
  public retry = false;
}

export class RBAC {
  private policy: Map<TSubjects, Map<Effect, Set<TActions>>>;

  constructor() {
    this.policy = new Map();
  }

  allow(subject: TSubjects, action: TActions): RBAC {
    this.register(subject, action, "allow");

    return this;
  }

  deny(subject: TSubjects, action: TActions): RBAC {
    this.register(subject, action, "deny");

    return this;
  }

  private register(subject: TSubjects, action: TActions, effect: Effect) {
    let subjectMap = this.policy.get(subject);

    if (!subjectMap) {
      subjectMap = new Map();
      this.policy.set(subject, subjectMap);
    }

    let actionSet = subjectMap.get(effect);

    if (!actionSet) {
      actionSet = new Set();
      subjectMap.set(effect, actionSet);
    }

    actionSet.add(action);
  }

  enforce(
    permissions: TPermission[],
  ): Result<{ valid: boolean; message: string }> {
    for (const perm of permissions) {
      const { actions, subject } = perm;

      const rules = this.policy.get(subject);

      if (rules) {
        const deniedActions = rules.get("deny");
        const allowedActions = rules.get("allow");

        if (
          deniedActions &&
          actions.some((action) => deniedActions.has(action))
        ) {
          return Ok({
            valid: false,
            message: `Permission denied for actions: ${actions.join(", ")}`,
          });
        }

        if (
          allowedActions &&
          actions.some((action) => allowedActions.has(action))
        ) {
          continue;
        }

        return Ok({
          valid: false,
          message: `No matching permissions found for actions: ${actions.join(
            ", ",
          )}`,
        });
      }
    }

    return Ok({ valid: true, message: "Permissions granted." });
  }

  addPolicies(policies: addPolicyOption) {
    for (const [subject, policy] of Object.entries(policies)) {
      const { allow, deny } = policy;

      for (const action of allow) {
        this.allow(subject as TSubjects, action);
      }

      if (deny) {
        for (const action of deny) {
          this.deny(subject as TSubjects, action);
        }
      }
    }

    return this;
  }
}

// Example usage:
// const rbac = new RBAC();

// rbac.allow("billing", "create").allow("billing", "delete");
