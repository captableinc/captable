import { dayjsExt } from "@/common/dayjs";
import { CapTableTemplate } from "@/pdf-templates/captable-template";
import { renderToBuffer } from "@react-pdf/renderer";
import Papa from "papaparse";
import { type CapTable, getCapTable } from "./captable";
import { db } from "./db";

export const REPORT_TYPES = [
  "captable-summary-pdf",
  "captable-csv",
  "securities-ledger-csv",
  "stakeholders-csv",
] as const;

export type TReportType = (typeof REPORT_TYPES)[number];

export const isReportType = (type: string): type is TReportType =>
  (REPORT_TYPES as readonly string[]).includes(type);

type GeneratedReport = {
  body: Buffer | string;
  contentType: string;
  filename: string;
};

const stamp = () => dayjsExt().format("YYYY-MM-DD");
const date = (value: Date | null | undefined) =>
  value ? dayjsExt(value).format("YYYY-MM-DD") : "";

// Column headers for the matrix CSV; duplicate class names get the
// share class prefix and index appended so columns stay distinguishable
const shareClassHeaders = (shareClasses: CapTable["shareClasses"]) => {
  const nameCounts = new Map<string, number>();

  for (const shareClass of shareClasses) {
    nameCounts.set(shareClass.name, (nameCounts.get(shareClass.name) ?? 0) + 1);
  }

  return shareClasses.map((shareClass) =>
    (nameCounts.get(shareClass.name) ?? 0) > 1
      ? `${shareClass.name} (${shareClass.prefix}-${shareClass.idx})`
      : shareClass.name,
  );
};

const generateCapTablePdf = async (
  companyId: string,
): Promise<GeneratedReport> => {
  const [capTable, company] = await Promise.all([
    getCapTable(companyId),
    db.company.findUniqueOrThrow({
      where: { id: companyId },
      select: {
        name: true,
        streetAddress: true,
        city: true,
        state: true,
        zipcode: true,
        country: true,
      },
    }),
  ]);

  const body = await renderToBuffer(
    CapTableTemplate({ company, capTable, generatedAt: new Date() }),
  );

  return {
    body,
    contentType: "application/pdf",
    filename: `captable-summary-${stamp()}.pdf`,
  };
};

const generateCapTableCsv = async (
  companyId: string,
): Promise<GeneratedReport> => {
  const capTable = await getCapTable(companyId);
  const { shareClasses, rows, pool, totals, summary } = capTable;

  const fields = [
    "Stakeholder",
    "Type",
    "Relationship",
    ...shareClassHeaders(shareClasses),
    "Options",
    "Fully diluted shares",
    "Fully diluted %",
    "Capital invested",
  ];

  const data = rows.map((row) => [
    row.name,
    row.type,
    row.relationship,
    ...shareClasses.map(
      (shareClass) => row.sharesByClassId[shareClass.id] ?? 0,
    ),
    row.optionsTotal,
    row.fullyDilutedTotal,
    row.fdPercent,
    row.capitalInvested,
  ]);

  if (pool.available > 0) {
    data.push([
      "Equity plan pool (available)",
      "",
      "",
      ...shareClasses.map(() => 0),
      0,
      pool.available,
      pool.fdPercent,
      0,
    ]);
  }

  data.push([
    "Total",
    "",
    "",
    ...shareClasses.map((shareClass) => shareClass.issued),
    totals.optionsTotal,
    summary.fullyDilutedShares,
    summary.fullyDilutedShares > 0 ? 100 : 0,
    totals.capitalInvested,
  ]);

  return {
    body: Papa.unparse({ fields, data }),
    contentType: "text/csv",
    filename: `captable-${stamp()}.csv`,
  };
};

const generateSecuritiesLedgerCsv = async (
  companyId: string,
): Promise<GeneratedReport> => {
  const [shares, options] = await Promise.all([
    db.share.findMany({
      where: { companyId },
      select: {
        certificateId: true,
        quantity: true,
        pricePerShare: true,
        capitalContribution: true,
        status: true,
        issueDate: true,
        boardApprovalDate: true,
        vestingStartDate: true,
        stakeholder: { select: { name: true } },
        shareClass: { select: { name: true } },
      },
      orderBy: { issueDate: "asc" },
    }),
    db.option.findMany({
      where: { companyId },
      select: {
        grantId: true,
        quantity: true,
        exercisePrice: true,
        type: true,
        status: true,
        issueDate: true,
        boardApprovalDate: true,
        vestingStartDate: true,
        expirationDate: true,
        stakeholder: { select: { name: true } },
        equityPlan: { select: { name: true } },
      },
      orderBy: { issueDate: "asc" },
    }),
  ]);

  const fields = [
    "Security",
    "ID",
    "Stakeholder",
    "Share class / Plan",
    "Quantity",
    "Price per share",
    "Exercise price",
    "Capital contribution",
    "Type",
    "Status",
    "Issue date",
    "Board approval date",
    "Vesting start date",
    "Expiration date",
  ];

  const data = [
    ...shares.map((share) => [
      "Share",
      share.certificateId,
      share.stakeholder.name,
      share.shareClass.name,
      share.quantity,
      share.pricePerShare ?? "",
      "",
      share.capitalContribution ?? "",
      "",
      share.status,
      date(share.issueDate),
      date(share.boardApprovalDate),
      date(share.vestingStartDate),
      "",
    ]),
    ...options.map((option) => [
      "Option",
      option.grantId,
      option.stakeholder.name,
      option.equityPlan.name,
      option.quantity,
      "",
      option.exercisePrice,
      "",
      option.type,
      option.status,
      date(option.issueDate),
      date(option.boardApprovalDate),
      date(option.vestingStartDate),
      date(option.expirationDate),
    ]),
  ];

  return {
    body: Papa.unparse({ fields, data }),
    contentType: "text/csv",
    filename: `securities-ledger-${stamp()}.csv`,
  };
};

const generateStakeholdersCsv = async (
  companyId: string,
): Promise<GeneratedReport> => {
  const stakeholders = await db.stakeholder.findMany({
    where: { companyId },
    select: {
      name: true,
      email: true,
      institutionName: true,
      stakeholderType: true,
      currentRelationship: true,
      streetAddress: true,
      city: true,
      state: true,
      zipcode: true,
      country: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const fields = [
    "Name",
    "Email",
    "Institution",
    "Type",
    "Relationship",
    "Street address",
    "City",
    "State",
    "Zip code",
    "Country",
    "Added on",
  ];

  const data = stakeholders.map((stakeholder) => [
    stakeholder.name,
    stakeholder.email,
    stakeholder.institutionName ?? "",
    stakeholder.stakeholderType,
    stakeholder.currentRelationship,
    stakeholder.streetAddress ?? "",
    stakeholder.city ?? "",
    stakeholder.state ?? "",
    stakeholder.zipcode ?? "",
    stakeholder.country,
    date(stakeholder.createdAt),
  ]);

  return {
    body: Papa.unparse({ fields, data }),
    contentType: "text/csv",
    filename: `stakeholders-${stamp()}.csv`,
  };
};

export const REPORTS: Record<
  TReportType,
  { generate: (companyId: string) => Promise<GeneratedReport> }
> = {
  "captable-summary-pdf": { generate: generateCapTablePdf },
  "captable-csv": { generate: generateCapTableCsv },
  "securities-ledger-csv": { generate: generateSecuritiesLedgerCsv },
  "stakeholders-csv": { generate: generateStakeholdersCsv },
};
