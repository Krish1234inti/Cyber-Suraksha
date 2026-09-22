import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Smartphone, 
  Laptop, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import { ANTIVIRUS_PLANS, PROBLEM_SCENARIOS } from '../data/antivirusPlans';
import { AntivirusPlanType, DeviceType } from '../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Profile fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Delhi NCR');
  const [deviceType, setDeviceType] = useState<DeviceType>('ANDROID');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 ');

  // Problem scenario & plan selection
  const [selectedProblemId, setSelectedProblemId] = useState<string>('banking_fraud');
  const [selectedPlanId, setSelectedPlanId] = useState<AntivirusPlanType>('PRO_SECURITY');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When user selects a problem scenario, auto-recommend the best antivirus tier!
  const handleSelectProblem = (scenarioId: string) => {
    setSelectedProblemId(scenarioId);
    const scenario = PROBLEM_SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      setSelectedPlanId(scenario.recommended_plan);
    }
  };

  const selectedScenario = PROBLEM_SCENARIOS.find(s => s.id === selectedProblemId);
  const selectedPlan = ANTIVIRUS_PLANS.find(p => p.id === selectedPlanId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register({
        name,
        email,
        password,
        phone,
        city,
        state: stateName,
        device_type: deviceType,
        primary_concern: selectedScenario?.title || 'Banking & Cyber Fraud Protection',
        antivirus_plan: selectedPlanId,
        emergency_alert_phone: emergencyPhone || phone,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed. Please check your entries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <span>CITIZEN ANTIVIRUS ONBOARDING</span>
            <PrototypeBadge type="USER PROFILE ENGINE" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            CREATE YOUR DEFENSE PROFILE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Choose your antivirus protection tier tailored specifically to your threats, device, and banking security requirements.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SECTION 1: Personal & Device Profile */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <UserIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase">
                  1. User Profile & Device Information
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul.sharma@example.com"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">
                    Mobile Phone Number (for Threat SMS Alerts)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">
                    City & State
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. New Delhi, Delhi"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">
                    Primary Device to Protect
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['ANDROID', 'WINDOWS', 'IOS', 'MULTI_DEVICE'] as DeviceType[]).map((dev) => (
                      <button
                        key={dev}
                        type="button"
                        onClick={() => setDeviceType(dev)}
                        className={`py-2 px-1 rounded-lg text-[10px] font-mono border text-center transition ${
                          deviceType === dev
                            ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {dev === 'ANDROID' && 'Android'}
                        {dev === 'WINDOWS' && 'Windows'}
                        {dev === 'IOS' && 'iPhone/Mac'}
                        {dev === 'MULTI_DEVICE' && 'Multi-OS'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Problem-Scenario Matching (User selects their problem) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase">
                    2. Select Your Specific Cyber Threat / Problem
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-400">
                  AI Antivirus Matcher
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pick the primary security problem you are facing; our engine will match the exact antivirus engine required:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PROBLEM_SCENARIOS.map((sc) => {
                  const isSelected = selectedProblemId === sc.id;
                  return (
                    <div
                      key={sc.id}
                      onClick={() => handleSelectProblem(sc.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition space-y-1.5 ${
                        isSelected
                          ? 'bg-amber-950/30 border-amber-400/80 shadow-md shadow-amber-950/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 font-mono">
                          {sc.title}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {sc.description}
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-500">Threat:</span>
                        <span className="text-rose-400 font-semibold">{sc.threat_type}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedScenario && (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs font-mono text-cyan-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Recommended Antivirus: <strong className="text-white">{selectedScenario.recommended_plan.replace('_', ' ')}</strong></span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-bold">Matched for {selectedScenario.threat_type}</span>
                </div>
              )}
            </div>

            {/* SECTION 3: Antivirus Plans & Pricing Cards */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase">
                    3. Choose Your Antivirus Plan & Pricing
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">
                  Zero-Day Detection Suite
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ANTIVIRUS_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-950/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {plan.badge && (
                        <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-500 text-black">
                          {plan.badge}
                        </span>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-white font-mono">{plan.name}</h3>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                        </div>

                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-extrabold text-white font-mono">
                              {plan.price_inr === 0 ? 'FREE' : `₹${plan.price_inr}`}
                            </span>
                            {plan.price_inr > 0 && (
                              <span className="text-[10px] text-slate-400 font-mono">/ {plan.period}</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Protects up to {plan.devices_count} {plan.devices_count === 1 ? 'device' : 'devices'}
                          </p>
                        </div>

                        <ul className="space-y-1.5 pt-2 border-t border-slate-800/80">
                          {plan.features.slice(0, 4).map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-300">
                              <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-800/60">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-400">Detection Depth:</span>
                          <span className="text-cyan-400 font-semibold">{plan.threat_detection_capability}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm font-mono flex items-center justify-center gap-2 transition shadow-xl shadow-cyan-950/60 cursor-pointer"
              >
                <span>{loading ? 'GENERATING PROFILE & ANTIVIRUS LICENSE...' : `ACTIVATE ${selectedPlan?.name.toUpperCase()} & ENTER SOC`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-center text-slate-500 font-mono mt-2">
                By registering, your account and threats are securely logged in the Master Database under Controller Rahul Singh.
              </p>
            </div>
          </form>

          <div className="text-center pt-2 text-xs font-mono text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:underline font-bold">
              Sign in to SOC Console
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
