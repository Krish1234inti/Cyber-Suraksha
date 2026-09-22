import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  ArrowRight,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { incidentApi } from '../services/api';
import { Incident } from '../types';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await incidentApi.list();
      setIncidents(data);
    } catch (err) {
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const filteredIncidents = incidents.filter(inc => {
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              National CERT-In & SOC Workflow
            </span>
            <PrototypeBadge type="PROTOTYPE" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            INCIDENT RESPONSE & TRIAGE
          </h1>
          <p className="text-xs text-slate-400">
            Lifecycle: DETECTED → INVESTIGATING → CONTAINED → RESOLVED with audit timeline
          </p>
        </div>

        <button
          onClick={fetchIncidents}
          className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition self-start"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh Incidents</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search incident ID or title..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          {['ALL', 'DETECTED', 'INVESTIGATING', 'CONTAINED', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Cards List */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
          <span className="text-xs font-mono text-slate-400">Loading Incident Triage Records...</span>
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
          No incidents found matching the selected filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition shadow-lg space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                    {inc.id}
                  </span>
                  <h3 className="text-sm font-bold text-white font-mono">
                    {inc.title}
                  </h3>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold ${
                    inc.status === 'DETECTED' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' :
                    inc.status === 'INVESTIGATING' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' :
                    inc.status === 'CONTAINED' ? 'bg-blue-950/80 text-blue-300 border border-blue-800' :
                    'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                  }`}>
                    {inc.status}
                  </span>

                  <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold ${
                    inc.risk_level === 'CRITICAL' ? 'bg-rose-950/80 text-rose-300' :
                    inc.risk_level === 'HIGH' ? 'bg-orange-950/80 text-orange-300' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {inc.risk_level}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {inc.description}
              </p>

              {/* Meta info & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs font-mono">
                <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{inc.assigned_to || 'Assigned to SOC Analyst'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(inc.created_at).toLocaleString()}</span>
                  </span>
                </div>

                <Link
                  to={`/incidents/${inc.id}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-900/40 hover:text-cyan-300 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition self-start"
                >
                  <span>View Full Timeline & Triage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
