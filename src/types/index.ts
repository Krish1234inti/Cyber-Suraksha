// Cyber Suraksha - Core Types

export type UserRole = 'USER' | 'ADMIN';

export type AntivirusPlanType = 'FREE_CITIZEN' | 'PRO_SECURITY' | 'ULTRA_SOC';

export type DeviceType = 'ANDROID' | 'WINDOWS' | 'MACOS' | 'LINUX' | 'MULTI_DEVICE' | 'IOS';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  city?: string;
  state?: string;
  device_type?: DeviceType;
  primary_concern?: string;
  antivirus_plan?: AntivirusPlanType;
  antivirus_plan_name?: string;
  license_key?: string;
  protection_status?: 'ACTIVE' | 'EXPIRED' | 'TRIAL';
  license_expiry?: string;
  emergency_alert_phone?: string;
  security_score: number;
  quarantined_threats_count?: number;
  created_at: string;
  updated_at: string;
}

export type RiskLevel = 'SAFE' | 'SUSPICIOUS' | 'HIGH' | 'CRITICAL';

export type ScanType = 'URL' | 'MESSAGE' | 'FILE' | 'APPLICATION';

export type ThreatQuarantineStatus = 'ACTIVE_THREAT' | 'QUARANTINED' | 'CLEAN' | 'WHITELISTED';

export interface ThreatIndicator {
  id: string;
  scan_id?: string;
  indicator_type: 'URL' | 'DOMAIN' | 'IP' | 'HASH' | 'KEYWORD' | 'BEHAVIOR' | 'PERMISSION';
  indicator: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}

export interface ThreatScan {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  scan_type: ScanType;
  input_value?: string;
  input_hash: string;
  detected_virus_name?: string;
  risk_score: number; // 0 - 100
  risk_level: RiskLevel;
  classification: string;
  explanation: string;
  recommended_action: string;
  quarantine_status?: ThreatQuarantineStatus;
  is_real_user_scan?: boolean;
  indicators: ThreatIndicator[];
  metadata?: Record<string, any>;
  created_at: string;
  incident_id?: string;
}

export interface AntivirusPlan {
  id: AntivirusPlanType;
  name: string;
  tagline: string;
  price_inr: number;
  billing_cycle: 'YEAR' | 'MONTH' | 'LIFETIME';
  price_display: string;
  is_popular?: boolean;
  protection_scope: string;
  detects_everything: boolean;
  features: string[];
  supported_vectors: string[];
  max_devices: number;
  soc_response_sla: string;
  badge?: string;
  threat_detection_capability?: string;
  description?: string;
  period?: string;
  devices_count?: string | number;
}

export interface ProblemScenario {
  id: string;
  title: string;
  hinglish_title: string;
  icon: string;
  description: string;
  symptoms: string[];
  recommended_plan: AntivirusPlanType;
  recommended_plan_name: string;
  key_shield: string;
  threat_type?: string;
  solution_summary?: string;
}

export type IncidentStatus = 'DETECTED' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';

export interface IncidentTimelineEvent {
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  status: IncidentStatus;
}

export interface Incident {
  id: string;
  user_id: string;
  threat_scan_id?: string;
  title: string;
  description: string;
  risk_level: RiskLevel;
  status: IncidentStatus;
  timeline: IncidentTimelineEvent[];
  recommended_actions: string[];
  created_at: string;
  resolved_at?: string | null;
  assigned_to?: string;
}

export interface ThreatIntelligenceRecord {
  id: string;
  indicator_type: 'DOMAIN' | 'URL' | 'HASH' | 'IP' | 'PATTERN';
  indicator_value: string;
  reputation: 'BENIGN' | 'SUSPICIOUS' | 'MALICIOUS';
  confidence: number; // 0 - 100
  source: string;
  first_seen: string;
  last_seen: string;
  category: string;
  campaign?: string;
}

export interface ThreatCampaign {
  id: string;
  name: string;
  threat_actor?: string;
  target_sectors: string[];
  risk_level: RiskLevel;
  domains_count: number;
  url_patterns_count: number;
  hashes_count: number;
  first_detected: string;
  status: 'ACTIVE' | 'MITIGATING' | 'DORMANT';
  description: string;
}

export interface SecurityEvent {
  id: string;
  user_id: string;
  event_type: 'SCAN_COMPLETED' | 'INCIDENT_CREATED' | 'THREAT_CONTAINED' | 'SCORE_CHANGED' | 'LOGIN_ATTEMPT' | 'LAB_COMPLETED';
  description: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
}

export interface SecurityScoreBreakdown {
  id: string;
  user_id: string;
  score: number;
  password_safety: number;     // e.g. 90/100
  device_security: number;     // e.g. 80/100
  link_safety: number;         // e.g. 78/100
  application_safety: number;  // e.g. 95/100
  threat_awareness: number;    // e.g. 88/100
  update_hygiene: number;      // e.g. 92/100
  recommendations: {
    category: string;
    issue: string;
    action: string;
    impact: string;
  }[];
  created_at: string;
}

export interface SecurityScoreHistoryItem {
  date: string;
  score: number;
}

export interface CyberLabTask {
  id: number;
  title: string;
  instruction: string;
  expectedCommand: string;
  hint: string;
  solution: string;
}

export interface CyberLabModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: 'Linux & Bash' | 'Networking' | 'Web Security' | 'Digital Forensics' | 'Log Analysis' | 'CTF' | 'Vulnerability Analysis' | 'Malware Analysis Fundamentals';
  xp: number;
  estimated_time: string;
  objectives: string[];
  tasks: CyberLabTask[];
  badge?: string;
}

export interface CyberLabProgress {
  id: string;
  user_id: string;
  module_id: string;
  progress: number; // 0 - 100
  completed: boolean;
  xp_earned: number;
  updated_at: string;
}

export interface ReportRecord {
  id: string;
  user_id: string;
  report_type: 'THREAT_ANALYSIS' | 'INCIDENT' | 'SECURITY_HEALTH' | 'MONTHLY_SECURITY';
  title: string;
  data: Record<string, any>;
  created_at: string;
}

export interface DashboardStats {
  security_score: number;
  today: {
    suspicious_calls: number;
    suspicious_messages: number;
    dangerous_urls: number;
    files_scanned: number;
    threats_contained: number;
  };
  total_scans: number;
  active_incidents: number;
  cyberlab_xp: number;
  recent_threats: ThreatScan[];
  threats_over_time: { date: string; threats: number; safe: number }[];
  threat_categories: { name: string; value: number }[];
  risk_distribution: { name: string; value: number; color: string }[];
  security_score_history: SecurityScoreHistoryItem[];
}
