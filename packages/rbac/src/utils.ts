import { ADMIN_ROLE_ID } from "./core/constants.js";
import { createServerAccessControl } from "./server/access-control.js";
import {
  createRoleIdMapper,
  createRolePermissionMapper,
} from "./server/role-utils.js";
import type { TPermission } from "./types/schema.js";

/**
 * Common role enum patterns that most apps use
 */
export const COMMON_ROLE_PATTERNS = {
  ADMIN: "ADMIN",
  USER: "USER",
  VIEWER: "VIEWER",
  CUSTOM: "CUSTOM",
} as const;

/**
 * Creates a standard role ID mapper for common role patterns
 * Most apps can use this directly if they follow the standard pattern
 */
export function createStandardRoleIdMapper<TRole extends string>(options: {
  adminRoleValue: TRole;
  customRoleValue: TRole;
  adminRoleId?: string;
}) {
  return createRoleIdMapper<TRole>({
    adminRoleId: options.adminRoleId || ADMIN_ROLE_ID,
    adminRoleValue: options.adminRoleValue,
    customRoleValue: options.customRoleValue,
  });
}

/**
 * Creates a standard role permission mapper for common patterns
 */
export function createStandardRolePermissionMapper<
  TRole extends string,
  TPermission,
>(options: {
  adminRoleValue: TRole;
  customRoleValue: TRole;
  adminPermissions: TPermission[];
  defaultPermissions: TPermission[];
}) {
  return createRolePermissionMapper<TRole, TPermission>({
    adminRoleValue: options.adminRoleValue,
    customRoleValue: options.customRoleValue,
    adminPermissions: options.adminPermissions,
    defaultPermissions: options.defaultPermissions,
  });
}

/**
 * Helper to create both role ID mapper and permission mapper with consistent config
 */
export function createStandardRoleUtils<
  TRole extends string,
  TPermission,
>(options: {
  adminRoleValue: TRole;
  customRoleValue: TRole;
  adminPermissions: TPermission[];
  defaultPermissions: TPermission[];
  adminRoleId?: string;
}) {
  const roleIdMapper = createStandardRoleIdMapper({
    adminRoleValue: options.adminRoleValue,
    customRoleValue: options.customRoleValue,
    adminRoleId: options.adminRoleId,
  });

  const rolePermissionMapper = createStandardRolePermissionMapper({
    adminRoleValue: options.adminRoleValue,
    customRoleValue: options.customRoleValue,
    adminPermissions: options.adminPermissions,
    defaultPermissions: options.defaultPermissions,
  });

  return {
    getRoleId: roleIdMapper,
    getRolePermissions: rolePermissionMapper,
  };
}

/**
 * Result type for generic operations that can succeed or fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Generic membership data that apps can extend
 */
export interface BaseMembership {
  role: string | null;
  customRoleId: string | null;
  companyId: string;
  [key: string]: unknown;
}

/**
 * Dependencies that apps need to provide for role permission resolution
 */
export interface RolePermissionDependencies<
  TRole,
  TSession,
  TDB,
  TMembership extends BaseMembership,
> {
  adminRoleValue: TRole;
  customRoleValue: TRole;
  adminPermissions: TPermission[];
  defaultPermissions: TPermission[];

  // App-specific implementations
  checkMembership: (session: TSession, db: TDB) => Promise<Result<TMembership>>;
  getCustomRolePermissions: (options: {
    customRoleId: string;
    companyId: string;
    db: TDB;
  }) => Promise<Result<TPermission[]>>;
}

/**
 * Creates a generic role permission resolver with dependency injection
 */
export function createRolePermissionResolver<
  TRole,
  TSession,
  TDB,
  TMembership extends BaseMembership,
>(deps: RolePermissionDependencies<TRole, TSession, TDB, TMembership>) {
  const getPermissionsForRole = (options: {
    role: TRole | null;
    customRoleId: string | null;
    companyId: string;
    db: TDB;
  }): Promise<Result<TPermission[]>> => {
    const { role, customRoleId, companyId, db } = options;

    if (role === deps.adminRoleValue) {
      return Promise.resolve({ success: true, data: deps.adminPermissions });
    }

    if (!role) {
      return Promise.resolve({ success: true, data: deps.defaultPermissions });
    }

    if (role === deps.customRoleValue && customRoleId) {
      return deps.getCustomRolePermissions({ customRoleId, companyId, db });
    }

    return Promise.resolve({ success: true, data: deps.defaultPermissions });
  };

  const getPermissions = async (options: {
    session: TSession;
    db: TDB;
  }): Promise<
    Result<{ permissions: TPermission[]; membership: TMembership }>
  > => {
    const membershipResult = await deps.checkMembership(
      options.session,
      options.db,
    );

    if (!membershipResult.success) {
      return { success: false, error: membershipResult.error };
    }

    const membership = membershipResult.data;
    const permissionsResult = await getPermissionsForRole({
      role: membership.role as TRole,
      customRoleId: membership.customRoleId,
      companyId: membership.companyId,
      db: options.db,
    });

    if (!permissionsResult.success) {
      return { success: false, error: permissionsResult.error };
    }

    return {
      success: true,
      data: { permissions: permissionsResult.data, membership },
    };
  };

  return {
    getPermissionsForRole,
    getPermissions,
  };
}

/**
 * Dependencies for server access control factory
 */
export interface ServerAccessControlDependencies<TSession, TDB> {
  getSession: (headers: Headers) => Promise<TSession | null>;
  database: TDB;

  // Error factories
  createUnauthorizedError?: () => Error;
  createGenericError?: (error: unknown) => Error;
}

/**
 * Creates a generic server access control factory with full dependency injection
 */
export function createServerAccessControlFactory<
  TRole,
  TSession,
  TDB,
  TMembership extends BaseMembership,
>(
  permissionDeps: RolePermissionDependencies<TRole, TSession, TDB, TMembership>,
  accessDeps: ServerAccessControlDependencies<TSession, TDB>,
) {
  const permissionResolver = createRolePermissionResolver(permissionDeps);

  const getServerPermissions = async ({ headers }: { headers: Headers }) => {
    const session = await accessDeps.getSession(headers);

    if (!session) {
      throw accessDeps.createUnauthorizedError?.() || new Error("Unauthorized");
    }

    const result = await permissionResolver.getPermissions({
      session,
      db: accessDeps.database,
    });

    if (!result.success) {
      throw accessDeps.createGenericError?.(result.error) || result.error;
    }

    return result.data;
  };

  const serverAccessControl = async ({ headers }: { headers: Headers }) => {
    const { permissions } = await getServerPermissions({ headers });

    // Use the RBAC package's access control with the standard TPermission type
    const accessControl = createServerAccessControl({ permissions });

    return accessControl;
  };

  return {
    getServerPermissions,
    serverAccessControl,
  };
}

/**
 * Database query dependencies for role ID resolution
 */
export interface RoleIdResolverDependencies<TDB> {
  findCustomRole: (id: string, db: TDB) => Promise<{ id: string } | null>;
}

/**
 * Creates a standard role ID resolver with dependency injection
 */
export function createRoleIdResolver<TRole extends string, TDB>(
  config: {
    adminRoleValue: TRole;
    customRoleValue: TRole;
    adminRoleId: string;
  },
  deps: RoleIdResolverDependencies<TDB>,
) {
  return async (options: {
    id?: string | null;
    db: TDB;
  }): Promise<{ role: TRole | null; customRoleId: string | null }> => {
    const { id, db } = options;

    if (!id || id === "") {
      return { role: null, customRoleId: null };
    }

    if (id === config.adminRoleId) {
      return { role: config.adminRoleValue, customRoleId: null };
    }

    const customRole = await deps.findCustomRole(id, db);

    if (!customRole) {
      throw new Error("Custom role not found");
    }

    return { role: config.customRoleValue, customRoleId: customRole.id };
  };
}
