"use client";

import React from "react";
import dynamic from "next/dynamic";

// PDFDownloadLink'i dynamic import ile yükle (sadece client-side)
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <button
        className="bg-[#171719] border border-white/10 dark:bg-[#131313] text-white px-6 py-3 rounded-xl flex-1 font-medium"
        disabled
      >
        Loading PDF...
      </button>
    ),
  }
);

// PDF Document component'i dynamic import ile yükle
const PDFDocument = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.Document),
  {
    ssr: false,
  }
);

const PDFPage = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.Page),
  {
    ssr: false,
  }
);

const PDFText = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.Text),
  {
    ssr: false,
  }
);

const PDFView = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.View),
  {
    ssr: false,
  }
);

interface InvoicePDFProps {
  subscription: {
    stripeSubscriptionId: string;
    customer: string;
    customerEmail: string;
    product: string;
    amount: number;
    currency: string;
    renewalDate: Date;
    subscriptionDate: Date;
  };
  billingInfo: {
    billingName: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const InvoicePDFDocument = ({ subscription, billingInfo }: InvoicePDFProps) => {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  // Dynamic import for StyleSheet
  const [StyleSheet, setStyleSheet] = React.useState(null);

  React.useEffect(() => {
    import("@react-pdf/renderer").then((mod) => {
      setStyleSheet(mod.StyleSheet);
    });
  }, []);

  if (!StyleSheet) {
    return null; // Loading state
  }

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      padding: 40,
      fontFamily: "Helvetica",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 40,
      borderBottom: 2,
      borderBottomColor: "#000000",
      paddingBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#000000",
    },
    companyInfo: {
      fontSize: 12,
      textAlign: "right",
      color: "#666666",
    },
    invoiceInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#000000",
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
      color: "#333333",
    },
    billTo: {
      backgroundColor: "#f5f5f5",
      padding: 15,
      marginBottom: 20,
    },
    table: {
      marginVertical: 20,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#333333",
      color: "#ffffff",
      padding: 10,
    },
    tableRow: {
      flexDirection: "row",
      borderBottom: 1,
      borderBottomColor: "#e5e5e5",
      padding: 10,
    },
    tableCell: {
      flex: 1,
      fontSize: 12,
    },
    tableCellHeader: {
      flex: 1,
      fontSize: 12,
      fontWeight: "bold",
      color: "#ffffff",
    },
    total: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 20,
      padding: 15,
      backgroundColor: "#f0f0f0",
    },
    totalText: {
      fontSize: 16,
      fontWeight: "bold",
    },
    footer: {
      marginTop: 40,
      textAlign: "center",
      fontSize: 10,
      color: "#666666",
    },
  });

  return (
    <PDFDocument>
      <PDFPage size="A4" style={styles.page}>
        {/* Header */}
        <PDFView style={styles.header}>
          <PDFView>
            <PDFText style={styles.title}>INVOICE</PDFText>
          </PDFView>
          <PDFView style={styles.companyInfo}>
            <PDFText>MOYDUS LLC</PDFText>
            <PDFText>Professional Web Services</PDFText>
            <PDFText>contact@moydus.com</PDFText>
          </PDFView>
        </PDFView>

        {/* Invoice Info */}
        <PDFView style={styles.invoiceInfo}>
          <PDFView>
            <PDFText style={styles.text}>
              Invoice #: {subscription.stripeSubscriptionId}
            </PDFText>
            <PDFText style={styles.text}>
              Date: {formatDate(new Date())}
            </PDFText>
            <PDFText style={styles.text}>
              Due Date: {formatDate(subscription.renewalDate)}
            </PDFText>
          </PDFView>
          <PDFView>
            <PDFText style={styles.text}>
              Subscription Date: {formatDate(subscription.subscriptionDate)}
            </PDFText>
            <PDFText style={styles.text}>
              Next Billing: {formatDate(subscription.renewalDate)}
            </PDFText>
          </PDFView>
        </PDFView>

        {/* Bill To */}
        <PDFView style={styles.billTo}>
          <PDFText style={styles.sectionTitle}>BILL TO:</PDFText>
          <PDFText style={styles.text}>{billingInfo.billingName}</PDFText>
          <PDFText style={styles.text}>{subscription.customerEmail}</PDFText>
          <PDFText style={styles.text}>{billingInfo.line1}</PDFText>
          {billingInfo.line2 && (
            <PDFText style={styles.text}>{billingInfo.line2}</PDFText>
          )}
          <PDFText style={styles.text}>
            {billingInfo.city}, {billingInfo.state} {billingInfo.postalCode}
          </PDFText>
          <PDFText style={styles.text}>{billingInfo.country}</PDFText>
        </PDFView>

        {/* Service Table */}
        <PDFView style={styles.table}>
          <PDFView style={styles.tableHeader}>
            <PDFText style={styles.tableCellHeader}>Description</PDFText>
            <PDFText style={styles.tableCellHeader}>Period</PDFText>
            <PDFText style={styles.tableCellHeader}>Amount</PDFText>
          </PDFView>
          <PDFView style={styles.tableRow}>
            <PDFText style={styles.tableCell}>{subscription.product}</PDFText>
            <PDFText style={styles.tableCell}>Monthly Subscription</PDFText>
            <PDFText style={styles.tableCell}>
              {formatPrice(subscription.amount, subscription.currency)}
            </PDFText>
          </PDFView>
        </PDFView>

        {/* Total */}
        <PDFView style={styles.total}>
          <PDFText style={styles.totalText}>
            Total: {formatPrice(subscription.amount, subscription.currency)}
          </PDFText>
        </PDFView>

        {/* Footer */}
        <PDFView style={styles.footer}>
          <PDFText>Thank you for choosing MOYDUS LLC!</PDFText>
          <PDFText>For support, contact us at support@moydus.com</PDFText>
        </PDFView>
      </PDFPage>
    </PDFDocument>
  );
};

interface InvoicePDFClientProps extends InvoicePDFProps {
  onDownloadComplete?: () => void;
}

const InvoicePDF = ({
  subscription,
  billingInfo,
  onDownloadComplete,
}: InvoicePDFClientProps) => {
  const fileName = `invoice-${subscription.stripeSubscriptionId}-${new Date().toISOString().split("T")[0]}.pdf`;

  return (
    <PDFDownloadLink
      document={
        <InvoicePDFDocument
          subscription={subscription}
          billingInfo={billingInfo}
        />
      }
      fileName={fileName}
    >
      {({ loading }) => (
        <button
          className="bg-[#171719] border border-white/10 dark:bg-[#131313] dark:hover:bg-[#171719] text-white px-6 py-3 rounded-xl hover:opacity-90 flex-1 font-medium"
          disabled={loading}
          onClick={() => {
            if (!loading && onDownloadComplete) {
              setTimeout(() => onDownloadComplete(), 100);
            }
          }}
        >
          {loading ? "Generating PDF..." : "Download Invoice PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default InvoicePDF;
