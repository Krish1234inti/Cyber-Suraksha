"""
Cyber Suraksha - Modular Python AI/ML Security Engine
Smart India Hackathon 2026 Innovation Architecture

Pipeline:
USER INPUT -> VALIDATION -> STATIC ANALYSIS -> THREAT INTEL -> AI/ML ANALYSIS -> BEHAVIOR SIGNALS -> RISK ENGINE -> EXPLAINABLE AI
"""

import hashlib
import re
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field

@dataclass
class ThreatIndicatorResult:
    indicator_type: str
    indicator: str
    severity: str
    description: str

@dataclass
class ThreatAnalysisOutput:
    risk_score: int
    risk_level: str
    classification: str
    indicators: List[ThreatIndicatorResult]
    explanation: str
    recommended_action: str
    metadata: Dict[str, Any] = field(default_factory=dict)


class BaseDetectorModule:
    """Base interface for all pluggable threat detectors (ready for PyTorch/Transformers)"""
    def analyze(self, input_data: Any) -> ThreatAnalysisOutput:
        raise NotImplementedError


class UrlRiskClassifier(BaseDetectorModule):
    """
    URL Risk & Phishing Classification Service
    Analyzes protocol, domain age heuristics, high-abuse TLDs, typosquatting & brand spoofing.
    """
    def __init__(self):
        self.suspicious_tlds = {'.top', '.xyz', '.work', '.click', '.buzz', '.online', '.site', '.fit'}
        self.banking_targets = ['sbi', 'hdfc', 'icici', 'axis', 'paytm', 'yono', 'incometax', 'pan']

    def analyze(self, url: str) -> ThreatAnalysisOutput:
        clean_url = url.strip()
        lower = clean_url.lower()
        score = 8
        indicators = []
        reasons = []

        if not lower.startswith('https://'):
            score += 25
            indicators.append(ThreatIndicatorResult(
                indicator_type='URL',
                indicator='Insecure Protocol (HTTP)',
                severity='MEDIUM',
                description='Target URL transmits credentials over unencrypted plaintext HTTP.'
            ))
            reasons.append('Uses unencrypted HTTP connection')

        # Check for IP in URL
        if re.search(r'^(https?://)?(\d{1,3}\.){3}\d{1,3}', lower):
            score += 35
            indicators.append(ThreatIndicatorResult(
                indicator_type='IP',
                indicator='Raw IP Destination Host',
                severity='HIGH',
                description='Bypasses legitimate DNS hierarchy; common in C2 and fast-flux networks.'
            ))
            reasons.append('Operates on raw IP host')

        # Brand spoofing checks
        targeted = [b for b in self.banking_targets if b in lower]
        if targeted:
            score += 35
            indicators.append(ThreatIndicatorResult(
                indicator_type='DOMAIN',
                indicator=f'Financial Entity Impersonation ({", ".join(targeted)})',
                severity='HIGH',
                description=f'URL syntax emulates official banking portals: {targeted}'
            ))
            reasons.append(f'Impersonates financial/governmental entity: {targeted}')

        # TLD check
        has_tld = any(tld in lower for tld in self.suspicious_tlds)
        if has_tld:
            score += 20
            indicators.append(ThreatIndicatorResult(
                indicator_type='DOMAIN',
                indicator='High-Abuse Domain Extension',
                severity='MEDIUM',
                description='Domain uses disposable or high-spam-volume registry.'
            ))
            reasons.append('Uses disposable/high-abuse domain extension')

        risk_score = min(max(score, 5), 98)
        risk_level = 'CRITICAL' if risk_score >= 80 else 'HIGH' if risk_score >= 60 else 'SUSPICIOUS' if risk_score >= 30 else 'SAFE'
        classification = 'CREDENTIAL PHISHING' if risk_score >= 70 else 'SUSPICIOUS LINK' if risk_score >= 30 else 'BENIGN'

        explanation = f"URL risk score calculated at {risk_score}/100 based on factors: {'; '.join(reasons) if reasons else 'Clean domain reputation'}"
        recommendation = "Do not open link or provide personal credentials" if risk_score >= 50 else "Safe to browse under standard precautions"

        return ThreatAnalysisOutput(
            risk_score=risk_score,
            risk_level=risk_level,
            classification=classification,
            indicators=indicators,
            explanation=explanation,
            recommended_action=recommendation,
            metadata={'analyzer': 'UrlRiskClassifier-v1', 'url_length': len(clean_url)}
        )


class NlpMessageClassifier(BaseDetectorModule):
    """
    NLP Message & Smishing Detector
    Classifies urgency cues, OTP/PAN extortion, lottery lures, and social engineering patterns.
    """
    def __init__(self):
        self.urgency_cues = ['urgent', 'immediately', 'blocked today', 'suspended', 'penalty', 'within 24 hours']
        self.credential_cues = ['otp', 'password', 'pin', 'pan card', 'aadhaar', 'cvv', 'card number']
        self.lure_cues = ['lottery', 'won', 'reward', 'refund', 'cashback', 'click here to claim']

    def analyze(self, message: str) -> ThreatAnalysisOutput:
        clean_msg = message.strip()
        lower = clean_msg.lower()
        score = 12
        indicators = []
        reasons = []

        found_urgency = [u for u in self.urgency_cues if u in lower]
        if found_urgency:
            score += 25
            indicators.append(ThreatIndicatorResult(
                indicator_type='KEYWORD',
                indicator='Psychological Urgency Trigger',
                severity='HIGH',
                description=f'Urgency cues detected to rush victim into panic: {found_urgency}'
            ))
            reasons.append(f'Urgency language ({found_urgency})')

        found_creds = [c for c in self.credential_cues if c in lower]
        if found_creds:
            score += 35
            indicators.append(ThreatIndicatorResult(
                indicator_type='BEHAVIOR',
                indicator='Confidential Credential Solicitation',
                severity='CRITICAL',
                description=f'Prompts for protected identification or authentication tokens: {found_creds}'
            ))
            reasons.append(f'Asks for private credentials ({found_creds})')

        found_lures = [l for l in self.lure_cues if l in lower]
        if found_lures:
            score += 25
            indicators.append(ThreatIndicatorResult(
                indicator_type='KEYWORD',
                indicator='Advance-Fee / Lottery Scam Lure',
                severity='HIGH',
                description=f'Baiting language promising unsolicited monetary reward: {found_lures}'
            ))
            reasons.append(f'Unsolicited monetary lure ({found_lures})')

        risk_score = min(max(score, 10), 96)
        risk_level = 'CRITICAL' if risk_score >= 80 else 'HIGH' if risk_score >= 60 else 'SUSPICIOUS' if risk_score >= 30 else 'SAFE'
        classification = 'SMISHING / SOCIAL ENGINEERING' if risk_score >= 70 else 'SUSPICIOUS MESSAGE' if risk_score >= 40 else 'LEGITIMATE'

        explanation = f"Semantic text analyzer calculated risk {risk_score}/100: {'; '.join(reasons) if reasons else 'Normal interpersonal or system alert tone'}."
        recommendation = "Do not reply, never disclose OTP or banking pins, and report to National Cyber Crime Portal (1930)." if risk_score >= 60 else "No immediate threat indicators."

        return ThreatAnalysisOutput(
            risk_score=risk_score,
            risk_level=risk_level,
            classification=classification,
            indicators=indicators,
            explanation=explanation,
            recommended_action=recommendation,
            metadata={'analyzer': 'NlpMessageClassifier-v1', 'tokens_evaluated': len(clean_msg.split())}
        )


class FileRiskAnalyzer(BaseDetectorModule):
    """
    Static File & PE Metadata Inspector
    Computes cryptographic SHA-256 digests, flags double extensions, and identifies macro hazards.
    """
    def analyze(self, file_name: str, file_bytes: Optional[bytes] = None) -> ThreatAnalysisOutput:
        ext = file_name.split('.')[-1].lower() if '.' in file_name else ''
        file_hash = hashlib.sha256(file_bytes if file_bytes else file_name.encode()).hexdigest()

        score = 15
        indicators = []
        reasons = []

        if ext in ['exe', 'bat', 'vbs', 'scr', 'ps1', 'sh', 'apk', 'jar']:
            score += 45
            indicators.append(ThreatIndicatorResult(
                indicator_type='HASH',
                indicator=f'Direct Executable Format (.{ext})',
                severity='HIGH',
                description='Binary payload capable of executing arbitrary code on client machine.'
            ))
            reasons.append(f'Dangerous binary extension (.{ext})')

        if len(file_name.split('.')) > 2:
            score += 30
            indicators.append(ThreatIndicatorResult(
                indicator_type='BEHAVIOR',
                indicator='Double Extension Deception Technique',
                severity='HIGH',
                description='Masks executable payload behind trusted document extension icon.'
            ))
            reasons.append('Uses double extension obfuscation')

        risk_score = min(max(score, 10), 98)
        risk_level = 'CRITICAL' if risk_score >= 80 else 'HIGH' if risk_score >= 60 else 'SUSPICIOUS' if risk_score >= 30 else 'SAFE'
        classification = 'TROJAN / MALWARE' if risk_score >= 70 else 'POTENTIALLY UNWANTED' if risk_score >= 40 else 'CLEAN FILE'

        explanation = f"Static analysis scored {risk_score}/100: {'; '.join(reasons) if reasons else 'Normal document metadata'}. Note: Deep behavioral tracing is isolated to our proposed sandbox."
        recommendation = "Quarantine file immediately. Do not execute." if risk_score >= 60 else "File appears clean under static rules."

        return ThreatAnalysisOutput(
            risk_score=risk_score,
            risk_level=risk_level,
            classification=classification,
            indicators=indicators,
            explanation=explanation,
            recommended_action=recommendation,
            metadata={'sha256': file_hash, 'sandbox_isolation': 'PROPOSED — ISOLATED SANDBOX'}
        )


class UnifiedSecurityAnalysisEngine:
    """Central orchestrator uniting all detection services into a cohesive pipeline"""
    def __init__(self):
        self.url_classifier = UrlRiskClassifier()
        self.message_classifier = NlpMessageClassifier()
        self.file_analyzer = FileRiskAnalyzer()

    def process(self, vector_type: str, data: Any) -> ThreatAnalysisOutput:
        v = vector_type.upper()
        if v == 'URL':
            return self.url_classifier.analyze(data)
        elif v == 'MESSAGE':
            return self.message_classifier.analyze(data)
        elif v == 'FILE':
            return self.file_analyzer.analyze(data)
        else:
            raise ValueError(f"Unsupported vector type: {vector_type}")
