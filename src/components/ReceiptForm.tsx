import React from 'react';
import { ReceiptData, CompanySettings, PaymentMethod, PaymentStatus } from '../types/receipt';
import {
  FileText,
  User,
  Truck,
  DollarSign,
  PenTool,
  Clock,
  Sparkles,
  RotateCcw,
  Plus,
  Trash2,
  Calendar,
} from 'lucide-react';
import { getFormattedCurrentDate, getFormattedCurrentTime } from '../utils/defaults';

interface ReceiptFormProps {
  receipt: ReceiptData;
  settings: CompanySettings;
  onChange: (updatedReceipt: ReceiptData) => void;
  onReset: () => void;
  onLoadSample: () => void;
  onOpenSignaturePad: () => void;
}

export const ReceiptForm: React.FC<ReceiptFormProps> = ({
  receipt,
  settings,
  onChange,
  onReset,
  onLoadSample,
  onOpenSignaturePad,
}) => {
  // Update shipment fields
  const handleFieldChange = (field: keyof ReceiptData, value: unknown) => {
    onChange({
      ...receipt,
      [field]: value,
      isSample: false, // user edited
    });
  };

  // Update shipper or consignee
  const handlePartyChange = (party: 'shipper' | 'consignee', field: string, value: string) => {
    onChange({
      ...receipt,
      [party]: {
        ...receipt[party],
        [field]: value,
      },
      isSample: false,
    });
  };

  // Update payment charge fields and auto-calculate total and balance
  const handleChargeChange = (field: keyof ReceiptData['charges'], value: number) => {
    const updatedCharges = {
      ...receipt.charges,
      [field]: isNaN(value) ? 0 : value,
    };

    // Calculate total: serviceChg + otherAmount + vas + gst + premium
    const calculatedTotal =
      (updatedCharges.serviceChg || 0) +
      (updatedCharges.otherAmount || 0) +
      (updatedCharges.vas || 0) +
      (updatedCharges.gst || 0) +
      (updatedCharges.premium || 0);

    updatedCharges.total = calculatedTotal;

    // Remaining payment default or calculation
    if (field !== 'remainingPayment') {
      // Keep remaining payment aligned or auto-set
    }

    // Calculate outstanding balance: total - amountReceived
    const balance = Math.max(0, calculatedTotal - (updatedCharges.amountReceived || 0));
    updatedCharges.outstandingBalance = balance;

    // Auto-align payment status if amount received matches or is 0
    let autoStatus = receipt.paymentStatus;
    if (updatedCharges.amountReceived >= calculatedTotal && calculatedTotal > 0) {
      autoStatus = 'Paid';
    } else if (updatedCharges.amountReceived === 0) {
      autoStatus = 'Pending';
    } else if (updatedCharges.amountReceived > 0 && updatedCharges.amountReceived < calculatedTotal) {
      autoStatus = 'Partially Paid';
    }

    onChange({
      ...receipt,
      charges: updatedCharges,
      paymentStatus: autoStatus,
      isSample: false,
    });
  };

  // Handle direct payment status change
  const handlePaymentStatusChange = (newStatus: PaymentStatus) => {
    const updatedCharges = { ...receipt.charges };
    if (newStatus === 'Paid') {
      updatedCharges.amountReceived = updatedCharges.total;
      updatedCharges.outstandingBalance = 0;
      updatedCharges.remainingPayment = 0;
    } else if (newStatus === 'Pending') {
      updatedCharges.amountReceived = 0;
      updatedCharges.outstandingBalance = updatedCharges.total;
      updatedCharges.remainingPayment = updatedCharges.total;
    }

    // Toggle Paid stamp visibility based on status
    const updatedPaidStamp = {
      ...receipt.paidStampSettings,
      enabled: newStatus === 'Paid' || newStatus === 'Pending' || newStatus === 'Partially Paid',
    };

    onChange({
      ...receipt,
      paymentStatus: newStatus,
      charges: updatedCharges,
      paidStampSettings: updatedPaidStamp,
      isSample: false,
    });
  };

  // Remark helpers
  const handleAddRemark = () => {
    onChange({
      ...receipt,
      remarks: [...receipt.remarks, 'New Remark'],
      isSample: false,
    });
  };

  const handleUpdateRemark = (index: number, val: string) => {
    const updated = [...receipt.remarks];
    updated[index] = val;
    onChange({
      ...receipt,
      remarks: updated,
      isSample: false,
    });
  };

  const handleRemoveRemark = (index: number) => {
    onChange({
      ...receipt,
      remarks: receipt.remarks.filter((_, i) => i !== index),
      isSample: false,
    });
  };

  const handleSetCurrentDateTime = () => {
    onChange({
      ...receipt,
      date: getFormattedCurrentDate(),
      time: getFormattedCurrentTime(),
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top action row */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold text-slate-200">Receipt Details Form</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition"
            title="Load sample test data (clearly tagged as test specimen)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Sample Data
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Form
          </button>
        </div>
      </div>

      {/* 1. Shipment Information */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <Truck className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            1. Shipment & Consignment Info
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Receipt / Consignment No.
            </label>
            <input
              type="text"
              value={receipt.receiptNumber}
              onChange={(e) => handleFieldChange('receiptNumber', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-hidden"
              placeholder="e.g. BKT-2026-1001"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-semibold text-slate-400">Date & Time</label>
              <button
                type="button"
                onClick={handleSetCurrentDateTime}
                className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
              >
                <Clock className="w-3 h-3" /> Set Now
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="text"
                value={receipt.date}
                onChange={(e) => handleFieldChange('date', e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white font-mono text-center focus:border-emerald-500 focus:outline-hidden"
                placeholder="DD-MM-YYYY"
              />
              <input
                type="text"
                value={receipt.time}
                onChange={(e) => handleFieldChange('time', e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white font-mono text-center focus:border-emerald-500 focus:outline-hidden"
                placeholder="HH:mm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Payment Method
            </label>
            <select
              value={receipt.paymentMethod}
              onChange={(e) => handleFieldChange('paymentMethod', e.target.value as PaymentMethod)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Online">Online</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Origin (ORG)</label>
            <input
              type="text"
              value={receipt.origin}
              onChange={(e) => handleFieldChange('origin', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-semibold uppercase focus:border-emerald-500 focus:outline-hidden"
              placeholder="e.g. KHI"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Destination (DEST)
            </label>
            <input
              type="text"
              value={receipt.destination}
              onChange={(e) => handleFieldChange('destination', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-semibold uppercase focus:border-emerald-500 focus:outline-hidden"
              placeholder="e.g. LHR / PEW"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Piece(s)</label>
              <input
                type="number"
                min="1"
                value={receipt.pieces}
                onChange={(e) => handleFieldChange('pieces', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Weight</label>
              <input
                type="text"
                value={receipt.weight}
                onChange={(e) => handleFieldChange('weight', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                placeholder="e.g. 15 KG"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Shipper and Consignee Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shipper Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <User className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              2. Shipper Details (Sender)
            </h3>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Name &nbsp;:
              </label>
              <input
                type="text"
                value={receipt.shipper.name}
                onChange={(e) => handlePartyChange('shipper', 'name', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                placeholder="Sender Full Name"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Phone &nbsp;:
              </label>
              <input
                type="text"
                value={receipt.shipper.phone}
                onChange={(e) => handlePartyChange('shipper', 'phone', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                placeholder="0300-1234567"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {settings.useOriginalSpelling ? 'Adress' : 'Address'} &nbsp;:
              </label>
              <textarea
                rows={2}
                value={receipt.shipper.address}
                onChange={(e) => handlePartyChange('shipper', 'address', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden resize-none"
                placeholder="Full Shipper Address / Market / City"
              />
            </div>
          </div>
        </div>

        {/* Consignee Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <User className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              3. Consignee Details (Receiver)
            </h3>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Name &nbsp;:
              </label>
              <input
                type="text"
                value={receipt.consignee.name}
                onChange={(e) => handlePartyChange('consignee', 'name', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                placeholder="Receiver Full Name"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Phone &nbsp;:
              </label>
              <input
                type="text"
                value={receipt.consignee.phone}
                onChange={(e) => handlePartyChange('consignee', 'phone', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                placeholder="0333-7654321"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {settings.useOriginalSpelling ? 'Adress' : 'Address'} &nbsp;:
              </label>
              <textarea
                rows={2}
                value={receipt.consignee.address}
                onChange={(e) => handlePartyChange('consignee', 'address', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden resize-none"
                placeholder="Full Receiver Delivery Address / City"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Valuation & Payment Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              4. Value & Payment Breakdown ({settings.currency})
            </h3>
          </div>
          {/* Payment Status Badges */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1">Status:</span>
            {(['Paid', 'Pending', 'Partially Paid'] as PaymentStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handlePaymentStatusChange(status)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  receipt.paymentStatus === status
                    ? status === 'Paid'
                      ? 'bg-red-600 text-white shadow-md'
                      : status === 'Pending'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Packet & Insured Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b border-slate-800/80">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Packet Value (Declared)
            </label>
            <input
              type="text"
              value={receipt.packetValue}
              onChange={(e) => handleFieldChange('packetValue', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-hidden"
              placeholder="e.g. 50,000 or leave empty"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Insured Value
            </label>
            <input
              type="text"
              value={receipt.insuredValue}
              onChange={(e) => handleFieldChange('insuredValue', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-hidden"
              placeholder="e.g. 25,000 or leave empty"
            />
          </div>
        </div>

        {/* Numeric Line Items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div>
            <label className="block text-[10.5px] font-medium text-slate-400 mb-1">
              Service CHG:
            </label>
            <input
              type="number"
              value={receipt.charges.serviceChg}
              onChange={(e) => handleChargeChange('serviceChg', Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-medium text-slate-400 mb-1">
              Other Amount:
            </label>
            <input
              type="number"
              value={receipt.charges.otherAmount}
              onChange={(e) => handleChargeChange('otherAmount', Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-medium text-slate-400 mb-1">VAS:</label>
            <input
              type="number"
              value={receipt.charges.vas}
              onChange={(e) => handleChargeChange('vas', Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-medium text-slate-400 mb-1">GST:</label>
            <input
              type="number"
              value={receipt.charges.gst}
              onChange={(e) => handleChargeChange('gst', Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-medium text-slate-400 mb-1">Premium:</label>
            <input
              type="number"
              value={receipt.charges.premium}
              onChange={(e) => handleChargeChange('premium', Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-medium text-slate-400 mb-1">
              Remaining Payment:
            </label>
            <input
              type="number"
              value={receipt.charges.remainingPayment}
              onChange={(e) => handleChargeChange('remainingPayment', Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Calculation summary bar */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Auto-calculated Total
              </span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">
                {settings.currency} {receipt.charges.total.toLocaleString()}
              </span>
            </div>

            <div className="border-l border-slate-800 pl-4">
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">
                Amount Received
              </label>
              <input
                type="number"
                value={receipt.charges.amountReceived}
                onChange={(e) => handleChargeChange('amountReceived', Number(e.target.value))}
                className="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="border-l border-slate-800 pl-4">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Outstanding Balance
              </span>
              <span
                className={`text-sm font-bold font-mono ${
                  receipt.charges.outstandingBalance > 0 ? 'text-amber-400' : 'text-slate-400'
                }`}
              >
                {settings.currency} {receipt.charges.outstandingBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Remarks, Instructions, & Customer Signature */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Remarks */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Remarks</h4>
            <button
              type="button"
              onClick={handleAddRemark}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Line
            </button>
          </div>
          <div className="space-y-2">
            {receipt.remarks.map((rem, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={rem}
                  onChange={(e) => handleUpdateRemark(idx, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                  placeholder="e.g. Non Custom Product"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveRemark(idx)}
                  className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Instructions
            </h4>
          </div>
          <div>
            <textarea
              rows={3}
              value={receipt.instructions}
              onChange={(e) => handleFieldChange('instructions', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden resize-none"
              placeholder="e.g. Handle With Care"
            />
          </div>
        </div>

        {/* Customer Signature */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Customer Signature
            </h4>
            <button
              type="button"
              onClick={onOpenSignaturePad}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
            >
              <PenTool className="w-3 h-3" /> Sign / Edit
            </button>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center min-h-[72px] flex items-center justify-center">
            {receipt.customerSignature && receipt.customerSignature.startsWith('data:image') ? (
              <img
                src={receipt.customerSignature}
                alt="Signature preview"
                className="max-h-12 max-w-[120px] object-contain"
              />
            ) : (
              <span className="font-mono text-xs text-slate-300">
                {receipt.customerSignature || 'Nill'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onOpenSignaturePad}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <PenTool className="w-3.5 h-3.5 text-emerald-400" />
            Open Signature Pad
          </button>
        </div>
      </div>
    </div>
  );
};
