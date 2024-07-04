import { PageLayout } from "@/components/dashboard/page-layout";
import { Allow } from "@/components/rbac/allow";
import { CreateRbacModal } from "@/components/rbac/create-rbac-modal";
import { RoleTable } from "@/components/rbac/role-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { checkPageRoleAccess } from "@/lib/rbac/access-control";
import { api } from "@/trpc/server";

export default async function RolesPage() {
  const { allow } = await checkPageRoleAccess({ roles: { allow: ["*"] } });

  const data = await allow(api.rbac.listRoles.query(), ["roles", "read"]);
  return (
    <div className="flex flex-col gap-y-3">
      <PageLayout
        title="Roles"
        description="Manage your roles."
        action={
          <Allow
            action="create"
            subject="roles"
            not={<Button disabled>Create Role</Button>}
          >
            <CreateRbacModal />
          </Allow>
        }
      />

      <Card className="mt-3">
        <div className="p-6">
          {data ? <RoleTable roles={data.rolesList} /> : null}
        </div>
      </Card>
    </div>
  );
}
