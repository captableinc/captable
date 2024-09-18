import { AuditTable } from "@/components/audit/audit-table";
import { Card } from "@/components/ui/card";
import { UnAuthorizedState } from "@/components/ui/un-authorized-state";
import { serverAccessControl } from "@/lib/rbac/access-control";
import { api } from "@/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audits",
};

const AuditsPage = async () => {
  const { allow } = await serverAccessControl();

  const canView = allow(true, ["audits", "read"]);

  if (!canView) {
    return <UnAuthorizedState />;
  }

  const audits = await api.audit.getAudits({});
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">Audits</h3>
          <p className="text-sm text-muted-foreground">
            Manage your company{`'`}s audits
          </p>
        </div>
      </div>
      <Card className="mt-3">
        <AuditTable audits={audits.data} />
      </Card>
    </div>
  );
};

export default AuditsPage;
