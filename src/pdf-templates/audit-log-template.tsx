import { dayjsExt } from "@/common/dayjs";
import type { TEsignAuditSchema } from "@/server/audit/schema";
import type { TGetEsignAudits } from "@/server/esign";

import {
  Document,
  Font,
  Page,
  Path,
  Rect,
  StyleSheet,
  Svg,
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
  title: {
    fontSize: 14,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#e4e4e7",
    margin: "10 0",
  },

  text: {
    fontSize: 12,
  },
  table: {
    display: "flex",
    width: "auto",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "50%",
  },
  tableCell: {
    marginTop: 5,
    fontSize: 10,
  },
  container: {
    flexDirection: "row",
    width: "100%",
  },
  column: {
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    textAlign: "right",

    fontFamily: "Oswald",
  },
});
const Logo = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 1200 1200" fill="none">
      <Rect width="1200" height="1200" rx="24" fill="#18181B" />
      <Path
        d="M200 599.561C200 387.376 364.852 213.737 573.333 200V414.583C482.872 427.536 413.333 505.419 413.333 599.561C413.333 702.767 496.907 786.434 600 786.434C641.93 786.434 680.63 772.589 711.792 749.225L863.36 900.964C793.003 962.626 700.86 1000 600 1000C379.086 1000 200 820.716 200 599.561Z"
        fill="white"
      />
      <Path
        d="M901.072 863.211C962.672 792.771 1000 700.53 1000 599.561C1000 544.38 988.848 491.806 968.683 443.973L773.611 530.767C782.037 552.058 786.667 575.268 786.667 599.561C786.667 641.535 772.843 680.277 749.504 711.473L901.072 863.211Z"
        fill="white"
        fill-opacity="0.75"
      />
      <Path
        d="M626.667 414.583V200C762.219 208.932 879.323 285.46 944.672 396.23L746.885 484.23C717.9 447.286 675.308 421.548 626.667 414.583Z"
        fill="white"
        fill-opacity="0.5"
      />
    </Svg>
  );
};

const humanizedStatus: Record<TEsignAuditSchema["action"], string> = {
  "document.complete": "Document completed",
  "document.email.sent": "Email sent",
  "recipient.signed": "Signed",
};

export interface AuditLogTemplateProps {
  audits: TGetEsignAudits;
  templateName: string;
}

export function AuditLogTemplate({
  audits,
  templateName,
}: AuditLogTemplateProps) {
  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.headerContainer}>
          <View style={styles.column}>
            <Logo />
          </View>
          <View style={styles.column}>
            <Text style={styles.headerText}>Audit Logs</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>File Name</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{templateName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />
        <Text style={styles.title}>Document history</Text>
        {audits.map((item) => (
          <View style={styles.container} key={item.id}>
            <View style={styles.column}>
              <Text style={styles.text}>
                {humanizedStatus?.[
                  item.action as keyof typeof humanizedStatus
                ] ?? "unknown action"}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.text}>
                {dayjsExt(item.occurredAt).format("llll")}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.text}>{item.summary}</Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
