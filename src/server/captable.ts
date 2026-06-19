import {
  ConvertibleStatusEnum,
  OptionStatusEnum,
  SafeStatusEnum,
  type StakeholderRelationshipEnum,
  type StakeholderTypeEnum,
} from "@prisma/client";
import { db } from "./db";

export const toPercent = (quantity: number, total: number) =>
  total > 0 ? Math.round((quantity / total) * 10000) / 100 : 0;

export type CapTableShareClass = {
  id: string;
  name: string;
  idx: number;
  prefix: string;
  authorized: number;
  issued: number;
  raised: number;
};

export type CapTableRow = {
  stakeholderId: string;
  name: string;
  type: StakeholderTypeEnum;
  relationship: StakeholderRelationshipEnum;
  sharesByClassId: Record<string, number>;
  sharesTotal: number;
  optionsTotal: number;
  fullyDilutedTotal: number;
  fdPercent: number;
  capitalInvested: number;
};

export type CapTablePool = {
  reserved: number;
  granted: number;
  available: number;
  fdPercent: number;
};

export type CapTableConvertible = {
  id: string;
  publicId: string;
  stakeholderName: string;
  capital: number;
  status: SafeStatusEnum | ConvertibleStatusEnum;
  issueDate: Date;
};

export type CapTable = {
  shareClasses: CapTableShareClass[];
  rows: CapTableRow[];
  pool: CapTablePool;
  totals: {
    sharesTotal: number;
    optionsTotal: number;
    fullyDilutedTotal: number;
    capitalInvested: number;
  };
  convertibles: {
    safes: CapTableConvertible[];
    notes: CapTableConvertible[];
    totalCapital: number;
  };
  summary: {
    fullyDilutedShares: number;
    amountRaised: number;
    sharesCapital: number;
    safeCapital: number;
    noteCapital: number;
    stakeholderCount: number;
    isEmpty: boolean;
  };
};

export const getCapTable = async (companyId: string): Promise<CapTable> => {
  const [
    shareClasses,
    shares,
    options,
    equityPlans,
    safes,
    convertibleNotes,
    stakeholderCount,
  ] = await Promise.all([
    db.shareClass.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        idx: true,
        prefix: true,
        initialSharesAuthorized: true,
      },
      orderBy: { idx: "asc" },
    }),
    db.share.findMany({
      where: { companyId },
      select: {
        quantity: true,
        capitalContribution: true,
        shareClassId: true,
        stakeholder: {
          select: {
            id: true,
            name: true,
            stakeholderType: true,
            currentRelationship: true,
          },
        },
      },
    }),
    db.option.findMany({
      where: {
        companyId,
        status: {
          notIn: [OptionStatusEnum.CANCELLED, OptionStatusEnum.EXPIRED],
        },
      },
      select: {
        quantity: true,
        equityPlanId: true,
        stakeholder: {
          select: {
            id: true,
            name: true,
            stakeholderType: true,
            currentRelationship: true,
          },
        },
      },
    }),
    db.equityPlan.findMany({
      where: { companyId },
      select: { id: true, initialSharesReserved: true },
    }),
    db.safe.findMany({
      where: {
        companyId,
        status: { notIn: [SafeStatusEnum.CANCELLED, SafeStatusEnum.EXPIRED] },
      },
      select: {
        id: true,
        publicId: true,
        capital: true,
        status: true,
        issueDate: true,
        stakeholder: { select: { name: true } },
      },
      orderBy: { issueDate: "asc" },
    }),
    db.convertibleNote.findMany({
      where: {
        companyId,
        status: {
          notIn: [
            ConvertibleStatusEnum.CANCELLED,
            ConvertibleStatusEnum.EXPIRED,
          ],
        },
      },
      select: {
        id: true,
        publicId: true,
        capital: true,
        status: true,
        issueDate: true,
        stakeholder: { select: { name: true } },
      },
      orderBy: { issueDate: "asc" },
    }),
    db.stakeholder.count({ where: { companyId } }),
  ]);

  const issuedByClass = new Map<string, number>();
  const raisedByClass = new Map<string, number>();
  const grantedByPlan = new Map<string, number>();

  type Holding = Omit<CapTableRow, "fullyDilutedTotal" | "fdPercent">;
  const holdingsByStakeholder = new Map<string, Holding>();

  const holdingFor = (stakeholder: {
    id: string;
    name: string;
    stakeholderType: StakeholderTypeEnum;
    currentRelationship: StakeholderRelationshipEnum;
  }): Holding => {
    let holding = holdingsByStakeholder.get(stakeholder.id);

    if (!holding) {
      holding = {
        stakeholderId: stakeholder.id,
        name: stakeholder.name,
        type: stakeholder.stakeholderType,
        relationship: stakeholder.currentRelationship,
        sharesByClassId: {},
        sharesTotal: 0,
        optionsTotal: 0,
        capitalInvested: 0,
      };
      holdingsByStakeholder.set(stakeholder.id, holding);
    }

    return holding;
  };

  let issuedShares = 0;
  let sharesCapital = 0;

  for (const share of shares) {
    const raised = share.capitalContribution ?? 0;
    issuedShares += share.quantity;
    sharesCapital += raised;

    issuedByClass.set(
      share.shareClassId,
      (issuedByClass.get(share.shareClassId) ?? 0) + share.quantity,
    );
    raisedByClass.set(
      share.shareClassId,
      (raisedByClass.get(share.shareClassId) ?? 0) + raised,
    );

    const holding = holdingFor(share.stakeholder);
    holding.sharesByClassId[share.shareClassId] =
      (holding.sharesByClassId[share.shareClassId] ?? 0) + share.quantity;
    holding.sharesTotal += share.quantity;
    holding.capitalInvested += raised;
  }

  let grantedOptions = 0;

  for (const option of options) {
    grantedOptions += option.quantity;

    grantedByPlan.set(
      option.equityPlanId,
      (grantedByPlan.get(option.equityPlanId) ?? 0) + option.quantity,
    );

    holdingFor(option.stakeholder).optionsTotal += option.quantity;
  }

  // Shares reserved for equity plans but not granted as options yet
  let poolReserved = 0;
  let poolAvailable = 0;

  for (const plan of equityPlans) {
    const reserved = Number(plan.initialSharesReserved);
    poolReserved += reserved;
    poolAvailable += Math.max(0, reserved - (grantedByPlan.get(plan.id) ?? 0));
  }

  const fullyDilutedShares = issuedShares + grantedOptions + poolAvailable;

  const safeCapital = safes.reduce((sum, safe) => sum + safe.capital, 0);
  const noteCapital = convertibleNotes.reduce(
    (sum, note) => sum + note.capital,
    0,
  );
  const amountRaised = sharesCapital + safeCapital + noteCapital;

  const rows: CapTableRow[] = Array.from(holdingsByStakeholder.values())
    .map((holding) => {
      const fullyDilutedTotal = holding.sharesTotal + holding.optionsTotal;

      return {
        ...holding,
        fullyDilutedTotal,
        fdPercent: toPercent(fullyDilutedTotal, fullyDilutedShares),
      };
    })
    .filter((row) => row.fullyDilutedTotal > 0)
    .sort((a, b) => b.fullyDilutedTotal - a.fullyDilutedTotal);

  const toConvertible = (instrument: {
    id: string;
    publicId: string;
    capital: number;
    status: SafeStatusEnum | ConvertibleStatusEnum;
    issueDate: Date;
    stakeholder: { name: string };
  }): CapTableConvertible => ({
    id: instrument.id,
    publicId: instrument.publicId,
    stakeholderName: instrument.stakeholder.name,
    capital: instrument.capital,
    status: instrument.status,
    issueDate: instrument.issueDate,
  });

  return {
    shareClasses: shareClasses.map((shareClass) => ({
      id: shareClass.id,
      name: shareClass.name,
      idx: shareClass.idx,
      prefix: shareClass.prefix,
      authorized: Number(shareClass.initialSharesAuthorized),
      issued: issuedByClass.get(shareClass.id) ?? 0,
      raised: raisedByClass.get(shareClass.id) ?? 0,
    })),
    rows,
    pool: {
      reserved: poolReserved,
      granted: grantedOptions,
      available: poolAvailable,
      fdPercent: toPercent(poolAvailable, fullyDilutedShares),
    },
    totals: {
      sharesTotal: issuedShares,
      optionsTotal: grantedOptions,
      fullyDilutedTotal: fullyDilutedShares,
      capitalInvested: sharesCapital,
    },
    convertibles: {
      safes: safes.map(toConvertible),
      notes: convertibleNotes.map(toConvertible),
      totalCapital: safeCapital + noteCapital,
    },
    summary: {
      fullyDilutedShares,
      amountRaised,
      sharesCapital,
      safeCapital,
      noteCapital,
      stakeholderCount,
      // No equity issued, reserved or raised yet — nothing meaningful to chart
      isEmpty: fullyDilutedShares === 0 && amountRaised === 0,
    },
  };
};
