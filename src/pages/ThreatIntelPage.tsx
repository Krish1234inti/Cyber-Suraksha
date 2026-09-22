import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  ShieldAlert, 
  Layers, 
  ExternalLink, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  Cpu, 
  Database,
  Hash,
  Link as LinkIcon
} from 'lucide-react';
import { threatIntelApi } from '../services/api';
import { ThreatIntelligenceRecord, ThreatCampaign } from '../types';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const ThreatIntelPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<ThreatCampaign[]>([]);
  const [indicators, setIndicators] = useState<ThreatIntelligenceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, iRes] = await Promise.all([
        threatIntelApi.getCampaigns(),
        threatIntelApi.getIndicators({ search: searchTerm || undefined }),
      ]);
      setCampaigns(cRes);
      setIndicators(iRes.indicators);
    } catch (err) {
      console.error('Error fetching threat intel:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const filteredIndicators = indicators.filter(ind => {
    return selectedCategory === 'ALL' || ind.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              Collective Threat Intelligence & IOC Feed
            </span>
            <PrototypeBadge type="PROTOTYPE" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            THREAT INTELLIGENCE RADAR
          </h1>
          <p className="text-xs text-slate-400">
            Real-time campaign correlation, IoC reputation database, and national cyber defense telemetry
          </p>
        </div>

        <button
          onClick={fetchData}
          className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition self-start"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sync IoC Feeds</span>
        </button>
      </div>

      {/* Emerging Campaigns Section (Section 14 requirement) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-mono tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>ACTIVE EMERGING THREAT CAMPAIGNS</span>
            </h2>
            <p className="text-xs text-slate-400">Correlated multi-vector campaigns targeting Indian infrastructure</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">{campaigns.length} Campaigns Monitored</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  camp.risk_level === 'CRITICAL' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' :
                  'bg-orange-950/80 text-orange-300 border border-orange-800'
                }`}>
                  {camp.risk_level}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  STATUS: {camp.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white font-mono leading-snug">
                  {camp.name}
                </h3>
                <span className="text-[11px] text-cyan-400/80 font-mono block mt-1">
                  Actor: {camp.threat_actor}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {camp.description}
              </p>

              {/* Exact requirement metrics: 127 domains, 43 URL patterns, 18 hashes */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center font-mono">
                <div className="p-2 rounded-lg bg-slate-950/80">
                  <span className="text-sm font-bold text-white block">{camp.domains_count}</span>
                  <span className="text-[9px] text-slate-400">Domains</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80">
                  <span className="text-sm font-bold text-white block">{camp.url_patterns_count}</span>
                  <span className="text-[9px] text-slate-400">URL Patterns</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80">
                  <span className="text-sm font-bold text-white block">{camp.hashes_count}</span>
                  <span className="text-[9px] text-slate-400">Hashes</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {camp.target_sectors.map((sec, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                    {sec}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator Database Search & Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Known Indicators of Compromise (IoC)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Query verified malicious domains, hashes, and IP addresses
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search domain, hash, or IP..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* IoC Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Indicator Value</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Reputation</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Telemetry Source</th>
                <th className="py-3 px-4">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredIndicators.map((item) => (
                <tr key={item.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3 px-4 text-slate-200 font-bold max-w-xs truncate">
                    {item.indicator_value}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {item.indicator_type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.reputation === 'MALICIOUS' ? 'bg-rose-950/80 text-rose-300' :
                      item.reputation === 'SUSPICIOUS' ? 'bg-amber-950/80 text-amber-300' :
                      'bg-emerald-950/80 text-emerald-300'
                    }`}>
                      {item.reputation}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-cyan-400 font-bold">
                    {item.confidence}%
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] font-sans">
                    {item.source}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {new Date(item.last_seen).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
