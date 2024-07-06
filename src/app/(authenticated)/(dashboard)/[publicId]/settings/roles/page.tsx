import { PageLayout } from "@/components/dashboard/page-layout";
import { RoleCreateUpdateModalAction } from "@/components/modals/role-create-update-modal";
import { RoleTable } from "@/components/rbac/role-table";
import { Card } from "@/components/ui/card";
import { serverAccessControl } from "@/lib/rbac/access-control";
import { api } from "@/trpc/server";

export default async function RolesPage() {
  const { allow } = await serverAccessControl();

  const data = await allow(api.rbac.listRoles.query(), ["roles", "read"]);

  const canCreate = allow(true, ["roles", "create"]);

  return (
    <div className="flex flex-col gap-y-3">
      <PageLayout
        title="Roles"
        description="Manage your roles."
        action={<RoleCreateUpdateModalAction disabled={!canCreate} />}
      />

      <Card className="mt-3">
        <div className="p-6">
          {data ? <RoleTable roles={data.rolesList} /> : null}
        </div>
      </Card>
    </div>
  );
}
