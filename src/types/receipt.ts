export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Online' | 'Other';
export type PaymentStatus = 'Paid' | 'Pending' | 'Partially Paid';
export type PaperSize = '80mm' | '58mm' | 'A4';

export interface ShipperConsignee {
  name: string;
  phone: string;
  address: string;
}

export interface PaymentCharges {
  serviceChg: number;
  otherAmount: number;
  vas: number; // Value Added Service
  gst: number;
  premium: number; // Insurance premium
  remainingPayment: number;
  total: number;
  amountReceived: number;
  outstandingBalance: number;
}

export interface StampSettings {
  enabled: boolean;
  x: number; // percentage from left
  y: number; // percentage from top
  scale: number;
  rotation: number;
  opacity: number;
  customText?: string;
  inkColor?: string;
  uploadedImage?: string;
}

export interface ReceiptData {
  id: string;
  receiptNumber: string;
  bookingCode: string; // e.g. "G . 0" as in the original receipt
  date: string; // DD-MM-YYYY
  time: string; // HH:mm
  paymentMethod: PaymentMethod;
  origin: string;
  destination: string;
  pieces: number;
  weight: string;
  shipmentDescription: string;
  shipper: ShipperConsignee;
  consignee: ShipperConsignee;
  packetValue: number | string;
  insuredValue: number | string;
  charges: PaymentCharges;
  paymentStatus: PaymentStatus;
  remarks: string[];
  instructions: string;
  customerSignature: string; // "Nill" or data URL or signature text
  paidStampSettings: StampSettings;
  companyStampSettings: StampSettings;
  createdAt: string;
  updatedAt: string;
  isSample?: boolean;
}

export interface CompanySettings {
  companyName: string;
  slogan: string;
  gstNumber: string;
  topGstNumber: string;
  companyAddress: string;
  contactNumber: string;
  currency: string;
  defaultRemarks: string[];
  defaultInstructions: string;
  defaultPaperSize: PaperSize;
  useOriginalSpelling: boolean; // 'Adress' vs 'Address'
  companyStampImage?: string;
}
