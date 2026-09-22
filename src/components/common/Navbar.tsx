import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Sparkles, 
  Radar, 
  AlertTriangle, 
  GraduationCap, 
  FileText, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Lock,
  Layers,
  Info,
  HelpCircle,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SIHDemoModal } from './SIHDemoModal';
import { PrototypeBadge } from './PrototypeBadge';
import { demoApi } from '../../services/api';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, loginAsDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      await demoApi.seedData();
      alert('Demo data successfully refreshed in database!');
      window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSeeding(false);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Shield },
    { name: 'Threat Scanner', path: '/scanner', icon: Radar },
    { name: 'Antivirus & Pricing', path: '/antivirus', icon: ShieldCheck },
    { name: 'Threat Intelligence', path: '/threat-intelligence', icon: Layers },
    { name: 'Incidents', path: '/incidents', icon: AlertTriangle },
    { name: 'Security Score', path: '/security-score', icon: ShieldCheck },
    { name: 'CyberLab', path: '/cyberlab', icon: GraduationCap },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  if (isAuthenticated) {
    navLinks.push({ name: 'My Profile', path: '/user/profile', icon: UserIcon });
  }

  if (isAdmin || user?.email === 'rahulsingh241177@gmail.com') {
    navLinks.push({ name: 'Master Database', path: '/admin/database', icon: Database });
  }

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Top Banner Notice: SIH 2026 Innovation */}
      <div className="bg-[#0a0c10] border-b border-white/10 text-[11px] text-gray-400 py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-semibold text-gray-200">
            Smart India Hackathon 2026 Innovation Project
          </span>
          <span className="hidden md:inline text-gray-600">|</span>
          <span className="hidden md:inline text-gray-400">
            Theme: AI-Powered Unified Cyber Threat Detection & Response
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLegendOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Prototype vs Proposed Guide</span>
          </button>
          <span className="text-gray-700">|</span>
          <button
            onClick={handleSeedDemo}
            disabled={isSeeding}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
            title="Reset to official SIH judge test records"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSeeding ? 'Seeding...' : 'Reload Demo Data'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-[#0a0c10]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#0d1117] border border-cyan-500/40 p-0.5 shadow-lg shadow-cyan-950/50 group-hover:border-cyan-400 transition">
                <div className="w-full h-full bg-[#050608] rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-lg tracking-wider font-mono">
                    CYBER<span className="text-cyan-400">SURAKSHA</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-bold">
                    SIH'26
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 tracking-tight hidden sm:block">
                  Detect • Explain • Protect • Learn
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                      active
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-gray-400'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden sm:flex items-center gap-2.5">
              {/* SIH Presentation Mode Button */}
              <button
                onClick={() => setDemoModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                title="Launch the official 2-3 minute guided walkthrough for hackathon evaluation"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>SIH DEMO MODE</span>
              </button>

              {/* User / Authentication Dropdown or Demo Quick-Switch */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <Link
                    to="/user/profile"
                    className="text-right hidden md:block hover:opacity-85 transition cursor-pointer"
                    title="Open My Profile & Defense Center"
                  >
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-xs font-semibold text-white">
                        {user.name}
                      </span>
                      {user.email === 'rahulsingh241177@gmail.com' && (
                        <span className="px-1 py-0.2 rounded text-[8px] bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                          CONTROLLER
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 block leading-tight">
                      {user.antivirus_plan_name || 'Antivirus Active'}
                    </span>
                  </Link>

                  <Link
                    to="/user/profile"
                    className="p-1.5 rounded-lg bg-[#161b22] hover:bg-white/10 text-gray-300 hover:text-cyan-400 border border-white/10 transition"
                    title="User Profile & Threat Logs"
                  >
                    <UserIcon className="w-4 h-4" />
                  </Link>

                  {(isAdmin || user.email === 'rahulsingh241177@gmail.com') && (
                    <Link
                      to="/admin/database"
                      className="p-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 transition"
                      title="Master Database Controller"
                    >
                      <Database className="w-4 h-4" />
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg bg-[#161b22] hover:bg-rose-950/40 hover:text-rose-400 border border-white/10 text-gray-400 transition"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                  <button
                    onClick={() => loginAsDemo('USER')}
                    className="px-2.5 py-1.5 rounded bg-[#161b22] hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium transition cursor-pointer"
                    title="Sign in instantly as Officer / Security Analyst"
                  >
                    Demo User
                  </button>
                  <button
                    onClick={() => loginAsDemo('ADMIN')}
                    className="px-2.5 py-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition cursor-pointer"
                    title="Sign in instantly as Controller Rahul Singh"
                  >
                    Master Admin
                  </button>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition"
                  >
                    Create Profile
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setDemoModalOpen(true)}
                className="p-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold"
              >
                SIH DEMO
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-[#161b22] border border-white/10 text-gray-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0a0c10] border-b border-white/10 px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${
                    isActive(link.path)
                      ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-rose-950/40 text-rose-300 border border-rose-500/30 rounded text-xs font-medium"
                >
                  Sign Out ({user?.name})
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      loginAsDemo('USER');
                      setMobileMenuOpen(false);
                    }}
                    className="py-1.5 bg-[#161b22] text-gray-200 rounded text-xs border border-white/10"
                  >
                    Quick User Demo
                  </button>
                  <button
                    onClick={() => {
                      loginAsDemo('ADMIN');
                      setMobileMenuOpen(false);
                    }}
                    className="py-1.5 bg-cyan-500/10 text-cyan-300 rounded text-xs border border-cyan-500/30"
                  >
                    Quick Admin Demo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* SIH Presentation Guided Tour Modal */}
      <SIHDemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />

      {/* Prototype vs Proposed Transparency Legend Modal */}
      {legendOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0d1117] border border-white/10 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  Technical Credibility & Prototype Transparency
                </h3>
              </div>
              <button
                onClick={() => setLegendOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              In accordance with Smart India Hackathon (SIH 2026) standards, Cyber Suraksha clearly demarcates what is fully operational in this prototype versus what represents the proposed national-scale enterprise architecture.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-[#161b22] border border-white/5 flex items-start gap-2">
                <PrototypeBadge type="PROTOTYPE" size="sm" />
                <span className="text-gray-300">
                  Fully operational interactive web dashboard, heuristic scoring engine, explainable AI generator, and simulated terminal.
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#161b22] border border-white/5 flex items-start gap-2">
                <PrototypeBadge type="DEMO DATA" size="sm" />
                <span className="text-gray-300">
                  Curated telemetry matching real-world Indian cyber threat scenarios (e.g. KYC smishing, loan app malware).
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#161b22] border border-white/5 flex items-start gap-2">
                <PrototypeBadge type="MODEL INTEGRATION READY" size="sm" />
                <span className="text-gray-300">
                  Modular Python AI/ML pipeline ready for custom fine-tuned transformer weights & HuggingFace models.
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#161b22] border border-white/5 flex items-start gap-2">
                <PrototypeBadge type="PROPOSED — ISOLATED SANDBOX" size="sm" />
                <span className="text-gray-300">
                  Containerized/MicroVM detonation chamber for non-destructive dynamic malware behavior extraction.
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#161b22] border border-white/5 flex items-start gap-2">
                <PrototypeBadge type="PROPOSED — OS AGENT" size="sm" />
                <span className="text-gray-300">
                  Native Android daemon (Notification Listener / Accessibility) and Windows driver requiring explicit device grants.
                </span>
              </div>
            </div>

            <button
              onClick={() => setLegendOpen(false)}
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg text-xs transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
