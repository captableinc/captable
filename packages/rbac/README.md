# @captable/rbac

A flexible Role-Based Access Control (RBAC) library for React applications with TypeScript support.

## Features

- 🔒 **Type-safe** RBAC implementation with TypeScript
- ⚛️ **React Components** for conditional rendering
- 🎣 **React Hooks** for permission checking
- 🖥️ **Server-side** utilities for access control
- 🚀 **Zero dependencies** (except React for components)
- 📦 **Tree-shakeable** with separate client/server exports
- 🛠️ **Utility helpers** for common patterns
- 🔧 **Generic factory pattern** with dependency injection for maximum reusability

## Installation

```bash
npm install @captable/rbac
# or
yarn add @captable/rbac
# or
pnpm add @captable/rbac
```

## Core Concepts

### Subject
The subject or subject type which you want to check user action on. Usually this is a business (or domain) entity (e.g., billing, roles, members). Subjects can be added in the `@captable/rbac` package.

### Action
Explains what users are able to do in the app. User actions are typically verbs determined by how the business operates. Often, these actions will include words like create, read, update, and delete. Actions can be added in the `@captable/rbac` package.

## Quick Start

### 1. Define your subjects and actions

The package comes with default subjects and actions, but you can extend them:

```typescript
import { SUBJECTS, ACTIONS, type TSubjects, type TActions } from "@captable/rbac/types";

// Default subjects: "billing", "members", "stakeholder", etc.
// Default actions: "create", "read", "update", "delete", "*"
```

### 2. Generic RBAC Factory (Recommended)

For maximum reusability, use the generic factory with dependency injection:

```typescript
import { 
  createServerAccessControlFactory,
  type BaseMembership,
  type RolePermissionDependencies,
  type ServerAccessControlDependencies 
} from "@captable/rbac/utils";
import { type TPermission } from "@captable/rbac/types";

// Define your app-specific membership type
interface MyAppMembership extends BaseMembership {
  id: string;
  companyId: string;
  userId: string;
  role: "ADMIN" | "USER" | "CUSTOM" | null;
  customRoleId: string | null;
}

// Define permission dependencies
const permissionDeps: RolePermissionDependencies<"ADMIN" | "USER" | "CUSTOM", Session, Database, MyAppMembership> = {
  adminRoleValue: "ADMIN",
  customRoleValue: "CUSTOM", 
  adminPermissions: [
    { subject: "billing", actions: ["*"] },
    { subject: "members", actions: ["*"] }
  ] as TPermission[],
  defaultPermissions: [],

  // Your app-specific database queries
  async checkMembership(session, db) {
    const membership = await db.query.memberships.findFirst({
      where: eq(memberships.userId, session.user.id)
    });
    if (!membership) return { success: false, error: new Error("No membership") };
    return { success: true, data: membership };
  },

  async getCustomRolePermissions({ customRoleId, companyId, db }) {
    const permissions = await db.query.rolePermissions.findMany({
      where: and(
        eq(rolePermissions.roleId, customRoleId),
        eq(rolePermissions.companyId, companyId)
      )
    });
    return { 
      success: true, 
      data: permissions.map(p => ({ 
        subject: p.resource, 
        actions: p.actions.split(",") 
      })) 
    };
  }
};

// Define access control dependencies  
const accessDeps: ServerAccessControlDependencies<Session, Database> = {
  database: myDatabase,
  getSession: async (headers) => await getSessionFromHeaders(headers),
  createUnauthorizedError: () => new Error("Unauthorized"),
  createGenericError: (error) => new Error(`Access error: ${error}`)
};

// Create the factory
const accessControlFactory = createServerAccessControlFactory(permissionDeps, accessDeps);

// Use in your app
export const serverAccessControl = accessControlFactory.serverAccessControl;
export const getServerPermissions = accessControlFactory.getServerPermissions;
```

### 3. Create app-specific utilities (Alternative Pattern)

For simpler use cases, create thin wrapper utilities for your specific role types:

```typescript
// In your app: lib/rbac-utils.ts
import { createStandardRoleIdMapper } from "@captable/rbac";
import type { MyAppRoleEnum } from "./types"; // Your app's role enum

// Create app-specific role utilities
export const getRoleId = createStandardRoleIdMapper<MyAppRoleEnum>({
  adminRoleValue: "ADMIN",
  customRoleValue: "CUSTOM",
});

// Or create a complete utils bundle
import { createStandardRoleUtils, ADMIN_PERMISSION, DEFAULT_PERMISSION } from "@captable/rbac";

export const { getRoleId, getRolePermissions } = createStandardRoleUtils<MyAppRoleEnum, MyPermissionType>({
  adminRoleValue: "ADMIN",
  customRoleValue: "CUSTOM", 
  adminPermissions: ADMIN_PERMISSION,
  defaultPermissions: DEFAULT_PERMISSION,
});
```

## Usage Examples

### tRPC Procedures

```typescript
import { withAccessControl } from "@/trpc/api/trpc";

export const withAccessControlProcedure = withAccessControl
  .input(inputSchema)
  .meta({
    policies: {
      members: { allow: ["create"] },
    },
  })
  .mutation(({ ctx, input }) => {
    const { membership } = ctx;
    return { success: true };
  });
```

### Client-side usage with React

#### Using the RolesProvider

```tsx
import { RolesProvider, AllowWithProvider } from "@captable/rbac/client";

function App() {
  const permissionsMap = new Map([
    ["billing", ["read", "create"]],
    ["members", ["*"]]
  ]);

  return (
    <RolesProvider data={{ permissions: permissionsMap }}>
      <Dashboard />
    </RolesProvider>
  );
}

function Dashboard() {
  return (
    <div>
      <AllowWithProvider subject="billing" action="create">
        <CreateBillingButton />
      </AllowWithProvider>

      <AllowWithProvider subject="members" action="delete">
        {(allowed) => allowed ? "Can delete members" : "Cannot delete members"}
      </AllowWithProvider>
    </div>
  );
}
```

#### Using the standalone Allow component

```tsx
import { Allow } from "@captable/rbac/client";

function ClientComponent() {
  const permissionsContext = {
    permissions: new Map([["billing", ["read", "create"]]])
  };

  return (
    <div>
      <Allow 
        subject="roles" 
        action="delete" 
        permissionsContext={permissionsContext}
      >
        Allowed
      </Allow>

      {/* or using render props */}
      <Allow 
        subject="roles" 
        action="delete" 
        permissionsContext={permissionsContext}
      >
        {(allow) => (allow ? "allowed" : "disallowed")}
      </Allow>
    </div>
  );
}
```

### Server Components

```tsx
"use server";

import { serverAccessControl } from "@/lib/rbac/access-control";
import { headers } from "next/headers";

const fetchDataFromServer = async () => {
  return { data: [] };
};

async function ServerComponent() {
  const { allow } = await serverAccessControl({ headers: await headers() });

  const canRead = !!allow(true, ["billing", "read"]);
  const data = await allow(fetchDataFromServer(), ["billing", "read"]);

  return (
    <div>
      {canRead ? "can read" : "cannot read"}
      {data ? data.data : null}
    </div>
  );
}
```

### Server-side API usage

```typescript
import { createServerAccessControl } from "@captable/rbac/server";
import type { TPermission } from "@captable/rbac/types";

const permissions: TPermission[] = [
  { subject: "billing", actions: ["read", "create"] },
  { subject: "members", actions: ["*"] }
];

const accessControl = createServerAccessControl({ permissions });

// Check specific permission
const canCreateBilling = accessControl.hasPermission("billing", "create");

// Conditional execution
const result = accessControl.allow(
  fetchBillingData(), 
  ["billing", "read"], 
  null // fallback value
);

// Policy-based checking
const { isAllowed } = accessControl.isPermissionsAllowed({
  billing: { allow: ["create"] }
});
```

### Core RBAC usage

```typescript
import { RBAC } from "@captable/rbac";
import type { TPermission } from "@captable/rbac/types";

const rbac = new RBAC();

// Define policies
rbac
  .allow("billing", "create")
  .allow("billing", "read")
  .deny("billing", "delete");

// Or use bulk policy definition
rbac.addPolicies({
  billing: { allow: ["create", "read"], deny: ["delete"] },
  members: { allow: ["*"] }
});

// Check permissions
const permissions: TPermission[] = [
  { subject: "billing", actions: ["create"] }
];

const result = rbac.enforce(permissions);
console.log(result.valid); // true/false
console.log(result.message); // descriptive message
```

### Helper Utilities

You can also use the individual utility functions:

```typescript
import { 
  createStandardRoleUtils,
  createRoleIdResolver,
  type RoleIdResolverDependencies 
} from "@captable/rbac/utils";

// Standard role utilities
const { getRoleId, getRolePermissions } = createStandardRoleUtils({
  adminRoleValue: "ADMIN",
  customRoleValue: "CUSTOM",
  adminPermissions: [...],
  defaultPermissions: [...]
});

// Role ID resolver with database dependency
const roleIdResolverDeps: RoleIdResolverDependencies<Database> = {
  findCustomRole: async (id, db) => {
    return await db.query.customRoles.findFirst({
      where: eq(customRoles.id, id)
    });
  }
};

const resolveRoleId = createRoleIdResolver(
  {
    adminRoleValue: "ADMIN",
    customRoleValue: "CUSTOM", 
    adminRoleId: "admin-role-id"
  },
  roleIdResolverDeps
);

// Usage
const { role, customRoleId } = await resolveRoleId({ 
  id: "some-role-id", 
  db: myDatabase 
});
```

## API Reference

### Core Classes

#### `RBAC`
Main RBAC engine for defining and enforcing policies.

**Methods:**
- `allow(subject, action)` - Allow an action on a subject
- `deny(subject, action)` - Deny an action on a subject  
- `addPolicies(policies)` - Bulk add policies
- `enforce(permissions)` - Check if permissions are valid
- `static normalizePermissionsMap(permissions)` - Convert permissions to Map

### Generic Factory Functions

#### `createServerAccessControlFactory<TRole, TSession, TDB, TMembership>(permissionDeps, accessDeps)`
Creates a fully generic server access control factory with dependency injection.

**Parameters:**
- `permissionDeps: RolePermissionDependencies` - Permission resolution dependencies
- `accessDeps: ServerAccessControlDependencies` - Access control dependencies

**Returns:**
- `getServerPermissions(options)` - Get permissions for a session
- `serverAccessControl(options)` - Get access control utilities

### Utility Functions

#### `createStandardRoleIdMapper<TRole>(options)`
Creates a role ID mapper for common role patterns.

**Options:**
- `adminRoleValue: TRole` - Your app's admin role value (e.g., "ADMIN")
- `customRoleValue: TRole` - Your app's custom role value (e.g., "CUSTOM") 
- `adminRoleId?: string` - Override default admin role ID

**Returns:** Function that maps `{ role, customRoleId }` to string ID

#### `createStandardRolePermissionMapper<TRole, TPermission>(options)`
Creates a role permission mapper for common patterns.

#### `createStandardRoleUtils<TRole, TPermission>(options)`
Creates both role ID mapper and permission mapper with consistent config.

**Returns:** `{ getRoleId, getRolePermissions }`

#### `createRoleIdResolver<TRole, TDB>(config, deps)`
Creates a role ID resolver with database dependency injection.

### Client Components

#### `AllowWithProvider`
Renders children conditionally based on permissions from RolesProvider.

**Props:**
- `subject: TSubjects` - The subject to check
- `action: TActions` - The action to check
- `children: ReactNode | ((authorized: boolean) => ReactNode)` - Content to render

#### `Allow`
Standalone component for conditional rendering.

**Props:**
- `subject: TSubjects` - The subject to check
- `action: TActions` - The action to check
- `permissionsContext: PermissionsContext` - Permissions context
- `children: ReactNode | ((authorized: boolean) => ReactNode)` - Content to render

#### `RolesProvider`
Context provider for permissions.

**Props:**
- `data: RolesData` - Object containing permissions Map and additional data
- `children: ReactNode` - Child components

### Server Utilities

#### `createServerAccessControl(options)`
Creates server-side access control utilities.

**Returns:**
- `allow<T>(value, permission, fallback?)` - Conditional value return
- `hasPermission(subject, action)` - Boolean permission check
- `isPermissionsAllowed(policies)` - Policy-based checking
- `roleMap` - Normalized permissions Map
- `permissions` - Original permissions array

## Types

```typescript
type TActions = "create" | "read" | "update" | "delete" | "*";
type TSubjects = "billing" | "members" | "stakeholder" | "roles" | "audits" | "documents" | "company" | "developer" | "bank-accounts";

interface TPermission {
  subject: TSubjects;
  actions: TActions[];
}

interface BaseMembership {
  role: string | null;
  customRoleId: string | null;
  companyId: string;
  [key: string]: unknown;
}

type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
```

## Best Practices

### 🏗️ **Architecture Pattern**

1. **Keep the RBAC package generic** - Don't tie it to specific databases or apps
2. **Use dependency injection** - Leverage the generic factory pattern for maximum reusability
3. **Create app-specific utilities** - Use the provided helpers to create thin wrappers
4. **Use standard patterns** - Leverage `createStandardRoleUtils` for common cases
5. **Type safety first** - Always use your app's specific role enum types

### 📁 **Recommended Project Structure**

```
your-app/
├── lib/
│   ├── rbac-utils.ts          # App-specific RBAC utilities
│   └── access-control.ts      # App-specific access control logic
├── components/
│   └── auth/                  # Permission-gated components
└── types/
    └── roles.ts               # App-specific role types
```

### 🎯 **Import Strategy**

```typescript
// ✅ Good: Specific imports for better tree-shaking
import { RBAC } from "@captable/rbac";
import { Allow } from "@captable/rbac/client";
import { createServerAccessControl } from "@captable/rbac/server";

// ✅ Good: Generic factory pattern
import { createServerAccessControlFactory } from "@captable/rbac/utils";

// ✅ Good: App-specific utilities
import { getRoleId } from "./lib/rbac-utils";
import { serverAccessControl } from "./lib/access-control";
```

### 🔧 **Dependency Injection Benefits**

- **No Forced Dependencies**: Works with any database, auth system, or framework
- **Type Safety**: Generic types adapt to your app's data structures  
- **Flexible**: Use individual utilities or the full factory
- **Maintainable**: Clear separation between RBAC logic and app-specific code
- **Testable**: Easy to mock dependencies for testing

## Examples

See the [examples directory](./examples) for complete implementation examples.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details.