/**
 * Creates a role ID mapper function for converting role types to string IDs
 * This allows apps to define their own role enum types while using a standard mapping function
 */
export function createRoleIdMapper<TRole extends string>(options: {
  adminRoleId: string;
  adminRoleValue: TRole;
  customRoleValue: TRole;
}) {
  const { adminRoleId, adminRoleValue, customRoleValue } = options;

  return ({
    role,
    customRoleId,
  }: {
    role: TRole | null;
    customRoleId: string | null;
  }): string => {
    if (role === adminRoleValue) {
      return adminRoleId;
    }

    if (role === customRoleValue && customRoleId) {
      return customRoleId;
    }

    // Return empty string for other cases (could be made configurable)
    return "";
  };
}

/**
 * Generic role permission mapper for converting database role data to permission objects
 */
export function createRolePermissionMapper<
  TRole extends string,
  TPermission = unknown,
>(options: {
  adminPermissions: TPermission[];
  defaultPermissions: TPermission[];
  adminRoleValue: TRole;
  customRoleValue: TRole;
}) {
  const {
    adminPermissions,
    defaultPermissions,
    adminRoleValue,
    customRoleValue,
  } = options;

  return ({
    role,
    customPermissions,
  }: {
    role: TRole | null;
    customPermissions?: TPermission[];
  }) => {
    if (role === adminRoleValue) {
      return adminPermissions;
    }

    if (role === customRoleValue && customPermissions) {
      return customPermissions;
    }

    return defaultPermissions;
  };
}
