# Kavach Vaani – Technical Architecture Specification

---

## 1. High-Level System Architecture
Kavach Vaani is designed as an empathetic, voice-native welfare access platform for India's 450M+ informal and gig workers.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        User (Mobile / Web Client)                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Kavach Vaani Web Client (React 19)                   │
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. Multilingual Audio Engine      │ 2. Statutory Welfare Rules Engine  │
│    - W3C Web Speech API           │    - PM SVANidhi (₹15k/₹25k/₹50k)  │
│    - Voice Mutual Exclusion Lock  │    - 7% Interest Subsidy Rules     │
│    - Offline Asset Player         │    - CoV & LoR Document Check      │
│    - Missing Voice Pack Detector  │    - Section 18(3) Rights Rules    │
├───────────────────────────────────┼────────────────────────────────────┤
│ 3. Privacy & Consent Layer        │ 4. Indic Document Engine           │
│    - Purpose-Bound Consent Gate   │    - High-DPI Canvas Rendering     │
│    - Data Minimization (Last 4)   │    - Native Unicode Font Fallback  │
│    - Immediate Volatile Purge     │    - Official Citizen Slip PDF     │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 2. Key Architectural Decisions (ADRs)
1. **Zero Secret Keys Out-of-the-Box:** To eliminate evaluation hurdles and recurring subscription costs for public welfare kiosks, the core platform relies entirely on standard W3C Web Speech standards, local deterministic scheme rules, and offline assets.
2. **Mutual Exclusion Audio Protocol:** To prevent acoustic reverberation where the device microphone transcribes the assistant's own speaker output, `VoiceEngine` forces mutual exclusion between speech recognition and audio playback.
3. **Canvas-Based Indic PDF Generation:** Standard PDF libraries rely on 14 Latin-1 fonts (Helvetica/Times) which irreversibly corrupt Indic scripts. Kavach Vaani rasterizes the applicant record via high-DPI canvas drawing using system fonts (`Nirmala UI`, `Noto Sans`) before packaging as an A4 PDF document.
