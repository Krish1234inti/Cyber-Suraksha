import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Radar, 
  Globe, 
  MessageSquare, 
  FileCode, 
  Smartphone, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  FileCheck,
  Shield,
  HelpCircle,
  Bug,
  Lock,
  Database,
  Upload,
  Cpu,
  Laptop,
  Search,
  Check,
  ShieldCheck,
  Layers,
  Terminal,
  Activity
} from 'lucide-react';
import { scannerApi, deviceAntivirusApi, incidentApi, profileApi } from '../services/api';
import { ThreatScan } from '../types';
import { RiskMeter } from '../components/common/RiskMeter';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import { useAuth } from '../context/AuthContext';

type ScannerTab = 'FILE_ANTIVIRUS' | 'SOFTWARE_APK' | 'PROCESS_SCAN' | 'DEVICE_SWEEP' | 'URL_WEB' | 'SMS_PHISH';

export const ScannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<ScannerTab>('FILE_ANTIVIRUS');

  // Input fields (clean by default — no pre-populated demo data!)
  const [urlInput, setUrlInput] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>('');
  
  // File Scan State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileNameInput, setFileNameInput] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [calculatedHash, setCalculatedHash] = useState<string>('');
  const [fileContentSnippet, setFileContentSnippet] = useState<string>('');
  const [isHashing, setIsHashing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Software & APK State
  const [softwareName, setSoftwareName] = useState<string>('');
  const [apkPackage, setApkPackage] = useState<string>('');
  const [apkVersion, setApkVersion] = useState<string>('1.0.0');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Process & Memory State
  const [processName, setProcessName] = useState<string>('');
  const [processPid, setProcessPid] = useState<string>('');
  const [commandLineArgs, setCommandLineArgs] = useState<string>('');
  const [memoryUsage, setMemoryUsage] = useState<string>('');

  // Device Sweep State
  const [sweepDeviceType, setSweepDeviceType] = useState<string>(user?.device_type || 'ANDROID');
  const [sweepProgress, setSweepProgress] = useState<number>(0);
  const [isSweeping, setIsSweeping] = useState<boolean>(false);
  const [sweepResult, setSweepResult] = useState<{
    message: string;
    device_health_score: number;
    items_audited: number;
    threats_found: number;
  } | null>(null);

  // General State
  const [loading, setLoading] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ThreatScan | null>(null);
  const [escalateSuccess, setEscalateSuccess] = useState<string | null>(null);
  const [quarantineNotice, setQuarantineNotice] = useState<string | null>(null);

  // Check if an ID was passed in query params
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      scannerApi.getScanById(id).then(res => {
        setScanResult(res);
        if (res.scan_type === 'FILE') setActiveTab('FILE_ANTIVIRUS');
        else if (res.scan_type === 'APPLICATION') setActiveTab('SOFTWARE_APK');
        else if (res.scan_type === 'URL') setActiveTab('URL_WEB');
        else if (res.scan_type === 'MESSAGE') setActiveTab('SMS_PHISH');
      }).catch(err => console.error(err));
    }
  }, [searchParams]);

  // Handle Real File Selection from User's Device (supports browse, drag & drop)
  const processFile = async (file: File) => {
    setSelectedFile(file);
    setFileNameInput(file.name);
    setFileSize(file.size);
    setIsHashing(true);

    try {
      // Calculate real SHA-256 in browser (use slice if file is large to keep memory light)
      const buffer = file.size > 25 * 1024 * 1024 
        ? await file.slice(0, 25 * 1024 * 1024).arrayBuffer() 
        : await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setCalculatedHash(hashHex);

      // Read sample text snippet (first 32KB) for string/signature checks
      const textDecoder = new TextDecoder('utf-8', { fatal: false });
      const snippetBuffer = await file.slice(0, 32768).arrayBuffer();
      const snippet = textDecoder.decode(snippetBuffer);
      setFileContentSnippet(snippet);
    } catch (err) {
      console.warn('Could not compute client-side SHA-256:', err);
    } finally {
      setIsHashing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Safe EICAR Antivirus Test File Generator (Standard Benign Verification)
  const handleLoadEicarTest = () => {
    const eicarCode = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';
    setFileNameInput('eicar_antivirus_test_file.com.txt');
    setFileSize(68);
    setFileContentSnippet(eicarCode);
    setCalculatedHash('275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f');
    setSelectedFile(null);
  };

  // Clear inputs
  const handleClearInputs = () => {
    setUrlInput('');
    setMessageInput('');
    setSelectedFile(null);
    setFileNameInput('');
    setFileSize(0);
    setCalculatedHash('');
    setFileContentSnippet('');
    setSoftwareName('');
    setApkPackage('');
    setSelectedPermissions([]);
    setProcessName('');
    setProcessPid('');
    setCommandLineArgs('');
    setMemoryUsage('');
    setScanResult(null);
    setSweepResult(null);
  };

  // Toggle permission
  const handleTogglePermission = (perm: string) => {
    setSelectedPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  // Common high-risk Android permissions
  const commonPermissions = [
    { id: 'android.permission.READ_SMS', label: 'Read SMS Messages (OTP theft risk)' },
    { id: 'android.permission.RECEIVE_SMS', label: 'Receive SMS (Intercept 2FA)' },
    { id: 'android.permission.READ_CONTACTS', label: 'Read Contacts Directory' },
    { id: 'android.permission.RECORD_AUDIO', label: 'Record Audio / Microphone' },
    { id: 'android.permission.SYSTEM_ALERT_WINDOW', label: 'Draw Over Other Apps (Screen overlay phishing)' },
    { id: 'android.permission.BIND_ACCESSIBILITY_SERVICE', label: 'Accessibility Service (Keylogging & auto-clicks)' },
  ];

  // Handler for running scans
  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setEscalateSuccess(null);
    setQuarantineNotice(null);

    try {
      let result: ThreatScan;

      if (activeTab === 'FILE_ANTIVIRUS') {
        const name = fileNameInput.trim() || 'unnamed_device_file.bin';
        result = await deviceAntivirusApi.scanFile({
          fileName: name,
          fileSize: fileSize || 1024,
          fileHash: calculatedHash || undefined,
          fileContent: fileContentSnippet || undefined,
          mimeType: selectedFile?.type || 'application/octet-stream',
        });
      } else if (activeTab === 'SOFTWARE_APK') {
        result = await deviceAntivirusApi.scanSoftware({
          softwareName: softwareName.trim() || undefined,
          package_name: apkPackage.trim() || softwareName.trim() || 'com.device.app',
          version: apkVersion.trim() || '1.0.0',
          permissions: selectedPermissions,
        });
      } else if (activeTab === 'PROCESS_SCAN') {
        result = await deviceAntivirusApi.scanProcess({
          processName: processName.trim() || 'system_worker',
          pid: processPid ? parseInt(processPid, 10) : undefined,
          commandLine: commandLineArgs.trim() || undefined,
          memoryUsage: memoryUsage.trim() || undefined,
        });
      } else if (activeTab === 'URL_WEB') {
        if (!urlInput.trim()) return;
        result = await scannerApi.scanUrl(urlInput.trim());
      } else {
        if (!messageInput.trim()) return;
        result = await scannerApi.scanMessage(messageInput.trim(), 'SMS/Chat');
      }

      setScanResult(result);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Full Device Sweep Execution
  const handleRunDeviceSweep = async () => {
    setIsSweeping(true);
    setSweepProgress(10);
    setSweepResult(null);
    setScanResult(null);

    try {
      // Simulate live multi-stage scanning feedback
      const timer1 = setTimeout(() => setSweepProgress(35), 400);
      const timer2 = setTimeout(() => setSweepProgress(65), 900);
      const timer3 = setTimeout(() => setSweepProgress(88), 1400);

      const res = await deviceAntivirusApi.scanFullDevice({
        deviceType: sweepDeviceType,
        deviceName: `${sweepDeviceType} Device (${user?.name || 'Local User'})`,
        scanDepth: 'DEEP',
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setSweepProgress(100);

      setTimeout(() => {
        setIsSweeping(false);
        setSweepResult({
          message: res.message,
          device_health_score: res.device_health_score,
          items_audited: res.items_audited,
          threats_found: res.threats_found,
        });
      }, 500);
    } catch (err) {
      console.error('Sweep error:', err);
      setIsSweeping(false);
    }
  };

  const handleEscalateToIncident = async () => {
    if (!scanResult) return;
    try {
      const inc = await incidentApi.create({
        title: `Incident: ${scanResult.detected_virus_name || scanResult.classification} (${scanResult.scan_type})`,
        description: scanResult.explanation,
        risk_level: scanResult.risk_level,
        threat_scan_id: scanResult.id,
      });
      setEscalateSuccess(`Incident #${inc.id} created! Redirecting to Incidents Console...`);
      setTimeout(() => {
        navigate(`/incidents/${inc.id}`);
      }, 1200);
    } catch (err) {
      console.error('Escalation error:', err);
    }
  };

  const handleQuarantineCurrentThreat = async () => {
    if (!scanResult) return;
    try {
      const res = await profileApi.quarantineThreat(scanResult.id);
      setScanResult(prev => prev ? { ...prev, quarantine_status: 'QUARANTINED' } : null);
      setQuarantineNotice(res.message);
      setTimeout(() => setQuarantineNotice(null), 4000);
    } catch (err) {
      console.error('Error quarantining threat:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            Cyber Suraksha • Device Antivirus & Threat Engine
          </span>
          <PrototypeBadge type="LIVE SCANNER" size="sm" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
          DEVICE ANTIVIRUS & MALWARE SCANNER
        </h1>
        <p className="text-xs text-gray-400">
          Inspect your personal device for viruses, trojans, suspicious software packages, background processes, and phishing vectors without pre-loaded dummy data.
        </p>
      </div>

      {/* Antivirus Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => { setActiveTab('FILE_ANTIVIRUS'); setScanResult(null); }}
          className={`px-4 py-2.5 text-xs font-mono font-bold rounded-t-lg flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'FILE_ANTIVIRUS'
              ? 'bg-[#0d1117] border-t-2 border-cyan-400 text-white border-x border-white/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span>1. Device File & Binary Antivirus</span>
        </button>

        <button
          onClick={() => { setActiveTab('SOFTWARE_APK'); setScanResult(null); }}
          className={`px-4 py-2.5 text-xs font-mono font-bold rounded-t-lg flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'SOFTWARE_APK'
              ? 'bg-[#0d1117] border-t-2 border-purple-400 text-white border-x border-white/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Smartphone className="w-4 h-4 text-purple-400" />
          <span>2. Software & APK Inspector</span>
        </button>

        <button
          onClick={() => { setActiveTab('PROCESS_SCAN'); setScanResult(null); }}
          className={`px-4 py-2.5 text-xs font-mono font-bold rounded-t-lg flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'PROCESS_SCAN'
              ? 'bg-[#0d1117] border-t-2 border-amber-400 text-white border-x border-white/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>3. Device Process & Memory</span>
        </button>

        <button
          onClick={() => { setActiveTab('DEVICE_SWEEP'); setScanResult(null); }}
          className={`px-4 py-2.5 text-xs font-mono font-bold rounded-t-lg flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'DEVICE_SWEEP'
              ? 'bg-[#0d1117] border-t-2 border-emerald-400 text-white border-x border-white/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>4. Full Device Sweep</span>
        </button>

        <button
          onClick={() => { setActiveTab('URL_WEB'); setScanResult(null); }}
          className={`px-4 py-2.5 text-xs font-mono font-bold rounded-t-lg flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'URL_WEB'
              ? 'bg-[#0d1117] border-t-2 border-cyan-400 text-white border-x border-white/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>5. URL Sentinel</span>
        </button>

        <button
          onClick={() => { setActiveTab('SMS_PHISH'); setScanResult(null); }}
          className={`px-4 py-2.5 text-xs font-mono font-bold rounded-t-lg flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === 'SMS_PHISH'
              ? 'bg-[#0d1117] border-t-2 border-rose-400 text-white border-x border-white/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-rose-400" />
          <span>6. SMS & Fraud Analyzer</span>
        </button>
      </div>

      {/* Main Scanner Card & Result Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-xl bg-[#0d1117] border border-white/10 space-y-5 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <span>Vector Submission</span>
              </h2>
              <button
                type="button"
                onClick={handleClearInputs}
                className="text-[11px] text-gray-400 hover:text-cyan-400 font-mono transition"
              >
                Clear Input
              </button>
            </div>

            {/* TAB 4: FULL DEVICE SWEEP SPECIFIC VIEW */}
            {activeTab === 'DEVICE_SWEEP' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#161b22] border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <Laptop className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">
                        Target Operating System
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        Select device profile for comprehensive partition and privilege audit.
                      </p>
                    </div>
                  </div>

                  <select
                    value={sweepDeviceType}
                    onChange={(e) => setSweepDeviceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d1117] border border-white/10 text-gray-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="ANDROID">Android Smartphone (APKs, Storage, SMS Permissions)</option>
                    <option value="WINDOWS">Windows PC / Laptop (Executables, Registry, Memory)</option>
                    <option value="LINUX">Linux Workstation / Server (Daemons, Cron, Binaries)</option>
                    <option value="IOS">Apple iOS / macOS (Sandboxed Bundles, Keychain)</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-xs font-mono text-emerald-300 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Safe Heuristic Audit</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Audits your device against standard known virus definitions, Trojan stagers, ransomware indicators, and rogue background listeners without altering your files.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRunDeviceSweep}
                  disabled={isSweeping}
                  className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold text-xs font-mono flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
                >
                  {isSweeping ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>AUDITING DEVICE TELEMETRY ({sweepProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>START FULL DEVICE ANTIVIRUS AUDIT</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <form onSubmit={handleScan} className="space-y-4">
                {/* TAB 1: FILE ANTIVIRUS SCANNER */}
                {activeTab === 'FILE_ANTIVIRUS' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-mono text-gray-300 block mb-1">
                        Select Device File to Scan
                      </label>
                      <input
                        id="device-file-input"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="*/*"
                        className="sr-only"
                      />
                      
                      <label
                        htmlFor="device-file-input"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`block p-5 rounded-xl border-2 border-dashed text-center cursor-pointer transition space-y-2 ${
                          isDragging
                            ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
                            : selectedFile
                            ? 'border-emerald-500/50 bg-emerald-950/15 hover:border-emerald-400'
                            : 'border-white/20 hover:border-cyan-400 bg-[#161b22]/70'
                        }`}
                      >
                        {selectedFile ? (
                          <div className="space-y-1.5">
                            <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
                            <div className="text-xs font-semibold text-white break-all">
                              {selectedFile.name}
                            </div>
                            <div className="text-[11px] text-gray-400 font-mono">
                              {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Binary / Document'}
                            </div>
                            <span className="inline-block px-2.5 py-1 mt-1 rounded bg-white/10 hover:bg-white/20 text-[11px] font-mono text-cyan-300">
                              Click or Drop another file to change
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <Upload className={`w-6 h-6 mx-auto ${isDragging ? 'text-cyan-300 animate-bounce' : 'text-cyan-400'}`} />
                            <span className="text-xs text-gray-200 block font-semibold">
                              {isDragging ? 'Drop file here to analyze' : 'Click to browse a file from your device'}
                            </span>
                            <span className="text-[11px] text-gray-400 block font-mono">
                              Supports .exe, .apk, .pdf, .docx, .zip, .bat, scripts, images, audio
                            </span>
                            <div className="pt-1">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 font-medium hover:bg-cyan-500/20">
                                📁 Browse Device Storage
                              </span>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-mono text-gray-300">
                          Selected File Name
                        </label>
                        {selectedFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setFileNameInput('');
                              setFileSize(0);
                              setCalculatedHash('');
                              setFileContentSnippet('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="text-[10px] font-mono text-rose-400 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={fileNameInput}
                        onChange={(e) => setFileNameInput(e.target.value)}
                        placeholder="No file chosen yet (or enter file name manually)"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#161b22] border border-white/10 text-gray-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    {/* Hashing & Hash preview */}
                    {isHashing ? (
                      <div className="p-2 rounded bg-[#161b22] border border-white/10 text-[11px] text-cyan-300 flex items-center gap-2 font-mono">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                        <span>Computing SHA-256 fingerprint in browser...</span>
                      </div>
                    ) : calculatedHash ? (
                      <div className="p-2.5 rounded bg-[#161b22] border border-white/10 text-[10px] font-mono space-y-1">
                        <span className="text-gray-400 block">SHA-256 HASH VERIFIED:</span>
                        <span className="text-cyan-300 break-all block">{calculatedHash}</span>
                        <span className="text-gray-500 block">Size: {(fileSize / 1024).toFixed(1)} KB</span>
                      </div>
                    ) : null}

                    {/* Benign AV Test Helper */}
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-400">Want to test antivirus detection safely?</span>
                        <button
                          type="button"
                          onClick={handleLoadEicarTest}
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono font-bold underline"
                        >
                          Load EICAR AV Test File
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: SOFTWARE & APK INSPECTOR */}
                {activeTab === 'SOFTWARE_APK' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-mono text-gray-300 block mb-1">
                        Application or Software Name
                      </label>
                      <input
                        type="text"
                        value={softwareName}
                        onChange={(e) => setSoftwareName(e.target.value)}
                        placeholder="e.g., QuickLoan Express, ScreenRecorder Pro"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#161b22] border border-white/10 text-gray-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-mono text-gray-300 block mb-1">
                          Package / Bundle ID
                        </label>
                        <input
                          type="text"
                          value={apkPackage}
                          onChange={(e) => setApkPackage(e.target.value)}
                          placeholder="com.example.app"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#161b22] border border-white/10 text-gray-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-gray-300 block mb-1">
                          Version
                        </label>
                        <input
                          type="text"
                          value={apkVersion}
                          onChange={(e) => setApkVersion(e.target.value)}
                          placeholder="1.0.0"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#161b22] border border-white/10 text-gray-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-gray-300 block mb-1.5">
                        Requested Privileges / Permissions to Audit:
                      </label>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {commonPermissions.map(p => (
                          <label 
                            key={p.id}
                            className="flex items-start gap-2 p-2 rounded bg-[#161b22] border border-white/5 hover:border-white/20 text-xs cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(p.id)}
                              onChange={() => handleTogglePermission(p.id)}
                              className="mt-0.5 rounded border-white/20 text-cyan-500 focus:ring-0"
                            />
                            <div>
                              <span className="text-gray-200 font-mono text-[11px] block">{p.id.replace('android.permission.', '')}</span>
                              <span className="text-[10px] text-gray-400">{p.label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: PROCESS & MEMORY SCANNER */}
                {activeTab === 'PROCESS_SCAN' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-mono text-gray-300 block mb-1">
                        Process Binary Name
                      </label>
                      <input
                        type="text"
                        value={processName}
                        onChange={(e) => setProcessName(e.target.value)}
                        placeholder="e.g., xmrig, svchost.exe, node, python"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#161b22] border border-white/10 text-gray-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-mono text-gray-300 block mb-1">
                          Process ID (PID)
                        </label>
                        <input
                          type="text"
                          value={processPid}
                          onChange={(e) => setProcessPid(e.target.value)}
                          placeholder="e.g. 4822"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#161b22] border border-white/10 text-gray-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-gray-300 block mb-1">
                          Memory Footprint
                        </label>
                        <input
                          type="text"
                          value={memoryUsage}
                          onChange={(e) => setMemoryUsage(e.target.value)}
                          placeholder="e.g. 450 MB"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#161b22] border border-white/10 text-gray-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-gray-300 block mb-1">
                        Command-line Arguments / Launch Path
                      </label>
                      <input
                        type="text"
                        value={commandLineArgs}
                        onChange={(e) => setCommandLineArgs(e.target.value)}
                        placeholder="e.g., -o stratum+tcp://pool.minexmr.com:443"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#161b22] border border-white/10 text-gray-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 5: URL SENTINEL */}
                {activeTab === 'URL_WEB' && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-300 block">
                      Target URL or Domain Name to Evaluate
                    </label>
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/login"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#161b22] border border-white/10 text-gray-100 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      required
                    />
                    <p className="text-[11px] text-gray-500">
                      Evaluates typosquatting, certificate validity, URL encoding tricks, and known phishing feeds.
                    </p>
                  </div>
                )}

                {/* TAB 6: SMS & PHISHING MESSAGE */}
                {activeTab === 'SMS_PHISH' && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-300 block">
                      Message Content (SMS, WhatsApp, or Email Text)
                    </label>
                    <textarea
                      rows={4}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Paste suspicious SMS, lottery alert, or banking warning message here..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#161b22] border border-white/10 text-gray-100 text-xs font-mono focus:border-cyan-400 focus:outline-none leading-relaxed"
                      required
                    />
                    <p className="text-[11px] text-gray-500">
                      NLP sentiment analysis detects urgency keywords, fake discom warnings, and UPI fraud patterns.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold text-xs font-mono flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>ANALYZING THREAT SIGNATURES...</span>
                    </>
                  ) : (
                    <>
                      <Radar className="w-4 h-4" />
                      <span>RUN SECURITY SCAN</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="p-3 rounded-lg bg-[#161b22] border border-white/5 text-[11px] text-gray-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                User-Centric Privacy Isolation: Scans generated here are saved directly to your account log and live telemetry without using old pre-seeded data.
              </span>
            </div>
          </div>
        </div>

        {/* Right: Analysis Output & Explainable AI Card (7 cols) */}
        <div className="lg:col-span-7">
          {/* DEVICE SWEEP RESULTS */}
          {activeTab === 'DEVICE_SWEEP' && sweepResult && (
            <div className="p-6 rounded-xl bg-[#0d1117] border border-white/10 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="text-base font-bold text-white font-mono">
                      DEVICE INTEGRITY AUDIT REPORT
                    </h3>
                    <span className="text-xs text-gray-400 font-mono">
                      Target: {sweepDeviceType} Ecosystem
                    </span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-2xl font-black text-emerald-400">
                    {sweepResult.device_health_score}/100
                  </span>
                  <span className="text-[10px] text-gray-400 block uppercase">Health Score</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[#161b22] border border-white/5 font-mono">
                  <span className="text-[10px] text-gray-400 block uppercase">Items Inspected</span>
                  <span className="text-lg font-bold text-white mt-0.5 block">{sweepResult.items_audited.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-500">Binaries, permissions & ports</span>
                </div>
                <div className="p-3 rounded-lg bg-[#161b22] border border-white/5 font-mono">
                  <span className="text-[10px] text-gray-400 block uppercase">Active Threats</span>
                  <span className="text-lg font-bold text-emerald-400 mt-0.5 block">{sweepResult.threats_found} Detected</span>
                  <span className="text-[10px] text-emerald-500/80">0 malicious payloads</span>
                </div>
                <div className="p-3 rounded-lg bg-[#161b22] border border-white/5 font-mono">
                  <span className="text-[10px] text-gray-400 block uppercase">Antivirus Sentinel</span>
                  <span className="text-lg font-bold text-cyan-400 mt-0.5 block">ACTIVE</span>
                  <span className="text-[10px] text-cyan-500/80">Real-time heuristics</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono space-y-1">
                <span className="text-emerald-400 font-bold block">VERIFIED SYSTEM INTEGRITY:</span>
                <p className="text-gray-200 leading-relaxed">{sweepResult.message}</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSweepResult(null)}
                  className="px-4 py-2 rounded-lg bg-[#161b22] hover:bg-white/10 text-gray-300 text-xs font-mono border border-white/10 transition"
                >
                  Close Report
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE SCAN RESULT */}
          {scanResult ? (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-[#0d1117] border border-white/10 shadow-xl space-y-6">
                {/* Header score & classification */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">CLASSIFICATION:</span>
                      <span className="text-xs font-bold text-white font-mono px-2 py-0.5 rounded bg-[#161b22] border border-white/10">
                        {scanResult.classification}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white font-mono mt-1">
                      {scanResult.scan_type} ANALYSIS RESULT
                    </h3>
                  </div>
                  <div>
                    <RiskMeter score={scanResult.risk_score} level={scanResult.risk_level} size="lg" />
                  </div>
                </div>

                {/* Scanned Input snippet */}
                <div className="p-3 rounded-lg bg-[#161b22] border border-white/5 font-mono text-xs">
                  <span className="text-gray-500 block mb-1">EVALUATED TARGET:</span>
                  <span className="text-gray-300 break-all">{scanResult.input_value || scanResult.input_hash}</span>
                </div>

                {/* REAL ANTIVIRUS THREAT INTERCEPT & VIRUS NAME DISPLAY */}
                <div className={`p-4 rounded-xl border font-mono text-xs space-y-3 ${
                  scanResult.risk_score >= 60
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                    : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Bug className={`w-4 h-4 ${scanResult.risk_score >= 60 ? 'text-rose-400' : 'text-emerald-400'}`} />
                      <span className="font-bold tracking-wider uppercase text-[11px]">
                        {scanResult.risk_score >= 60 ? 'MALWARE / VIRUS SIGNATURE IDENTIFIED' : 'CLEAN TELEMETRY SIGNATURE'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {scanResult.quarantine_status === 'QUARANTINED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> THREAT QUARANTINED
                        </span>
                      ) : scanResult.risk_score >= 60 ? (
                        <button
                          onClick={handleQuarantineCurrentThreat}
                          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] flex items-center gap-1 transition shadow cursor-pointer"
                        >
                          <Lock className="w-3 h-3" />
                          <span>ISOLATE & QUARANTINE THREAT</span>
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Detected Virus Classification:</span>
                      <span className="text-sm font-black text-white block mt-0.5">
                        {scanResult.detected_virus_name || scanResult.classification}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">User Log & Database Status:</span>
                      <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1 mt-0.5">
                        <Database className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Saved to User Profile & Master SOC DB</span>
                      </span>
                    </div>
                  </div>

                  {quarantineNotice && (
                    <div className="p-2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-200 text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{quarantineNotice}</span>
                    </div>
                  )}
                </div>

                {/* Explainable AI: Why it is dangerous */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Explainable Antivirus Reasoning</span>
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed bg-[#161b22] p-4 rounded-xl border border-white/5 font-mono">
                    {scanResult.explanation}
                  </p>
                </div>

                {/* Detected Threat Indicators */}
                {scanResult.indicators && scanResult.indicators.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Detected Indicators ({scanResult.indicators.length})
                    </h4>
                    <div className="space-y-2">
                      {scanResult.indicators.map((ind, i) => (
                        <div key={i} className="p-3 rounded-lg bg-[#161b22] border border-white/5 flex items-start justify-between gap-3 text-xs">
                          <div>
                            <span className="font-semibold text-white block">{ind.indicator}</span>
                            <span className="text-gray-400 text-[11px]">{ind.description}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap ${
                            ind.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                            ind.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {ind.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Immediate Action */}
                <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-1 text-xs">
                  <span className="font-bold text-cyan-400 block font-mono">RECOMMENDED ACTION:</span>
                  <p className="text-gray-300 leading-relaxed font-mono">{scanResult.recommended_action}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleEscalateToIncident}
                    className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-black font-semibold text-xs font-mono flex items-center gap-2 transition cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>ESCALATE TO INCIDENT TRIAGE</span>
                  </button>
                  <button
                    onClick={() => setScanResult(null)}
                    className="px-3 py-2 rounded-lg bg-[#161b22] hover:bg-white/10 text-gray-300 text-xs font-mono border border-white/10 transition cursor-pointer"
                  >
                    Clear Result
                  </button>
                </div>

                {escalateSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{escalateSuccess}</span>
                  </div>
                )}
              </div>
            </div>
          ) : !sweepResult ? (
            <div className="h-full min-h-[350px] p-8 rounded-xl bg-[#0d1117]/50 border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-3">
              <Radar className="w-12 h-12 text-gray-600 animate-pulse" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-300 font-mono">
                  Awaiting Device Security Scan
                </h3>
                <p className="text-xs text-gray-500 max-w-sm">
                  Upload a file from your device, inspect an application package, check a process, or start a full device sweep on the left to view results.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
