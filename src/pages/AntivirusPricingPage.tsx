import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  X, 
  Zap, 
  AlertTriangle, 
  Smartphone, 
  Laptop, 
  HelpCircle, 
  ArrowRight,
  Sparkles,
  Lock,
  FileSearch,
  Database,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ANTIVIRUS_PLANS, PROBLEM_SCENARIOS } from '../data/antivirusPlans';
import { profileApi } from '../services/api';
import { AntivirusPlanType } from '../types';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import { Link, useNavigate } from 'react-router-dom';

export const AntivirusPricingPage: React.FC = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('banking_fraud');
  const [selectedPlanId, setSelectedPlanId] = useState<AntivirusPlanType>(user?.antivirus_plan || 'PRO_SECURITY');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const activeScenario = PROBLEM_SCENARIOS.find(s => s.id === selectedScenarioId) || PROBLEM_SCENARIOS[0];

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    const sc = PROBLEM_SCENARIOS.find(s => s.id === scenarioId);
    if (sc) {
      setSelectedPlanId(sc.recommended_plan);
    }
  };

  const handleActivatePlan = async (planId: AntivirusPlanType) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    setUpdating(true);
    try {
      const res = await profileApi.selectPlan(planId);
      updateUser(res.user);
      setSelectedPlanId(planId);
      setSuccessMessage(`Activated ${res.user.antivirus_plan_name || planId}! Your device is now shielded.`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Error activating plan:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <span>AI-POWERED INDIAN CYBER THREAT ENGINE</span>
          <PrototypeBadge type="ANTIVIRUS PRICING & SOLUTION" size="sm" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
          CHOOSE ANTIVIRUS BY YOUR CYBER PROBLEM
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Every Indian citizen and organization faces unique attack vectors — from UPI phishing to malicious loan APKs and corporate ransomware. Select your threat scenario to activate the optimal defense engine.
        </p>
      </div>

      {successMessage && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <Link to="/user/profile" className="text-emerald-300 font-bold underline text-xs">
            View My Profile →
          </Link>
        </div>
      )}

      {/* SECTION 1: PROBLEM MATCHING WIZARD */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-tight">
                Step 1: What Cyber Security Threat Are You Facing?
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Click on your current threat scenario. Our heuristics engine will pair you with the exact defense capabilities required.
            </p>
          </div>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-500/30">
            Interactive Threat Matcher
          </span>
        </div>

        {/* Problem Scenario Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PROBLEM_SCENARIOS.map((sc) => {
            const isSelected = selectedScenarioId === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => handleScenarioSelect(sc.id)}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-amber-950/30 border-amber-400/90 ring-1 ring-amber-400/40 shadow-lg shadow-amber-950/50'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">
                      {sc.title}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {sc.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Threat Signature</span>
                  <span className="text-[10px] font-mono text-rose-400 font-semibold block truncate">
                    {sc.threat_type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Problem Scenario Solution Banner */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-950 to-blue-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
              AI Match Solution for "{activeScenario.title}"
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white font-mono">
              Recommended Tier: <span className="text-cyan-300">{activeScenario.recommended_plan.replace('_', ' ')}</span>
            </h3>
            <p className="text-xs text-slate-300">
              {activeScenario.solution_summary}
            </p>
          </div>

          <button
            onClick={() => handleActivatePlan(activeScenario.recommended_plan)}
            disabled={updating}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-950/60 transition flex-shrink-0 cursor-pointer"
          >
            <span>Activate Matched Antivirus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SECTION 2: FULL PRICING MATRIX */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-white font-mono tracking-tight">
            ANTIVIRUS PLANS & PRICING
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Direct INR pricing with no hidden charges. All detected virus telemetry is managed securely in the Master Database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ANTIVIRUS_PLANS.map((plan) => {
            const isUserActive = user?.antivirus_plan === plan.id;
            const isRecommended = activeScenario.recommended_plan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 sm:p-7 border flex flex-col justify-between space-y-6 transition ${
                  isRecommended
                    ? 'bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-900 border-cyan-400 shadow-2xl shadow-cyan-950/60 ring-1 ring-cyan-400/60'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md">
                    {plan.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                      {plan.threat_detection_capability}
                    </span>
                    <h3 className="text-xl font-bold text-white font-mono">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {plan.description}
                    </p>
                  </div>

                  <div className="py-2 border-y border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white font-mono">
                        {plan.price_inr === 0 ? 'FREE' : `₹${plan.price_inr}`}
                      </span>
                      {plan.price_inr > 0 && (
                        <span className="text-xs text-slate-400 font-mono">/ {plan.period}</span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono block mt-1">
                      Multi-device license: <strong>{plan.devices_count} {plan.devices_count === 1 ? 'Device' : 'Devices'}</strong>
                    </span>
                  </div>

                  {/* Feature List */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                      Included Protection:
                    </span>
                    <ul className="space-y-2">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <button
                    onClick={() => handleActivatePlan(plan.id)}
                    disabled={updating || isUserActive}
                    className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      isUserActive
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 cursor-default'
                        : isRecommended
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/60'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    {isUserActive ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>CURRENT ACTIVE PLAN</span>
                      </>
                    ) : (
                      <>
                        <span>{updating ? 'ACTIVATING...' : `ACTIVATE ${plan.name.toUpperCase()}`}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500">
                    <Database className="w-3 h-3 text-cyan-400" />
                    <span>Instant Master Database Telemetry Link</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: EMERGENCY 1930 & MASTER DATABASE DISCLOSURE */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
              NATIONAL CYBERCRIME HELPLINE INTEGRATION (1930)
            </h4>
            <p className="text-[11px] text-slate-400">
              When financial fraud or extortion is detected by the antivirus, an automated incident packet is formatted for swift submission to cybercrime.gov.in.
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-400 flex-shrink-0">
          <span>Master SOC Controller: </span>
          <strong className="text-cyan-400">Rahul Singh</strong>
        </div>
      </div>
    </div>
  );
};
