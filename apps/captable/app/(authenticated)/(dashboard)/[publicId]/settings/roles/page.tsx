import { PageLayout } from "@/components/dashboard/page-layout";
import { pushModal } from "@/components/modals";
import RoleCreateUpdateModal from "@/components/modals/role-create-update-modal";
import RoleTable from "@/components/rbac/role-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UnAuthorizedState } from "@/components/ui/un-authorized-state";
import { serverAccessControl } from "@/server/member";
import { api } from "@/trpc/server";
import { headers } from "next/headers";

export default async function RolesPage() {
  const { allow } = await serverAccessControl({ headers: await headers() });

  const data = await allow(api.rbac.listRoles.query(), ["roles", "read"]);

  const canCreate = allow(true, ["roles", "create"]);

  return (
    <div className="flex flex-col gap-y-3">
      <PageLayout
        title="Roles"
        description="Create and manage roles for your company."
        action={<RoleCreateUpdateModal disabled={!canCreate} />}
      />

      {data ? <RoleTable roles={data.rolesList} /> : null}
    </div>
  );
}
