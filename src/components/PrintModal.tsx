import React, { useState } from 'react';
import { ReceiptData, CompanySettings, PaperSize } from '../types/receipt';
import { Printer, Download, Image as ImageIcon, X, Check, Loader2 } from 'lucide-react';
import { exportReceiptAsPDF, exportReceiptAsPNG } from '../utils/pdfExport';
import { ReceiptPreview } from './ReceiptPreview';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptData;
  settings: CompanySettings;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  receipt,
  settings,
}) => {
  const [paperSize, setPaperSize] = useState<PaperSize>(settings.defaultPaperSize || '80mm');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    await exportReceiptAsPDF(
      'printable-receipt',
      `Bacha_Khan_${receipt.receiptNumber}_${receipt.date}`,
      paperSize
    );
    setIsExportingPDF(false);
  };

  const handleDownloadPNG = async () => {
    setIsExportingPNG(true);
    await exportReceiptAsPNG(
      'printable-receipt',
      `Bacha_Khan_${receipt.receiptNumber}_${receipt.date}`
    );
    setIsExportingPNG(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full text-white shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">Print & Export Center</h3>
              <p className="text-[11px] text-slate-400">
                Receipt {receipt.receiptNumber} • High-Resolution Thermal POS Output
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

        {/* Paper Selector Toolbar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Paper Format:</span>
            <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
              <button
                type="button"
                onClick={() => setPaperSize('80mm')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  paperSize === '80mm'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                80mm POS Roll
              </button>
              <button
                type="button"
                onClick={() => setPaperSize('58mm')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  paperSize === '58mm'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                58mm Mini Roll
              </button>
              <button
                type="button"
                onClick={() => setPaperSize('A4')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  paperSize === 'A4'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                A4 Sheet
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={isExportingPNG}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition"
              title="Download crisp PNG for WhatsApp / Mobile share"
            >
              {isExportingPNG ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              )}
              Download PNG
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition"
            >
              {isExportingPDF ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-emerald-400" />
              )}
              Download PDF
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
          </div>
        </div>

        {/* Live Preview Canvas Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 flex items-center justify-center">
          <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/60 shadow-inner flex justify-center">
            <ReceiptPreview
              receipt={receipt}
              settings={settings}
              paperSize={paperSize}
              isInteractiveStamps={false}
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Thermal Printer Tip: In browser print dialog, set Margins to <strong>None</strong> and
            scale to <strong>100%</strong> for cleanest receipt feed.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
