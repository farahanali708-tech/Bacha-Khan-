import { CompanySettings, ReceiptData } from '../types/receipt';

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  companyName: 'BACHA KHAN TRANSPORT',
  slogan: 'WE MOVE YOU',
  gstNumber: '12-009808-002-73',
  topGstNumber: '12-009808-002-73',
  companyAddress: 'Main Goods Transport Terminal, Hawkesbay Road, Karachi, Pakistan',
  contactNumber: '+92 300 1234567 / +92 321 7654321',
  currency: 'PKR',
  defaultRemarks: ['Non Custom Product', 'Deal Box 🎁 Gift Pack'],
  defaultInstructions: 'Handle With Care',
  defaultPaperSize: '80mm',
  useOriginalSpelling: true, // "Adress :" exactly matches the original printed receipt
};

export const getFormattedCurrentDate = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getFormattedCurrentTime = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const generateReceiptNumber = (existingReceiptsCount: number = 0): string => {
  const year = new Date().getFullYear();
  const num = 1001 + existingReceiptsCount;
  return `BKT-${year}-${num}`;
};

export const createEmptyReceipt = (seqCount: number = 0): ReceiptData => {
  const now = new Date().toISOString();
  return {
    id: `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    receiptNumber: generateReceiptNumber(seqCount),
    bookingCode: 'G                 .        0',
    date: getFormattedCurrentDate(),
    time: getFormattedCurrentTime(),
    paymentMethod: 'Cash',
    origin: 'KHI',
    destination: 'LHR',
    pieces: 1,
    weight: '12 KG',
    shipmentDescription: 'Deal Box / Gift Pack',
    shipper: {
      name: '',
      phone: '',
      address: '',
    },
    consignee: {
      name: '',
      phone: '',
      address: '',
    },
    packetValue: '',
    insuredValue: '',
    charges: {
      serviceChg: 1500,
      otherAmount: 0,
      vas: 100,
      gst: 256,
      premium: 0,
      remainingPayment: 0,
      total: 1856,
      amountReceived: 1856,
      outstandingBalance: 0,
    },
    paymentStatus: 'Paid',
    remarks: ['Non Custom Product', 'Deal Box 🎁 Gift Pack'],
    instructions: 'Handle With Care',
    customerSignature: 'Nill',
    paidStampSettings: {
      enabled: true,
      x: 65, // % from left
      y: 72, // % from top (near payment details)
      scale: 1,
      rotation: -12,
      opacity: 0.92,
      customText: 'PAYMENT PAID',
      inkColor: '#dc2626', // Red ink
    },
    companyStampSettings: {
      enabled: false,
      x: 25,
      y: 86,
      scale: 0.95,
      rotation: 6,
      opacity: 0.88,
      customText: 'BACHA KHAN TRANSPORT\nOFFICIAL DISPATCH',
      inkColor: '#1d4ed8', // Blue ink
    },
    createdAt: now,
    updatedAt: now,
    isSample: false,
  };
};

export const createSampleReceipt = (): ReceiptData => {
  const now = new Date().toISOString();
  return {
    id: 'sample-receipt-001',
    receiptNumber: 'BKT-2026-SAMPLE-01',
    bookingCode: 'G                 .        0',
    date: getFormattedCurrentDate(),
    time: getFormattedCurrentTime(),
    paymentMethod: 'Cash',
    origin: 'KARACHI (KHI)',
    destination: 'PESHAWAR (PEW)',
    pieces: 3,
    weight: '24.5 KG',
    shipmentDescription: 'Household Goods & Commercial Electronics',
    shipper: {
      name: 'Muhammad Tariq Khan',
      phone: '0300-8274619',
      address: 'Shop 42, Bolton Market, M.A Jinnah Road, Karachi',
    },
    consignee: {
      name: 'Sheraz Ahmad Afridi',
      phone: '0333-9182741',
      address: 'Near Karkhano Market, Jamrud Road, Peshawar',
    },
    packetValue: '85,000',
    insuredValue: '50,000',
    charges: {
      serviceChg: 3200,
      otherAmount: 300,
      vas: 150,
      gst: 584,
      premium: 250,
      remainingPayment: 0,
      total: 4484,
      amountReceived: 4484,
      outstandingBalance: 0,
    },
    paymentStatus: 'Paid',
    remarks: ['Non Custom Product', 'Deal Box 🎁 Gift Pack'],
    instructions: 'Handle With Care',
    customerSignature: 'Nill',
    paidStampSettings: {
      enabled: true,
      x: 64,
      y: 71,
      scale: 1,
      rotation: -14,
      opacity: 0.9,
      customText: 'PAYMENT PAID',
      inkColor: '#dc2626',
    },
    companyStampSettings: {
      enabled: true,
      x: 20,
      y: 88,
      scale: 0.95,
      rotation: 8,
      opacity: 0.85,
      customText: 'BACHA KHAN TRANSPORT\nMAIN CARGO HUB',
      inkColor: '#1d4ed8',
    },
    createdAt: now,
    updatedAt: now,
    isSample: true, // clearly marked sample
  };
};
