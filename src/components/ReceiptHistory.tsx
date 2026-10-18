import React, { useState, useMemo } from 'react';
import { ReceiptData, CompanySettings, PaymentStatus } from '../types/receipt';
import {
  Search,
  Filter,
  Download,
  Copy,
  Edit,
  Trash2,
  Printer,
  FileSpreadsheet,
  Calendar,
  AlertCircle,
  Database,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import { exportReceiptsToCSV } from '../utils/storage';

interface ReceiptHistoryProps {
  receipts: ReceiptData[];
  settings: CompanySettings;
  onSelectReceipt: (receipt: ReceiptData) => void;
  onDuplicateReceipt: (receipt: ReceiptData) => void;
  onDeleteReceipt: (id: string) => void;
  onDirectPrint: (receipt: ReceiptData) => void;
  onDirectDownloadPDF: (receipt: ReceiptData) => void;
  onCreateNew: () => void;
}

export const ReceiptHistory: React.FC<ReceiptHistoryProps> = ({
  receipts,
  settings,
  onSelectReceipt,
  onDuplicateReceipt,
  onDeleteReceipt,
  onDirectPrint,
  onDirectDownloadPDF,
  onCreateNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PaymentStatus>('All');
  const [dateFilter, setDateFilter] = useState('');

  // Filter and sort receipts
  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      // Search by receipt #, shipper name/phone, consignee name/phone, route
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        r.receiptNumber.toLowerCase().includes(query) ||
        r.shipper.name.toLowerCase().includes(query) ||
        r.shipper.phone.toLowerCase().includes(query) ||
        r.consignee.name.toLowerCase().includes(query) ||
        r.consignee.phone.toLowerCase().includes(query) ||
        r.origin.toLowerCase().includes(query) ||
        r.destination.toLowerCase().includes(query);

      // Status filter
      const matchesStatus = statusFilter === 'All' || r.paymentStatus === statusFilter;

      // Date filter (matches DD-MM-YYYY or YYYY-MM-DD)
      const matchesDate = !dateFilter || r.date.includes(dateFilter);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [receipts, searchQuery, statusFilter, dateFilter]);

  const handleExportCSV = () => {
    exportReceiptsToCSV(filteredReceipts, settings.currency);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner explaining persistent storage */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-start gap-2.5">
          <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white text-sm">
              Local Browser Storage Active ({receipts.length} Saved Receipts)
            </h4>
            <p className="text-slate-400 mt-0.5">
              All receipts are saved locally in your browser and will persist across refreshes.
              Use "Export CSV" for Excel backup or to share reports.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={receipts.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV ({filteredReceipts.length})
          </button>
          <button
            type="button"
            onClick={onCreateNew}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-xs transition"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            New Receipt
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by receipt #, shipper, consignee..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | PaymentStatus)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially Paid</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date (e.g. 17-10 or 2026)"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Receipts Table / List */}
      {filteredReceipts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-300">No matching receipts found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'All' || dateFilter
              ? 'Try adjusting your search filters.'
              : 'Create and save your first receipt from the Receipt Entry tab.'}
          </p>
          <button
            type="button"
            onClick={onCreateNew}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
          >
            Create New Receipt
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Receipt No.</th>
                  <th className="py-3 px-3">Date / Time</th>
                  <th className="py-3 px-3">Route & Cargo</th>
                  <th className="py-3 px-3">Shipper / Consignee</th>
                  <th className="py-3 px-3 text-right">Total Amount</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredReceipts.map((rcpt) => (
                  <tr
                    key={rcpt.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectReceipt(rcpt)}
                  >
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {rcpt.receiptNumber}
                      {rcpt.isSample && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-sans">
                          SAMPLE
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-slate-400">
                      <div>{rcpt.date}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{rcpt.time}</div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-200">
                        {rcpt.origin} ➔ {rcpt.destination}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {rcpt.pieces} pcs | {rcpt.weight}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-slate-200 font-medium truncate max-w-[160px]">
                        From: {rcpt.shipper.name || '—'}
                      </div>
                      <div className="text-slate-400 text-[10.5px] truncate max-w-[160px]">
                        To: {rcpt.consignee.name || '—'}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-100 whitespace-nowrap">
                      {settings.currency} {rcpt.charges.total.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                          rcpt.paymentStatus === 'Paid'
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : rcpt.paymentStatus === 'Pending'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {rcpt.paymentStatus}
                      </span>
                    </td>

                    <td
                      className="py-3 px-3 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectReceipt(rcpt)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded hover:text-white"
                          title="Open & Edit Receipt"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDuplicateReceipt(rcpt)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded hover:text-white"
                          title="Duplicate as New Receipt"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDirectPrint(rcpt)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded hover:text-white"
                          title="Print Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDirectDownloadPDF(rcpt)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded hover:text-white"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete receipt "${rcpt.receiptNumber}"?`
                              )
                            ) {
                              onDeleteReceipt(rcpt.id);
                            }
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 rounded"
                          title="Delete Receipt"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
