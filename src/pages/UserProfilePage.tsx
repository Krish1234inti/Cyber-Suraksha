import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Shield, 
  Phone, 
  MapPin, 
  Laptop, 
  Smartphone, 
  Key, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Bug, 
  Trash2, 
  ArrowUpRight, 
  RefreshCw, 
  Save, 
  Sliders,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../services/api';
import { ThreatScan, AntivirusPlanType, DeviceType } from '../types';
import { ANTIVIRUS_PLANS } from '../data/antivirusPlans';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const UserProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [myScans, setMyScans] = useState<ThreatScan[]>([]);
  const [profileStats, setProfileStats] = useState({
    total_scans: 0,
    threats_detected: 0,
    quarantined_threats: 0,
  });

  // Edit fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+91 ');
  const [city, setCity] = useState(user?.city || '');
  const [stateName, setStateName] = useState(user?.state || 'Delhi');
  const [deviceType, setDeviceType] = useState<DeviceType>(user?.device_type || 'ANDROID');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergency_alert_phone || user?.phone || '+91 ');
  const [primaryConcern, setPrimaryConcern] = useState(user?.primary_concern || '');

  // Upgrade Plan Modal
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const res = await profileApi.getProfile();
      if (res.user) {
        updateUser(res.user);
        setName(res.user.name || '');
        setPhone(res.user.phone || '+91 ');
        setCity(res.user.city || '');
        setStateName(res.user.state || 'Delhi');
        setDeviceType(res.user.device_type || 'ANDROID');
        setEmergencyPhone(res.user.emergency_alert_phone || res.user.phone || '+91 ');
        setPrimaryConcern(res.user.primary_concern || '');
      }
      setProfileStats({
        total_scans: res.total_scans,
        threats_detected: res.threats_detected,
        quarantined_threats: res.quarantined_threats,
      });

      const scans = await profileApi.getMyScans();
      setMyScans(Array.isArray(scans) ? scans : []);
    } catch (err) {
      console.error('Failed to load profile data:', err);
      setMyScans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await profileApi.updateProfile({
        name,
        phone,
        city,
        state: stateName,
        device_type: deviceType,
        emergency_alert_phone: emergencyPhone,
        primary_concern: primaryConcern,
      });
      updateUser(res.user);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleQuarantine = async (scanId: string) => {
    try {
      const res = await profileApi.quarantineThreat(scanId);
      setActionMessage(res.message);
      // Update local state
      setMyScans(prev => prev.map(s => s.id === scanId ? { ...s, quarantine_status: 'QUARANTINED' } : s));
      setProfileStats(prev => ({ ...prev, quarantined_threats: prev.quarantined_threats + 1 }));
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      console.error('Error quarantining threat:', err);
    }
  };

  const handleDeleteScan = async (scanId: string) => {
    try {
      await profileApi.deleteScan(scanId);
      setMyScans(prev => prev.filter(s => s.id !== scanId));
      setActionMessage('Threat record deleted from user log.');
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      console.error('Error deleting scan:', err);
    }
  };

  const handlePlanUpgrade = async (planId: AntivirusPlanType) => {
    try {
      const res = await profileApi.selectPlan(planId);
      updateUser(res.user);
      setShowUpgradeModal(false);
      setActionMessage(res.message);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      console.error('Error upgrading plan:', err);
    }
  };

  const currentPlan = ANTIVIRUS_PLANS.find(p => p.id === (user?.antivirus_plan || 'PRO_SECURITY')) || ANTIVIRUS_PLANS[1];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              USER PROFILE & ANTIVIRUS SENTINEL
            </span>
            <PrototypeBadge type="POSTGRESQL CENTRAL DB" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            MY CYBER DEFENSE PROFILE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal profile, active antivirus license, and view real-time viruses detected on your device.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProfileData}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-950/50 transition cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Manage Antivirus Plan</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Top Grid: Antivirus License Card & Live Telemetry Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Antivirus License & Protection Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  ACTIVE ANTIVIRUS SHIELD
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white font-mono">
                  {user?.antivirus_plan_name || currentPlan.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                PROTECTION ACTIVE
              </span>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline ml-1 cursor-pointer"
              >
                Change Plan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 block">LICENSE KEY</span>
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 font-bold truncate">
                <Key className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{user?.license_key || 'CS-PRO-2026-9482'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 block">PLAN PRICE</span>
              <div className="text-xs font-mono text-white font-extrabold">
                {currentPlan.price_inr === 0 ? 'FREE' : `₹${currentPlan.price_inr}`}
                <span className="text-[10px] text-slate-400 font-normal"> / {currentPlan.period}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 block">PROTECTED DEVICE</span>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-200">
                {deviceType === 'ANDROID' && <Smartphone className="w-3.5 h-3.5 text-cyan-400" />}
                {deviceType !== 'ANDROID' && <Laptop className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{deviceType}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 block">DETECTION ENGINE</span>
              <div className="text-[11px] font-mono text-cyan-400 font-bold truncate">
                {currentPlan.threat_detection_capability}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Primary Defense Target: <strong>{user?.primary_concern || 'Banking Fraud, UPI & Phishing Scams'}</strong></span>
            </div>
            <span className="text-[11px] text-slate-400">
              Central Master DB Synced: <strong className="text-cyan-400">Yes</strong>
            </span>
          </div>
        </div>

        {/* Live Threat Stats for User */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
              YOUR SCAN TELEMETRY
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              REAL-TIME
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-lg font-black text-white font-mono block">
                {(Array.isArray(myScans) ? myScans : []).length}
              </span>
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Total Scans</span>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-center">
              <span className="text-lg font-black text-rose-400 font-mono block">
                {(Array.isArray(myScans) ? myScans : []).filter(s => s && s.risk_score >= 60).length}
              </span>
              <span className="text-[9px] font-mono text-rose-300 block uppercase">Viruses Found</span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-center">
              <span className="text-lg font-black text-amber-400 font-mono block">
                {(Array.isArray(myScans) ? myScans : []).filter(s => s && s.quarantine_status === 'QUARANTINED').length}
              </span>
              <span className="text-[9px] font-mono text-amber-300 block uppercase">Quarantined</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Device Security Health</span>
              <span className="text-emerald-400 font-bold">{user?.security_score || 88} / 100</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" 
                style={{ width: `${user?.security_score || 88}%` }}
              />
            </div>
          </div>

          <p className="text-[10px] font-mono text-slate-500 text-center">
            All virus signatures detected on your device are instantly synced to Controller Rahul Singh's Master Database.
          </p>
        </div>
      </div>

      {/* Profile Editing Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              EDIT USER INFORMATION & EMERGENCY NOTIFICATIONS
            </h2>
          </div>
          {saveSuccess && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Profile Updated Successfully
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Phone Number (Alert SMS)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Emergency Alert Phone
              </label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                State
              </label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Primary Operating System / Device
              </label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as DeviceType)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="ANDROID">Android Smartphone</option>
                <option value="WINDOWS">Windows PC / Laptop</option>
                <option value="IOS">Apple iPhone / macOS</option>
                <option value="LINUX">Linux Workstation</option>
                <option value="MULTI_DEVICE">Multi-Device Ecosystem</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'SAVING...' : 'SAVE PROFILE CHANGES'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* USER'S DETECTED VIRUSES & QUARANTINED THREATS TABLE */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                MY DETECTED VIRUSES & QUARANTINE LOG
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live threat signatures intercepted on your device by your chosen antivirus.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing <strong className="text-white">{myScans.length}</strong> intercepted payloads
          </span>
        </div>

        {myScans.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <Shield className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs font-mono text-slate-300 font-bold">
              Clean Device — No Viruses Currently Intercepted
            </p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Scan URLs, suspicious SMS/WhatsApp messages, files, or APKs on the Threat Scanner page to inspect them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-slate-950/60">
                <tr>
                  <th className="p-3">VIRUS / THREAT SIGNATURE</th>
                  <th className="p-3">PAYLOAD INPUT</th>
                  <th className="p-3">VECTOR</th>
                  <th className="p-3">RISK SCORE</th>
                  <th className="p-3">QUARANTINE STATUS</th>
                  <th className="p-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {myScans.map((scan) => {
                  const isHigh = scan.risk_score >= 60;
                  const isQuarantined = scan.quarantine_status === 'QUARANTINED';
                  return (
                    <tr key={scan.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <Bug className={`w-3.5 h-3.5 ${isHigh ? 'text-rose-400' : 'text-emerald-400'}`} />
                          <span className={isHigh ? 'text-rose-300' : 'text-emerald-300'}>
                            {scan.detected_virus_name || scan.classification}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {new Date(scan.created_at).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs truncate text-slate-400">
                        {scan.input_value}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                          {scan.scan_type}
                        </span>
                      </td>
                      <td className="p-3 font-bold">
                        <span className={
                          scan.risk_score >= 80 ? 'text-rose-400' :
                          scan.risk_score >= 60 ? 'text-amber-400' :
                          scan.risk_score >= 30 ? 'text-cyan-400' : 'text-emerald-400'
                        }>
                          {scan.risk_score}/100 ({scan.risk_level})
                        </span>
                      </td>
                      <td className="p-3">
                        {isQuarantined ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> QUARANTINED
                          </span>
                        ) : isHigh ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3" /> ACTIVE THREAT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                            CLEAN
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {isHigh && !isQuarantined && (
                          <button
                            onClick={() => handleQuarantine(scan.id)}
                            className="px-2.5 py-1 rounded bg-amber-600/80 hover:bg-amber-500 text-black text-[11px] font-bold transition cursor-pointer"
                          >
                            Quarantine
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteScan(scan.id)}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition"
                          title="Delete from log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PLAN UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  CHOOSE YOUR ANTIVIRUS PROTECTION PLAN
                </h3>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select an antivirus plan matching your required detection capabilities. Your database license will be updated immediately.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ANTIVIRUS_PLANS.map((plan) => {
                const isCurrent = user?.antivirus_plan === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                      isCurrent
                        ? 'bg-cyan-950/40 border-cyan-400'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white font-mono">{plan.name}</span>
                        {isCurrent && <span className="text-[9px] font-mono text-cyan-400 font-bold">CURRENT</span>}
                      </div>
                      <div className="mt-2 text-lg font-black text-white font-mono">
                        {plan.price_inr === 0 ? 'FREE' : `₹${plan.price_inr}`}
                        <span className="text-[10px] text-slate-400 font-normal"> / {plan.period}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {plan.threat_detection_capability}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePlanUpgrade(plan.id)}
                      disabled={isCurrent}
                      className={`w-full py-2 rounded-lg text-xs font-mono font-bold transition ${
                        isCurrent
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer'
                      }`}
                    >
                      {isCurrent ? 'Active Plan' : 'Select Plan'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
