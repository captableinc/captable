import { RBAC } from "@/lib/rbac";
import { getPermissions } from "@/lib/rbac/access-control";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { REPORTS, isReportType } from "@/server/reports";

export const GET = async (
  _req: Request,
  { params }: { params: { type: string } },
) => {
  const session = await getServerAuthSession();

  if (!session?.user?.companyId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { err, val } = await getPermissions({ db, session });

  if (err) {
    return new Response("Forbidden", { status: 403 });
  }

  const rbac = new RBAC();
  rbac.addPolicies({ stakeholder: { allow: ["read"] } });
  const enforced = rbac.enforce(val.permissions);

  if (enforced.err || !enforced.val.valid) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!isReportType(params.type)) {
    return new Response("Not found", { status: 404 });
  }

  const report = await REPORTS[params.type].generate(val.membership.companyId);

  return new Response(report.body, {
    headers: {
      "Content-Type": report.contentType,
      "Content-Disposition": `attachment; filename="${report.filename}"`,
      "Cache-Control": "no-store",
    },
  });
};
