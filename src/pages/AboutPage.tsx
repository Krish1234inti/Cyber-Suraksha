import React from 'react';
import { 
  Shield, 
  Cpu, 
  Database, 
  Globe, 
  Server, 
  Smartphone, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const AboutPage: React.FC = () => {
  const pipelineSteps = [
    { name: '1. User Input', desc: 'URL, Message, File, or APK Manifest' },
    { name: '2. Validation', desc: 'Sanitization, MIME verification, and SHA-256' },
    { name: '3. Static Analysis', desc: 'Double extensions, permissions, TLD flags' },
    { name: '4. Threat Intel', desc: 'Cross-reference with 240+ known malicious IoCs' },
    { name: '5. AI/ML Analysis', desc: 'NLP urgency classifier & financial spoof heuristics' },
    { name: '6. Risk Engine', desc: 'Normalized 0-100 score + risk level calibration' },
    { name: '7. Explainable AI', desc: 'Plain-language attribution & detected cues' },
    { name: '8. Response Playbook', desc: 'CERT-In escalation, DNS sinkhole, quarantine' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            Smart India Hackathon (SIH) 2026 Documentation
          </span>
          <PrototypeBadge type="PROTOTYPE" size="sm" />
        </div>
        <h1 className="text-3xl font-black text-white font-mono tracking-tight">
          CYBER SURAKSHA ARCHITECTURE SPECIFICATION
        </h1>
        <p className="text-xs text-slate-400 max-w-3xl">
          National-Level AI-Powered Unified Cyber Threat Detection, Prevention & Response Platform. 
          Bridging technical defense, explainable AI, and citizen education.
        </p>
      </div>

      {/* Pipeline Diagram */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>The End-to-End Threat Detection Pipeline</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-xs font-mono font-bold text-cyan-400 block">{step.name}</span>
              <p className="text-[11px] text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Realistic Boundaries Section (Section 31 exact requirement) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
            Platform Realism & Operating System Boundaries
          </h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl font-sans">
          Cyber Suraksha is built upon principled security engineering, not science-fiction antivirus claims. 
          Modern operating systems enforce strict application sandboxes. The matrix below transparently delineates 
          what our web platform demonstrates versus what requires native operating system privilege escalations:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold block">1. Browser Sandbox Environment</span>
            <p className="text-slate-400 font-sans text-xs">
              Web applications cannot arbitrarily read local files or monitor background processes. Our solution operates via explicit user input submissions and browser extensions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold block">2. Android Permissions Model</span>
            <p className="text-slate-400 font-sans text-xs">
              Direct SMS interception and call screening require <code className="text-slate-200">READ_SMS</code>, <code className="text-slate-200">ROLE_CALL_SCREENING</code>, or Accessibility Service grants under Google Play policy.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold block">3. WhatsApp & End-to-End Encryption</span>
            <p className="text-slate-400 font-sans text-xs">
              WhatsApp chats cannot be read directly due to Signal protocol encryption. Detection works through user forwarding or explicit accessibility triage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold block">4. Windows & Linux Kernel Privileges</span>
            <p className="text-slate-400 font-sans text-xs">
              Deep file quarantine requires administrative/root privileges or Windows Defender API integration; in this prototype, quarantine is simulated.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Transparency Matrix */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
          Feature Credibility Matrix (SIH 2026 Evaluation)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Feature Module</th>
                <th className="py-3 px-4">Status Tag</th>
                <th className="py-3 px-4">Technical Implementation Mechanism</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr>
                <td className="py-3 px-4 font-bold text-white">URL & Phishing Engine</td>
                <td className="py-3 px-4"><PrototypeBadge type="PROTOTYPE" size="sm" /></td>
                <td className="py-3 px-4 text-slate-300 font-sans">Live REST API + Heuristic & IoC rules</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">SMS & Email NLP Analyzer</td>
                <td className="py-3 px-4"><PrototypeBadge type="PROTOTYPE" size="sm" /></td>
                <td className="py-3 px-4 text-slate-300 font-sans">Deterministic NLP classifier for urgency & credentials</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">CyberLab Safe Terminal</td>
                <td className="py-3 px-4"><PrototypeBadge type="PROTOTYPE" size="sm" /></td>
                <td className="py-3 px-4 text-slate-300 font-sans">Sandboxed shell interpreter supporting 7 core commands</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Deep Android Call Interceptor</td>
                <td className="py-3 px-4"><PrototypeBadge type="PROPOSED — ANDROID DAEMON" size="sm" /></td>
                <td className="py-3 px-4 text-slate-300 font-sans">Requires Android Telecom screening permissions</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Deep Dynamic Sandbox Execution</td>
                <td className="py-3 px-4"><PrototypeBadge type="PROPOSED — ISOLATED SANDBOX" size="sm" /></td>
                <td className="py-3 px-4 text-slate-300 font-sans">Requires isolated QEMU / Cuckoo sandbox worker nodes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
