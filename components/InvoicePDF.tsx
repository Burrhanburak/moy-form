"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDFDownloadLink'i dynamic import ile yükle (sadece client-side)
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
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

// PDF için stiller
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottom: 2,
    borderBottomColor: '#000000',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  companyInfo: {
    fontSize: 12,
    textAlign: 'right',
    color: '#666666',
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#333333',
  },
  billTo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 20,
  },
  table: {
    marginVertical: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    color: '#ffffff',
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#e5e5e5',
    padding: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  },
});

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text>MOYDUS LLC</Text>
            <Text>Professional Web Services</Text>
            <Text>contact@moydus.com</Text>
          </View>
        </View>

        {/* Invoice Info */}
        <View style={styles.invoiceInfo}>
          <View>
            <Text style={styles.text}>Invoice #: {subscription.stripeSubscriptionId}</Text>
            <Text style={styles.text}>Date: {formatDate(new Date())}</Text>
            <Text style={styles.text}>Due Date: {formatDate(subscription.renewalDate)}</Text>
          </View>
          <View>
            <Text style={styles.text}>Subscription Date: {formatDate(subscription.subscriptionDate)}</Text>
            <Text style={styles.text}>Next Billing: {formatDate(subscription.renewalDate)}</Text>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.billTo}>
          <Text style={styles.sectionTitle}>BILL TO:</Text>
          <Text style={styles.text}>{billingInfo.billingName}</Text>
          <Text style={styles.text}>{subscription.customerEmail}</Text>
          <Text style={styles.text}>{billingInfo.line1}</Text>
          {billingInfo.line2 && <Text style={styles.text}>{billingInfo.line2}</Text>}
          <Text style={styles.text}>
            {billingInfo.city}, {billingInfo.state} {billingInfo.postalCode}
          </Text>
          <Text style={styles.text}>{billingInfo.country}</Text>
        </View>

        {/* Service Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellHeader}>Description</Text>
            <Text style={styles.tableCellHeader}>Period</Text>
            <Text style={styles.tableCellHeader}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{subscription.product}</Text>
            <Text style={styles.tableCell}>Monthly Subscription</Text>
            <Text style={styles.tableCell}>{formatPrice(subscription.amount, subscription.currency)}</Text>
          </View>
        </View>

        {/* Total */}
        <View style={styles.total}>
          <Text style={styles.totalText}>
            Total: {formatPrice(subscription.amount, subscription.currency)}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for choosing MOYDUS LLC!</Text>
          <Text>For support, contact us at support@moydus.com</Text>
        </View>
      </Page>
    </Document>
  );
};

interface InvoicePDFClientProps extends InvoicePDFProps {
  onDownloadComplete?: () => void;
}

const InvoicePDF = ({ subscription, billingInfo, onDownloadComplete }: InvoicePDFClientProps) => {
  const fileName = `invoice-${subscription.stripeSubscriptionId}-${new Date().toISOString().split('T')[0]}.pdf`;
  
  return (
    <PDFDownloadLink
      document={<InvoicePDFDocument subscription={subscription} billingInfo={billingInfo} />}
      fileName={fileName}
    >
      {({ blob, url, loading, error }) => (
        <button 
          className="bg-[#171719] border border-white/10 dark:bg-[#131313] dark:hover:bg-[#171719] text-white px-6 py-3 rounded-xl hover:opacity-90 flex-1 font-medium"
          disabled={loading}
          onClick={() => {
            if (!loading && url && onDownloadComplete) {
              setTimeout(() => onDownloadComplete(), 100);
            }
          }}
        >
          {loading ? 'Generating PDF...' : 'Download Invoice PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default InvoicePDF;