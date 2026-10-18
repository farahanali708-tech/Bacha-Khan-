import React from 'react';
import { PaymentStatus, StampSettings } from '../types/receipt';

interface PaidStampProps {
  status: PaymentStatus;
  settings: StampSettings;
  isInteractive?: boolean;
  onPositionChange?: (x: number, y: number) => void;
}

export const PaidStamp: React.FC<PaidStampProps> = ({
  status,
  settings,
  isInteractive = false,
  onPositionChange,
}) => {
  if (!settings.enabled) return null;

  // Configure ink color and text based on payment status
  let text = 'PAYMENT PAID';
  let inkColor = settings.inkColor || '#dc2626'; // default red
  let subText = 'VERIFIED & RECEIVED';

  if (status === 'Pending') {
    text = 'PAYMENT PENDING';
    inkColor = '#ea580c'; // energetic amber/orange
    subText = 'TO BE COLLECTED';
  } else if (status === 'Partially Paid') {
    text = 'PARTIALLY PAID';
    inkColor = '#2563eb'; // blue
    subText = 'BALANCE DUE';
  }

  // Allow custom text override if provided in settings
  if (settings.customText && status === 'Paid') {
    text = settings.customText;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${settings.x}%`,
        top: `${settings.y}%`,
        transform: `translate(-50%, -50%) rotate(${settings.rotation}deg) scale(${settings.scale})`,
        opacity: settings.opacity,
        pointerEvents: isInteractive ? 'auto' : 'none',
        cursor: isInteractive ? 'grab' : 'default',
        zIndex: 20,
        userSelect: 'none',
      }}
      title="Payment Stamp (Drag or use controls to reposition)"
    >
      {/* Realistic Circular Ink Stamp */}
      <div
        className="relative flex items-center justify-center rounded-full p-2 select-none"
        style={{
          width: '130px',
          height: '130px',
          border: `3.5px dashed ${inkColor}`,
          boxShadow: `inset 0 0 0 3px #ffffff, inset 0 0 0 6px ${inkColor}`,
          color: inkColor,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: 'rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Subtle ink grunge dots inside */}
        <div className="absolute inset-0 rounded-full pointer-events-none opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:6px_6px]" />

        <div className="text-center px-1 flex flex-col items-center justify-center">
          <div
            className="text-[8px] font-extrabold tracking-widest uppercase border-b pb-0.5 mb-1"
            style={{ borderColor: inkColor }}
          >
            BACHA KHAN
          </div>
          <div
            className="text-[13px] font-black tracking-wider leading-tight uppercase px-1 py-0.5 border-y-2"
            style={{ borderColor: inkColor }}
          >
            {text}
          </div>
          <div
            className="text-[7.5px] font-bold tracking-widest uppercase mt-1"
            style={{ color: inkColor }}
          >
            ★ {subText} ★
          </div>
        </div>
      </div>
    </div>
  );
};

interface CompanyStampProps {
  settings: StampSettings;
  companyName: string;
  isInteractive?: boolean;
}

export const CompanyStamp: React.FC<CompanyStampProps> = ({
  settings,
  companyName,
  isInteractive = false,
}) => {
  if (!settings.enabled) return null;

  const inkColor = settings.inkColor || '#1e40af'; // official blue

  return (
    <div
      style={{
        position: 'absolute',
        left: `${settings.x}%`,
        top: `${settings.y}%`,
        transform: `translate(-50%, -50%) rotate(${settings.rotation}deg) scale(${settings.scale})`,
        opacity: settings.opacity,
        pointerEvents: isInteractive ? 'auto' : 'none',
        zIndex: 19,
        userSelect: 'none',
      }}
      title="Company Stamp"
    >
      {settings.uploadedImage ? (
        <img
          src={settings.uploadedImage}
          alt="Company Stamp"
          className="max-w-[150px] max-h-[85px] object-contain drop-shadow"
          style={{ mixBlendMode: 'multiply' }}
        />
      ) : (
        /* Realistic Oval/Rectangular Transport Dispatch Stamp */
        <div
          className="px-4 py-2 rounded-xl text-center flex flex-col items-center justify-center"
          style={{
            border: `3px double ${inkColor}`,
            boxShadow: `0 0 0 1px ${inkColor}`,
            color: inkColor,
            background: 'rgba(255, 255, 255, 0.05)',
            minWidth: '150px',
          }}
        >
          <span className="text-[10px] font-black uppercase tracking-wider leading-tight">
            {companyName}
          </span>
          <span className="text-[7.5px] font-bold tracking-widest uppercase mt-0.5 text-slate-700">
            GOODS FORWARDING & CARGO
          </span>
          <div className="w-full border-t my-1 opacity-70" style={{ borderColor: inkColor }} />
          <span className="text-[8px] font-bold tracking-tight">
            BOOKING OFFICE • VERIFIED
          </span>
        </div>
      )}
    </div>
  );
};
