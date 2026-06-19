import { getCapTable, toPercent } from "./captable";

export type OwnershipSlice = {
  key: string;
  value: number; // percentage on a fully-diluted basis
};

export type ShareClassSummary = {
  id: string;
  name: string;
  authorized: number;
  diluted: number;
  ownership: number; // percentage on a fully-diluted basis
  raised: number;
};

export type OverviewData = {
  amountRaised: number;
  fullyDilutedShares: number;
  stakeholderCount: number;
  ownershipByStakeholder: OwnershipSlice[];
  ownershipByShareClass: OwnershipSlice[];
  summary: ShareClassSummary[];
  totalRaised: number;
  isEmpty: boolean;
};

// Cap the number of donut slices; the long tail is grouped into "Others"
const MAX_STAKEHOLDER_SLICES = 6;

export const getOverviewData = async (
  companyId: string,
): Promise<OverviewData> => {
  const capTable = await getCapTable(companyId);
  const { fullyDilutedShares } = capTable.summary;

  const ownershipByStakeholder: OwnershipSlice[] = capTable.rows
    .slice(0, MAX_STAKEHOLDER_SLICES)
    .map((row) => ({
      key: row.name,
      value: toPercent(row.fullyDilutedTotal, fullyDilutedShares),
    }));

  const othersQuantity = capTable.rows
    .slice(MAX_STAKEHOLDER_SLICES)
    .reduce((sum, row) => sum + row.fullyDilutedTotal, 0);

  if (othersQuantity > 0) {
    ownershipByStakeholder.push({
      key: "Others",
      value: toPercent(othersQuantity, fullyDilutedShares),
    });
  }

  if (capTable.pool.available > 0) {
    ownershipByStakeholder.push({
      key: "Equity plan",
      value: capTable.pool.fdPercent,
    });
  }

  const ownershipByShareClass: OwnershipSlice[] = capTable.shareClasses
    .map((shareClass) => ({
      key: shareClass.name,
      value: toPercent(shareClass.issued, fullyDilutedShares),
    }))
    .filter((slice) => slice.value > 0);

  const stockPlanShares =
    capTable.totals.optionsTotal + capTable.pool.available;

  if (stockPlanShares > 0) {
    ownershipByShareClass.push({
      key: "Stock plan",
      value: toPercent(stockPlanShares, fullyDilutedShares),
    });
  }

  const summary: ShareClassSummary[] = capTable.shareClasses.map(
    (shareClass) => ({
      id: shareClass.id,
      name: shareClass.name,
      authorized: shareClass.authorized,
      diluted: shareClass.issued,
      ownership: toPercent(shareClass.issued, fullyDilutedShares),
      raised: shareClass.raised,
    }),
  );

  if (stockPlanShares > 0) {
    summary.push({
      id: "stock-plan",
      name: "Stock plan",
      authorized: capTable.pool.reserved,
      diluted: stockPlanShares,
      ownership: toPercent(stockPlanShares, fullyDilutedShares),
      raised: 0,
    });
  }

  const totalRaised = summary.reduce((sum, row) => sum + row.raised, 0);

  return {
    amountRaised: capTable.summary.amountRaised,
    fullyDilutedShares,
    stakeholderCount: capTable.summary.stakeholderCount,
    ownershipByStakeholder,
    ownershipByShareClass,
    summary,
    totalRaised,
    isEmpty: capTable.summary.isEmpty,
  };
};
