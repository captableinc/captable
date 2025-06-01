// Core RBAC functionality
export { RBAC, type addPolicyOption } from "./core/rbac.js";
export {
  ADMIN_PERMISSION,
  ADMIN_ROLE_ID,
  DEFAULT_PERMISSION,
  DEFAULT_ADMIN_ROLE,
  type RoleList,
} from "./core/constants.js";

// Type definitions
export { ACTIONS, type TActions } from "./types/actions.js";
export { SUBJECTS, type TSubjects } from "./types/subjects.js";
export { permissionSchema, type TPermission } from "./types/schema.js";

// Utilities and helpers
export {
  COMMON_ROLE_PATTERNS,
  createStandardRoleIdMapper,
  createStandardRolePermissionMapper,
  createStandardRoleUtils,
} from "./utils.js";

// Client-side utilities (these should typically be imported from /client)
export {
  Allow,
  AllowWithProvider,
  RolesProvider,
  useRoles,
} from "./client/index.js";
export type {
  useAllowedOptions,
  PermissionsContext,
  RolesData,
} from "./client/index.js";

// Server-side utilities (these should typically be imported from /server)
export {
  createServerAccessControl,
  createRoleIdMapper,
  createRolePermissionMapper,
  type AccessControlOptions,
} from "./server/index.js";
