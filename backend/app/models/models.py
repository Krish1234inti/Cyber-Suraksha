# Cyber Suraksha - SQLAlchemy ORM Models
# Supporting PostgreSQL (with JSONB) and MySQL (adaptable JSON)

from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(32), default="USER")
    security_score = Column(Integer, default=80)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    scans = relationship("ThreatScan", back_populates="user")
    incidents = relationship("Incident", back_populates="user")
    reports = relationship("Report", back_populates="user")


class ThreatScan(Base):
    __tablename__ = "threat_scans"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    scan_type = Column(String(32), nullable=False)  # URL, MESSAGE, FILE, APPLICATION
    input_value = Column(Text, nullable=True)
    input_hash = Column(String(64), nullable=False, index=True)
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(String(32), nullable=False)  # SAFE, SUSPICIOUS, HIGH, CRITICAL
    classification = Column(String(128), nullable=False)
    explanation = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    scan_metadata = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="scans")
    indicators = relationship("ThreatIndicator", back_populates="scan", cascade="all, delete-orphan")


class ThreatIndicator(Base):
    __tablename__ = "threat_indicators"

    id = Column(String(64), primary_key=True, index=True)
    scan_id = Column(String(64), ForeignKey("threat_scans.id"), nullable=False)
    indicator_type = Column(String(32), nullable=False)  # URL, DOMAIN, IP, HASH, KEYWORD, BEHAVIOR, PERMISSION
    indicator = Column(Text, nullable=False)
    severity = Column(String(32), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    scan = relationship("ThreatScan", back_populates="indicators")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    threat_scan_id = Column(String(64), ForeignKey("threat_scans.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    risk_level = Column(String(32), nullable=False)
    status = Column(String(32), default="DETECTED")  # DETECTED, INVESTIGATING, CONTAINED, RESOLVED
    assigned_to = Column(String(128), nullable=True)
    timeline = Column(JSON, default=list)
    recommended_actions = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="incidents")


class ThreatIntelligence(Base):
    __tablename__ = "threat_intelligence"

    id = Column(String(64), primary_key=True, index=True)
    indicator_type = Column(String(32), nullable=False)  # DOMAIN, URL, HASH, IP, PATTERN
    indicator_value = Column(Text, nullable=False, index=True)
    reputation = Column(String(32), nullable=False)  # BENIGN, SUSPICIOUS, MALICIOUS
    confidence = Column(Integer, nullable=False)
    source = Column(String(255), nullable=False)
    category = Column(String(128), nullable=False)
    campaign = Column(String(255), nullable=True)
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow)


class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    event_type = Column(String(64), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(32), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)


class SecurityScore(Base):
    __tablename__ = "security_scores"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=False)
    password_safety = Column(Integer, default=85)
    device_security = Column(Integer, default=80)
    link_safety = Column(Integer, default=75)
    application_safety = Column(Integer, default=90)
    threat_awareness = Column(Integer, default=85)
    update_hygiene = Column(Integer, default=85)
    recommendations = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)


class CyberLabModule(Base):
    __tablename__ = "cyberlab_modules"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(32), nullable=False)  # BEGINNER, INTERMEDIATE, ADVANCED
    category = Column(String(64), nullable=False)
    xp = Column(Integer, default=100)
    estimated_time = Column(String(32), default="15 mins")
    objectives = Column(JSON, default=list)
    tasks = Column(JSON, default=list)
    badge = Column(String(128), nullable=True)


class CyberLabProgress(Base):
    __tablename__ = "cyberlab_progress"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    module_id = Column(String(64), ForeignKey("cyberlab_modules.id"), nullable=False)
    progress = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    xp_earned = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    report_type = Column(String(64), nullable=False)  # THREAT_ANALYSIS, INCIDENT, SECURITY_HEALTH, MONTHLY_SECURITY
    title = Column(String(255), nullable=False)
    data = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reports")
