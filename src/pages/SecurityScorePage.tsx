import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Lock, 
  Smartphone, 
  Globe, 
  Cpu, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { securityScoreApi } from '../services/api';
import { SecurityScoreBreakdown } from '../types';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const SecurityScorePage: React.FC = () => {
  const [scoreData, setScoreData] = useState<SecurityScoreBreakdown | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      securityScoreApi.getBreakdown(),
      securityScoreApi.getHistory(),
    ]).then(([sRes, hRes]) => {
      setScoreData(sRes);
      setHistoryData(hRes.history);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading || !scoreData) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
        <span className="text-xs font-mono text-slate-400">Loading Personal Cyber Hygiene Audit...</span>
      </div>
    );
  }

  const subScores = [
    { name: 'Password & Auth Safety', score: scoreData.password_safety, icon: Lock, color: '#10b981' },
    { name: 'Device Security Posture', score: scoreData.device_security, icon: Smartphone, color: '#06b6d4' },
    { name: 'Link & URL Vigilance', score: scoreData.link_safety, icon: Globe, color: '#f59e0b' },
    { name: 'Application Integrity', score: scoreData.application_safety, icon: Cpu, color: '#8b5cf6' },
    { name: 'Threat Awareness / Labs', score: scoreData.threat_awareness, icon: ShieldCheck, color: '#10b981' },
    { name: 'OS Update Hygiene', score: scoreData.update_hygiene, icon: RefreshCw, color: '#06b6d4' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            Personal Cyber Hygiene Diagnostic
          </span>
          <PrototypeBadge type="PROTOTYPE" size="sm" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
          SECURITY SCORE DIAGNOSTIC: {scoreData.score} / 100
        </h1>
        <p className="text-xs text-slate-400">
          Multi-dimensional risk analysis quantifying device posture, link safety, and habit vigilance
        </p>
      </div>

      {/* Top Banner: Score + History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 space-y-4 shadow-xl">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
            AGGREGATE HYGIENE RATING
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-black text-white font-mono">{scoreData.score}</span>
            <span className="text-slate-400 text-base font-mono">/ 100</span>
            <span className="ml-auto px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              HEALTHY DEFENSE
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Your defensive posture sits in the 88th percentile. Completing pending link safety recommendations will elevate your score to 96 / 100.
          </p>

          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${scoreData.score}%` }}
            />
          </div>
        </div>

        {/* 7-Day Trend Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Security Score 7-Day Trajectory
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">+9 Points This Week</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[60, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090e1a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Security Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sub-scores Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
          Diagnostic Dimension Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subScores.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Targeted Defensive Recommendations</span>
          </h3>
          <span className="text-xs font-mono text-cyan-400">Potential Gain: +13 Points</span>
        </div>

        <div className="space-y-3">
          {scoreData.recommendations.map((rec, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                    {rec.category}
                  </span>
                  <span className="font-bold text-white font-sans">{rec.issue}</span>
                </div>
                <p className="text-slate-400 leading-relaxed font-sans">{rec.action}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs">
                  {rec.impact}
                </span>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition"
                >
                  Apply Fix
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
