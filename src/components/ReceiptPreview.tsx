import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { CompanySettings, ReceiptData, PaperSize } from '../types/receipt';
import { PaidStamp, CompanyStamp } from './Stamps';

interface ReceiptPreviewProps {
  receipt: ReceiptData;
  settings: CompanySettings;
  paperSize?: PaperSize;
  isInteractiveStamps?: boolean;
  onUpdateStampPosition?: (stampType: 'paid' | 'company', x: number, y: number) => void;
  onOpenVerification?: () => void;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({
  receipt,
  settings,
  paperSize = '80mm',
  isInteractiveStamps = false,
  onUpdateStampPosition,
  onOpenVerification,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const receiptContainerRef = useRef<HTMLDivElement>(null);

  // Generate QR Code containing verifiable consignment payload
  useEffect(() => {
    const payload = JSON.stringify({
      bkt: 'BACHA KHAN TRANSPORT',
      rcpt: receipt.receiptNumber,
      date: receipt.date,
      time: receipt.time,
      org: receipt.origin,
      dest: receipt.destination,
      pcs: receipt.pieces,
      wt: receipt.weight,
      tot: receipt.charges.total,
      curr: settings.currency,
      status: receipt.paymentStatus,
      verifyUrl: `https://bachakhantransport.com/verify?cn=${encodeURIComponent(receipt.receiptNumber)}`,
    });

    QRCode.toDataURL(payload, {
      width: 220,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation failed:', err));
  }, [receipt, settings.currency]);

  // Handle direct drag repositioning of stamps on preview
  const handleStampDrag = (e: React.MouseEvent, stampType: 'paid' | 'company') => {
    if (!isInteractiveStamps || !receiptContainerRef.current) return;
    e.preventDefault();
    const container = receiptContainerRef.current;
    const rect = container.getBoundingClientRect();

    const onMouseMove = (moveEvent: MouseEvent) => {
      const xPx = moveEvent.clientX - rect.left;
      const yPx = moveEvent.clientY - rect.top;
      const xPercent = Math.max(5, Math.min(95, Math.round((xPx / rect.width) * 100)));
      const yPercent = Math.max(5, Math.min(95, Math.round((yPx / rect.height) * 100)));

      if (onUpdateStampPosition) {
        onUpdateStampPosition(stampType, xPercent, yPercent);
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const addressLabel = settings.useOriginalSpelling ? 'Adress' : 'Address';
  const currencySymbol = settings.currency || 'PKR';

  // Paper width styling: 80mm is approx 330px on screen, 58mm is 270px
  const containerWidthClass =
    paperSize === '58mm' ? 'max-w-[270px] text-[11px]' : 'max-w-[340px] text-[12.5px]';

  return (
    <div className="flex justify-center w-full">
      <div
        id="printable-receipt"
        ref={receiptContainerRef}
        className={`relative bg-white text-black font-sans leading-tight shadow-2xl p-4 transition-all duration-200 select-none print:shadow-none print:p-2 print:m-0 w-full ${containerWidthClass}`}
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: '#000000',
          backgroundColor: '#ffffff',
          boxSizing: 'border-box',
        }}
      >
        {/* Sample Watermark Banner if marked sample */}
        {receipt.isSample && (
          <div className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold py-0.5 px-2 text-center mb-2 rounded print:hidden">
            TEST SPECIMEN • SAMPLE RECEIPT
          </div>
        )}

        {/* 1. Very Top Tiny GST line */}
        <div className="flex justify-between items-center text-[10.5px] font-medium tracking-tight px-1 mb-2">
          <span>GST</span>
          <span className="font-mono tracking-wider">{settings.topGstNumber || settings.gstNumber}</span>
        </div>

        {/* 2. Company Heading */}
        <div className="text-center mt-1 mb-1">
          <h1
            className="text-[19px] font-black tracking-tight uppercase leading-none"
            style={{
              fontFamily: "'Cinzel', 'Times New Roman', serif",
              fontWeight: 900,
              letterSpacing: '0.02em',
            }}
          >
            {settings.companyName}
          </h1>

          {/* Slogan with speed lines */}
          <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px] font-black italic tracking-wider text-slate-800">
            <span>{settings.slogan}</span>
            <div className="flex items-center gap-0.5 opacity-80 not-italic">
              <span className="inline-block w-2.5 h-[1.5px] bg-black skew-x-[-25deg]"></span>
              <span className="inline-block w-2.5 h-[1.5px] bg-black skew-x-[-25deg]"></span>
              <span className="inline-block w-2.5 h-[1.5px] bg-black skew-x-[-25deg]"></span>
            </div>
          </div>
        </div>

        {/* 3. Centered QR Code Area */}
        <div className="flex flex-col items-center justify-center my-2">
          {qrDataUrl ? (
            <div
              className="cursor-pointer group relative"
              onClick={onOpenVerification}
              title="Click to inspect QR code verification data"
            >
              <img
                src={qrDataUrl}
                alt="Consignment QR Code"
                className="w-28 h-28 object-contain transition-transform group-hover:scale-105"
              />
              <span className="hidden print:hidden group-hover:block absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-1 py-0.5 rounded whitespace-nowrap">
                Click to verify
              </span>
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
              Generating QR...
            </div>
          )}
        </div>

        {/* 4. Dark Section Bar: GST */}
        <div className="bg-black text-white px-2 py-0.5 flex justify-between items-center text-[11px] font-bold uppercase tracking-wider my-1">
          <span>GST</span>
          <span className="font-mono tracking-wide">{settings.gstNumber}</span>
        </div>

        {/* 5. Sub-code row: G . 0 */}
        <div className="flex justify-between items-center px-6 py-0.5 text-[11.5px] font-bold text-black">
          <span>G</span>
          <span>•</span>
          <span>0</span>
        </div>

        {/* 6. Dark Section Bar: Payment | Date-Time */}
        <div className="bg-black text-white px-2 py-0.5 flex justify-between items-center text-[11px] font-bold uppercase tracking-wider my-1">
          <span>Payment</span>
          <span>Date-Time</span>
        </div>

        {/* Payment & Date-Time Values */}
        <div className="flex justify-between items-center px-2 py-0.5 text-[11.5px] font-bold">
          <span>{receipt.paymentMethod}</span>
          <span className="font-mono font-medium text-[11px]">
            {receipt.date} {receipt.time}
          </span>
        </div>

        {/* 7. Dark Section Bar: ORG-DEST | Piece(s) | WEIGHT */}
        <div className="bg-black text-white px-2 py-0.5 flex justify-between items-center text-[11px] font-bold uppercase tracking-wider my-1">
          <span>ORG-DEST</span>
          <span>Piece(s) | WEIGHT</span>
        </div>

        {/* Origin-Destination and Pieces/Weight Values */}
        <div className="flex justify-between items-center px-2 py-0.5 text-[11.5px] font-bold uppercase">
          <span>
            {receipt.origin || 'KHI'} - {receipt.destination || 'LHR'}
          </span>
          <span className="font-mono">
            {receipt.pieces || 1} | {receipt.weight || '10 KG'}
          </span>
        </div>

        {/* 8. Dark Section Bar: Shipper Details */}
        <div className="bg-black text-white py-0.5 text-center text-[11.5px] font-bold uppercase tracking-wider my-1">
          Shipper Details
        </div>

        {/* Shipper Details Content */}
        <div className="px-1.5 py-1 text-[11px] space-y-0.5 leading-snug">
          <div className="grid grid-cols-[68px_1fr] items-start">
            <span className="font-bold text-slate-900">Name &nbsp; :</span>
            <span className="font-semibold break-words">{receipt.shipper.name || '—'}</span>
          </div>
          <div className="grid grid-cols-[68px_1fr] items-start">
            <span className="font-bold text-slate-900">Phone &nbsp;:</span>
            <span className="font-mono">{receipt.shipper.phone || '—'}</span>
          </div>
          <div className="grid grid-cols-[68px_1fr] items-start">
            <span className="font-bold text-slate-900">{addressLabel} :</span>
            <span className="break-words leading-tight">{receipt.shipper.address || '—'}</span>
          </div>
        </div>

        {/* 9. Dark Section Bar: Consignee Details */}
        <div className="bg-black text-white py-0.5 text-center text-[11.5px] font-bold uppercase tracking-wider my-1">
          Consignee Details
        </div>

        {/* Consignee Details Content */}
        <div className="px-1.5 py-1 text-[11px] space-y-0.5 leading-snug">
          <div className="grid grid-cols-[68px_1fr] items-start">
            <span className="font-bold text-slate-900">Name &nbsp; :</span>
            <span className="font-semibold break-words">{receipt.consignee.name || '—'}</span>
          </div>
          <div className="grid grid-cols-[68px_1fr] items-start">
            <span className="font-bold text-slate-900">Phone &nbsp;:</span>
            <span className="font-mono">{receipt.consignee.phone || '—'}</span>
          </div>
          <div className="grid grid-cols-[68px_1fr] items-start">
            <span className="font-bold text-slate-900">{addressLabel} :</span>
            <span className="break-words leading-tight">{receipt.consignee.address || '—'}</span>
          </div>
        </div>

        {/* 10. Dark Section Bar: Packet Value */}
        <div className="bg-black text-white py-0.5 text-center text-[11px] font-bold uppercase tracking-wider my-1">
          Packet Value
        </div>
        <div className="text-center py-0.5 text-[11.5px] font-bold">
          {receipt.packetValue ? `${currencySymbol} ${receipt.packetValue}` : '—'}
        </div>

        {/* 11. Dark Section Bar: Insured Value */}
        <div className="bg-black text-white py-0.5 text-center text-[11px] font-bold uppercase tracking-wider my-1">
          Insured Value
        </div>
        <div className="text-center py-0.5 text-[11.5px] font-bold">
          {receipt.insuredValue ? `${currencySymbol} ${receipt.insuredValue}` : '—'}
        </div>

        {/* 12. Dark Section Bar: Payment Details */}
        <div className="bg-black text-white py-0.5 text-center text-[11px] font-bold uppercase tracking-wider my-1">
          Payment Details
        </div>

        {/* Payment Line Items */}
        <div className="px-2 py-1 text-[11px] font-mono space-y-0.5">
          <div className="flex justify-between items-center">
            <span className="font-bold font-sans">Service CHG:</span>
            <span>{receipt.charges.serviceChg}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold font-sans">Other Amount:</span>
            <span>{receipt.charges.otherAmount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold font-sans">VAS:</span>
            <span>{receipt.charges.vas}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold font-sans">GST:</span>
            <span>{receipt.charges.gst}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold font-sans">Premium:</span>
            <span>{receipt.charges.premium}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold font-sans">Remaining Payment:</span>
            <span>{receipt.charges.remainingPayment}</span>
          </div>
          <div className="flex justify-between items-center border-t border-black/40 pt-0.5 text-[12px] font-bold">
            <span className="font-sans">Total:</span>
            <span>
              {currencySymbol} {receipt.charges.total}
            </span>
          </div>
          {receipt.paymentStatus === 'Partially Paid' && (
            <div className="flex justify-between items-center text-[10.5px] text-blue-900 border-t border-dashed border-blue-400 pt-0.5">
              <span className="font-sans font-semibold">Received / Balance:</span>
              <span>
                {receipt.charges.amountReceived} / {receipt.charges.outstandingBalance}
              </span>
            </div>
          )}
        </div>

        {/* 13. Dark Section Bar: Remarks */}
        <div className="bg-black text-white px-2 py-0.5 text-left text-[11px] font-bold uppercase tracking-wider my-1">
          Remarks
        </div>
        <div className="text-center py-1 text-[11px] font-semibold space-y-0.5">
          {receipt.remarks && receipt.remarks.length > 0 ? (
            receipt.remarks.map((rem, idx) => (
              <div key={idx} className="leading-tight">
                {rem}
              </div>
            ))
          ) : (
            <div className="leading-tight text-gray-500">None</div>
          )}
        </div>

        {/* 14. Dark Section Bar: Instructions */}
        <div className="bg-black text-white px-2 py-0.5 text-left text-[11px] font-bold uppercase tracking-wider my-1">
          Instructions
        </div>
        <div className="text-center py-1 text-[11.5px] font-bold leading-tight">
          {receipt.instructions || 'Handle With Care'}
        </div>

        {/* 15. Dark Section Bar: Customer Signature */}
        <div className="bg-black text-white px-2 py-0.5 text-left text-[11px] font-bold uppercase tracking-wider my-1">
          Customer Signature
        </div>
        <div className="text-center py-2 flex items-center justify-center min-h-[36px]">
          {receipt.customerSignature && receipt.customerSignature !== 'Nill' ? (
            receipt.customerSignature.startsWith('data:image') ? (
              <img
                src={receipt.customerSignature}
                alt="Signature"
                className="max-h-12 max-w-[140px] object-contain"
              />
            ) : (
              <span className="font-serif italic text-base">{receipt.customerSignature}</span>
            )
          ) : (
            <span className="text-[11.5px] font-medium text-black">Nill</span>
          )}
        </div>

        {/* Bottom Receipt ID and Barcode line */}
        <div className="border-t border-dashed border-gray-400 pt-1 mt-1 text-center">
          <div className="text-[9px] font-mono tracking-widest text-gray-800">
            {receipt.receiptNumber}
          </div>
          <div className="text-[7.5px] text-gray-500 tracking-tight mt-0.5">
            Thank you for shipping with Bacha Khan Transport
          </div>
        </div>

        {/* STAMPS LAYER */}
        <div
          onMouseDown={(e) => handleStampDrag(e, 'paid')}
          className="print:cursor-default"
        >
          <PaidStamp
            status={receipt.paymentStatus}
            settings={receipt.paidStampSettings}
            isInteractive={isInteractiveStamps}
          />
        </div>

        <div
          onMouseDown={(e) => handleStampDrag(e, 'company')}
          className="print:cursor-default"
        >
          <CompanyStamp
            settings={receipt.companyStampSettings}
            companyName={settings.companyName}
            isInteractive={isInteractiveStamps}
          />
        </div>
      </div>
    </div>
  );
};
