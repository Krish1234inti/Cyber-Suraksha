# Pydantic Schemas for Cyber Suraksha REST API

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# Authentication
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirm_password: Optional[str] = None

class UserLogin(BaseModel):

    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str

    name: str
    email: str
    role: str
    security_score: int
    created_at: Any
    updated_at: Any

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    user: UserResponse

# Threat Scans
class UrlScanRequest(BaseModel):
    url: str

class MessageScanRequest(BaseModel):
    message: str
    channel: Optional[str] = "SMS"

class ApplicationScanRequest(BaseModel):
    package_name: str
    version: Optional[str] = "1.0.0"
    permissions: Optional[List[str]] = []

class ThreatIndicatorOut(BaseModel):
    id: str
    indicator_type: str
    indicator: str
    severity: str
    description: str

class ThreatScanResponse(BaseModel):
    id: str
    user_id: Optional[str]
    scan_type: str
    input_value: Optional[str]
    input_hash: str
    risk_score: int
    risk_level: str
    classification: str
    explanation: str
    recommended_action: str
    indicators: List[ThreatIndicatorOut] = []
    metadata: Optional[Dict[str, Any]] = {}
    created_at: Any

# Incidents
class IncidentCreate(BaseModel):
    title: str
    description: str
    risk_level: str
    threat_scan_id: Optional[str] = None

class IncidentResolve(BaseModel):
    notes: Optional[str] = None

class IncidentResponse(BaseModel):
    id: str
    title: str
    description: str
    risk_level: str
    status: str
    timeline: List[Dict[str, Any]]
    recommended_actions: List[str]
    created_at: Any
    resolved_at: Optional[Any] = None

# Terminal & CyberLab
class TerminalExecuteRequest(BaseModel):
    command: str
    context: Optional[Dict[str, Any]] = None

class TerminalExecuteResponse(BaseModel):
    output: str
    exitCode: int
    currentDir: str
    hint: Optional[str] = None
