import { Document, Font, Page, StyleSheet, Text } from '@react-pdf/renderer'

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf',
})

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Oswald',
  },
  text: {
    margin: 5,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
  },
})

export interface AuditLogTemplateProps {
  audits: { id: string; summary: string }[]
}

export function AuditLogTemplate({ audits }: AuditLogTemplateProps) {
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.title}>eSigning audit logs</Text>
        {audits.map((item) => (
          <Text key={item.id} style={styles.text}>
            {item.summary}
          </Text>
        ))}
      </Page>
    </Document>
  )
}
