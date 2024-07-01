import { PageLayout } from "@/components/dashboard/page-layout";
import { Allow } from "@/components/rbac/allow";
import { CreateRbacModal } from "@/components/rbac/create-rbac-modal";
import { Card } from "@/components/ui/card";

export default function RolesPage() {
  return (
    <div className="flex flex-col gap-y-3">
      <PageLayout
        title="Roles"
        description="Manage your roles."
        action={
          <Allow action="create" subject="roles">
            {/* biome-ignore lint/suspicious/useAwait: <explanation> */}
            {async () => {
              "use server";
              return <CreateRbacModal />;
            }}
          </Allow>
        }
      />

      <Card className="mt-3">
        <div className="p-6" />
      </Card>
    </div>
  );
}
