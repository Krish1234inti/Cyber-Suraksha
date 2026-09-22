import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Users, 
  Shield, 
  Bug, 
  Download, 
  Trash2, 
  Edit3, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  HardDrive,
  Key,
  Smartphone,
  Laptop,
  Check,
  X
} from 'lucide-react';
import { adminApi, demoApi } from '../services/api';
import { User, ThreatScan, AntivirusPlanType } from '../types';
import { ANTIVIRUS_PLANS } from '../data/antivirusPlans';
import { PrototypeBadge } from '../components/common/PrototypeBadge';

export const MasterDatabaseAdminPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [allScans, setAllScans] = useState<ThreatScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'scans' | 'database'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Edit user modal
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<'ADMIN' | 'USER'>('USER');
  const [editPlan, setEditPlan] = useState<AntivirusPlanType>('PRO_SECURITY');
  const [editStatus, setEditStatus] = useState<string>('ACTIVE');

  const fetchDatabaseState = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, scansData] = await Promise.all([
        adminApi.getStats().catch(() => null),
        adminApi.getUsers().catch(() => []),
        adminApi.getAllScans().catch(() => []),
      ]);
      if (statsData) setStats(statsData);
      setUsers(Array.isArray(usersData) ? usersData : (usersData && Array.isArray((usersData as any).users) ? (usersData as any).users : []));
      setAllScans(Array.isArray(scansData) ? scansData : (scansData && Array.isArray((scansData as any).scans) ? (scansData as any).scans : []));
    } catch (err) {
      console.error('Error fetching database state:', err);
      setUsers([]);
      setAllScans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabaseState();
  }, []);

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to remove user "${userName}" from the master database?`)) return;

    try {
      await adminApi.deleteUser(userId);
      setUsers(prev => (Array.isArray(prev) ? prev.filter(u => u && u.id !== userId) : []));
      setActionNotice(`User "${userName}" removed from Master Database.`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleAdminQuarantine = async (scanId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'QUARANTINED' ? 'ACTIVE_THREAT' : 'QUARANTINED';
    try {
      const res = await adminApi.quarantineThreat(scanId, nextStatus);
      setAllScans(prev => (Array.isArray(prev) ? prev.map(s => s && s.id === scanId ? { ...s, quarantine_status: nextStatus as any } : s) : []));
      setActionNotice(res.message);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error('Error modifying quarantine state:', err);
    }
  };

  const handleOpenEditUser = (u: User) => {
    setEditingUser(u);
    setEditRole(u.role);
    setEditPlan(u.antivirus_plan || 'PRO_SECURITY');
    setEditStatus(u.protection_status || 'ACTIVE');
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    try {
      const res = await adminApi.updateUser(editingUser.id, {
        role: editRole,
        antivirus_plan: editPlan,
        protection_status: editStatus,
      });
      setUsers(prev => (Array.isArray(prev) ? prev.map(u => (u && u.id === editingUser.id ? res.user : u)) : []));
      setEditingUser(null);
      setActionNotice(`Updated settings for ${res.user.name}`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const safeScans = Array.isArray(allScans) ? allScans : [];

  const filteredUsers = safeUsers.filter(u => 
    u && (
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      (u.city && u.city.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const filteredScans = safeScans.filter(s =>
    s && (
      (s.detected_virus_name && s.detected_virus_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.input_value && s.input_value.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.classification && s.classification.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  return (
    <div className="space-y-6 pb-14">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              MASTER DATABASE CONTROLLER CONSOLE
            </span>
            <PrototypeBadge type="SUPERADMIN ROOT" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            CENTRAL DATABASE CONTROLLER
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Database Controller: <strong className="text-cyan-300">Rahul Singh (rahulsingh241177@gmail.com)</strong>. Full authority over registered users, license records, and user-detected threat logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDatabaseState}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh State</span>
          </button>

          <a
            href={adminApi.getDatabaseExportUrl()}
            download="cybersuraksha_master_database.json"
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-950/50 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Database (.JSON)</span>
          </a>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Registered Users</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stats?.total_users ?? safeUsers.length}
          </div>
          <span className="text-[10px] font-mono text-cyan-400 block">User-Generated Profiles</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Active Antivirus Licenses</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {stats?.active_antivirus_licenses ?? safeUsers.filter(u => u && u.protection_status === 'ACTIVE').length}
          </div>
          <span className="text-[10px] font-mono text-slate-500 block">Pro & Ultra Tiers Active</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Viruses Intercepted</span>
            <Bug className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {safeScans.filter(s => s && s.risk_score >= 60).length}
          </div>
          <span className="text-[10px] font-mono text-rose-300 block">Detected Across Users</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Quarantined Threats</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {safeScans.filter(s => s && s.quarantine_status === 'QUARANTINED').length}
          </div>
          <span className="text-[10px] font-mono text-amber-300 block">Payloads Neutralized</span>
        </div>
      </div>

      {/* TABS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTab === 'users'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            User Accounts ({safeUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('scans')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTab === 'scans'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Virus Detections ({safeScans.length})
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTab === 'database'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Database Engine
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, email, virus..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                MASTER USERS TABLE
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                All citizen & officer profiles registered directly in Rahul Singh's master database.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Showing <strong className="text-white">{filteredUsers.length}</strong> records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-slate-950/60">
                <tr>
                  <th className="p-3">USER NAME & EMAIL</th>
                  <th className="p-3">PHONE & CITY</th>
                  <th className="p-3">DEVICE</th>
                  <th className="p-3">ANTIVIRUS PLAN</th>
                  <th className="p-3">LICENSE KEY</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredUsers.map((u) => {
                  const isMaster = u.email === 'rahulsingh241177@gmail.com';
                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {isMaster && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              CONTROLLER
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{u.email}</span>
                      </td>
                      <td className="p-3">
                        <div className="text-slate-200">{u.phone || '—'}</div>
                        <span className="text-[10px] text-slate-500">{u.city || 'India'}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {u.device_type || 'ANDROID'}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-cyan-300">
                        {u.antivirus_plan_name || u.antivirus_plan || 'Pro Security Shield'}
                      </td>
                      <td className="p-3 text-slate-400 text-[10px] font-mono truncate max-w-[120px]">
                        {u.license_key || 'CS-AUTO-2026'}
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.protection_status === 'ACTIVE'
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {u.protection_status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        <button
                          onClick={() => handleOpenEditUser(u)}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition"
                          title="Edit User in Master Database"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {!isMaster && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition"
                            title="Delete User from Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CENTRAL DETECTED VIRUSES & QUARANTINE LOG */}
      {activeTab === 'scans' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                CENTRAL THREAT & VIRUS DETECTION LOG
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every virus detected across all citizen and officer devices by the antivirus engine.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Total Logged: <strong className="text-white">{filteredScans.length}</strong> payloads
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-slate-950/60">
                <tr>
                  <th className="p-3">DETECTED VIRUS / MALWARE NAME</th>
                  <th className="p-3">PAYLOAD VALUE</th>
                  <th className="p-3">TYPE</th>
                  <th className="p-3">SCORE</th>
                  <th className="p-3">QUARANTINE STATUS</th>
                  <th className="p-3 text-right">ADMIN OVERRIDE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredScans.map((scan) => {
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
                          Timestamp: {new Date(scan.created_at).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs truncate text-slate-400">
                        {scan.input_value}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {scan.scan_type}
                        </span>
                      </td>
                      <td className="p-3 font-bold">
                        <span className={
                          scan.risk_score >= 80 ? 'text-rose-400' :
                          scan.risk_score >= 60 ? 'text-amber-400' : 'text-emerald-400'
                        }>
                          {scan.risk_score}/100
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
                      <td className="p-3 text-right">
                        {isHigh && (
                          <button
                            onClick={() => handleAdminQuarantine(scan.id, scan.quarantine_status)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                              isQuarantined
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                : 'bg-rose-600 hover:bg-rose-500 text-white'
                            }`}
                          >
                            {isQuarantined ? 'Release Quarantine' : 'Quarantine Payload'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE ENGINE CONTROL */}
      {activeTab === 'database' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                CENTRAL DATABASE ENGINE SPECIFICATIONS
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Direct control over central data retention, live backup dumps, and SIH 2026 judging audit state.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              DATABASE ONLINE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Master Controller</span>
              <div className="text-sm font-bold text-white">Rahul Singh</div>
              <div className="text-cyan-400">rahulsingh241177@gmail.com</div>
              <p className="text-[11px] text-slate-400 mt-2">
                All registered users and incoming threat scan events are authenticated, encrypted, and written into this controller account's repository.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Database Architecture</span>
              <div className="text-sm font-bold text-white">PostgreSQL Compatible Schema</div>
              <div className="text-emerald-400">Connection Pool: 18/20 Active</div>
              <p className="text-[11px] text-slate-400 mt-2">
                Tables: <code>users</code>, <code>threat_scans</code>, <code>incidents</code>, <code>threat_campaigns</code>, <code>cyberlab_progress</code>.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <div className="text-xs font-mono text-slate-400">
              Download the complete database in JSON format for offline audit or analysis.
            </div>

            <a
              href={adminApi.getDatabaseExportUrl()}
              download="cybersuraksha_master_database.json"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-950/60 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD MASTER DATABASE (.JSON)</span>
            </a>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono uppercase">
                EDIT USER: {editingUser.name}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Role Permission</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="USER">Standard User / Citizen</option>
                  <option value="ADMIN">SOC Security Officer / Admin</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Antivirus Plan Tier</label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="CITIZEN_BASIC">Citizen Basic (₹0 Free)</option>
                  <option value="PRO_SECURITY">Pro Security Shield (₹499/yr)</option>
                  <option value="ULTRA_SOC_SENTINEL">Ultra SOC Sentinel (₹1,499/yr)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Protection Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="ACTIVE">ACTIVE (Protected)</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingUser(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold"
              >
                Save to Master DB
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
