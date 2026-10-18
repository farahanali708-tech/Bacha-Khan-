import React, { useState, useEffect } from 'react';
import { ReceiptData, CompanySettings, PaperSize } from './types/receipt';
import {
  DEFAULT_COMPANY_SETTINGS,
  createEmptyReceipt,
  createSampleReceipt,
  generateReceiptNumber,
} from './utils/defaults';
import {
  loadSavedReceipts,
  saveReceiptToStorage,
  deleteReceiptFromStorage,
  loadCompanySettings,
  saveCompanySettings,
} from './utils/storage';
import { exportReceiptAsPDF, exportReceiptAsPNG } from './utils/pdfExport';
import { Navbar } from './components/Navbar';
import { ReceiptForm } from './components/ReceiptForm';
import { ReceiptPreview } from './components/ReceiptPreview';
import { StampCustomizer } from './components/StampCustomizer';
import { ReceiptHistory } from './components/ReceiptHistory';
import { SettingsModal } from './components/SettingsModal';
import { PrintModal } from './components/PrintModal';
import { SignaturePadModal } from './components/SignaturePadModal';
import { VerificationModal } from './components/VerificationModal';
import {
  Eye,
  Edit3,
  Printer,
  Download,
  Save,
  CheckCircle2,
  AlertTriangle,
  Move,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(DEFAULT_COMPANY_SETTINGS);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptData>(() => createSampleReceipt());

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [isInteractiveStamps, setIsInteractiveStamps] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSignaturePadOpen, setIsSignaturePadOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(
    null
  );

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load from localStorage on mount
  useEffect(() => {
    const loadedSettings = loadCompanySettings();
    setCompanySettings(loadedSettings);

    const loadedReceipts = loadSavedReceipts();
    setReceipts(loadedReceipts);

    if (loadedReceipts.length > 0) {
      // Start with the latest saved receipt or empty new
      setCurrentReceipt(loadedReceipts[0]);
    } else {
      // Default to sample receipt to showcase the design immediately
      setCurrentReceipt(createSampleReceipt());
    }
  }, []);

  // Save receipt handler
  const handleSaveReceipt = () => {
    const result = saveReceiptToStorage(currentReceipt);
    if (result.success) {
      const updated = loadSavedReceipts();
      setReceipts(updated);
      showToast(`Receipt ${currentReceipt.receiptNumber} saved successfully.`, 'success');
    } else {
      showToast(result.message, 'error');
    }
  };

  // Reset to brand new receipt
  const handleResetForm = () => {
    const newSeq = receipts.length;
    const blank = createEmptyReceipt(newSeq);
    setCurrentReceipt(blank);
    showToast('Form cleared. New receipt initiated.', 'info');
  };

  // Load sample test data
  const handleLoadSample = () => {
    setCurrentReceipt(createSampleReceipt());
    showToast('Loaded sample specimen receipt for testing.', 'info');
  };

  // Duplicate an existing receipt
  const handleDuplicateReceipt = (source: ReceiptData) => {
    const newRcptNumber = generateReceiptNumber(receipts.length);
    const duplicated: ReceiptData = {
      ...source,
      id: `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      receiptNumber: newRcptNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSample: false,
    };
    setCurrentReceipt(duplicated);
    setActiveTab('generator');
    setMobileView('form');
    showToast(`Duplicated into new receipt: ${newRcptNumber}`, 'success');
  };

  // Delete receipt
  const handleDeleteReceipt = (id: string) => {
    const success = deleteReceiptFromStorage(id);
    if (success) {
      const updated = loadSavedReceipts();
      setReceipts(updated);
      showToast('Receipt deleted.', 'info');
    } else {
      showToast('Failed to delete receipt.', 'error');
    }
  };

  // Direct print from history
  const handleDirectPrint = (rcpt: ReceiptData) => {
    setCurrentReceipt(rcpt);
    setIsPrintModalOpen(true);
  };

  // Direct PDF download from history
  const handleDirectDownloadPDF = async (rcpt: ReceiptData) => {
    setCurrentReceipt(rcpt);
    setTimeout(async () => {
      await exportReceiptAsPDF(
        'printable-receipt',
        `Bacha_Khan_${rcpt.receiptNumber}_${rcpt.date}`,
        companySettings.defaultPaperSize
      );
      showToast(`PDF downloaded for ${rcpt.receiptNumber}`, 'success');
    }, 150);
  };

  // Update stamp positions from drag or customizer
  const handleUpdateStampPosition = (stampType: 'paid' | 'company', x: number, y: number) => {
    if (stampType === 'paid') {
      setCurrentReceipt((prev) => ({
        ...prev,
        paidStampSettings: {
          ...prev.paidStampSettings,
          x,
          y,
        },
      }));
    } else {
      setCurrentReceipt((prev) => ({
        ...prev,
        companyStampSettings: {
          ...prev.companyStampSettings,
          x,
          y,
        },
      }));
    }
  };

  // Save company settings
  const handleSaveSettings = (newSettings: CompanySettings) => {
    setCompanySettings(newSettings);
    saveCompanySettings(newSettings);
    showToast('Company branding & settings updated.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border ${
              toast.type === 'success'
                ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
                : toast.type === 'error'
                ? 'bg-rose-950 text-rose-200 border-rose-800'
                : 'bg-slate-900 text-slate-200 border-slate-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
            {toast.type === 'info' && <Sparkles className="w-4 h-4 text-sky-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSaveCurrentReceipt={handleSaveReceipt}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        settings={companySettings}
        receiptNumber={currentReceipt.receiptNumber}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8">
        {activeTab === 'history' ? (
          /* Receipt History Tab */
          <ReceiptHistory
            receipts={receipts}
            settings={companySettings}
            onSelectReceipt={(rcpt) => {
              setCurrentReceipt(rcpt);
              setActiveTab('generator');
              showToast(`Loaded receipt ${rcpt.receiptNumber}`, 'info');
            }}
            onDuplicateReceipt={handleDuplicateReceipt}
            onDeleteReceipt={handleDeleteReceipt}
            onDirectPrint={handleDirectPrint}
            onDirectDownloadPDF={handleDirectDownloadPDF}
            onCreateNew={handleResetForm}
          />
        ) : (
          /* Receipt Generator Tab (Split-Screen / Responsive Mobile) */
          <div className="space-y-4">
            {/* Mobile View Toggle Bar (Only shown on small screens) */}
            <div className="lg:hidden flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold pl-2">Current Mode:</span>
              <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setMobileView('form')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition ${
                    mobileView === 'form'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Form
                </button>
                <button
                  type="button"
                  onClick={() => setMobileView('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition ${
                    mobileView === 'preview'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Live Receipt
                </button>
              </div>
            </div>

            {/* Split Screen Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form & Stamp Controls */}
              <div
                className={`lg:col-span-7 space-y-5 ${
                  mobileView === 'preview' ? 'hidden lg:block' : 'block'
                }`}
              >
                {/* Stamp & Seal Customizer Controls */}
                <StampCustomizer
                  paidStampSettings={currentReceipt.paidStampSettings}
                  companyStampSettings={currentReceipt.companyStampSettings}
                  paymentStatus={currentReceipt.paymentStatus}
                  onChangePaidStamp={(paidStampSettings) =>
                    setCurrentReceipt((prev) => ({ ...prev, paidStampSettings }))
                  }
                  onChangeCompanyStamp={(companyStampSettings) =>
                    setCurrentReceipt((prev) => ({ ...prev, companyStampSettings }))
                  }
                  isInteractiveStamps={isInteractiveStamps}
                  onToggleInteractiveStamps={() => setIsInteractiveStamps(!isInteractiveStamps)}
                />

                {/* Main Receipt Input Form */}
                <ReceiptForm
                  receipt={currentReceipt}
                  settings={companySettings}
                  onChange={setCurrentReceipt}
                  onReset={handleResetForm}
                  onLoadSample={handleLoadSample}
                  onOpenSignaturePad={() => setIsSignaturePadOpen(true)}
                />
              </div>

              {/* Right Column: Live Printable Receipt Preview (Sticky on desktop) */}
              <div
                className={`lg:col-span-5 lg:sticky lg:top-24 space-y-4 ${
                  mobileView === 'form' ? 'hidden lg:block' : 'block'
                }`}
              >
                {/* Live Preview Header Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Live Thermal POS Preview
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsInteractiveStamps(!isInteractiveStamps)}
                      className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition ${
                        isInteractiveStamps
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                      title="Toggle drag-and-drop repositioning for stamps"
                    >
                      <Move className="w-3 h-3" />
                      {isInteractiveStamps ? 'Drag Stamps ON' : 'Drag Stamps'}
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveReceipt}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[11px] font-semibold flex items-center gap-1 transition"
                      title="Save to database"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                </div>

                {/* Printable Receipt Paper Container */}
                <div className="bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center">
                  <ReceiptPreview
                    receipt={currentReceipt}
                    settings={companySettings}
                    paperSize={companySettings.defaultPaperSize}
                    isInteractiveStamps={isInteractiveStamps}
                    onUpdateStampPosition={handleUpdateStampPosition}
                    onOpenVerification={() => setIsVerificationOpen(true)}
                  />

                  {/* Print & Export Bar under Preview */}
                  <div className="w-full mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPrintModalOpen(true)}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow transition"
                    >
                      <Printer className="w-4 h-4" />
                      Print Receipt
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        exportReceiptAsPDF(
                          'printable-receipt',
                          `Bacha_Khan_${currentReceipt.receiptNumber}_${currentReceipt.date}`,
                          companySettings.defaultPaperSize
                        )
                      }
                      className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      Download PDF
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        exportReceiptAsPNG(
                          'printable-receipt',
                          `Bacha_Khan_${currentReceipt.receiptNumber}_${currentReceipt.date}`
                        )
                      }
                      className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      title="Download image for WhatsApp sharing"
                    >
                      PNG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={companySettings}
        onSave={handleSaveSettings}
      />

      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        receipt={currentReceipt}
        settings={companySettings}
      />

      <SignaturePadModal
        isOpen={isSignaturePadOpen}
        onClose={() => setIsSignaturePadOpen(false)}
        currentSignature={currentReceipt.customerSignature}
        onSaveSignature={(sig) => {
          setCurrentReceipt((prev) => ({
            ...prev,
            customerSignature: sig,
            isSample: false,
          }));
          showToast('Customer signature saved.', 'success');
        }}
      />

      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        receipt={currentReceipt}
        settings={companySettings}
      />
    </div>
  );
}
