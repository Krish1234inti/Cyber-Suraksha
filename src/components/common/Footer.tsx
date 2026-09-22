import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldAlert, Cpu, Terminal, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0c10] border-t border-white/10 text-xs text-gray-400 mt-20">
      {/* Realism Disclaimer Banner */}
      <div className="bg-[#050608] border-b border-white/5 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px]">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>
              Realism Assurance: Response capabilities depend on operating-system APIs, available permissions and explicit user authorization.
            </span>
          </div>
          <div className="text-[11px] text-gray-500">
            Compliant with Indian IT Act (2000) & CERT-In Vulnerability Disclosure Guidelines
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-white tracking-wider font-mono text-sm">
                CYBER SURAKSHA
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              AI-Powered Unified Cyber Threat Detection, Prevention & Response Platform. Designed for Smart India Hackathon (SIH) 2026.
            </p>
            <div className="text-[11px] text-cyan-400 font-mono">
              "Detect. Explain. Protect. Learn."
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider font-mono">
              Unified Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition">
                  SOC Threat Dashboard
                </Link>
              </li>
              <li>
                <Link to="/scanner" className="hover:text-cyan-400 transition">
                  Multi-Vector Threat Scanner
                </Link>
              </li>
              <li>
                <Link to="/threat-intelligence" className="hover:text-cyan-400 transition">
                  Threat Intelligence & Campaigns
                </Link>
              </li>
              <li>
                <Link to="/incidents" className="hover:text-cyan-400 transition">
                  Incident Response Lifecycle
                </Link>
              </li>
              <li>
                <Link to="/security-score" className="hover:text-cyan-400 transition">
                  Personal Security Score Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* CyberLab & Learning */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider font-mono">
              CyberLab & Research
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/cyberlab" className="hover:text-cyan-400 transition">
                  Safe Educational Terminal
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-cyan-400 transition">
                  Forensic & Incident Reports
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition">
                  Problem Statement & Architecture
                </Link>
              </li>
              <li>
                <a 
                  href="/api/openapi.json" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-cyan-400 transition flex items-center gap-1"
                >
                  <span>OpenAPI 3.0 /docs Spec</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* National Hackathon Info */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider font-mono">
              SIH 2026 Innovation
            </h4>
            <div className="p-3 rounded-lg bg-[#0d1117] border border-white/10 text-[11px] space-y-1.5 text-gray-400">
              <span className="text-white font-semibold block">Team Cyber Suraksha</span>
              <p>Problem: Multi-Vector AI Threat Defense</p>
              <p>Target: Citizens, MSMEs, State Cyber Cells</p>
              <span className="text-cyan-400 block pt-1 font-mono">
                Prototype Version: v1.0.0-SIH
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-3">
          <p>© 2026 Cyber Suraksha Innovation Team. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-gray-400 transition">Architecture</Link>
            <Link to="/settings" className="hover:text-gray-400 transition">System Settings</Link>
            <span className="text-gray-700">•</span>
            <span className="font-mono text-cyan-400">Connected to SIH SOC Node 01</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
