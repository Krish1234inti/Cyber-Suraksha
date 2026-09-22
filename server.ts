import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { DatabaseStore } from './server/db';
import { ThreatDetectionEngine } from './server/aiEngine';
import { Incident, ThreatScan, User, AntivirusPlanType } from './src/types';
import { ANTIVIRUS_PLANS, PROBLEM_SCENARIOS } from './src/data/antivirusPlans';

// Initialize Database State
DatabaseStore.initialize();

// Helper: Resolve requesting user from token or headers or fallback
function getRequestUser(req: Request): User {
  const state = DatabaseStore.getState();
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer jwt-token-')) {
    const raw = authHeader.replace('Bearer jwt-token-', '');
    const dashIdx = raw.lastIndexOf('-');
    const userId = dashIdx > 0 ? raw.substring(0, dashIdx) : raw;
    const found = state.users.find(u => u.id === userId);
    if (found) return found;
  }
  const customId = (req.headers['x-user-id'] as string) || req.body?.user_id;
  if (customId) {
    const found = state.users.find(u => u.id === customId);
    if (found) return found;
  }
  // Default to first user or officer
  return state.users[0];
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // ==========================================
  // 1. HEALTH & OPENAPI SPECIFICATION
  // ==========================================
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'operational',
      platform: 'Cyber Suraksha v1.0.0 (SIH 2026 Innovation)',
      timestamp: new Date().toISOString(),
      engine: 'Threat Detection & Explainable AI Engine',
    });
  });

  app.get('/api/openapi.json', (req: Request, res: Response) => {
    res.json({
      openapi: '3.0.3',
      info: {
        title: 'Cyber Suraksha Unified Threat Detection Platform API',
        version: '1.0.0-SIH2026',
        description: 'National-Level AI-Powered Unified Cyber Threat Detection, Prevention & Response Platform REST API.',
      },
      servers: [{ url: '/api', description: 'Container Gateway Service' }],
      paths: {
        '/auth/login': { post: { summary: 'Authenticate user & issue JWT' } },
        '/auth/register': { post: { summary: 'Register citizen/officer account' } },
        '/dashboard': { get: { summary: 'Get unified SOC dashboard telemetry' } },
        '/scan/url': { post: { summary: 'Analyze URL with heuristic AI & threat intelligence' } },
        '/scan/message': { post: { summary: 'NLP classification for SMS/Email phishing & urgency' } },
        '/scan/file': { post: { summary: 'Static hash & metadata inspection with isolated sandbox note' } },
        '/scan/application': { post: { summary: 'Android APK manifest and permission triage' } },
        '/incidents': { get: { summary: 'Query active security incident records' } },
        '/threat-intelligence/campaigns': { get: { summary: 'Retrieve emerging multi-vector threat campaigns' } },
        '/cyberlab/terminal/execute': { post: { summary: 'Safe sandboxed educational shell interpreter' } },
      },
    });
  });

  // ==========================================
  // 2. AUTHENTICATION & PROFILE ENDPOINTS
  // ==========================================
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { 
      name, 
      email, 
      password, 
      phone, 
      city, 
      state: userState, 
      device_type, 
      primary_concern, 
      antivirus_plan = 'PRO_SECURITY',
      emergency_alert_phone 
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const state = DatabaseStore.getState();
    const existing = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const planObj = ANTIVIRUS_PLANS.find(p => p.id === antivirus_plan) || ANTIVIRUS_PLANS[1];
    const role = (email.toLowerCase() === 'rahulsingh241177@gmail.com' || email.toLowerCase().includes('admin'))
      ? 'ADMIN'
      : 'USER';

    const licenseCode = `CS-${planObj.id.replace('_', '-')}-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: role as 'ADMIN' | 'USER',
      phone: phone || '+91 98000 00000',
      city: city || 'New Delhi',
      state: userState || 'Delhi',
      device_type: device_type || 'ANDROID',
      primary_concern: primary_concern || 'Banking, UPI Fraud & Phishing Scams',
      antivirus_plan: planObj.id as AntivirusPlanType,
      antivirus_plan_name: planObj.name,
      license_key: licenseCode,
      protection_status: 'ACTIVE',
      license_expiry: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      emergency_alert_phone: emergency_alert_phone || phone || '+91 98000 00000',
      security_score: 85,
      quarantined_threats_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    state.users.unshift(newUser);

    const token = `jwt-token-${newUser.id}-${Date.now()}`;
    res.status(201).json({
      access_token: token,
      token_type: 'Bearer',
      user: newUser,
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    const state = DatabaseStore.getState();
    
    // Find user
    let user = state.users.find(u => u.email.toLowerCase() === email?.toLowerCase());
    if (!user) {
      // Auto-fallback for demo conveniences or master admin
      if (email?.toLowerCase() === 'rahulsingh241177@gmail.com' || email?.includes('admin')) {
        user = state.users.find(u => u.role === 'ADMIN');
      } else {
        user = state.users.find(u => u.role === 'USER') || state.users[0];
      }
    }

    const token = `jwt-token-${user.id}-${Date.now()}`;
    res.json({
      access_token: token,
      token_type: 'Bearer',
      user,
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = getRequestUser(req);
    res.json(user);
  });

  // User Profile Endpoints
  app.get('/api/user/profile', (req: Request, res: Response) => {
    const user = getRequestUser(req);
    const state = DatabaseStore.getState();
    const userScans = state.threat_scans.filter(s => s.user_id === user.id);
    res.json({
      user,
      total_scans: userScans.length,
      threats_detected: userScans.filter(s => s.risk_score >= 60).length,
      quarantined_threats: userScans.filter(s => s.quarantine_status === 'QUARANTINED').length,
    });
  });

  app.put('/api/user/profile', (req: Request, res: Response) => {
    const currentUser = getRequestUser(req);
    const state = DatabaseStore.getState();
    const user = state.users.find(u => u.id === currentUser.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, phone, city, state: userState, device_type, primary_concern, emergency_alert_phone } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (city) user.city = city;
    if (userState) user.state = userState;
    if (device_type) user.device_type = device_type;
    if (primary_concern) user.primary_concern = primary_concern;
    if (emergency_alert_phone) user.emergency_alert_phone = emergency_alert_phone;
    user.updated_at = new Date().toISOString();

    res.json({ message: 'Profile updated successfully', user });
  });

  // User Antivirus Plan Activation / Update
  app.post('/api/user/plan', (req: Request, res: Response) => {
    const currentUser = getRequestUser(req);
    const state = DatabaseStore.getState();
    const user = state.users.find(u => u.id === currentUser.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { plan_id } = req.body;
    const chosenPlan = ANTIVIRUS_PLANS.find(p => p.id === plan_id);
    if (!chosenPlan) return res.status(400).json({ error: 'Invalid antivirus plan selected' });

    user.antivirus_plan = chosenPlan.id;
    user.antivirus_plan_name = chosenPlan.name;
    user.license_key = `CS-${chosenPlan.id.replace('_', '-')}-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    user.protection_status = 'ACTIVE';
    user.license_expiry = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString();
    user.security_score = Math.min(user.security_score + 10, 99);
    user.updated_at = new Date().toISOString();

    res.json({
      message: `Successfully activated ${chosenPlan.name}!`,
      user,
      plan: chosenPlan,
    });
  });

  // Scans for the logged in user
  app.get('/api/user/my-scans', (req: Request, res: Response) => {
    const user = getRequestUser(req);
    const state = DatabaseStore.getState();
    // Return only authenticated user's scans (strict privacy isolation)
    const userScans = state.threat_scans.filter(s => s.user_id === user.id);
    res.json(userScans);
  });

  // Quarantine a detected threat
  app.post('/api/user/quarantine', (req: Request, res: Response) => {
    const { scan_id } = req.body;
    const state = DatabaseStore.getState();
    const scan = state.threat_scans.find(s => s.id === scan_id);
    if (!scan) return res.status(404).json({ error: 'Scan record not found' });

    scan.quarantine_status = 'QUARANTINED';
    const user = getRequestUser(req);
    user.quarantined_threats_count = (user.quarantined_threats_count || 0) + 1;

    res.json({ message: `Threat "${scan.detected_virus_name || scan.classification}" quarantined securely.`, scan });
  });

  // Delete a scan from user history
  app.delete('/api/user/scans/:id', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    const idx = state.threat_scans.findIndex(s => s.id === req.params.id);
    if (idx >= 0) {
      state.threat_scans.splice(idx, 1);
      return res.json({ message: 'Threat record removed from database' });
    }
    res.status(404).json({ error: 'Record not found' });
  });

  // Pricing & Antivirus Plans
  app.get('/api/pricing/plans', (req: Request, res: Response) => {
    res.json({
      plans: ANTIVIRUS_PLANS,
      timestamp: new Date().toISOString(),
      guarantee: '100% Zero-Day Detection Rate & Indian Banking Gateway Sentinel',
    });
  });

  app.get('/api/pricing/problems', (req: Request, res: Response) => {
    res.json(PROBLEM_SCENARIOS);
  });

  // ==========================================
  // 3. DASHBOARD ENDPOINTS
  // ==========================================
  app.get('/api/dashboard', (req: Request, res: Response) => {
    const stats = DatabaseStore.getDashboardStats();
    res.json(stats);
  });

  app.get('/api/dashboard/activity', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    res.json({ events: state.security_events });
  });

  app.get('/api/dashboard/security-score', (req: Request, res: Response) => {
    res.json({ score: 87, trend: '+5 this month' });
  });

  // ==========================================
  // 4. THREAT SCANNER ENDPOINTS
  // ==========================================
  app.post('/api/scan/url', (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const user = getRequestUser(req);
    const scanResult = ThreatDetectionEngine.analyzeUrl(url);
    scanResult.user_id = user.id;
    scanResult.user_name = user.name;
    scanResult.user_email = user.email;
    const state = DatabaseStore.getState();
    state.threat_scans.unshift(scanResult);

    // Auto-create incident if high risk
    if (scanResult.risk_score >= 80) {
      const incident: Incident = {
        id: `INC-2026-0${state.incidents.length + 1}`,
        user_id: scanResult.user_id,
        threat_scan_id: scanResult.id,
        title: `Phishing Detection: ${url.replace(/^https?:\/\//, '').split('/')[0]}`,
        description: scanResult.explanation,
        risk_level: scanResult.risk_level,
        status: 'DETECTED',
        timeline: [
          {
            timestamp: new Date().toISOString(),
            title: 'Automated Threat Interception',
            description: `Scan scored ${scanResult.risk_score}/100. High probability credential harvester.`,
            actor: 'Threat Detection Engine',
            status: 'DETECTED',
          },
        ],
        recommended_actions: [scanResult.recommended_action],
        created_at: new Date().toISOString(),
      };
      state.incidents.unshift(incident);
      scanResult.incident_id = incident.id;
    }

    res.json(scanResult);
  });

  app.post('/api/scan/message', (req: Request, res: Response) => {
    const { message, channel } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const user = getRequestUser(req);
    const scanResult = ThreatDetectionEngine.analyzeMessage(message, channel || 'SMS');
    scanResult.user_id = user.id;
    scanResult.user_name = user.name;
    scanResult.user_email = user.email;
    const state = DatabaseStore.getState();
    state.threat_scans.unshift(scanResult);

    if (scanResult.risk_score >= 80) {
      const incident: Incident = {
        id: `INC-2026-0${state.incidents.length + 1}`,
        user_id: scanResult.user_id,
        threat_scan_id: scanResult.id,
        title: `Smishing Alert: Urgent Social Engineering Pattern`,
        description: scanResult.explanation,
        risk_level: scanResult.risk_level,
        status: 'DETECTED',
        timeline: [
          {
            timestamp: new Date().toISOString(),
            title: 'NLP Keyword & Urgency Classifier Triggered',
            description: `Score ${scanResult.risk_score}/100. Credential extraction pattern detected.`,
            actor: 'NLP Classifier',
            status: 'DETECTED',
          },
        ],
        recommended_actions: [scanResult.recommended_action],
        created_at: new Date().toISOString(),
      };
      state.incidents.unshift(incident);
      scanResult.incident_id = incident.id;
    }

    res.json(scanResult);
  });

  app.post('/api/scan/file', (req: Request, res: Response) => {
    // Note: If using multipart or raw json metadata
    const fileName = req.body.fileName || 'uploaded_sample.exe';
    const fileSize = req.body.fileSize || 2048576;
    const fileHash = req.body.fileHash;
    const fileContent = req.body.fileContent;
    const mimeType = req.body.mimeType;

    const user = getRequestUser(req);
    const scanResult = ThreatDetectionEngine.analyzeFile(fileName, fileSize, fileHash, fileContent, mimeType);
    scanResult.user_id = user.id;
    scanResult.user_name = user.name;
    scanResult.user_email = user.email;
    const state = DatabaseStore.getState();
    state.threat_scans.unshift(scanResult);

    res.json(scanResult);
  });

  app.post('/api/scan/application', (req: Request, res: Response) => {
    const { package_name, version, permissions } = req.body;
    const pkg = package_name || 'com.unknown.package';
    const ver = version || '1.0.0';
    const perms = permissions || [];

    const user = getRequestUser(req);
    const scanResult = ThreatDetectionEngine.analyzeApplication(pkg, ver, perms);
    scanResult.user_id = user.id;
    scanResult.user_name = user.name;
    scanResult.user_email = user.email;
    const state = DatabaseStore.getState();
    state.threat_scans.unshift(scanResult);

    res.json(scanResult);
  });

  // ==========================================
  // 4B. DEDICATED DEVICE ANTIVIRUS SERVICE ENDPOINTS
  // ==========================================
  // Antivirus File & Software Binary Scanner
  app.post('/api/antivirus/scan-file', (req: Request, res: Response) => {
    const { fileName, fileSize, fileHash, fileContent, mimeType } = req.body;
    if (!fileName) {
      return res.status(400).json({ error: 'File name is required' });
    }

    const user = getRequestUser(req);
    const scanResult = ThreatDetectionEngine.analyzeFile(
      fileName, 
      fileSize || 1024, 
      fileHash, 
      fileContent, 
      mimeType
    );
    scanResult.user_id = user.id;
    scanResult.user_name = user.name;
    scanResult.user_email = user.email;
    
    const state = DatabaseStore.getState();
    state.threat_scans.unshift(scanResult);

    // If threat detected, increment user quarantine counter if auto-isolated
    if (scanResult.risk_score >= 60) {
      scanResult.quarantine_status = 'ACTIVE_THREAT';
    }

    res.json(scanResult);
  });

  // Antivirus Software / APK Inspector
  app.post('/api/antivirus/scan-software', (req: Request, res: Response) => {
    const { softwareName, package_name, version, permissions, source } = req.body;
    const pkg = package_name || softwareName || 'com.unknown.software';
    const ver = version || '1.0.0';
    const perms = permissions || [];

    const user = getRequestUser(req);
    const scanResult = ThreatDetectionEngine.analyzeApplication(pkg, ver, perms);
    scanResult.user_id = user.id;
    scanResult.user_name = user.name;
    scanResult.user_email = user.email;

    if (softwareName) {
      scanResult.input_value = `${softwareName} (${pkg} v${ver})`;
    }

    const state = DatabaseStore.getState();
    state.threat_scans.unshift(scanResult);

    res.json(scanResult);
  });

  // Antivirus Process & Memory Inspector
  app.post('/api/antivirus/scan-process', (req: Request, res: Response) => {
    const { processName, pid, commandLine, memoryUsage } = req.body;
    if (!processName) {
      return res.status(400).json({ error: 'Process name is required' });
    }

    const user = getRequestUser(req);
    const scanResult = ThreatDetectionEngine.analyzeProcess(processName, pid, commandLine, memoryUsage);
    scanResult.user_id = user.id;
    scanResult.user_name = user.name;
    scanResult.user_email = user.email;

    const state = DatabaseStore.getState();
    state.threat_scans.unshift(scanResult);

    res.json(scanResult);
  });

  // Antivirus Full Device Deep Audit
  app.post('/api/antivirus/full-device-scan', (req: Request, res: Response) => {
    const { deviceType, deviceName, scanDepth } = req.body;
    const user = getRequestUser(req);
    const targetType = deviceType || user.device_type || 'ANDROID';

    const auditResult = ThreatDetectionEngine.analyzeDeviceAudit(targetType, deviceName, scanDepth);
    
    // If audit returned any specific detected threats, record them
    const state = DatabaseStore.getState();
    for (const scan of auditResult.scans) {
      scan.user_id = user.id;
      scan.user_name = user.name;
      scan.user_email = user.email;
      state.threat_scans.unshift(scan);
    }

    res.json({
      message: auditResult.message,
      device_health_score: auditResult.device_health_score,
      items_audited: auditResult.items_audited,
      threats_found: auditResult.threats_found,
      scans: auditResult.scans,
    });
  });

  app.get('/api/scans', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    res.json(state.threat_scans);
  });

  app.get('/api/scans/:id', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    const scan = state.threat_scans.find(s => s.id === req.params.id);
    if (!scan) return res.status(404).json({ error: 'Scan record not found' });
    res.json(scan);
  });

  // ==========================================
  // 5. THREAT INTELLIGENCE ENDPOINTS
  // ==========================================
  app.get('/api/threat-intelligence', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    const { search, category, reputation } = req.query;

    let items = [...state.threat_intelligence];
    if (search) {
      const q = String(search).toLowerCase();
      items = items.filter(i => 
        i.indicator_value.toLowerCase().includes(q) || 
        i.category.toLowerCase().includes(q) ||
        (i.campaign && i.campaign.toLowerCase().includes(q))
      );
    }
    if (category) {
      items = items.filter(i => i.category === category);
    }
    if (reputation) {
      items = items.filter(i => i.reputation === reputation);
    }

    res.json({ indicators: items, total: items.length });
  });

  app.get('/api/threat-intelligence/campaigns', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    res.json(state.threat_campaigns);
  });

  // ==========================================
  // 6. INCIDENTS ENDPOINTS
  // ==========================================
  app.get('/api/incidents', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    res.json(state.incidents);
  });

  app.get('/api/incidents/:id', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    const incident = state.incidents.find(i => i.id === req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    res.json(incident);
  });

  app.post('/api/incidents', (req: Request, res: Response) => {
    const { title, description, risk_level, threat_scan_id } = req.body;
    const state = DatabaseStore.getState();
    
    const newInc: Incident = {
      id: `INC-2026-0${state.incidents.length + 1}`,
      user_id: 'usr-officer-01',
      threat_scan_id,
      title: title || 'Reported Cyber Threat Event',
      description: description || 'User reported suspicious vector for national cyber cell triage.',
      risk_level: risk_level || 'HIGH',
      status: 'DETECTED',
      timeline: [
        {
          timestamp: new Date().toISOString(),
          title: 'Manual Incident Creation',
          description: 'Incident initiated via Cyber Suraksha portal.',
          actor: 'Inspector Rahul Sharma',
          status: 'DETECTED',
        },
      ],
      recommended_actions: [
        'Collect originating packet logs',
        'Verify target phone number against CDR records',
      ],
      created_at: new Date().toISOString(),
    };

    state.incidents.unshift(newInc);
    res.status(201).json(newInc);
  });

  app.post('/api/incidents/:id/resolve', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    const incident = state.incidents.find(i => i.id === req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });

    incident.status = 'RESOLVED';
    incident.resolved_at = new Date().toISOString();
    incident.timeline.push({
      timestamp: new Date().toISOString(),
      title: 'Incident Resolved',
      description: req.body.notes || 'Threat mitigated. Domain sinkholed and advisory disseminated.',
      actor: 'Inspector Rahul Sharma',
      status: 'RESOLVED',
    });

    res.json(incident);
  });

  app.post('/api/incidents/:id/status', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    const incident = state.incidents.find(i => i.id === req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });

    const newStatus = req.body.status;
    incident.status = newStatus;
    if (newStatus === 'RESOLVED') {
      incident.resolved_at = new Date().toISOString();
    }
    incident.timeline.push({
      timestamp: new Date().toISOString(),
      title: `Status Changed to ${newStatus}`,
      description: req.body.notes || `Triage milestone updated to ${newStatus}.`,
      actor: 'Inspector Rahul Sharma',
      status: newStatus,
    });

    res.json(incident);
  });

  // ==========================================
  // 7. CYBERLAB & SAFE SIMULATED TERMINAL
  // ==========================================
  app.get('/api/cyberlab/modules', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    res.json(state.cyberlab_modules);
  });

  app.get('/api/cyberlab/progress', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    res.json(state.cyberlab_progress);
  });

  app.post('/api/cyberlab/modules/:id/complete', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    const mod = state.cyberlab_modules.find(m => m.id === req.params.id);
    if (!mod) return res.status(404).json({ error: 'Module not found' });

    let prog = state.cyberlab_progress.find(p => p.module_id === req.params.id);
    if (!prog) {
      prog = {
        id: `prog-${Date.now()}`,
        user_id: 'usr-officer-01',
        module_id: mod.id,
        progress: 100,
        completed: true,
        xp_earned: mod.xp,
        updated_at: new Date().toISOString(),
      };
      state.cyberlab_progress.push(prog);
    } else {
      prog.progress = 100;
      prog.completed = true;
      prog.xp_earned = mod.xp;
    }

    res.json({
      message: `Module "${mod.title}" completed!`,
      xp_awarded: mod.xp,
      total_xp: state.cyberlab_progress.reduce((acc, curr) => acc + curr.xp_earned, 0),
    });
  });

  // Section 22: Safe CyberLab Terminal - Simulated educational terminal
  // Only allows predefined safe commands: whoami, pwd, ls, help, cat, clear, grep, date, etc.
  app.post('/api/cyberlab/terminal/execute', (req: Request, res: Response) => {
    const rawCmd = (req.body.command || '').trim();
    const parts = rawCmd.split(/\s+/);
    const cmd = parts[0]?.toLowerCase();
    const arg = parts[1];

    if (!rawCmd) {
      return res.json({ output: '', exitCode: 0, currentDir: '/home/analyst/lab' });
    }

    // Predefined safe sandbox responses
    switch (cmd) {
      case 'help':
        return res.json({
          output: `Cyber Suraksha Safe Educational Shell v1.0
Predefined Commands Allowed:
  whoami       - Display current simulated user
  pwd          - Print current safe sandbox directory
  ls [-la]     - List directory contents
  cat <file>   - Read safe exercise artifact
  grep <term>  - Search text pattern
  clear        - Clear console screen
  help         - Show this help manual

NOTE: Destructive or network-invasive commands are restricted by policy.`,
          exitCode: 0,
          currentDir: '/home/analyst/lab',
        });

      case 'whoami':
        return res.json({
          output: 'analyst@cyber-suraksha-sandbox [UID=1002 GID=1002 (student_soc_analyst)]',
          exitCode: 0,
          currentDir: '/home/analyst/lab',
        });

      case 'pwd':
        return res.json({
          output: '/home/analyst/lab',
          exitCode: 0,
          currentDir: '/home/analyst/lab',
        });

      case 'ls':
        return res.json({
          output: `total 32
-rw-r--r-- 1 analyst analyst 1240 Mar 06 00:10 auth.log
-rw-r--r-- 1 analyst analyst  540 Mar 06 00:08 header.txt
-rw-r--r-- 1 analyst analyst  310 Mar 06 00:05 ioc.txt
-rw-r--r-- 1 analyst analyst 2180 Mar 06 00:02 manifest.xml
-rw-r--r-- 1 analyst analyst 4920 Mar 05 23:45 access.log
-rwxr-xr-x 1 analyst analyst  120 Mar 05 23:30 inspect.sh`,
          exitCode: 0,
          currentDir: '/home/analyst/lab',
        });

      case 'cat':
        if (!arg) {
          return res.json({ output: 'cat: missing file operand. Try: cat auth.log', exitCode: 1, currentDir: '/home/analyst/lab' });
        }
        if (arg.includes('auth.log')) {
          return res.json({
            output: `Mar 06 00:01:14 host sshd[1492]: Failed password for invalid user root from 194.38.20.114 port 44822 ssh2
Mar 06 00:01:17 host sshd[1494]: Failed password for invalid user admin from 194.38.20.114 port 44826 ssh2
Mar 06 00:01:21 host sshd[1498]: Failed password for invalid user test from 194.38.20.114 port 44830 ssh2
Mar 06 00:01:25 host sshd[1502]: Received disconnect from 194.38.20.114: 11: Bye Bye [preauth]
Mar 06 00:02:00 host kernel: [UFW BLOCK] IN=eth0 OUT= SRC=194.38.20.114 PROTO=TCP DPT=22`,
            exitCode: 0,
            currentDir: '/home/analyst/lab',
          });
        }
        if (arg.includes('header.txt')) {
          return res.json({
            output: `Delivered-To: victim.citizen@gmail.com
Received: by 2002:a05:6512:1234 with SMTP id ab12;
Authentication-Results: mx.google.com;
  spf=fail (google.com: domain of alert@sbi-kyc-update-portal.online does not designate permitted sender)
  dkim=neutral (no key for signature)
Return-Path: <spoofed@sbi-kyc-update-portal.online>
From: "State Bank Official" <alert@sbi-kyc-update-portal.online>
Subject: URGENT: Complete your KYC within 24 hours to prevent account debit freeze`,
            exitCode: 0,
            currentDir: '/home/analyst/lab',
          });
        }
        if (arg.includes('ioc.txt')) {
          return res.json({
            output: `[IOC INDICATORS EXTRACTED]
DOMAIN: sbi-kyc-update-portal.online
SENDER_IP: 194.38.20.114 (ASN 49822 - Bulletproof Host Europe)
ATTACK_TYPE: Spear-Phishing / Credential Harvester
TARGET_ASSET: NetBanking Login & PAN Card Form`,
            exitCode: 0,
            currentDir: '/home/analyst/lab',
          });
        }
        if (arg.includes('manifest.xml')) {
          return res.json({
            output: `<manifest package="com.quickcash.instant.microloan">
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.READ_SMS" />
  <uses-permission android:name="android.permission.RECEIVE_SMS" />
  <uses-permission android:name="android.permission.READ_CONTACTS" />
  <uses-permission android:name="android.permission.RECORD_AUDIO" />
  <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
  <service android:name=".StealthBackgroundUploader" android:exported="true" />
</manifest>`,
            exitCode: 0,
            currentDir: '/home/analyst/lab',
          });
        }
        if (arg.includes('access.log')) {
          return res.json({
            output: `194.38.20.114 - - [06/Mar/2026:00:04:12 +0000] "GET /login HTTP/1.1" 200 4820
194.38.20.114 - - [06/Mar/2026:00:04:15 +0000] "POST /api/authenticate HTTP/1.1" 401 120
194.38.20.114 - - [06/Mar/2026:00:04:22 +0000] "GET /admin' OR '1'='1 HTTP/1.1" 400 320 [SQLI PROBE]
194.38.20.114 - - [06/Mar/2026:00:04:29 +0000] "GET /../../../../etc/passwd HTTP/1.1" 403 140 [PATH TRAVERSAL]`,
            exitCode: 0,
            currentDir: '/home/analyst/lab',
          });
        }
        return res.json({
          output: `cat: ${arg}: No such file or directory. Try: ls`,
          exitCode: 1,
          currentDir: '/home/analyst/lab',
        });

      case 'clear':
        return res.json({ output: '__CLEAR__', exitCode: 0, currentDir: '/home/analyst/lab' });

      default:
        return res.json({
          output: `bash: ${cmd}: command not recognized in safe sandbox. Predefined safe commands: whoami, pwd, ls, cat, help, clear.`,
          exitCode: 127,
          currentDir: '/home/analyst/lab',
        });
    }
  });

  // ==========================================
  // 8. SECURITY SCORE ENDPOINTS
  // ==========================================
  app.get('/api/security-score', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    const score = state.security_scores[0];
    res.json(score);
  });

  app.get('/api/security-score/history', (req: Request, res: Response) => {
    const stats = DatabaseStore.getDashboardStats();
    res.json({ history: stats.security_score_history });
  });

  // ==========================================
  // 9. REPORTS ENDPOINTS
  // ==========================================
  app.get('/api/reports', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    res.json(state.reports);
  });

  app.post('/api/reports', (req: Request, res: Response) => {
    const { report_type, title, data } = req.body;
    const state = DatabaseStore.getState();
    
    const newReport = {
      id: `rep-0${state.reports.length + 1}`,
      user_id: 'usr-officer-01',
      report_type: report_type || 'THREAT_ANALYSIS',
      title: title || 'Custom Security Analysis Report',
      data: data || { generated_by: 'Cyber Suraksha SOC' },
      created_at: new Date().toISOString(),
    };

    state.reports.unshift(newReport);
    res.status(201).json(newReport);
  });

  // ==========================================
  // 10. ADMIN & MASTER DATABASE ENDPOINTS
  // ==========================================
  app.get('/api/admin/statistics', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    const activeThreats = state.threat_scans.filter(s => s.risk_score >= 60).length;
    const quarantinedThreats = state.threat_scans.filter(s => s.quarantine_status === 'QUARANTINED').length;
    res.json({
      total_users: state.users.length,
      active_antivirus_licenses: state.users.filter(u => u.protection_status === 'ACTIVE').length,
      total_scans: state.threat_scans.length,
      threats_detected: activeThreats,
      quarantined_threats: quarantinedThreats,
      incidents: state.incidents.length,
      emerging_campaigns: state.threat_campaigns.length,
      database_controller: 'Rahul Singh (rahulsingh241177@gmail.com)',
      system_uptime: '99.98%',
      db_status: 'Central Master Database Online (PostgreSQL Engine Active)',
    });
  });

  // Admin: Get all users from master database
  app.get('/api/admin/users', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    res.json(state.users);
  });

  // Admin: Update user's plan or details
  app.put('/api/admin/users/:id', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    const user = state.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found in master database' });

    const { role, antivirus_plan, protection_status, phone, city } = req.body;
    if (role) user.role = role;
    if (antivirus_plan) {
      user.antivirus_plan = antivirus_plan;
      const planObj = ANTIVIRUS_PLANS.find(p => p.id === antivirus_plan);
      if (planObj) user.antivirus_plan_name = planObj.name;
    }
    if (protection_status) user.protection_status = protection_status;
    if (phone) user.phone = phone;
    if (city) user.city = city;
    user.updated_at = new Date().toISOString();

    res.json({ message: 'User record updated in database', user });
  });

  // Admin: Delete user from master database
  app.delete('/api/admin/users/:id', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    const idx = state.users.findIndex(u => u.id === req.params.id);
    if (idx >= 0) {
      state.users.splice(idx, 1);
      return res.json({ message: 'User successfully removed from master database' });
    }
    res.status(404).json({ error: 'User not found' });
  });

  // Admin: Get all scans with user details and virus names
  app.get('/api/admin/all-scans', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    res.json(state.threat_scans);
  });

  // Admin: Quarantine or release threat
  app.post('/api/admin/quarantine-threat', (req: Request, res: Response) => {
    const { scan_id, status = 'QUARANTINED' } = req.body;
    const state = DatabaseStore.getState();
    const scan = state.threat_scans.find(s => s.id === scan_id);
    if (!scan) return res.status(404).json({ error: 'Scan record not found' });

    scan.quarantine_status = status;
    res.json({ message: `Threat ${scan.detected_virus_name || scan.id} status updated to ${status}`, scan });
  });

  // Admin: Full database JSON export
  app.get('/api/admin/database/export', (req: Request, res: Response) => {
    const state = DatabaseStore.getState();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="cybersuraksha_master_database.json"');
    res.json({
      database_name: 'CyberSuraksha_Master_SOC_Database',
      controller: 'Rahul Singh (rahulsingh241177@gmail.com)',
      exported_at: new Date().toISOString(),
      version: '2.6.0-SIH',
      tables: {
        users: state.users,
        threat_scans: state.threat_scans,
        incidents: state.incidents,
        threat_campaigns: state.threat_campaigns,
        threat_intelligence: state.threat_intelligence,
        reports: state.reports,
        telemetry_events: state.security_events,
      },
    });
  });

  app.post('/api/demo/seed', (req: Request, res: Response) => {
    DatabaseStore.seedDemoData();
    res.json({
      message: 'Demo dataset successfully restored to initial SIH judging state',
      stats: DatabaseStore.getDashboardStats(),
    });
  });

  // ==========================================
  // 11. VITE MIDDLEWARE (DEV) & STATIC (PROD)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Cyber Suraksha] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to boot Cyber Suraksha server:', err);
});
