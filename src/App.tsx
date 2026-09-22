import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SIHDemoModal } from './components/common/SIHDemoModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { ThreatIntelPage } from './pages/ThreatIntelPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { IncidentDetailPage } from './pages/IncidentDetailPage';
import { SecurityScorePage } from './pages/SecurityScorePage';
import { CyberLabPage } from './pages/CyberLabPage';
import { CyberLabTerminalPage } from './pages/CyberLabTerminalPage';
import { ReportsPage } from './pages/ReportsPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';
import { SettingsPage } from './pages/SettingsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AntivirusPricingPage } from './pages/AntivirusPricingPage';
import { MasterDatabaseAdminPage } from './pages/MasterDatabaseAdminPage';

export default function App() {
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#050608] text-gray-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/scanner" element={<ScannerPage />} />
              <Route path="/url-checker" element={<Navigate to="/scanner" replace />} />
              <Route path="/message-analyzer" element={<Navigate to="/scanner" replace />} />
              <Route path="/file-analyzer" element={<Navigate to="/scanner" replace />} />
              <Route path="/antivirus" element={<AntivirusPricingPage />} />
              <Route path="/pricing" element={<AntivirusPricingPage />} />
              <Route path="/user/profile" element={<UserProfilePage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/admin/database" element={<MasterDatabaseAdminPage />} />
              <Route path="/database-admin" element={<MasterDatabaseAdminPage />} />
              <Route path="/threat-intelligence" element={<ThreatIntelPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/incidents/:id" element={<IncidentDetailPage />} />
              <Route path="/security-score" element={<SecurityScorePage />} />
              <Route path="/cyberlab" element={<CyberLabPage />} />
              <Route path="/cyberlab/:id" element={<CyberLabTerminalPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          {/* SIH Judging Guided Walkthrough Modal */}
          <SIHDemoModal
            isOpen={showDemoModal}
            onClose={() => setShowDemoModal(false)}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}
