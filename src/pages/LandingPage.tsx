import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Radar, 
  GraduationCap, 
  Cpu, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  FileText, 
  Database, 
  Globe, 
  Sparkles,
  Smartphone,
  Server
} from 'lucide-react';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#060913] text-slate-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/80 bg-cyber-grid">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>SMART INDIA HACKATHON 2026 INNOVATION</span>
              <span className="text-slate-500">•</span>
              <span>THEME: ADVANCED CYBER DEFENSE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-mono">
              CYBER <span className="text-cyan-400">SURAKSHA</span>
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-slate-300 italic">
              “Detect. Explain. Protect. Learn.”
            </p>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              AI-Powered Unified Cyber Threat Detection, Prevention & Response Platform. 
              Bridging the gap between instantaneous threat interception, transparent explainable AI, and actionable cyber education for citizens, MSMEs, and law enforcement.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-cyan-950/60 transition"
              >
                <Shield className="w-4 h-4" />
                <span>LAUNCH DASHBOARD</span>
              </Link>
              <Link
                to="/scanner"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 transition"
              >
                <Radar className="w-4 h-4 text-cyan-400" />
                <span>SCAN A THREAT</span>
              </Link>
              <Link
                to="/cyberlab"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 transition"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>EXPLORE CYBERLAB</span>
              </Link>
            </div>

            {/* Live Metrics Pill Strip */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90">
                <span className="text-[11px] text-slate-400 block font-mono">Real-time Score</span>
                <span className="text-xl font-bold text-cyan-400 font-mono">87 / 100</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90">
                <span className="text-[11px] text-slate-400 block font-mono">Active Threats Today</span>
                <span className="text-xl font-bold text-rose-400 font-mono">14 Vector Scans</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90">
                <span className="text-[11px] text-slate-400 block font-mono">Threats Contained</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">3 Incidents</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90">
                <span className="text-[11px] text-slate-400 block font-mono">CyberLab Modules</span>
                <span className="text-xl font-bold text-amber-400 font-mono">8 Interactive</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Problem & Existing Gap */}
      <section className="py-16 border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                The National Challenge
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                India's Escalating Cyber Threat Landscape
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                With over 900 million internet users and the world's largest real-time digital payment volume (UPI), Indian citizens and small enterprises face unprecedented multi-vector assaults: 
                banking KYC smishing, fake electricity disconnections, predatory loan spyware, and sophisticated spear-phishing.
              </p>
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-rose-300 block">Fragmented & Black-box Tools</span>
                    <span className="text-slate-400">Traditional antivirus engines alert users with cryptic error codes without explaining *why* an asset is dangerous.</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-rose-300 block">No Unified Multi-Vector Defense</span>
                    <span className="text-slate-400">Users must toggle between separate URL checkers, SMS spam filters, and file scanners with zero shared threat correlation.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gap Analysis Box */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                <span>Existing Tools vs. Cyber Suraksha</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Analysis Transparency</span>
                  <span className="text-cyan-400 font-mono font-bold">100% Explainable AI</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Vectors Supported</span>
                  <span className="text-cyan-400 font-mono font-bold">URL + SMS + File + APK</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Adaptive Education</span>
                  <span className="text-cyan-400 font-mono font-bold">Built-in CyberLab Exercises</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Realistic OS Boundaries</span>
                  <span className="text-cyan-400 font-mono font-bold">Explicit Permission Model</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Solution & 4 Pillars ("Detect. Explain. Protect. Learn.") */}
      <section className="py-16 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              The 4 Pillars of Cyber Suraksha
            </h2>
            <p className="text-sm text-slate-400">
              A holistic cycle transforming reactive victims into proactive defenders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Detect */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
                <Radar className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">1. Detect</h3>
                <PrototypeBadge type="PROTOTYPE" size="sm" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-vector scanner analyzing URLs, SMS messages, binary files, and APK packages through heuristic scoring & threat intelligence.
              </p>
            </div>

            {/* 2. Explain */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">2. Explain</h3>
                <PrototypeBadge type="PROTOTYPE" size="sm" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Demystifies cyber attacks into plain language reasoning, pinpointing credential harvesting syntax, urgency lures, and spoofed headers.
              </p>
            </div>

            {/* 3. Protect */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">3. Protect</h3>
                <PrototypeBadge type="PROPOSED — OS AGENT" size="sm" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatic incident routing (DETECTED → RESOLVED), DNS sinkhole recommendations, and proposed native OS agents for automated containment.
              </p>
            </div>

            {/* 4. Learn */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">4. Learn</h3>
                <PrototypeBadge type="PROTOTYPE" size="sm" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Integrated CyberLab interactive terminal with real-world exercises (Bash, Forensics, Log Analysis) and personal security health score tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Features & How It Works */}
      <section className="py-16 border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Enterprise SOC Architecture
            </h2>
            <p className="text-sm text-slate-400">
              Rigorous, production-ready modules crafted for high availability and security compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Collective Threat Intelligence</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Privacy-preserving anonymized IOC aggregation. When multiple citizens report identical deceptive domains, our correlation engine elevates them into active emerging campaigns.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Forensic Reporting Engine</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate structured, evidentiary cybercrime incident reports formatted for filing directly on the Indian Cybercrime Reporting Portal (I4C / 1930).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">OS-Aware Agent Architecture</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transparently accounts for mobile and operating-system sandboxes. Integrates with proposed Android daemons and Windows drivers under explicit user authorization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Technology Stack & Impact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  SYSTEM READY FOR EVALUATION
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Experience the Full Working Cyber Suraksha Platform
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Explore the SOC dashboard, run live vector scans, inspect emerging campaigns, or practice defensive Bash commands in our CyberLab terminal.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/about"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
              >
                View Architecture
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
