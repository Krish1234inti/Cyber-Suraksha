import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Terminal, 
  Award, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RefreshCw,
  BookOpen,
  Code,
  ShieldCheck
} from 'lucide-react';
import { cyberlabApi } from '../services/api';
import { CyberLabModule, CyberLabProgress } from '../types';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const CyberLabPage: React.FC = () => {
  const [modules, setModules] = useState<CyberLabModule[]>([]);
  const [progressList, setProgressList] = useState<CyberLabProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, pRes] = await Promise.all([
        cyberlabApi.getModules(),
        cyberlabApi.getProgress(),
      ]);
      setModules(mRes);
      setProgressList(pRes);
    } catch (err) {
      console.error('Error fetching cyberlab:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalXP = progressList.reduce((acc, curr) => acc + curr.xp_earned, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              Educational Defense Academy
            </span>
            <PrototypeBadge type="PROTOTYPE" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            CYBERLAB DEFENSIVE ACADEMY
          </h1>
          <p className="text-xs text-slate-400">
            Interactive terminal simulations, forensics CTFs, and defensive cybersecurity drills
          </p>
        </div>

        {/* User XP Badge */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">ACCUMULATED XP</span>
            <span className="text-xl font-bold text-white font-mono">{totalXP} XP</span>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
          <span className="text-xs font-mono text-slate-400">Loading CyberLab Modules...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod) => {
            const prog = progressList.find(p => p.module_id === mod.id);
            const isCompleted = prog?.completed || false;
            const percent = prog ? prog.progress : 0;

            return (
              <div
                key={mod.id}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                      {mod.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        mod.difficulty === 'BEGINNER' ? 'bg-emerald-950/80 text-emerald-300' :
                        mod.difficulty === 'INTERMEDIATE' ? 'bg-amber-950/80 text-amber-300' :
                        'bg-rose-950/80 text-rose-300'
                      }`}>
                        {mod.difficulty}
                      </span>
                      <span className="text-[11px] font-mono text-amber-400 font-bold">
                        +{mod.xp} XP
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white font-mono">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {mod.description}
                  </p>

                  {/* Objectives */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                      Learning Objectives:
                    </span>
                    {mod.objectives.map((obj, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress & Launch Button */}
                <div className="space-y-3 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Module Progress:</span>
                    <span className="text-cyan-400 font-bold">{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-emerald-400' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <Link
                    to={`/cyberlab/${mod.id}`}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{isCompleted ? 'REPLAY TERMINAL LAB' : 'LAUNCH INTERACTIVE TERMINAL'}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
