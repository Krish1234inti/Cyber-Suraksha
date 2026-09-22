-- ==========================================================
-- CYBER SURAKSHA: Database Schema Definition
-- Compatible with PostgreSQL 14+ and adaptable to MySQL 8.0+
-- Smart India Hackathon (SIH) 2026 Innovation Project
-- ==========================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    security_score INTEGER DEFAULT 80,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. THREAT SCANS TABLE
CREATE TABLE IF NOT EXISTS threat_scans (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    scan_type VARCHAR(32) NOT NULL CHECK (scan_type IN ('URL', 'MESSAGE', 'FILE', 'APPLICATION')),
    input_value TEXT,
    input_hash VARCHAR(64) NOT NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level VARCHAR(32) NOT NULL CHECK (risk_level IN ('SAFE', 'SUSPICIOUS', 'HIGH', 'CRITICAL')),
    classification VARCHAR(128) NOT NULL,
    explanation TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. THREAT INDICATORS TABLE
CREATE TABLE IF NOT EXISTS threat_indicators (
    id VARCHAR(64) PRIMARY KEY,
    scan_id VARCHAR(64) REFERENCES threat_scans(id) ON DELETE CASCADE,
    indicator_type VARCHAR(32) NOT NULL CHECK (indicator_type IN ('URL', 'DOMAIN', 'IP', 'HASH', 'KEYWORD', 'BEHAVIOR', 'PERMISSION')),
    indicator TEXT NOT NULL,
    severity VARCHAR(32) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. INCIDENTS TABLE
CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    threat_scan_id VARCHAR(64) REFERENCES threat_scans(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    risk_level VARCHAR(32) NOT NULL CHECK (risk_level IN ('SAFE', 'SUSPICIOUS', 'HIGH', 'CRITICAL')),
    status VARCHAR(32) NOT NULL DEFAULT 'DETECTED' CHECK (status IN ('DETECTED', 'INVESTIGATING', 'CONTAINED', 'RESOLVED')),
    assigned_to VARCHAR(128),
    timeline JSONB DEFAULT '[]',
    recommended_actions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 5. THREAT INTELLIGENCE TABLE
CREATE TABLE IF NOT EXISTS threat_intelligence (
    id VARCHAR(64) PRIMARY KEY,
    indicator_type VARCHAR(32) NOT NULL CHECK (indicator_type IN ('DOMAIN', 'URL', 'HASH', 'IP', 'PATTERN')),
    indicator_value TEXT NOT NULL,
    reputation VARCHAR(32) NOT NULL CHECK (reputation IN ('BENIGN', 'SUSPICIOUS', 'MALICIOUS')),
    confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    source VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    campaign VARCHAR(255),
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SECURITY EVENTS TABLE
CREATE TABLE IF NOT EXISTS security_events (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(32) NOT NULL CHECK (severity IN ('INFO', 'LOW', 'MEDIUM', 'HIGH')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. SECURITY SCORES TABLE
CREATE TABLE IF NOT EXISTS security_scores (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    password_safety INTEGER DEFAULT 85,
    device_security INTEGER DEFAULT 80,
    link_safety INTEGER DEFAULT 75,
    application_safety INTEGER DEFAULT 90,
    threat_awareness INTEGER DEFAULT 85,
    update_hygiene INTEGER DEFAULT 85,
    recommendations JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. CYBERLAB MODULES TABLE
CREATE TABLE IF NOT EXISTS cyberlab_modules (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(32) NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    category VARCHAR(64) NOT NULL,
    xp INTEGER NOT NULL DEFAULT 100,
    estimated_time VARCHAR(32) DEFAULT '15 mins',
    objectives JSONB DEFAULT '[]',
    tasks JSONB DEFAULT '[]',
    badge VARCHAR(128)
);

-- 9. CYBERLAB PROGRESS TABLE
CREATE TABLE IF NOT EXISTS cyberlab_progress (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    module_id VARCHAR(64) REFERENCES cyberlab_modules(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed BOOLEAN DEFAULT FALSE,
    xp_earned INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    report_type VARCHAR(64) NOT NULL CHECK (report_type IN ('THREAT_ANALYSIS', 'INCIDENT', 'SECURITY_HEALTH', 'MONTHLY_SECURITY')),
    title VARCHAR(255) NOT NULL,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_threat_scans_user ON threat_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_threat_scans_hash ON threat_scans(input_hash);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_ti_indicator ON threat_intelligence(indicator_value);
