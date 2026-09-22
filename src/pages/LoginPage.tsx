import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('officer.sharma@cybercell.gov.in');
  const [password, setPassword] = useState('SecurityOfficer@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('DemoPassword2026!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <span>OFFICIAL SOC CONSOLE ACCESS</span>
            <PrototypeBadge type="LIVE REST API" size="sm" />
          </div>
          <h1 className="text-2xl font-black text-white font-mono tracking-tight">
            SIGN IN TO CYBER SURAKSHA
          </h1>
          <p className="text-xs text-slate-400">
            Access National Cyber Threat Telemetry & Incident Playbooks
          </p>
        </div>

        {/* Login Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Official Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs font-mono flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-950/50"
            >
              <UserCheck className="w-4 h-4" />
              <span>{loading ? 'AUTHENTICATING...' : 'SECURE CONSOLE LOGIN'}</span>
            </button>
          </form>

          {/* Quick Demo Credentials for Hackathon Judges */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block text-center">
              Quick Judge & Evaluator Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('officer.sharma@cybercell.gov.in')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono text-left transition"
              >
                <span className="font-bold text-cyan-400 block">SOC Officer</span>
                <span className="text-[10px] text-slate-500">Inspector Sharma</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@cybersuraksha.gov.in')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono text-left transition"
              >
                <span className="font-bold text-purple-400 block">Super Admin</span>
                <span className="text-[10px] text-slate-500">National SOC Lead</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
