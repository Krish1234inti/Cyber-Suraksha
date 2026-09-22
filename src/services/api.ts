import axios from 'axios';
import { 
  User, 
  ThreatScan, 
  Incident, 
  ThreatIntelligenceRecord, 
  ThreatCampaign, 
  DashboardStats, 
  SecurityScoreBreakdown, 
  CyberLabModule, 
  CyberLabProgress, 
  ReportRecord 
} from '../types';

const API_BASE = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cyber_suraksha_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 unauthenticated
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        localStorage.removeItem('cyber_suraksha_token');
        localStorage.removeItem('cyber_suraksha_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await apiClient.post<{ access_token: string; token_type: string; user: User }>('/auth/login', credentials);
    return data;
  },
  register: async (payload: { 
    name: string; 
    email: string; 
    password: string; 
    confirm_password?: string;
    phone?: string;
    city?: string;
    state?: string;
    device_type?: string;
    primary_concern?: string;
    antivirus_plan?: string;
    emergency_alert_phone?: string;
  }) => {
    const { data } = await apiClient.post<{ access_token: string; token_type: string; user: User }>('/auth/register', payload);
    return data;
  },
  getMe: async () => {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },
};

// User Profile & Antivirus Management
export const profileApi = {
  getProfile: async () => {
    const { data } = await apiClient.get<{ user: User; total_scans: number; threats_detected: number; quarantined_threats: number }>('/user/profile');
    return data;
  },
  updateProfile: async (payload: Partial<User>) => {
    const { data } = await apiClient.put<{ message: string; user: User }>('/user/profile', payload);
    return data;
  },
  selectPlan: async (plan_id: string) => {
    const { data } = await apiClient.post<{ message: string; user: User; plan: any }>('/user/plan', { plan_id });
    return data;
  },
  getMyScans: async () => {
    try {
      const { data } = await apiClient.get<any>('/user/my-scans');
      if (Array.isArray(data)) return data as ThreatScan[];
      if (data && Array.isArray(data.scans)) return data.scans as ThreatScan[];
      return [] as ThreatScan[];
    } catch {
      return [] as ThreatScan[];
    }
  },
  quarantineThreat: async (scan_id: string) => {
    const { data } = await apiClient.post<{ message: string; scan: ThreatScan }>('/user/quarantine', { scan_id });
    return data;
  },
  deleteScan: async (scan_id: string) => {
    const { data } = await apiClient.delete<{ message: string }>(`/user/scans/${scan_id}`);
    return data;
  },
};

// Antivirus Pricing & Problem Solutions
export const antivirusApi = {
  getPlans: async () => {
    const { data } = await apiClient.get<{ plans: any[]; guarantee: string }>('/pricing/plans');
    return data;
  },
  getProblems: async () => {
    const { data } = await apiClient.get<any[]>('/pricing/problems');
    return data;
  },
};

// Dashboard Endpoints
export const dashboardApi = {
  getStats: async () => {
    const { data } = await apiClient.get<DashboardStats>('/dashboard');
    return data;
  },
  getActivity: async () => {
    const { data } = await apiClient.get<{ events: any[] }>('/dashboard/activity');
    return data;
  },
  getSecurityScore: async () => {
    const { data } = await apiClient.get<{ score: number; trend: string }>('/dashboard/security-score');
    return data;
  },
};

// Threat Scanner Endpoints
export const scanApi = {
  scanUrl: async (url: string) => {
    const { data } = await apiClient.post<ThreatScan>('/scan/url', { url });
    return data;
  },
  scanMessage: async (message: string, channel: string = 'SMS/Chat') => {
    const { data } = await apiClient.post<ThreatScan>('/scan/message', { message, channel });
    return data;
  },
  scanFile: async (fileName: string, fileSize?: number, fileHash?: string, fileContent?: string, mimeType?: string) => {
    const { data } = await apiClient.post<ThreatScan>('/scan/file', { fileName, fileSize, fileHash, fileContent, mimeType });
    return data;
  },
  scanApplication: async (package_name: string, version: string = '1.0.0', permissions: string[] = []) => {
    const { data } = await apiClient.post<ThreatScan>('/scan/application', { package_name, version, permissions });
    return data;
  },
  // Dedicated Device Antivirus Scanning Endpoints
  scanDeviceFile: async (payload: { fileName: string; fileSize?: number; fileHash?: string; fileContent?: string; mimeType?: string }) => {
    const { data } = await apiClient.post<ThreatScan>('/antivirus/scan-file', payload);
    return data;
  },
  scanDeviceSoftware: async (payload: { softwareName?: string; package_name: string; version?: string; permissions?: string[]; developer?: string; source?: string }) => {
    const { data } = await apiClient.post<ThreatScan>('/antivirus/scan-software', payload);
    return data;
  },
  scanDeviceProcess: async (payload: { processName: string; pid?: number; commandLine?: string; memoryUsage?: string }) => {
    const { data } = await apiClient.post<ThreatScan>('/antivirus/scan-process', payload);
    return data;
  },
  scanFullDevice: async (payload: { deviceType?: string; deviceName?: string; scanDepth?: string }) => {
    const { data } = await apiClient.post<{ message: string; device_health_score: number; items_audited: number; threats_found: number; scans: ThreatScan[] }>('/antivirus/full-device-scan', payload);
    return data;
  },
  getScans: async () => {
    const { data } = await apiClient.get<ThreatScan[]>('/scans');
    return data;
  },
  getScanById: async (id: string) => {
    const { data } = await apiClient.get<ThreatScan>(`/scans/${id}`);
    return data;
  },
};
export const scannerApi = scanApi;
export const deviceAntivirusApi = {
  scanFile: scanApi.scanDeviceFile,
  scanSoftware: scanApi.scanDeviceSoftware,
  scanProcess: scanApi.scanDeviceProcess,
  scanFullDevice: scanApi.scanFullDevice,
};

// Threat Intelligence Endpoints
export const threatIntelApi = {
  getIndicators: async (params?: { category?: string; reputation?: string; search?: string }) => {
    const { data } = await apiClient.get<{ indicators: ThreatIntelligenceRecord[]; total: number }>('/threat-intelligence', { params });
    return data;
  },
  getCampaigns: async () => {
    const { data } = await apiClient.get<ThreatCampaign[]>('/threat-intelligence/campaigns');
    return data;
  },
};

// Incidents Endpoints
export const incidentApi = {
  list: async () => {
    const { data } = await apiClient.get<Incident[]>('/incidents');
    return data;
  },
  getIncidents: async () => {
    const { data } = await apiClient.get<Incident[]>('/incidents');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get<Incident>(`/incidents/${id}`);
    return data;
  },
  getIncidentById: async (id: string) => {
    const { data } = await apiClient.get<Incident>(`/incidents/${id}`);
    return data;
  },
  create: async (payload: { threat_scan_id?: string; title: string; description: string; risk_level: string }) => {
    const { data } = await apiClient.post<Incident>('/incidents', payload);
    return data;
  },
  createIncident: async (payload: { threat_scan_id?: string; title: string; description: string; risk_level: string }) => {
    const { data } = await apiClient.post<Incident>('/incidents', payload);
    return data;
  },
  resolve: async (id: string, notes?: string) => {
    const { data } = await apiClient.post<Incident>(`/incidents/${id}/resolve`, { notes });
    return data;
  },
  resolveIncident: async (id: string, notes?: string) => {
    const { data } = await apiClient.post<Incident>(`/incidents/${id}/resolve`, { notes });
    return data;
  },
  updateStatus: async (id: string, status: string, notes?: string) => {
    const { data } = await apiClient.post<Incident>(`/incidents/${id}/status`, { status, notes });
    return data;
  },
};

// Reports Endpoints
export const reportApi = {
  list: async () => {
    const { data } = await apiClient.get<ReportRecord[]>('/reports');
    return data;
  },
  getReports: async () => {
    const { data } = await apiClient.get<ReportRecord[]>('/reports');
    return data;
  },
  createReport: async (payload: { report_type: string; title: string; data?: any }) => {
    const { data } = await apiClient.post<ReportRecord>('/reports', payload);
    return data;
  },
};
export const reportsApi = reportApi;

// CyberLab Endpoints
export const cyberLabApi = {
  getModules: async () => {
    const { data } = await apiClient.get<CyberLabModule[]>('/cyberlab/modules');
    return data;
  },
  getProgress: async () => {
    const { data } = await apiClient.get<CyberLabProgress[]>('/cyberlab/progress');
    return data;
  },
  completeModule: async (id: string, answers?: any) => {
    const { data } = await apiClient.post<{ message: string; xp_awarded: number; total_xp: number }>(`/cyberlab/modules/${id}/complete`, answers);
    return data;
  },
  executeTerminalCommand: async (command: string, context?: { currentDir?: string; moduleId?: string }) => {
    const { data } = await apiClient.post<{ output: string; exitCode: number; currentDir: string; hint?: string }>('/cyberlab/terminal/execute', { command, context });
    return data;
  },
  executeTerminal: async (command: string, context?: { currentDir?: string; moduleId?: string }) => {
    const { data } = await apiClient.post<{ output: string; exitCode: number; currentDir: string; hint?: string }>('/cyberlab/terminal/execute', { command, context });
    return data;
  },
};
export const cyberlabApi = cyberLabApi;

// Security Score Endpoints
export const securityScoreApi = {
  getBreakdown: async () => {
    const { data } = await apiClient.get<SecurityScoreBreakdown>('/security-score');
    return data;
  },
  getScore: async () => {
    const { data } = await apiClient.get<SecurityScoreBreakdown>('/security-score');
    return data;
  },
  getHistory: async () => {
    const { data } = await apiClient.get<{ history: { date: string; score: number }[] }>('/security-score/history');
    return data;
  },
};

// Admin Endpoints
export const adminApi = {
  getStats: async () => {
    const { data } = await apiClient.get<any>('/admin/statistics');
    return data;
  },
  getStatistics: async () => {
    const { data } = await apiClient.get<any>('/admin/statistics');
    return data;
  },
  getUsers: async () => {
    try {
      const { data } = await apiClient.get<any>('/admin/users');
      if (Array.isArray(data)) return data as User[];
      if (data && Array.isArray(data.users)) return data.users as User[];
      return [] as User[];
    } catch {
      return [] as User[];
    }
  },
  updateUser: async (id: string, payload: Partial<User>) => {
    const { data } = await apiClient.put<{ message: string; user: User }>(`/admin/users/${id}`, payload);
    return data;
  },
  deleteUser: async (id: string) => {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/users/${id}`);
    return data;
  },
  getAllScans: async () => {
    try {
      const { data } = await apiClient.get<any>('/admin/all-scans');
      if (Array.isArray(data)) return data as ThreatScan[];
      if (data && Array.isArray(data.scans)) return data.scans as ThreatScan[];
      return [] as ThreatScan[];
    } catch {
      return [] as ThreatScan[];
    }
  },
  quarantineThreat: async (scan_id: string, status: string = 'QUARANTINED') => {
    const { data } = await apiClient.post<{ message: string; scan: ThreatScan }>('/admin/quarantine-threat', { scan_id, status });
    return data;
  },
  getDatabaseExportUrl: () => '/api/admin/database/export',
};

// Demo Seed API
export const demoApi = {
  resetSeed: async () => {
    const { data } = await apiClient.post<{ message: string; stats: any }>('/demo/seed');
    return data;
  },
  seedData: async () => {
    const { data } = await apiClient.post<{ message: string; stats: any }>('/demo/seed');
    return data;
  },
};
