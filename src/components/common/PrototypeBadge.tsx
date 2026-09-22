import React from 'react';
import { Shield, Database, Cpu, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';

export type BadgeType = 
  | 'PROTOTYPE' 
  | 'DEMO DATA' 
  | 'PROPOSED — ISOLATED SANDBOX' 
  | 'PROPOSED — OS AGENT' 
  | 'MODEL INTEGRATION READY' 
  | 'LIVE REST API';

interface PrototypeBadgeProps {
  type: BadgeType;
  size?: 'sm' | 'md';
  className?: string;
}

export const PrototypeBadge: React.FC<PrototypeBadgeProps> = ({ type, size = 'sm', className = '' }) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'PROTOTYPE':
        return {
          label: 'PROTOTYPE',
          desc: 'Demonstrated frontend & operational logic',
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          icon: Shield,
        };
      case 'DEMO DATA':
        return {
          label: 'DEMO DATA',
          desc: 'Realistic curated SIH test data',
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: Database,
        };
      case 'PROPOSED — ISOLATED SANDBOX':
        return {
          label: 'PROPOSED — ISOLATED SANDBOX',
          desc: 'Future microVM/containerized execution environment',
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          icon: Lock,
        };
      case 'PROPOSED — OS AGENT':
        return {
          label: 'PROPOSED — OS AGENT',
          desc: 'Requires native Android/Windows/Linux daemon with user grant',
          bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
          icon: Cpu,
        };
      case 'MODEL INTEGRATION READY':
        return {
          label: 'MODEL INTEGRATION READY',
          desc: 'Modular pipeline designed for PyTorch/Transformers drop-in',
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: CheckCircle2,
        };
      case 'LIVE REST API':
        return {
          label: 'LIVE REST API',
          desc: 'Active backend endpoint connected',
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          icon: CheckCircle2,
        };
      default:
        return {
          label: type,
          desc: '',
          bg: 'bg-[#161b22] border-white/10 text-gray-300',
          icon: AlertTriangle,
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5 gap-1' 
    : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      title={config.desc}
      className={`inline-flex items-center font-mono font-semibold uppercase tracking-wider rounded border ${config.bg} ${sizeClasses} ${className}`}
    >
      <Icon className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};
