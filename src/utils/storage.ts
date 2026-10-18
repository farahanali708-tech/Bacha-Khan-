import { CompanySettings, ReceiptData } from '../types/receipt';
import { DEFAULT_COMPANY_SETTINGS } from './defaults';

const RECEIPTS_KEY = 'bkt_receipts_v1';
const SETTINGS_KEY = 'bkt_settings_v1';

export const loadSavedReceipts = (): ReceiptData[] => {
  try {
    const raw = localStorage.getItem(RECEIPTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load receipts from storage:', err);
    return [];
  }
};

export const saveReceiptToStorage = (receipt: ReceiptData): { success: boolean; message: string; duplicate?: boolean } => {
  try {
    const receipts = loadSavedReceipts();
    
    // Check for accidental duplicate receipt number with a different ID
    const duplicate = receipts.find(
      (r) => r.receiptNumber.trim().toLowerCase() === receipt.receiptNumber.trim().toLowerCase() && r.id !== receipt.id
    );

    if (duplicate) {
      return {
        success: false,
        duplicate: true,
        message: `Receipt number "${receipt.receiptNumber}" is already used by another receipt. Please change the receipt number.`,
      };
    }

    const existingIndex = receipts.findIndex((r) => r.id === receipt.id);
    const updatedReceipt: ReceiptData = {
      ...receipt,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      receipts[existingIndex] = updatedReceipt;
    } else {
      receipts.unshift(updatedReceipt);
    }

    localStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts));
    return { success: true, message: 'Receipt saved successfully.' };
  } catch (err) {
    console.error('Failed to save receipt:', err);
    return { success: false, message: 'Storage error: Could not save receipt to browser storage.' };
  }
};

export const deleteReceiptFromStorage = (id: string): boolean => {
  try {
    const receipts = loadSavedReceipts();
    const filtered = receipts.filter((r) => r.id !== id);
    localStorage.setItem(RECEIPTS_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete receipt:', err);
    return false;
  }
};

export const loadCompanySettings = (): CompanySettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_COMPANY_SETTINGS;
    return { ...DEFAULT_COMPANY_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load company settings:', err);
    return DEFAULT_COMPANY_SETTINGS;
  }
};

export const saveCompanySettings = (settings: CompanySettings): boolean => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (err) {
    console.error('Failed to save company settings:', err);
    return false;
  }
};

export const exportReceiptsToCSV = (receipts: ReceiptData[], currency: string = 'PKR') => {
  if (receipts.length === 0) return;

  const headers = [
    'Receipt Number',
    'Date',
    'Time',
    'Origin',
    'Destination',
    'Pieces',
    'Weight',
    'Shipper Name',
    'Shipper Phone',
    'Shipper Address',
    'Consignee Name',
    'Consignee Phone',
    'Consignee Address',
    'Payment Method',
    'Payment Status',
    `Service Charge (${currency})`,
    `GST (${currency})`,
    `Total Amount (${currency})`,
    `Received (${currency})`,
    `Balance (${currency})`,
    'Remarks',
    'Instructions',
    'Is Sample',
  ];

  const escapeCSV = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = receipts.map((r) => [
    escapeCSV(r.receiptNumber),
    escapeCSV(r.date),
    escapeCSV(r.time),
    escapeCSV(r.origin),
    escapeCSV(r.destination),
    escapeCSV(r.pieces),
    escapeCSV(r.weight),
    escapeCSV(r.shipper.name),
    escapeCSV(r.shipper.phone),
    escapeCSV(r.shipper.address),
    escapeCSV(r.consignee.name),
    escapeCSV(r.consignee.phone),
    escapeCSV(r.consignee.address),
    escapeCSV(r.paymentMethod),
    escapeCSV(r.paymentStatus),
    escapeCSV(r.charges.serviceChg),
    escapeCSV(r.charges.gst),
    escapeCSV(r.charges.total),
    escapeCSV(r.charges.amountReceived),
    escapeCSV(r.charges.outstandingBalance),
    escapeCSV(r.remarks.join(' | ')),
    escapeCSV(r.instructions),
    escapeCSV(r.isSample ? 'YES' : 'NO'),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Bacha_Khan_Transport_Receipts_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
