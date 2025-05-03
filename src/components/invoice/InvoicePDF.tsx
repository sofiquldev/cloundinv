'use client';

import { Invoice } from '@/types';
import { useSettingsStore } from '@/store/settingsStore';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { PageSize as PDFPageSize } from '@react-pdf/types';

const mapPageSize = (pageSize: 'A4' | 'POS50' | 'POS70'): PDFPageSize => {
    switch (pageSize) {
        case 'POS50':
            return [141.73, 425.20]; // 50mm width x 150mm height
        case 'POS70':
            return [198.42, 425.20]; // 70mm width x 150mm height
        default:
            return 'A4';
    }
};

const styles = StyleSheet.create({
    page: {
        padding: '10pt',
        fontSize: '8pt',
    },
    header: {
        marginBottom: 10,
        textAlign: 'center',
    },
    companyName: {
        fontSize: '10pt',
        fontWeight: 'bold',
        marginBottom: '5pt',
        textAlign: 'center', 
    },
    companyDetails: {
        textAlign: 'center',
    },
    invoiceInfoSection: {
        marginBottom: 20,
    },
    invoiceHeader: {
        marginBottom: 15,
        textAlign: 'right',
    },
    customerInfo: {
        marginBottom: 20,
    },
    invoiceDetails: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 10,
        marginBottom: 4,
        color: '#666',
    },
    table: {
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        paddingBottom: 5,
        marginBottom: 5,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 5,
    },
    col1: { width: '45%' },
    col2: { width: '20%' },
    col3: { width: '15%' },
    col4: { width: '20%', textAlign: 'right' },
    totalsSection: {
        marginTop: 0,
        borderTopWidth: 1,
        borderColor: '#000',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    bold: {
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: '7pt',
        color: '#666'
    }
});

interface InvoicePDFProps {
    invoice: Invoice;
}

export default function InvoicePDF({ invoice }: InvoicePDFProps) {
    const { settings } = useSettingsStore();
    const currentTime = new Date().toLocaleString();

    return (
        <Document>
            <Page size={mapPageSize(settings.pageSize)} style={styles.page}>
                {/* Company Header */}
                <View style={styles.header}>
                    <Text style={styles.companyName}>{settings.company.name}</Text>
                    <View style={styles.companyDetails}>
                        <Text>{settings.company.address}</Text>
                        {settings.company.phone && <Text>{settings.company.phone}</Text>}
                        {settings.company.email && <Text>{settings.company.email}</Text>}
                        {settings.company.website && <Text>{settings.company.website}</Text>}
                    </View>
                </View>

                {/* Invoice Info Section */}
                <View style={styles.invoiceInfoSection}>
                    {/* Invoice ID and Date */}
                    <View style={styles.invoiceHeader}>
                        <Text style={styles.bold}>Invoice #: {invoice.id}</Text>
                        <Text style={styles.bold}>Date: {new Date(invoice.date).toLocaleDateString()}</Text>
                    </View>

                    {/* Customer Section */}
                    <View style={styles.customerInfo}>
                        <Text style={styles.sectionTitle}>Bill To:</Text>
                        <Text>{invoice.customer.name}</Text>
                        {invoice.customer.address && <Text>{invoice.customer.address}</Text>}
                        {invoice.customer.phone && <Text>{invoice.customer.phone}</Text>}
                        {invoice.customer.email && <Text>{invoice.customer.email}</Text>}
                        {invoice.customer.website && <Text>{invoice.customer.website}</Text>}
                    </View>
                </View>

                {/* Invoice Details */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.col1}>Item</Text>
                        <Text style={styles.col2}>Rate</Text>
                        <Text style={styles.col3}>Amount</Text>
                        <Text style={styles.col4}>Total</Text>
                    </View>

                    {invoice.items.map((item) => (
                        <View key={item.id} style={styles.tableRow}>
                            <Text style={styles.col1}>{item.name}</Text>
                            <Text style={styles.col2}>{item.rate.toFixed(2)}</Text>
                            <Text style={styles.col3}>{item.amount}</Text>
                            <Text style={styles.col4}>{item.total.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Totals Section */}
                <View style={styles.totalsSection}>
                    <View style={styles.totalRow}>
                        <Text>Subtotal:</Text>
                        <Text>{settings.currency} {invoice.subtotal.toFixed(2)}</Text>
                    </View>
                    {invoice.discount > 0 && (
                        <View style={styles.totalRow}>
                            <Text>Discount ({invoice.discount}%):</Text>
                            <Text>{settings.currency} {((invoice.subtotal * invoice.discount) / 100).toFixed(2)}</Text>
                        </View>
                    )}
                    {invoice.vat > 0 && (
                        <View style={styles.totalRow}>
                            <Text>VAT ({invoice.vat}%):</Text>
                            <Text>{settings.currency} {((invoice.subtotal * invoice.vat) / 100).toFixed(2)}</Text>
                        </View>
                    )}
                    <View style={styles.totalRow}>
                        <Text style={styles.bold}>Total:</Text>
                        <Text style={styles.bold}>{settings.currency} {invoice.total.toFixed(2)}</Text>
                    </View>
                    {invoice.paid > 0 && (
                        <View style={styles.totalRow}>
                            <Text>Paid:</Text>
                            <Text>{settings.currency} {invoice.paid.toFixed(2)}</Text>
                        </View>
                    )}
                    {invoice.due > 0 && (
                        <View style={styles.totalRow}>
                            <Text style={styles.bold}>Due:</Text>
                            <Text style={styles.bold}>{settings.currency} {invoice.due.toFixed(2)}</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.footer}>
                    Printed on {currentTime}
                </Text>
            </Page>
        </Document>
    );
}