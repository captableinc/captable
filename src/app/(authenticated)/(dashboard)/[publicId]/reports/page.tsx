import ReportCard from "@/components/reports/report-card";
import { UnAuthorizedState } from "@/components/ui/un-authorized-state";
import { serverAccessControl } from "@/lib/rbac/access-control";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
};

const reports = [
  {
    type: "captable-summary-pdf",
    title: "Cap table summary",
    description:
      "Printable cap table: summary numbers, share classes and fully-diluted ownership by stakeholder.",
    format: "PDF",
  },
  {
    type: "captable-csv",
    title: "Cap table matrix",
    description:
      "Fully-diluted ownership by stakeholder and share class, as a spreadsheet.",
    format: "CSV",
  },
  {
    type: "securities-ledger-csv",
    title: "Securities ledger",
    description:
      "Every share certificate and option grant with quantities, prices, dates and statuses.",
    format: "CSV",
  },
  {
    type: "stakeholders-csv",
    title: "Stakeholders",
    description:
      "All stakeholders with their contact details, type and relationship.",
    format: "CSV",
  },
] as const;

const ReportsPage = async () => {
  const { allow } = await serverAccessControl();

  const canView = allow(true, ["stakeholder", "read"]);

  if (!canView) {
    return <UnAuthorizedState />;
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="gap-y-3">
        <h3 className="font-medium">Reports</h3>
        <p className="text-sm text-muted-foreground">
          Download reports generated from your company{`'`}s cap table
        </p>
      </div>

      <div className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <ReportCard
            key={report.type}
            type={report.type}
            title={report.title}
            description={report.description}
            format={report.format}
          />
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
