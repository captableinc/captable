import { dayjsExt } from "@/common/dayjs";
import type { CapTable } from "@/server/captable";

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 16,
    textAlign: "right",
    fontFamily: "Oswald",
  },
  companyName: {
    fontSize: 14,
  },
  muted: {
    fontSize: 9,
    color: "#71717a",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#e4e4e7",
    margin: "10 0",
  },
  sectionTitle: {
    fontSize: 12,
    marginTop: 14,
    marginBottom: 6,
  },
  summaryContainer: {
    flexDirection: "row",
    width: "100%",
  },
  summaryColumn: {
    flex: 1,
    paddingRight: 10,
  },
  summaryLabel: {
    fontSize: 9,
    color: "#71717a",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 12,
  },
  table: {
    display: "flex",
    width: "auto",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e4e4e7",
    paddingVertical: 4,
  },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: "#a1a1aa",
  },
});

const formatter = new Intl.NumberFormat("en-US");
const money = (value: number) => `$ ${formatter.format(value)}`;

type CellProps = {
  width: string;
  value: string;
  fontSize: number;
  align?: "left" | "right";
  bold?: boolean;
};

const Cell = ({ width, value, fontSize, align = "left", bold }: CellProps) => (
  <View style={{ width }}>
    <Text
      style={{
        fontSize,
        textAlign: align,
        paddingRight: align === "right" ? 4 : 0,
        ...(bold ? { fontFamily: "Helvetica-Bold" } : {}),
      }}
    >
      {value}
    </Text>
  </View>
);

export interface CapTableTemplateProps {
  company: {
    name: string;
    streetAddress: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  };
  capTable: CapTable;
  generatedAt: Date;
}

export function CapTableTemplate({
  company,
  capTable,
  generatedAt,
}: CapTableTemplateProps) {
  const { shareClasses, rows, pool, totals, convertibles, summary } = capTable;

  // Matrix column widths: stakeholder, relationship, one per class, options, FD, %
  const matrixFontSize = shareClasses.length > 6 ? 7 : 9;
  const nameWidth = 18;
  const relationshipWidth = 12;
  const numericColumns = shareClasses.length + 3;
  const numericWidth = (100 - nameWidth - relationshipWidth) / numericColumns;
  const nw = `${nameWidth}%`;
  const rw = `${relationshipWidth}%`;
  const cw = `${numericWidth}%`;

  const generatedLine = `Generated on ${dayjsExt(generatedAt).format("ll")}`;

  return (
    <Document>
      {/* Page 1 — summary */}
      <Page style={styles.body}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.muted}>
              {company.streetAddress}, {company.city}, {company.state}{" "}
              {company.zipcode}, {company.country}
            </Text>
          </View>
          <View>
            <Text style={styles.headerText}>Cap table</Text>
            <Text style={styles.muted}>{generatedLine}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryContainer}>
          <View style={styles.summaryColumn}>
            <Text style={styles.summaryLabel}>Fully-diluted shares</Text>
            <Text style={styles.summaryValue}>
              {formatter.format(summary.fullyDilutedShares)}
            </Text>
          </View>
          <View style={styles.summaryColumn}>
            <Text style={styles.summaryLabel}>Amount raised</Text>
            <Text style={styles.summaryValue}>
              {money(summary.amountRaised)}
            </Text>
          </View>
          <View style={styles.summaryColumn}>
            <Text style={styles.summaryLabel}>Stakeholders</Text>
            <Text style={styles.summaryValue}>{summary.stakeholderCount}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Share classes</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Cell width="28%" value="Share class" fontSize={9} bold />
            <Cell
              width="18%"
              value="Authorized"
              fontSize={9}
              align="right"
              bold
            />
            <Cell width="18%" value="Issued" fontSize={9} align="right" bold />
            <Cell
              width="18%"
              value="Ownership"
              fontSize={9}
              align="right"
              bold
            />
            <Cell width="18%" value="Raised" fontSize={9} align="right" bold />
          </View>
          {shareClasses.map((shareClass) => (
            <View style={styles.tableRow} key={shareClass.id}>
              <Cell width="28%" value={shareClass.name} fontSize={9} />
              <Cell
                width="18%"
                value={formatter.format(shareClass.authorized)}
                fontSize={9}
                align="right"
              />
              <Cell
                width="18%"
                value={formatter.format(shareClass.issued)}
                fontSize={9}
                align="right"
              />
              <Cell
                width="18%"
                value={`${(shareClass.issued && summary.fullyDilutedShares
                  ? Math.round(
                      (shareClass.issued / summary.fullyDilutedShares) * 10000,
                    ) / 100
                  : 0
                ).toString()} %`}
                fontSize={9}
                align="right"
              />
              <Cell
                width="18%"
                value={money(shareClass.raised)}
                fontSize={9}
                align="right"
              />
            </View>
          ))}
          {pool.reserved > 0 && (
            <View style={styles.tableRow}>
              <Cell width="28%" value="Stock plan" fontSize={9} />
              <Cell
                width="18%"
                value={formatter.format(pool.reserved)}
                fontSize={9}
                align="right"
              />
              <Cell
                width="18%"
                value={formatter.format(pool.granted + pool.available)}
                fontSize={9}
                align="right"
              />
              <Cell
                width="18%"
                value={`${(summary.fullyDilutedShares
                  ? Math.round(
                      ((pool.granted + pool.available) /
                        summary.fullyDilutedShares) *
                        10000,
                    ) / 100
                  : 0
                ).toString()} %`}
                fontSize={9}
                align="right"
              />
              <Cell width="18%" value={money(0)} fontSize={9} align="right" />
            </View>
          )}
        </View>

        {convertibles.safes.length + convertibles.notes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Convertible instruments (not yet converted)
            </Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Cell width="20%" value="Type" fontSize={9} bold />
                <Cell width="15%" value="ID" fontSize={9} bold />
                <Cell width="25%" value="Holder" fontSize={9} bold />
                <Cell width="15%" value="Status" fontSize={9} bold />
                <Cell
                  width="25%"
                  value="Capital"
                  fontSize={9}
                  align="right"
                  bold
                />
              </View>
              {[
                ...convertibles.safes.map((safe) => ({
                  ...safe,
                  kind: "SAFE",
                })),
                ...convertibles.notes.map((note) => ({
                  ...note,
                  kind: "Convertible note",
                })),
              ].map((instrument) => (
                <View style={styles.tableRow} key={instrument.id}>
                  <Cell width="20%" value={instrument.kind} fontSize={9} />
                  <Cell width="15%" value={instrument.publicId} fontSize={9} />
                  <Cell
                    width="25%"
                    value={instrument.stakeholderName}
                    fontSize={9}
                  />
                  <Cell width="15%" value={instrument.status} fontSize={9} />
                  <Cell
                    width="25%"
                    value={money(instrument.capital)}
                    fontSize={9}
                    align="right"
                  />
                </View>
              ))}
              <View style={styles.totalRow}>
                <Cell width="75%" value="Total" fontSize={9} bold />
                <Cell
                  width="25%"
                  value={money(convertibles.totalCapital)}
                  fontSize={9}
                  align="right"
                  bold
                />
              </View>
            </View>
          </>
        )}
      </Page>

      {/* Page 2 — fully-diluted ownership matrix */}
      <Page style={styles.body} orientation="landscape">
        <View style={styles.headerContainer}>
          <Text style={styles.companyName}>{company.name}</Text>
          <View>
            <Text style={styles.headerText}>Ownership by stakeholder</Text>
            <Text style={styles.muted}>{generatedLine}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Cell
              width={nw}
              value="Stakeholder"
              fontSize={matrixFontSize}
              bold
            />
            <Cell
              width={rw}
              value="Relationship"
              fontSize={matrixFontSize}
              bold
            />
            {shareClasses.map((shareClass) => (
              <Cell
                key={shareClass.id}
                width={cw}
                value={shareClass.name}
                fontSize={matrixFontSize}
                align="right"
                bold
              />
            ))}
            <Cell
              width={cw}
              value="Options"
              fontSize={matrixFontSize}
              align="right"
              bold
            />
            <Cell
              width={cw}
              value="Fully diluted"
              fontSize={matrixFontSize}
              align="right"
              bold
            />
          </View>

          {rows.map((row) => (
            <View style={styles.tableRow} key={row.stakeholderId}>
              <Cell width={nw} value={row.name} fontSize={matrixFontSize} />
              <Cell
                width={rw}
                value={row.relationship}
                fontSize={matrixFontSize}
              />
              {shareClasses.map((shareClass) => (
                <Cell
                  key={shareClass.id}
                  width={cw}
                  value={formatter.format(
                    row.sharesByClassId[shareClass.id] ?? 0,
                  )}
                  fontSize={matrixFontSize}
                  align="right"
                />
              ))}
              <Cell
                width={cw}
                value={formatter.format(row.optionsTotal)}
                fontSize={matrixFontSize}
                align="right"
              />
              <Cell
                width={cw}
                value={`${formatter.format(row.fullyDilutedTotal)} (${
                  row.fdPercent
                } %)`}
                fontSize={matrixFontSize}
                align="right"
              />
            </View>
          ))}

          {pool.available > 0 && (
            <View style={styles.tableRow}>
              <Cell
                width={nw}
                value="Equity plan pool"
                fontSize={matrixFontSize}
              />
              <Cell width={rw} value="Available" fontSize={matrixFontSize} />
              {shareClasses.map((shareClass) => (
                <Cell
                  key={shareClass.id}
                  width={cw}
                  value="—"
                  fontSize={matrixFontSize}
                  align="right"
                />
              ))}
              <Cell
                width={cw}
                value="—"
                fontSize={matrixFontSize}
                align="right"
              />
              <Cell
                width={cw}
                value={`${formatter.format(pool.available)} (${
                  pool.fdPercent
                } %)`}
                fontSize={matrixFontSize}
                align="right"
              />
            </View>
          )}

          <View style={styles.totalRow}>
            <Cell width={nw} value="Total" fontSize={matrixFontSize} bold />
            <Cell width={rw} value="" fontSize={matrixFontSize} />
            {shareClasses.map((shareClass) => (
              <Cell
                key={shareClass.id}
                width={cw}
                value={formatter.format(shareClass.issued)}
                fontSize={matrixFontSize}
                align="right"
                bold
              />
            ))}
            <Cell
              width={cw}
              value={formatter.format(totals.optionsTotal)}
              fontSize={matrixFontSize}
              align="right"
              bold
            />
            <Cell
              width={cw}
              value={`${formatter.format(totals.fullyDilutedTotal)} (100 %)`}
              fontSize={matrixFontSize}
              align="right"
              bold
            />
          </View>
        </View>
      </Page>
    </Document>
  );
}
