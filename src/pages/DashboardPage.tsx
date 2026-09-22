import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  PhoneCall, 
  MessageSquare, 
  Globe, 
  FileCode, 
  CheckCircle, 
  AlertTriangle, 
  Radar, 
  ArrowUpRight, 
  Activity, 
  Sparkles, 
  TrendingUp,
  RefreshCw,
  Clock,
  Layers,
  Bug,
  Lock,
  UserCheck,
  HardDrive,
  ShieldCheck,
  Database
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { dashboardApi } from '../services/api';
import { DashboardStats } from '../types';
import { RiskMeter } from '../components/common/RiskMeter';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-xs font-mono text-slate-400 tracking-wider">
          LOADING REAL-TIME SOC TELEMETRY...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              National Cyber Defense Console
            </span>
            <PrototypeBadge type="LIVE REST API" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            SOC SECURITY DASHBOARD
          </h1>
          <p className="text-xs text-gray-400">
            Real-time telemetry, threat containment metrics, and automated triage lifecycle
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchDashboardData}
            className="px-3 py-2 rounded-lg bg-[#161b22] hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Refresh Telemetry</span>
          </button>
          <Link
            to="/scanner"
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Radar className="w-3.5 h-3.5" />
            <span>Scan New Vector</span>
          </Link>
        </div>
      </div>

      {/* ACTIVE USER DEFENSE & ANTIVIRUS PROFILE STRIP */}
      {isAuthenticated && user && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1522] to-slate-900 border border-cyan-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{user.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  ● {user.protection_status || 'ACTIVE PROTECTION'}
                </span>
                {user.email === 'rahulsingh241177@gmail.com' && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                    MASTER CONTROLLER
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Active Antivirus Engine: <strong className="text-cyan-300">{user.antivirus_plan_name || 'Pro Security Shield'}</strong> ({user.device_type || 'ANDROID'} Protection) • License: <code className="text-slate-300">{user.license_key || 'CS-AUTO-2026'}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Link
              to="/user/profile"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>My Defense Logs</span>
            </Link>

            <Link
              to="/antivirus"
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Change / Upgrade Plan</span>
            </Link>

            {(isAdmin || user.email === 'rahulsingh241177@gmail.com') && (
              <Link
                to="/admin/database"
                className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Master DB</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Row 1: Main Metric Cards (Section 16 exact values) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Security Score Card (87/100) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0d1117] border border-cyan-500/30 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">
              Security Score
            </span>
            <Link 
              to="/security-score"
              className="text-[11px] text-gray-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition"
            >
              <span>Audit Breakdown</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
              {stats.security_score}
            </span>
            <span className="text-gray-500 text-sm font-mono">/ 100</span>
            <span className="ml-auto px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
              HEALTHY
            </span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mb-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${stats.security_score}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">
            +5 Points earned this week from CyberLab completion and verified smishing report.
          </p>
        </div>

        {/* Suspicious Calls (Today: 3) */}
        <div className="p-4 rounded-xl bg-[#0d1117] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>Suspicious Calls</span>
            <PhoneCall className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">
              {stats.today.suspicious_calls}
            </span>
            <span className="text-[10px] text-amber-400/80 font-mono">TODAY</span>
          </div>
          <p className="text-[10px] text-gray-500">VOIP Spoofing Cues</p>
        </div>

        {/* Suspicious Messages (Today: 5) */}
        <div className="p-4 rounded-xl bg-[#0d1117] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>Suspicious Messages</span>
            <MessageSquare className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">
              {stats.today.suspicious_messages}
            </span>
            <span className="text-[10px] text-rose-400/80 font-mono">TODAY</span>
          </div>
          <p className="text-[10px] text-gray-500">Smishing & Urgency Cues</p>
        </div>

        {/* Dangerous URLs (Today: 2) */}
        <div className="p-4 rounded-xl bg-[#0d1117] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>Dangerous URLs</span>
            <Globe className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">
              {stats.today.dangerous_urls}
            </span>
            <span className="text-[10px] text-rose-400/80 font-mono">TODAY</span>
          </div>
          <p className="text-[10px] text-gray-500">Phishing Domain Spoofs</p>
        </div>

        {/* Threats Contained (Today: 3) */}
        <div className="p-4 rounded-xl bg-[#0d1117] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>Threats Contained</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400 font-mono">
              {stats.today.threats_contained}
            </span>
            <span className="text-[10px] text-emerald-400/80 font-mono">TODAY</span>
          </div>
          <p className="text-[10px] text-gray-500">Quarantined / Sinkholed</p>
        </div>
      </div>

      {/* Row 2: Visual Charts (Threats over time, Categories, Risk Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Threats Over Time */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0d1117] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-mono tracking-wide">
                THREAT ACTIVITY & INTERCEPTIONS OVER TIME
              </h3>
              <p className="text-[11px] text-gray-400">7-Day Rolling Vector Volume</p>
            </div>
            <PrototypeBadge type="DEMO DATA" size="sm" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.threats_over_time} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="safeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d1117', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="threats" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#threatGrad)" name="High Risk Threats" />
                <Area type="monotone" dataKey="safe" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#safeGrad)" name="Benign Scans" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Risk Distribution */}
        <div className="p-5 rounded-xl bg-[#0d1117] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono tracking-wide">
              RISK DISTRIBUTION
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">60 Total Vectors</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.risk_distribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {stats.risk_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d1117', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {stats.risk_distribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-300 text-[11px] truncate">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Threats Table (Threat, Risk, Status, Time) */}
      <div className="p-6 rounded-xl bg-[#0d1117] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white font-mono tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>RECENT INTERCEPTED THREATS</span>
            </h3>
            <p className="text-xs text-gray-400">
              Live automated triage and explainable classification outputs
            </p>
          </div>
          <Link
            to="/scanner"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            <span>Open Threat Scanner</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0c10] text-gray-400 uppercase font-mono border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Detected Virus / Threat Signature</th>
                <th className="py-3 px-4">Vector / Asset</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Quarantine Status</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {stats.recent_threats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 font-mono">
                    <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                    <p className="text-white font-bold text-xs">No Threats or Scans Intercepted Yet</p>
                    <p className="text-[11px] text-gray-500 mt-1 max-w-md mx-auto">
                      Your device and system telemetry are completely clean. Run a scan from the Antivirus & Threat Scanner to inspect your own device files, software, or web links.
                    </p>
                  </td>
                </tr>
              ) : (
                stats.recent_threats.map((threat) => {
                  const isHigh = threat.risk_score >= 60;
                  const isQuarantined = threat.quarantine_status === 'QUARANTINED';
                  return (
                    <tr key={threat.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-4 text-gray-100 font-sans font-medium">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Bug className={`w-3.5 h-3.5 ${isHigh ? 'text-rose-400' : 'text-emerald-400'}`} />
                          <span className={isHigh ? 'text-rose-300' : 'text-slate-200'}>
                            {threat.detected_virus_name || threat.classification}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono block">
                          Classification: {threat.classification}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-gray-400 font-mono text-[11px]">
                        {threat.input_value || threat.input_hash}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#161b22] border border-white/10 text-gray-300 text-[10px]">
                          {threat.scan_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <RiskMeter score={threat.risk_score} level={threat.risk_level} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        {isQuarantined ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                            <CheckCircle className="w-3 h-3" /> QUARANTINED
                          </span>
                        ) : isHigh ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3" /> ACTIVE THREAT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                            CLEAN
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                        {new Date(threat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/scanner?id=${threat.id}`}
                          className="px-2.5 py-1 rounded bg-[#161b22] hover:bg-cyan-500/20 hover:text-cyan-300 text-gray-300 text-[11px] border border-white/10 transition"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
