import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Server, 
  Database, 
  Users, 
  Activity, 
  RotateCcw, 
  CheckCircle2, 
  RefreshCw,
  Cpu,
  Layers
} from 'lucide-react';
import { adminApi, demoApi } from '../services/api';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleResetDemo = async () => {
    try {
      const res = await demoApi.resetSeed();
      setSeedMessage(res.message);
      fetchStats();
      setTimeout(() => setSeedMessage(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !stats) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
        <span className="text-xs font-mono text-slate-400">Loading System Health Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono font-semibold text-purple-400 uppercase tracking-wider">
              National Security Operations Center (SOC) Master Admin
            </span>
            <PrototypeBadge type="PROTOTYPE" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            SYSTEM HEALTH & NODE ADMINISTRATION
          </h1>
          <p className="text-xs text-slate-400">
            Database pool metrics, uptime telemetry, heuristic model versions, and seed controls
          </p>
        </div>

        <button
          onClick={handleResetDemo}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-mono font-semibold flex items-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Initial SIH Demo Dataset</span>
        </button>
      </div>

      {seedMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{seedMessage}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400">TOTAL REGISTERED DEFENDERS</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">{stats.total_users}</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400">TOTAL SCANS ANALYZED</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">{stats.total_scans}</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400">CONTAINMENT UPTIME</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400 font-mono">{stats.system_uptime}</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400">DB CLUSTER STATUS</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-cyan-400 font-mono">{stats.db_status}</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
