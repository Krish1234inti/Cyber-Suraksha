import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Key, CheckCircle2, Lock } from 'lucide-react';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const SettingsPage: React.FC = () => {
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [realtimeSmsAlerts, setRealtimeSmsAlerts] = useState(true);
  const [anonymousSharing, setAnonymousSharing] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <SettingsIcon className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            Defense Preferences & Privacy Controls
          </span>
          <PrototypeBadge type="PROTOTYPE" size="sm" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
          PLATFORM SETTINGS
        </h1>
        <p className="text-xs text-slate-400">
          Configure automated quarantine recommendations and privacy-preserving IoC sharing
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Defensive Automation
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white block">Automated Incident Triage</span>
                <span className="text-[11px] text-slate-400">Auto-open an incident ticket whenever a scan scores above 80/100 risk.</span>
              </div>
              <input
                type="checkbox"
                checked={autoQuarantine}
                onChange={(e) => setAutoQuarantine(e.target.checked)}
                className="w-4 h-4 text-cyan-600 rounded bg-slate-900 border-slate-700 focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white block">Real-time Smishing Alerts</span>
                <span className="text-[11px] text-slate-400">Flag incoming SMS patterns matching active banking campaigns.</span>
              </div>
              <input
                type="checkbox"
                checked={realtimeSmsAlerts}
                onChange={(e) => setRealtimeSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-cyan-600 rounded bg-slate-900 border-slate-700 focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white block">Anonymized IoC Contribution</span>
                <span className="text-[11px] text-slate-400">Contribute anonymized malicious domain indicators to CERT-In collective radar.</span>
              </div>
              <input
                type="checkbox"
                checked={anonymousSharing}
                onChange={(e) => setAnonymousSharing(e.target.checked)}
                className="w-4 h-4 text-cyan-600 rounded bg-slate-900 border-slate-700 focus:ring-cyan-500"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs font-mono transition"
          >
            SAVE PREFERENCES
          </button>

          {saved && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
