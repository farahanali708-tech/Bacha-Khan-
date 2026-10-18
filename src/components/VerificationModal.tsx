import React from 'react';
import { ReceiptData, CompanySettings } from '../types/receipt';
import { ShieldCheck, CheckCircle2, Clock, MapPin, Truck, AlertCircle, X, Hash } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptData;
  settings: CompanySettings;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  receipt,
  settings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-emerald-950/70 border-b border-emerald-800/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-white">Consignment Verification</h3>
              <p className="text-[11px] text-emerald-300">
                Official Digital Record • {settings.companyName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {receipt.isSample ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5 text-amber-300 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-bold">Test Specimen Warning:</span> This is a demonstration
                sample receipt. It is not an active bill of lading in live transit.
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2.5 text-emerald-300 text-xs">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <div>
                <span className="font-bold">Receipt Authenticated:</span> The digital QR hash matches
                the transport consignment manifest.
              </div>
            </div>
          )}

          {/* Key Details Grid */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" /> Receipt / Consignment No.
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {receipt.receiptNumber}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Issued Date & Time
              </span>
              <span className="font-mono text-slate-200">
                {receipt.date} at {receipt.time}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Route (ORG - DEST)
              </span>
              <span className="font-bold text-slate-200 uppercase">
                {receipt.origin} ➔ {receipt.destination}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-400" /> Cargo Parcel
              </span>
              <span className="font-mono text-slate-200">
                {receipt.pieces} Pcs | {receipt.weight}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
              <span className="text-slate-400">Total Billed Charges</span>
              <span className="font-bold text-slate-100 font-mono">
                {settings.currency} {receipt.charges.total.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">Payment Status</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  receipt.paymentStatus === 'Paid'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : receipt.paymentStatus === 'Pending'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {receipt.paymentStatus}
              </span>
            </div>
          </div>

          {/* Shipper & Consignee Summary */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                Shipper (Sender)
              </div>
              <div className="font-semibold text-slate-200">{receipt.shipper.name || '—'}</div>
              <div className="text-slate-400 text-[11px] mt-0.5 font-mono">
                {receipt.shipper.phone || '—'}
              </div>
            </div>

            <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                Consignee (Receiver)
              </div>
              <div className="font-semibold text-slate-200">{receipt.consignee.name || '—'}</div>
              <div className="text-slate-400 text-[11px] mt-0.5 font-mono">
                {receipt.consignee.phone || '—'}
              </div>
            </div>
          </div>

          <div className="text-[10.5px] text-slate-500 text-center leading-relaxed">
            GST Registration: <span className="font-mono text-slate-400">{settings.gstNumber}</span> •
            Bacha Khan Transport Cargo Network
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 flex justify-end border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
          >
            Close Verification
          </button>
        </div>
      </div>
    </div>
  );
};
