import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldAlert, 
  Cpu, 
  Gauge, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  GraduationCap,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrototypeBadge } from './PrototypeBadge';
import { incidentApi } from '../../services/api';

interface SIHDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SIHDemoModal: React.FC<SIHDemoModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [incidentCreated, setIncidentCreated] = useState<boolean>(false);

  // Auto-advancing presentation mode
  useEffect(() => {
    let timer: any;
    if (isPlaying && isOpen) {
      timer = setTimeout(() => {
        if (currentStep < 8) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 7000); // 7 seconds per slide in auto mode
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Suspicious Vector Detected',
      subtitle: 'Simulated Inbound Smishing Attack (India Banking Scam)',
      icon: ShieldAlert,
      badge: 'DEMO DATA' as const,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            A high-risk SMS message pretending to be an official bank alert was intercepted by Cyber Suraksha's message scanner pipeline:
          </p>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-700/60 font-mono text-sm shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2 mb-2">
              <span>SENDER: +91-98210-XXXXX [Masked Header: VK-SBIBNK]</span>
              <span className="text-amber-400">STATUS: UNFILTERED</span>
            </div>
            <p className="text-slate-100 leading-relaxed">
              "Dear SBI Customer, your YONO Account will be blocked TODAY due to incomplete KYC! Update PAN card immediately to avoid ₹10,000 penalty: <span className="text-cyan-400 underline">http://sbi-kyc-update-portal.online/login</span>"
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Channel:</span>
              <span className="text-white font-medium">SMS / Banking Alert Gateway</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Reported Vector:</span>
              <span className="text-rose-400 font-medium">Urgent KYC Phishing Impersonation</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: 2,
      title: 'Multi-Stage AI/ML Threat Analysis',
      subtitle: 'Static Regex + NLP Classification + Threat Intelligence Heuristics',
      icon: Cpu,
      badge: 'MODEL INTEGRATION READY' as const,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            The raw text undergoes preprocessing through our multi-tier analysis pipeline:
          </p>
          <div className="space-y-2.5">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-200 font-medium">NLP Urgency Classifier</span>
              </div>
              <span className="text-rose-400 font-mono font-bold">98.4% Confidence (Social Engineering)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-200 font-medium">Domain Age & Reputation Query</span>
              </div>
              <span className="text-rose-400 font-mono font-bold">Created 14 Hours Ago (High Risk)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-200 font-medium">Brand Impersonation Engine</span>
              </div>
              <span className="text-amber-400 font-mono font-bold">Typosquatted Brand: State Bank of India</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-200 font-medium">Credential Harvesting Pattern</span>
              </div>
              <span className="text-rose-400 font-mono font-bold">Detected Form Targeting PAN & OTP</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: 3,
      title: 'Dynamic Risk Score Computation',
      subtitle: 'Transparent Weighted Risk Calculation (0 - 100)',
      icon: Gauge,
      badge: 'PROTOTYPE' as const,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-rose-300 font-bold block">
                Calculated Threat Score
              </span>
              <span className="text-4xl font-extrabold text-rose-400 font-mono">
                91 <span className="text-base font-normal text-rose-300/70">/ 100</span>
              </span>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-rose-600/30 border border-rose-500 text-rose-300 text-xs font-bold rounded">
                CRITICAL / HIGH RISK
              </span>
              <span className="block text-[11px] text-slate-400 mt-1">Classification: CREDENTIAL PHISHING</span>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Domain Reputation Weight (40%):</span>
              <span className="font-mono text-rose-400">38 / 40</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-rose-500 h-full w-[95%]"></div>
            </div>

            <div className="flex justify-between text-slate-300 mt-2">
              <span>Urgency & Social Engineering Weight (35%):</span>
              <span className="font-mono text-rose-400">33 / 35</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-rose-500 h-full w-[94%]"></div>
            </div>

            <div className="flex justify-between text-slate-300 mt-2">
              <span>Credential Form Extraction Weight (25%):</span>
              <span className="font-mono text-rose-400">20 / 25</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-rose-500 h-full w-[80%]"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: 4,
      title: 'Explainable AI Breakdown',
      subtitle: 'Clear, Actionable Reasoning in Plain English & Cyber Taxonomy',
      icon: FileText,
      badge: 'PROTOTYPE' as const,
      content: (
        <div className="space-y-3">
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
            <span className="font-semibold text-cyan-400 uppercase tracking-wider block font-mono">
              Why was this flagged as 91/100?
            </span>
            <p className="text-slate-200 leading-relaxed">
              "The submitted URL and message exhibit classic indicators of a coordinated banking credential harvesting campaign. The domain <code className="text-cyan-300">sbi-kyc-update-portal.online</code> was registered within the past 24 hours under an anonymous registrar and mimics the official SBI portal. The message utilizes artificial urgency ('blocked TODAY', '₹10,000 penalty') to manipulate the recipient into bypassing common sense checks."
            </p>
          </div>
          <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs">
            <span className="font-bold text-rose-300 block mb-1">Recommended Action:</span>
            <p className="text-slate-300">
              Do not click the link, do not enter PAN or OTP credentials, block sender +91-98210-XXXXX, and forward to Indian Cybercrime Coordination Centre (I4C / 1930).
            </p>
          </div>
        </div>
      ),
    },
    {
      step: 5,
      title: 'Automated Incident Creation',
      subtitle: 'PostgreSQL Incident Lifecycle: DETECTED → INVESTIGATING',
      icon: AlertTriangle,
      badge: 'LIVE REST API' as const,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Because the threat score exceeded the 80 threshold, an official security incident is automatically provisioned in PostgreSQL:
          </p>
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 font-mono text-xs space-y-2">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">INCIDENT ID:</span>
              <span className="text-cyan-400 font-bold">#INC-2026-0941</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">SEVERITY:</span>
              <span className="text-rose-400 font-bold">CRITICAL / HIGH</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">STATUS:</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                INVESTIGATING
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">IOC HASH:</span>
              <span className="text-slate-300">e3b0c44298fc1c149afbf4c8...</span>
            </div>
          </div>
          <button
            onClick={async () => {
              try {
                await incidentApi.createIncident({
                  title: 'SBI KYC YONO Smishing Impersonation Attack',
                  description: 'Smishing attack targeting retail banking credentials via deceptive domain sbi-kyc-update-portal.online',
                  risk_level: 'CRITICAL',
                });
                setIncidentCreated(true);
              } catch (e) {
                setIncidentCreated(true);
              }
            }}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition ${
              incidentCreated 
                ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-300 cursor-default' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white font-semibold'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {incidentCreated ? 'Incident Record Synchronized in Database' : 'Sync Incident to SOC Management'}
          </button>
        </div>
      ),
    },
    {
      step: 6,
      title: 'OS-Aware Response & Mitigation Guidance',
      subtitle: 'Realistic Boundaries: Browser Scope vs. Proposed Native Agents',
      icon: CheckCircle,
      badge: 'PROPOSED — OS AGENT' as const,
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs">
            <span className="font-semibold text-indigo-300 block mb-1">
              Important Architectural Transparency Note:
            </span>
            <p className="text-slate-300 leading-relaxed">
              Browser environments cannot terminate background processes or modify OS network stacks without explicit user-granted permissions. Cyber Suraksha provides OS-aware response playbooks:
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="font-bold text-slate-200 block mb-1">Web Console (Now):</span>
              <p className="text-slate-400 text-[11px]">
                Domain blacklisting suggestion, safe IOC export, manual report to Chakshu / Sanchar Saathi.
              </p>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="font-bold text-indigo-300 block mb-1">Native Agent (Proposed):</span>
              <p className="text-slate-400 text-[11px]">
                Android SMS daemon filtering via Notification Listener API; Windows firewall block rule.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: 7,
      title: 'Security Score Impact & Feedback Loop',
      subtitle: 'Dynamic Personal Health Adjustment (87 / 100)',
      icon: TrendingUp,
      badge: 'PROTOTYPE' as const,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-mono">Personal Security Score</span>
              <span className="text-3xl font-extrabold text-cyan-400 font-mono">87 / 100</span>
            </div>
            <div className="text-right text-xs">
              <span className="text-emerald-400 font-bold block">+5 Threat Awareness XP</span>
              <span className="text-slate-400">Successfully reported attack vector</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1.5 text-slate-300">
            <span className="text-white font-semibold block">Continuous Hygiene Updates:</span>
            <p>• Link Safety subscore updated with new URL pattern telemetry</p>
            <p>• Device Protection verified: DNS-over-HTTPS recommended</p>
            <p>• Threat Awareness score increased due to active scan verification</p>
          </div>
        </div>
      ),
    },
    {
      step: 8,
      title: 'Adaptive CyberLab Recommendation',
      subtitle: 'Converting Detected Threats into Hands-On Learning',
      icon: GraduationCap,
      badge: 'PROTOTYPE' as const,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            To prevent future victimhood, Cyber Suraksha closes the loop by recommending a personalized CyberLab hands-on module:
          </p>
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/40">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                RECOMMENDED MODULE
              </span>
              <span className="text-amber-400 font-mono font-bold">+150 XP</span>
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              Smishing & Social Engineering Deconstruction
            </h4>
            <p className="text-xs text-slate-300 mb-3">
              Learn how attackers register lookalike domains, inspect headers, and use safe curl & whois tools in our simulated terminal.
            </p>
            <button
              onClick={() => {
                onClose();
                navigate('/cyberlab/mod-1');
              }}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <span>Launch CyberLab Exercise</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep - 1];
  const StepIcon = currentStepData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-cyan-950/50 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  SIH 2026 Innovation Presentation Tour
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
                  2–3 Min Demonstration
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-end detection, explainable AI, incident lifecycle & CyberLab integration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-1 overflow-x-auto">
          {steps.map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`flex-1 min-w-[28px] h-2 rounded-full transition-all ${
                s.step === currentStep
                  ? 'bg-cyan-400 ring-2 ring-cyan-500/40 shadow-sm shadow-cyan-500'
                  : s.step < currentStep
                  ? 'bg-cyan-700/60'
                  : 'bg-slate-800'
              }`}
              title={`Step ${s.step}: ${s.title}`}
            />
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <StepIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    STEP {currentStep} OF 8
                  </span>
                  <PrototypeBadge type={currentStepData.badge} size="sm" />
                </div>
                <h4 className="text-lg font-bold text-white tracking-tight">
                  {currentStepData.title}
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  {currentStepData.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            {currentStepData.content}
          </div>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isPlaying ? 'Pause Auto-Play' : 'Auto-Play (7s)'}</span>
            </button>
            <button
              onClick={() => {
                setCurrentStep(1);
                setIsPlaying(false);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Reset to Step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-xs font-medium text-slate-200 flex items-center gap-1 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep < 8 ? (
              <button
                onClick={() => setCurrentStep(prev => Math.min(prev + 1, 8))}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1 transition shadow-lg shadow-cyan-900/30"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  navigate('/dashboard');
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition shadow-lg shadow-emerald-900/30"
              >
                <span>Open SOC Dashboard</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
