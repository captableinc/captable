import { PageLayout } from "@/components/dashboard/page-layout";
import { RoleCreateUpdateModalAction } from "@/components/modals/role-create-update-modal";
import { RoleTable } from "@/components/rbac/role-table";
import { Card } from "@/components/ui/card";
import { serverAccessControl } from "@/lib/rbac/access-control";
import { api } from "@/trpc/server";

export default async function RolesPage() {
  const { allow } = await serverAccessControl();

  const data = await allow(api.rbac.listRoles(), ["roles", "read"]);

  const canCreate = allow(true, ["roles", "create"]);

  return (
    <div className="flex flex-col gap-y-3">
      <PageLayout
        title="Roles"
        description="Create and manage roles for your company."
        action={<RoleCreateUpdateModalAction disabled={!canCreate} />}
      />

      {data ? <RoleTable roles={data.rolesList} /> : null}
    </div>
  );
}
