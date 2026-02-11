import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { format } from "date-fns";

export interface FeeProposalData {
  client: {
    businessName: string;
    clientType: string;
  };
  leaseCount: number;
  totalRent: number;
  totalValueAdd: number;
  recommendations: Array<{
    lease: string;
    title: string;
    impact: number;
  }>;
  feeModel: string;
  feeAmount: number;
  feeDetail: string;
  settings: {
    companyName: string;
    tagline: string;
    licenceNumber: string;
    disclaimer: string;
  };
}

const navy = "#1e3a5f";
const navyLight = "#486581";
const green = "#16a34a";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 50,
    color: "#1a1a1a",
  },
  coverPage: {
    fontFamily: "Helvetica",
    padding: 50,
    color: "#ffffff",
    backgroundColor: navy,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 16,
    marginBottom: 40,
    opacity: 0.8,
  },
  coverDetail: {
    fontSize: 12,
    marginBottom: 6,
    opacity: 0.9,
  },
  coverFooter: {
    position: "absolute",
    bottom: 50,
    left: 50,
    right: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: navy,
    marginBottom: 16,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: navy,
  },
  subTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: navy,
    marginBottom: 8,
    marginTop: 14,
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  label: {
    fontSize: 8,
    color: navyLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  col2: {
    flex: 1,
  },
  col3: {
    width: "33%",
  },
  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  table: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: navy,
    color: "#ffffff",
    padding: 6,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    padding: 6,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    padding: 6,
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    fontSize: 9,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: navyLight,
  },
});

function fmtCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-AU", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function PageFooter({ companyName, date }: { companyName: string; date: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text>{companyName} — Confidential</Text>
      <Text>{date}</Text>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

export function FeeProposalPdf({ data }: { data: FeeProposalData }) {
  const reportDate = format(new Date(), "dd/MM/yyyy");
  const feePercent =
    data.totalValueAdd > 0 ? (data.feeAmount / data.totalValueAdd) * 100 : 0;

  return (
    <Document>
      {/* Cover */}
      <Page size="A4" style={styles.coverPage}>
        <View style={{ marginTop: 120 }}>
          <Text style={styles.coverTitle}>Fee Proposal</Text>
          <Text style={styles.coverSubtitle}>
            Lease Advisory Services for {data.client.businessName}
          </Text>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.coverDetail}>
              Prepared: {reportDate}
            </Text>
            <Text style={styles.coverDetail}>
              Leases Under Advisory: {data.leaseCount}
            </Text>
            <Text style={styles.coverDetail}>
              Total Annual Rent: {fmtCurrency(data.totalRent)}
            </Text>
          </View>
        </View>
        <View style={styles.coverFooter}>
          <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold" }}>
            {data.settings.companyName}
          </Text>
          <Text style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>
            {data.settings.tagline}
          </Text>
        </View>
      </Page>

      {/* Portfolio Summary + Fee */}
      <Page size="A4" style={styles.page}>
        <PageFooter companyName={data.settings.companyName} date={reportDate} />
        <Text style={styles.sectionTitle}>Portfolio Overview</Text>

        <View style={styles.row}>
          <View style={[styles.card, { flex: 1, textAlign: "center" }]}>
            <Text style={styles.label}>Leases Analysed</Text>
            <Text style={{ fontSize: 24, fontFamily: "Helvetica-Bold", color: navy }}>
              {data.leaseCount}
            </Text>
          </View>
          <View style={[styles.card, { flex: 1, textAlign: "center" }]}>
            <Text style={styles.label}>Annual Rent Under Advisory</Text>
            <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: navy }}>
              {fmtCurrency(data.totalRent)}
            </Text>
          </View>
          <View style={[styles.card, { flex: 1, textAlign: "center", borderColor: green }]}>
            <Text style={styles.label}>Identified Value-Add</Text>
            <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: green }}>
              {fmtCurrency(data.totalValueAdd)}/yr
            </Text>
          </View>
        </View>

        <Text style={styles.subTitle}>Identified Opportunities</Text>
        {data.recommendations.length > 0 && (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Opportunity</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Lease</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}>
                Impact (p.a.)
              </Text>
            </View>
            {data.recommendations.map((rec, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, { flex: 2, fontFamily: "Helvetica-Bold" }]}>
                  {rec.title}
                </Text>
                <Text style={[styles.tableCell, { flex: 1, color: navyLight }]}>{rec.lease}</Text>
                <Text
                  style={[
                    styles.tableCell,
                    { flex: 1, textAlign: "right", fontFamily: "Helvetica-Bold", color: green },
                  ]}
                >
                  {fmtCurrency(rec.impact)}/yr
                </Text>
              </View>
            ))}
            <View style={[styles.tableRow, { backgroundColor: "#f0f4f8" }]}>
              <Text style={[styles.tableCell, { flex: 2, fontFamily: "Helvetica-Bold" }]}>
                Total
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]} />
              <Text
                style={[
                  styles.tableCell,
                  { flex: 1, textAlign: "right", fontFamily: "Helvetica-Bold", color: green },
                ]}
              >
                {fmtCurrency(data.totalValueAdd)}/yr
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Proposed Fee</Text>

        <View style={[styles.card, { borderColor: navy, textAlign: "center", padding: 20 }]}>
          <Text style={styles.label}>Fee Model: {data.feeDetail}</Text>
          <Text style={{ fontSize: 32, fontFamily: "Helvetica-Bold", color: navy, marginVertical: 8 }}>
            {fmtCurrency(data.feeAmount)}
          </Text>
          {data.totalValueAdd > 0 && (
            <Text style={{ fontSize: 10, color: navyLight }}>
              Representing just {feePercent.toFixed(1)}% of the {fmtCurrency(data.totalValueAdd)} in
              identified annual value improvements
            </Text>
          )}
        </View>

        <View style={{ marginTop: 20, padding: 12, backgroundColor: "#f9fafb", borderRadius: 4 }}>
          <Text style={{ fontSize: 8, color: "#6b7280", lineHeight: 1.5 }}>
            {data.settings.disclaimer}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
