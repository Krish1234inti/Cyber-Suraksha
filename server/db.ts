import crypto from 'crypto';
import { 
  User, 
  ThreatScan, 
  ThreatIndicator, 
  Incident, 
  ThreatIntelligenceRecord, 
  ThreatCampaign, 
  SecurityEvent, 
  SecurityScoreBreakdown, 
  CyberLabModule, 
  CyberLabProgress, 
  ReportRecord,
  DashboardStats 
} from '../src/types';

export interface DatabaseState {
  users: User[];
  threat_scans: ThreatScan[];
  threat_indicators: ThreatIndicator[];
  incidents: Incident[];
  threat_intelligence: ThreatIntelligenceRecord[];
  threat_campaigns: ThreatCampaign[];
  security_events: SecurityEvent[];
  security_scores: SecurityScoreBreakdown[];
  cyberlab_modules: CyberLabModule[];
  cyberlab_progress: CyberLabProgress[];
  reports: ReportRecord[];
}

export class DatabaseStore {
  private static state: DatabaseState;

  public static initialize(): void {
    if (this.state) return;
    this.seedDemoData();
  }

  public static getState(): DatabaseState {
    if (!this.state) this.initialize();
    return this.state;
  }

  public static seedDemoData(): void {
    const adminId = 'usr-admin-01';
    const userId = 'usr-officer-01';
    const masterAdminId = 'usr-master-01';

    const users: User[] = [
      {
        id: masterAdminId,
        name: 'Rahul Singh (Master Database Controller)',
        email: 'rahulsingh241177@gmail.com',
        role: 'ADMIN',
        phone: '+91 98765 43210',
        city: 'New Delhi',
        state: 'Delhi',
        device_type: 'MULTI_DEVICE',
        primary_concern: 'Central National Database Administration & All-Vector Antivirus Control',
        antivirus_plan: 'ULTRA_SOC',
        antivirus_plan_name: 'CyberSuraksha Ultra SOC Suite',
        license_key: 'CS-SOC-ROOT-2026-MASTER',
        protection_status: 'ACTIVE',
        license_expiry: '2028-12-31T23:59:59Z',
        emergency_alert_phone: '+91 98765 43210',
        security_score: 99,
        quarantined_threats_count: 0,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-03-06T10:00:00Z',
      },
      {
        id: adminId,
        name: 'Super Admin (National SOC)',
        email: 'admin@cybersuraksha.gov.in',
        role: 'ADMIN',
        phone: '+91 11 2436 8570',
        city: 'New Delhi',
        state: 'Delhi',
        device_type: 'LINUX',
        primary_concern: 'National Cyber Infrastructure Protection',
        antivirus_plan: 'ULTRA_SOC',
        antivirus_plan_name: 'CyberSuraksha Ultra SOC Suite',
        license_key: 'CS-SOC-GOV-2026-9901',
        protection_status: 'ACTIVE',
        license_expiry: '2027-12-31T23:59:59Z',
        emergency_alert_phone: '+91 11 2436 8570',
        security_score: 96,
        quarantined_threats_count: 0,
        created_at: '2026-01-15T08:00:00Z',
        updated_at: '2026-03-01T10:00:00Z',
      },
      {
        id: userId,
        name: 'Inspector Rahul Sharma',
        email: 'officer.sharma@cybercell.gov.in',
        role: 'USER',
        phone: '+91 94123 78901',
        city: 'Jaipur',
        state: 'Rajasthan',
        device_type: 'ANDROID',
        primary_concern: 'Banking, UPI & Phishing Scams',
        antivirus_plan: 'PRO_SECURITY',
        antivirus_plan_name: 'CyberSuraksha Pro Antivirus',
        license_key: 'CS-PRO-2026-4891-A812',
        protection_status: 'ACTIVE',
        license_expiry: '2027-03-05T12:00:00Z',
        emergency_alert_phone: '+91 94123 00000',
        security_score: 92,
        quarantined_threats_count: 0,
        created_at: '2026-02-01T09:30:00Z',
        updated_at: '2026-03-05T12:00:00Z',
      },
    ];

    // User-driven scans only: empty initially so user's antivirus detects their own device viruses
    const threat_scans: ThreatScan[] = [];

    // Incidents: DETECTED -> INVESTIGATING -> CONTAINED -> RESOLVED (empty initially, escalated from real scans)
    const incidents: Incident[] = [];

    // Threat Intelligence Campaigns & Indicators
    // Section 14: "Campaign: Credential Phishing Campaign, Indicators: 127 domains, 43 URL patterns, 18 hashes"
    const threat_campaigns: ThreatCampaign[] = [
      {
        id: 'camp-01',
        name: 'Credential Phishing Campaign (India Retail Banking)',
        threat_actor: 'APT-FraudShadow / FinPhish-IN',
        target_sectors: ['Retail Banking', 'Fintech Wallets', 'Taxpayers'],
        risk_level: 'CRITICAL',
        domains_count: 127,      // Requested in prompt
        url_patterns_count: 43,   // Requested in prompt
        hashes_count: 18,         // Requested in prompt
        first_detected: '2026-01-10',
        status: 'ACTIVE',
        description: 'Coordinated infrastructure generating short-lived domains spoofing SBI, HDFC, and ICICI KYC update pages via bulk SMS gateways.',
      },
      {
        id: 'camp-02',
        name: 'Operation PowerLure (Discom Fraud Network)',
        threat_actor: 'Unknown Criminal Syndicate',
        target_sectors: ['Public Utilities', 'Homeowners', 'Small Businesses'],
        risk_level: 'HIGH',
        domains_count: 54,
        url_patterns_count: 22,
        hashes_count: 9,
        first_detected: '2026-02-04',
        status: 'MITIGATING',
        description: 'Impersonates regional electricity distribution companies with threats of midnight power disconnections.',
      },
      {
        id: 'camp-03',
        name: 'ShadowLoan Exfiltration Ring',
        threat_actor: 'Offshore Syndicate',
        target_sectors: ['Mobile Users', 'Gig Workers'],
        risk_level: 'CRITICAL',
        domains_count: 89,
        url_patterns_count: 67,
        hashes_count: 34,
        first_detected: '2025-11-20',
        status: 'ACTIVE',
        description: 'Sideloaded APKs claiming 5-minute personal loans that harvest complete WhatsApp contact directories and photo galleries.',
      },
    ];

    const threat_intelligence: ThreatIntelligenceRecord[] = [
      {
        id: 'ti-01',
        indicator_type: 'DOMAIN',
        indicator_value: 'sbi-kyc-update-portal.online',
        reputation: 'MALICIOUS',
        confidence: 98,
        source: 'Cyber Suraksha Collective Threat Feed',
        first_seen: '2026-03-01T04:12:00Z',
        last_seen: '2026-03-06T00:00:00Z',
        category: 'Banking Phishing',
        campaign: 'Credential Phishing Campaign (India Retail Banking)',
      },
      {
        id: 'ti-02',
        indicator_type: 'URL',
        indicator_value: 'http://electricity-bill-discount-pay.click/rebate',
        reputation: 'MALICIOUS',
        confidence: 94,
        source: 'State Cyber Cell Telemetry',
        first_seen: '2026-02-28T11:45:00Z',
        last_seen: '2026-03-05T18:30:00Z',
        category: 'Utility Scam',
        campaign: 'Operation PowerLure (Discom Fraud Network)',
      },
      {
        id: 'ti-03',
        indicator_type: 'HASH',
        indicator_value: '275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f',
        reputation: 'MALICIOUS',
        confidence: 99,
        source: 'National Malware Signature Hub',
        first_seen: '2026-01-20T08:00:00Z',
        last_seen: '2026-03-04T14:15:00Z',
        category: 'Trojan PE Executable',
        campaign: 'Credential Phishing Campaign (India Retail Banking)',
      },
      {
        id: 'ti-04',
        indicator_type: 'IP',
        indicator_value: '194.38.20.114',
        reputation: 'SUSPICIOUS',
        confidence: 85,
        source: 'BGP Hijack & Anomaly Watch',
        first_seen: '2026-02-15T09:00:00Z',
        last_seen: '2026-03-05T22:00:00Z',
        category: 'C2 Fast-Flux Node',
        campaign: 'ShadowLoan Exfiltration Ring',
      },
      {
        id: 'ti-05',
        indicator_type: 'PATTERN',
        indicator_value: '*sbi*kyc*verify*.online',
        reputation: 'MALICIOUS',
        confidence: 96,
        source: 'Heuristic Pattern Engine',
        first_seen: '2026-01-12T00:00:00Z',
        last_seen: '2026-03-06T00:00:00Z',
        category: 'Phishing Heuristic Wildcard',
        campaign: 'Credential Phishing Campaign (India Retail Banking)',
      },
    ];

    // Personal Security Score Breakdown (Requested: 87 / 100)
    const security_scores: SecurityScoreBreakdown[] = [
      {
        id: 'score-01',
        user_id: userId,
        score: 87, // Exact requested score
        password_safety: 92,
        device_security: 84,
        link_safety: 79,
        application_safety: 88,
        threat_awareness: 94,
        update_hygiene: 85,
        recommendations: [
          {
            category: 'Link Safety',
            issue: 'Two unverified SMS links accessed in past 7 days',
            action: 'Enable automated link sandboxing and always verify sender headers',
            impact: '+4 Points',
          },
          {
            category: 'Device Security',
            issue: 'DNS-over-HTTPS (DoH) currently inactive on client browser',
            action: 'Turn on secure encrypted DNS query resolution in browser network settings',
            impact: '+5 Points',
          },
          {
            category: 'Update Hygiene',
            issue: 'Android security patch pending verification',
            action: 'Check settings for latest quarterly vendor security bulletin update',
            impact: '+4 Points',
          },
        ],
        created_at: new Date().toISOString(),
      },
    ];

    // CyberLab Modules (Section 21: Linux & Bash, Networking, Web Security, Forensics, Log Analysis, CTF, Vulnerability, Malware Fundamentals)
    const cyberlab_modules: CyberLabModule[] = [
      {
        id: 'mod-1',
        title: 'Linux & Bash Security Essentials',
        description: 'Master defensive terminal commands, inspect user privileges, and analyze system files.',
        difficulty: 'BEGINNER',
        category: 'Linux & Bash',
        xp: 150,
        estimated_time: '15 mins',
        objectives: [
          'Verify user identity using whoami',
          'Inspect directory structure with pwd and ls',
          'Read suspicious authorization log files safely with cat',
        ],
        tasks: [
          {
            id: 1,
            title: 'Verify Security Persona',
            instruction: 'Execute the command to inspect your current simulated terminal user privileges.',
            expectedCommand: 'whoami',
            hint: 'Type "whoami" and press Enter.',
            solution: 'whoami',
          },
          {
            id: 2,
            title: 'Examine System Path',
            instruction: 'Print your current working directory to confirm safe sandbox boundaries.',
            expectedCommand: 'pwd',
            hint: 'Type "pwd" to print working directory.',
            solution: 'pwd',
          },
          {
            id: 3,
            title: 'List Sandbox Files',
            instruction: 'List all files including hidden threat artifacts in the sandbox directory.',
            expectedCommand: 'ls',
            hint: 'Use "ls" or "ls -la".',
            solution: 'ls',
          },
          {
            id: 4,
            title: 'Audit Suspicious Log',
            instruction: 'Read the contents of the suspicious authentication log file (auth.log).',
            expectedCommand: 'cat auth.log',
            hint: 'Use "cat auth.log".',
            solution: 'cat auth.log',
          },
        ],
        badge: 'Terminal Defender',
      },
      {
        id: 'mod-2',
        title: 'Phishing Forensics & Header Deconstruction',
        description: 'Analyze spoofed email headers, identify DKIM/SPF failures, and pinpoint malicious origin IPs.',
        difficulty: 'INTERMEDIATE',
        category: 'Digital Forensics',
        xp: 220,
        estimated_time: '25 mins',
        objectives: [
          'Inspect RFC 5322 email headers',
          'Correlate Return-Path with DKIM signatures',
          'Track originating mail transfer agent (MTA)',
        ],
        tasks: [
          {
            id: 1,
            title: 'Inspect Email Envelope',
            instruction: 'Check the email header file for SPF alignment failure.',
            expectedCommand: 'cat header.txt',
            hint: 'Type "cat header.txt".',
            solution: 'cat header.txt',
          },
          {
            id: 2,
            title: 'Grep Malicious Sender IP',
            instruction: 'Search for the originating IP address in the header.',
            expectedCommand: 'cat ioc.txt',
            hint: 'Inspect ioc.txt.',
            solution: 'cat ioc.txt',
          },
        ],
        badge: 'Email Forensics Analyst',
      },
      {
        id: 'mod-3',
        title: 'Android APK Manifest Audit & Permission Triage',
        description: 'Dissect AndroidManifest.xml to spot dangerous permission combinations and stealthy background services.',
        difficulty: 'INTERMEDIATE',
        category: 'Malware Analysis Fundamentals',
        xp: 250,
        estimated_time: '20 mins',
        objectives: [
          'Identify excessive permissions',
          'Spot exported broadcast receivers vulnerable to injection',
          'Evaluate accessibility abuse techniques',
        ],
        tasks: [
          {
            id: 1,
            title: 'Review Manifest Privileges',
            instruction: 'Inspect the extracted Android manifest file for SMS permissions.',
            expectedCommand: 'cat manifest.xml',
            hint: 'Type "cat manifest.xml".',
            solution: 'cat manifest.xml',
          },
        ],
        badge: 'Mobile Security Auditor',
      },
      {
        id: 'mod-4',
        title: 'SOC Log Analysis & Incident Correlation',
        description: 'Process Apache and Nginx web server access logs to identify SQL injection and directory traversal probing.',
        difficulty: 'ADVANCED',
        category: 'Log Analysis',
        xp: 300,
        estimated_time: '35 mins',
        objectives: [
          'Identify web attack patterns',
          'Filter 404/500 HTTP response codes',
          'Compile IOC list for national threat sharing',
        ],
        tasks: [
          {
            id: 1,
            title: 'Inspect Web Access Log',
            instruction: 'Review the simulated web server log file.',
            expectedCommand: 'cat access.log',
            hint: 'Type "cat access.log".',
            solution: 'cat access.log',
          },
        ],
        badge: 'SOC Tier-2 Investigator',
      },
    ];

    const cyberlab_progress: CyberLabProgress[] = [
      {
        id: 'prog-01',
        user_id: userId,
        module_id: 'mod-1',
        progress: 75,
        completed: false,
        xp_earned: 110,
        updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'prog-02',
        user_id: userId,
        module_id: 'mod-2',
        progress: 100,
        completed: true,
        xp_earned: 220,
        updated_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ];

    // Reports
    const reports: ReportRecord[] = [
      {
        id: 'rep-01',
        user_id: userId,
        report_type: 'THREAT_ANALYSIS',
        title: 'Forensic Analysis: State Bank of India KYC Smishing Wave',
        data: {
          threat_id: 'scan-demo-01',
          risk_score: 91,
          classification: 'CREDENTIAL PHISHING',
          iocs: ['sbi-kyc-update-portal.online', '+91-98210-XXXXX'],
          remediation: 'Domain sinkholed, subscriber notified, CIRT alert filed.',
        },
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'rep-02',
        user_id: userId,
        report_type: 'INCIDENT',
        title: 'Incident Post-Mortem: Trojan Binary Quarantine (#INC-2026-002)',
        data: {
          incident_id: 'INC-2026-002',
          vector: 'Spear Phishing Email Attachment',
          containment_time_minutes: 18,
          status: 'CONTAINED',
        },
        created_at: new Date(Date.now() - 3600000 * 7).toISOString(),
      },
      {
        id: 'rep-03',
        user_id: userId,
        report_type: 'SECURITY_HEALTH',
        title: 'Quarterly Personal Cyber Hygiene Assessment (Q1 2026)',
        data: {
          aggregate_score: 87,
          improvement_points: 6,
          high_risk_interactions: 3,
        },
        created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
      },
    ];

    const security_events: SecurityEvent[] = [
      {
        id: 'evt-01',
        user_id: userId,
        event_type: 'SCAN_COMPLETED',
        description: 'URL Scan finished: sbi-kyc-update-portal.online flagged HIGH RISK (91/100)',
        severity: 'HIGH',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'evt-02',
        user_id: userId,
        event_type: 'INCIDENT_CREATED',
        description: 'Incident #INC-2026-001 automatically opened for SBI KYC Smishing Wave',
        severity: 'HIGH',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'evt-03',
        user_id: userId,
        event_type: 'THREAT_CONTAINED',
        description: 'Discom Electricity Bill Discount link sinkholed via telco gateway rule',
        severity: 'MEDIUM',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'evt-04',
        user_id: userId,
        event_type: 'SCORE_CHANGED',
        description: 'Security health score adjusted to 87/100 (+2 for completing CyberLab lab)',
        severity: 'INFO',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ];

    this.state = {
      users,
      threat_scans,
      threat_indicators: [],
      incidents,
      threat_intelligence,
      threat_campaigns,
      security_events,
      security_scores,
      cyberlab_modules,
      cyberlab_progress,
      reports,
    };
  }

  // Get Dashboard Stats dynamically reflecting real user scan data:
  public static getDashboardStats(): DashboardStats {
    const s = this.getState();
    const filesScanned = s.threat_scans.filter(sc => sc.scan_type === 'FILE' || sc.scan_type === 'APPLICATION').length;
    const urlsScanned = s.threat_scans.filter(sc => sc.scan_type === 'URL').length;
    const msgsScanned = s.threat_scans.filter(sc => sc.scan_type === 'MESSAGE').length;
    const threatsContained = s.threat_scans.filter(sc => sc.quarantine_status === 'QUARANTINED').length;
    const threatsDetected = s.threat_scans.filter(sc => sc.risk_score >= 60).length;
    const safeCount = s.threat_scans.filter(sc => sc.risk_score < 30).length;
    const susCount = s.threat_scans.filter(sc => sc.risk_score >= 30 && sc.risk_score < 60).length;
    const highCount = s.threat_scans.filter(sc => sc.risk_score >= 60 && sc.risk_score < 80).length;
    const criticalCount = s.threat_scans.filter(sc => sc.risk_score >= 80).length;

    return {
      security_score: threatsDetected === 0 ? 98 : Math.max(45, 98 - (threatsDetected * 8) + (threatsContained * 6)),
      today: {
        suspicious_calls: 0,
        suspicious_messages: msgsScanned,
        dangerous_urls: urlsScanned,
        files_scanned: filesScanned,
        threats_contained: threatsContained,
      },
      total_scans: s.threat_scans.length,
      active_incidents: s.incidents.filter(i => i.status !== 'RESOLVED').length,
      cyberlab_xp: 330,
      recent_threats: s.threat_scans.slice(0, 10),
      threats_over_time: [
        { date: 'Mon', threats: 0, safe: 0 },
        { date: 'Tue', threats: 0, safe: 0 },
        { date: 'Wed', threats: 0, safe: 0 },
        { date: 'Thu', threats: 0, safe: 0 },
        { date: 'Fri', threats: 0, safe: 0 },
        { date: 'Sat', threats: 0, safe: 0 },
        { date: 'Today', threats: threatsDetected, safe: safeCount },
      ],
      threat_categories: [
        { name: 'Banking Phishing', value: s.threat_scans.filter(sc => (sc.classification || '').includes('PHISHING') || (sc.classification || '').includes('SMISHING')).length },
        { name: 'Device Viruses & Trojans', value: s.threat_scans.filter(sc => (sc.classification || '').includes('TROJAN') || (sc.classification || '').includes('VIRUS') || (sc.classification || '').includes('MALWARE')).length },
        { name: 'Predatory Loan APKs', value: s.threat_scans.filter(sc => (sc.classification || '').includes('SPYWARE') || (sc.classification || '').includes('LOAN')).length },
        { name: 'Ransomware & Droppers', value: s.threat_scans.filter(sc => (sc.classification || '').includes('RANSOM') || (sc.classification || '').includes('DROPPER')).length },
      ],
      risk_distribution: [
        { name: 'Critical (80-100)', value: criticalCount, color: '#f43f5e' },
        { name: 'High Risk (60-79)', value: highCount, color: '#f97316' },
        { name: 'Suspicious (30-59)', value: susCount, color: '#f59e0b' },
        { name: 'Safe (0-29)', value: safeCount, color: '#10b981' },
      ],
      security_score_history: [
        { date: '04 Mar', score: 92 },
        { date: '05 Mar', score: 94 },
        { date: 'Today', score: threatsDetected === 0 ? 98 : Math.max(45, 98 - (threatsDetected * 8) + (threatsContained * 6)) },
      ],
    };
  }
}
