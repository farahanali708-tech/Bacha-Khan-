import React from 'react';
import { Truck, Plus, History, Settings, Printer, Download, Save, ShieldCheck } from 'lucide-react';
import { CompanySettings } from '../types/receipt';

interface NavbarProps {
  currentTab: 'generator' | 'history';
  onSelectTab: (tab: 'generator' | 'history') => void;
  onOpenSettings: () => void;
  onSaveCurrentReceipt: () => void;
  onOpenPrintModal: () => void;
  settings: CompanySettings;
  receiptNumber: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  onSaveCurrentReceipt,
  onOpenPrintModal,
  settings,
  receiptNumber,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 select-none print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-950">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-wide text-white uppercase font-sans">
                  {settings.companyName}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  RECEIPT POS
                </span>
              </div>
              <div className="text-[11px] text-slate-400 italic">
                {settings.slogan} • GST: {settings.gstNumber}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onSelectTab('generator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                currentTab === 'generator'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              Receipt Generator
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                currentTab === 'history'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-4 h-4" />
              Receipt History
            </button>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSaveCurrentReceipt}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
              title="Save current receipt to browser storage"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              Save Receipt
            </button>

            <button
              type="button"
              onClick={onOpenPrintModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition"
              title="Print or export PDF/PNG"
            >
              <Printer className="w-4 h-4" />
              Print / PDF
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Company Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
