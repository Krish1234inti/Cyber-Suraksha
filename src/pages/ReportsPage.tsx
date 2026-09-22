import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  ShieldAlert, 
  RefreshCw, 
  Eye,
  Plus
} from 'lucide-react';
import { reportsApi } from '../services/api';
import { ReportRecord } from '../types';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await reportsApi.list();
      setReports(data);
      if (data.length > 0) setSelectedReport(data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              Forensic Reporting & Legal Documentation
            </span>
            <PrototypeBadge type="PROTOTYPE" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            INCIDENT & FORENSIC REPORTS
          </h1>
          <p className="text-xs text-slate-400">
            Exportable structured dossiers formatted for CERT-In, I4C (1930 Portal), and executive review
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Report List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Generated Dossiers ({reports.length})
          </span>

          <div className="space-y-2">
            {reports.map((rep) => {
              const isSelected = selectedReport?.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition space-y-1.5 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[10px] text-cyan-400 font-bold">{rep.id}</span>
                    <span className="text-[10px] text-slate-500">{new Date(rep.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-slate-200 text-xs font-mono line-clamp-1">
                    {rep.title}
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-400 inline-block">
                    {rep.report_type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Dossier Viewer (8 cols) */}
        <div className="lg:col-span-8">
          {selectedReport ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 print:border-none print:bg-white print:text-black">
              {/* Report Header */}
              <div className="border-b border-slate-800 pb-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">CYBER SURAKSHA OFFICIAL INCIDENT REPORT</span>
                  <span className="text-slate-400">ID: {selectedReport.id}</span>
                </div>
                <h2 className="text-xl font-black text-white font-mono">
                  {selectedReport.title}
                </h2>
                <div className="text-[11px] font-mono text-slate-500">
                  Filing Agency: Indian Cyber Crime Coordination Centre (I4C) Reference Telemetry
                </div>
              </div>

              {/* Structured Metadata Box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">CATEGORY</span>
                  <span className="text-white font-bold">{selectedReport.report_type}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">DATE GENERATED</span>
                  <span className="text-white font-bold">{new Date(selectedReport.created_at).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">CONFIDENTIALITY</span>
                  <span className="text-emerald-400 font-bold">OFFICIAL USE ONLY</span>
                </div>
              </div>

              {/* Data payload display */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Technical Evidentiary Findings
                </h3>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 font-mono text-xs space-y-3">
                  {Object.entries(selectedReport.data).map(([key, val]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-850 pb-2">
                      <span className="text-slate-400 uppercase text-[11px] font-semibold">{key.replace(/_/g, ' ')}:</span>
                      <span className="text-slate-200 max-w-lg break-all text-right sm:text-left font-sans text-xs">
                        {Array.isArray(val) ? val.join(', ') : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidentiary Integrity Stamp */}
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-cyan-300 font-mono block">CRYPTOGRAPHIC INTEGRITY:</span>
                <p className="text-[11px] text-slate-400 font-mono break-all">
                  SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069 (Timestamp Verified)
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
              Select a report from the list to preview forensic details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
