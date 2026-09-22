import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Terminal as TerminalIcon, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  RefreshCw, 
  Sparkles,
  ChevronRight,
  Send
} from 'lucide-react';
import { cyberlabApi } from '../services/api';
import { CyberLabModule, CyberLabTask } from '../types';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

interface HistoryLine {
  type: 'COMMAND' | 'OUTPUT' | 'SYSTEM';
  text: string;
}

export const CyberLabTerminalPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [module, setModule] = useState<CyberLabModule | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [commandInput, setCommandInput] = useState<string>('');
  const [history, setHistory] = useState<HistoryLine[]>([
    { type: 'SYSTEM', text: 'Cyber Suraksha Educational Terminal v1.0.0 [Safe Sandbox Environment]' },
    { type: 'SYSTEM', text: 'Type "help" to see available safe commands or enter the command requested by the drill.' },
  ]);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [moduleCompleted, setModuleCompleted] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    cyberlabApi.getModules().then(modules => {
      const found = modules.find(m => m.id === id) || modules[0];
      setModule(found);
      setLoading(false);
    }).catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const currentTask: CyberLabTask | undefined = module?.tasks[currentTaskIndex];

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    setCommandInput('');
    const newHistory = [...history, { type: 'COMMAND' as const, text: `$ ${cmd}` }];

    try {
      const res = await cyberlabApi.executeTerminalCommand(cmd);

      if (res.output === '__CLEAR__') {
        setHistory([]);
        return;
      }

      newHistory.push({ type: 'OUTPUT' as const, text: res.output });
      setHistory(newHistory);

      // Check task requirement
      if (currentTask && cmd.toLowerCase().includes(currentTask.expectedCommand.toLowerCase())) {
        if (!completedTasks.includes(currentTask.id)) {
          const nextCompleted = [...completedTasks, currentTask.id];
          setCompletedTasks(nextCompleted);

          if (nextCompleted.length === module?.tasks.length) {
            setModuleCompleted(true);
            if (module) {
              cyberlabApi.completeModule(module.id);
            }
          } else if (currentTaskIndex < (module?.tasks.length || 0) - 1) {
            setCurrentTaskIndex(prev => prev + 1);
          }
        }
      }
    } catch (err) {
      console.error(err);
      newHistory.push({ type: 'OUTPUT' as const, text: 'Command execution simulated error.' });
      setHistory(newHistory);
    }
  };

  if (loading || !module) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
        <span className="text-xs font-mono text-slate-400">Loading Terminal Sandbox...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <Link
            to="/cyberlab"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to CyberLab Modules</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-mono">
              {module.title}
            </h1>
            <PrototypeBadge type="PROTOTYPE" size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-amber-400 font-bold px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30">
            +{module.xp} XP
          </span>
          <span className="text-xs font-mono text-slate-400">
            Task {currentTaskIndex + 1} of {module.tasks.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Terminal (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-[550px] rounded-2xl bg-[#090d16] border border-slate-800 shadow-2xl overflow-hidden">
          {/* Terminal Titlebar */}
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400 select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-bold text-slate-300">analyst@cyber-suraksha: /home/analyst/lab</span>
            </div>
            <span className="text-[10px] text-cyan-400">Safe Shell</span>
          </div>

          {/* Terminal Console View */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 leading-relaxed text-slate-300 bg-slate-950/60">
            {history.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap">
                {line.type === 'COMMAND' && (
                  <span className="text-cyan-400 font-bold">{line.text}</span>
                )}
                {line.type === 'OUTPUT' && (
                  <span className="text-slate-300">{line.text}</span>
                )}
                {line.type === 'SYSTEM' && (
                  <span className="text-slate-500 italic">{line.text}</span>
                )}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Command Input Bar */}
          <form onSubmit={handleCommandSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 font-mono">
            <span className="text-cyan-400 text-xs font-bold">$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Type bash command (e.g. whoami, ls, cat auth.log)..."
              className="flex-1 bg-transparent text-slate-200 text-xs font-mono focus:outline-none placeholder:text-slate-600"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs transition flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Run</span>
            </button>
          </form>
        </div>

        {/* Right: Task Guidance & Objectives (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Drill Card */}
          {currentTask && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  CURRENT DRILL OBJECTIVE
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Step {currentTask.id}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white font-mono">
                {currentTask.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentTask.instruction}
              </p>

              {/* Hint Box */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1 text-xs">
                <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1 font-bold">
                  <HelpCircle className="w-3 h-3" />
                  HINT:
                </span>
                <p className="text-slate-400 text-[11px] font-mono">{currentTask.hint}</p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCommandInput(currentTask.solution)}
                  className="text-[10px] text-cyan-400/80 hover:text-cyan-300 font-mono underline"
                >
                  [Autofill solution command: {currentTask.solution}]
                </button>
              </div>
            </div>
          )}

          {/* Module Tasks Checklist */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Module Drill Progress
            </span>

            <div className="space-y-2">
              {module.tasks.map((t, idx) => {
                const done = completedTasks.includes(t.id);
                const isCurrent = idx === currentTaskIndex;

                return (
                  <div
                    key={t.id}
                    onClick={() => setCurrentTaskIndex(idx)}
                    className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between cursor-pointer transition ${
                      done ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' :
                      isCurrent ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200' :
                      'bg-slate-950/40 border-slate-800/60 text-slate-400'
                    }`}
                  >
                    <span>{t.id}. {t.title}</span>
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <span className="text-[10px] text-slate-500">PENDING</span>
                    )}
                  </div>
                );
              })}
            </div>

            {moduleCompleted && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2 pt-3">
                <Award className="w-8 h-8 text-amber-400 mx-auto" />
                <div className="text-xs font-bold text-emerald-300 font-mono">
                  CONGRATULATIONS! MODULE COMPLETED
                </div>
                <div className="text-[11px] text-slate-400">
                  +{module.xp} XP awarded to your security profile.
                </div>
                <Link
                  to="/cyberlab"
                  className="inline-block mt-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold transition"
                >
                  Return to Academy
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
