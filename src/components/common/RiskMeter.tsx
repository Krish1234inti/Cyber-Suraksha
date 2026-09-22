import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldCheck, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RiskMeterProps {
  score: number;
  level?: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  score,
  level,
  size = 'md',
  showLabel = true,
}) => {
  // Determine risk level if not explicitly provided
  const computedLevel: RiskLevel = level || (
    score >= 80 ? 'CRITICAL' :
    score >= 60 ? 'HIGH' :
    score >= 30 ? 'SUSPICIOUS' : 'SAFE'
  );

  const getColorConfig = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'SAFE':
        return {
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/30',
          bgColor: 'bg-emerald-500/10',
          meterBg: 'bg-emerald-500',
          icon: ShieldCheck,
          label: 'SAFE',
          desc: 'Minimal or no threat indicators identified.',
        };
      case 'SUSPICIOUS':
        return {
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/30',
          bgColor: 'bg-amber-500/10',
          meterBg: 'bg-amber-500',
          icon: AlertCircle,
          label: 'SUSPICIOUS',
          desc: 'Unusual patterns detected; proceed with caution.',
        };
      case 'HIGH':
        return {
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500/30',
          bgColor: 'bg-orange-500/10',
          meterBg: 'bg-orange-500',
          icon: AlertTriangle,
          label: 'HIGH RISK',
          desc: 'High probability malicious indicators present.',
        };
      case 'CRITICAL':
      default:
        return {
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/30',
          bgColor: 'bg-rose-500/10',
          meterBg: 'bg-rose-600',
          icon: ShieldAlert,
          label: 'CRITICAL / MALICIOUS',
          desc: 'Active threat / credential harvesting detected.',
        };
    }
  };

  const config = getColorConfig(computedLevel);
  const Icon = config.icon;

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <span className={`font-mono font-bold text-sm ${config.textColor}`}>
          {score}/100
        </span>
        {showLabel && (
          <span className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
            {config.label}
          </span>
        )}
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`p-5 rounded-xl border ${config.borderColor} bg-[#0d1117] shadow-lg`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className={`w-6 h-6 ${config.textColor}`} />
            <span className={`font-bold tracking-wide ${config.textColor}`}>
              {config.label}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-extrabold font-mono ${config.textColor}`}>
              {score}
            </span>
            <span className="text-gray-500 text-sm font-mono">/ 100</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden border border-white/5 mb-2">
          <div
            className={`h-full ${config.meterBg} transition-all duration-700 ease-out`}
            style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-gray-500 font-mono">
          <span>0 (Safe)</span>
          <span>30 (Suspicious)</span>
          <span>60 (High)</span>
          <span>80+ (Critical)</span>
        </div>
      </div>
    );
  }

  // Medium (default)
  return (
    <div className={`p-3 rounded-lg border ${config.borderColor} bg-[#0d1117]`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${config.textColor}`} />
          <span className={`text-xs font-semibold ${config.textColor}`}>
            {config.label}
          </span>
        </div>
        <span className={`font-mono font-bold text-lg ${config.textColor}`}>
          {score}<span className="text-gray-500 text-xs font-normal">/100</span>
        </span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
        <div
          className={`h-full ${config.meterBg} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
