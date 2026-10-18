import React, { useState } from 'react';
import { CompanySettings, PaperSize } from '../types/receipt';
import { Building2, X, Save, RotateCcw, Check, HelpCircle } from 'lucide-react';
import { DEFAULT_COMPANY_SETTINGS } from '../utils/defaults';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CompanySettings;
  onSave: (updated: CompanySettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all company settings back to initial defaults?')) {
      setFormData(DEFAULT_COMPANY_SETTINGS);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Company & Receipt Settings</h3>
              <p className="text-[11px] text-slate-400">
                Configure branding, GST number, print format and defaults
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white italic font-semibold focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                GST Number (Section Bar)
              </label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Top GST Line (Above Title)
              </label>
              <input
                type="text"
                value={formData.topGstNumber}
                onChange={(e) => setFormData({ ...formData, topGstNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Currency Symbol
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="PKR">PKR (Pakistani Rupee)</option>
                <option value="USD">USD ($)</option>
                <option value="AED">AED (UAE Dirham)</option>
                <option value="SAR">SAR (Saudi Riyal)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Default Thermal Paper Width
              </label>
              <select
                value={formData.defaultPaperSize}
                onChange={(e) =>
                  setFormData({ ...formData, defaultPaperSize: e.target.value as PaperSize })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="80mm">80mm POS Thermal Roll (Standard - Recommended)</option>
                <option value="58mm">58mm POS Thermal Roll (Compact Mini)</option>
                <option value="A4">A4 Full Sheet (Office Printer)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Terminal / Head Office Address
            </label>
            <textarea
              rows={2}
              value={formData.companyAddress}
              onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-hidden resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Contact Numbers / Helplines
            </label>
            <input
              type="text"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Original Spelling Toggle */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">
                Match Exact Reference Receipt Spelling ("Adress :")
              </span>
              <span className="text-[10.5px] text-slate-400">
                In the original printed photo, "Adress :" is written with a single 'd'. Toggle to use
                exact match or standard "Address :".
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.useOriginalSpelling}
              onChange={(e) =>
                setFormData({ ...formData, useOriginalSpelling: e.target.checked })
              }
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white px-2 py-1 rounded"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow"
              >
                {savedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-white" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
