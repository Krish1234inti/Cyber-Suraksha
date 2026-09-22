import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CheckCircle, 
  Plus, 
  Send,
  RefreshCw,
  FileText
} from 'lucide-react';
import { incidentApi } from '../services/api';
import { Incident } from '../types';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newStatus, setNewStatus] = useState<Incident['status']>('INVESTIGATING');
  const [noteInput, setNoteInput] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchIncident = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await incidentApi.getById(id);
      setIncident(data);
      setNewStatus(data.status);
    } catch (err) {
      console.error('Error fetching incident:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const handleStatusChange = async () => {
    if (!incident || !id) return;
    setUpdating(true);
    try {
      const updated = await incidentApi.updateStatus(id, newStatus, noteInput || undefined);
      setIncident(updated);
      setNoteInput('');
    } catch (err) {
      console.error('Status update error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickResolve = async () => {
    if (!incident || !id) return;
    setUpdating(true);
    try {
      const updated = await incidentApi.resolve(id, 'Threat successfully mitigated through CERT-In domain takedown.');
      setIncident(updated);
      setNewStatus('RESOLVED');
    } catch (err) {
      console.error('Resolution error:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !incident) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
        <span className="text-xs font-mono text-slate-400">Loading Incident #{id}...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/incidents"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Incidents Triage</span>
        </Link>
      </div>

      {/* Incident Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30">
                {incident.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                incident.status === 'DETECTED' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' :
                incident.status === 'INVESTIGATING' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' :
                incident.status === 'CONTAINED' ? 'bg-blue-950/80 text-blue-300 border border-blue-800' :
                'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
              }`}>
                STATUS: {incident.status}
              </span>
              <span className="text-xs font-mono text-slate-500">
                Created: {new Date(incident.created_at).toLocaleString()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-mono">
              {incident.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {incident.status !== 'RESOLVED' && (
              <button
                onClick={handleQuickResolve}
                disabled={updating}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition shadow-lg shadow-emerald-950/40"
              >
                <CheckCircle className="w-4 h-4" />
                <span>MARK RESOLVED</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          {incident.description}
        </p>
      </div>

      {/* Grid: Timeline + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Incident Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Incident Response Audit Timeline</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {incident.timeline.map((item, idx) => (
                <div key={idx} className="relative space-y-1">
                  {/* Dot */}
                  <div className={`absolute -left-[27px] top-1 w-3 h-3 rounded-full border-2 bg-slate-950 ${
                    item.status === 'RESOLVED' ? 'border-emerald-400' :
                    item.status === 'CONTAINED' ? 'border-blue-400' :
                    item.status === 'INVESTIGATING' ? 'border-amber-400' :
                    'border-rose-400'
                  }`} />

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">{item.title}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {item.description}
                  </p>

                  <div className="text-[10px] font-mono text-cyan-400/80">
                    Logged by: {item.actor}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Actions & Triage Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Update Status Box */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Triage Stage Transition
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Target Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Incident['status'])}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="DETECTED">DETECTED (Initial Triage)</option>
                  <option value="INVESTIGATING">INVESTIGATING (Analyst Assessing)</option>
                  <option value="CONTAINED">CONTAINED (Sinkholed / Quarantined)</option>
                  <option value="RESOLVED">RESOLVED (Closed)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Audit Log / Operational Note
                </label>
                <textarea
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="e.g. Domain sinkhole requested through NIXI registry..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                onClick={handleStatusChange}
                disabled={updating}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 transition"
              >
                {updating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>UPDATE TRIAGE STATUS</span>
              </button>
            </div>
          </div>

          {/* Recommended Playbook */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Recommended Playbook Steps
            </h3>
            <div className="space-y-2">
              {incident.recommended_actions.map((act, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
