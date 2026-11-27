# Kavach Vaani – Project Baseline Audit

**Auditor:** Senior CTO & Technical Supervisor  
**Date:** 27 November 2026  
**Local Repository:** `C:\Users\DEEKSHITH K B\kavach-vaani`  

---

## 1. Architecture Overview
Kavach Vaani is built as a single-page, mobile-first client application using modern frontend technologies. It is containerized via a multi-stage Docker build served through Nginx.

```
Client (React 19 / TypeScript / Vite / Tailwind CSS)
 │
 ├── Voice Engine (W3C SpeechRecognition & SpeechSynthesis + HTML5 Audio fallback)
 ├── Scheme Knowledge & Rules Engine (PM SVANidhi, e-Shram, PM-JAY, BOCW)
 ├── Conversational State Controller (App.tsx - multi-stage progression)
 ├── High-DPI Indic Canvas PDF Generator (documentGenerator.ts)
 └── UI Presentation Layer (LanguageSelector, VoiceVisualizer, SchemeCard, AudioRightsCard)
```

---

## 2. Technology Stack
- **Runtime & Build:** Node.js (ESM), Vite 8.4.0, TypeScript 7.0.2
- **UI Framework:** React 19.3.1, React-DOM 19.3.1
- **Styling:** Tailwind CSS 3.4.17, PostCSS 8.5.33, Autoprefixer 10.7.0
- **Icons & Effects:** Lucide React 1.81.0, Canvas Confetti 1.9.4
- **Document Generation:** jsPDF 4.2.1 with High-DPI HTML5 Canvas rasterization
- **Containerization:** Dockerfile (Node 18 Alpine builder + Nginx Alpine runner), docker-compose.yml

---

## 3. Existing Functionality
1. **Interactive Multilingual Dialect Switcher:** English, Kannada, Hindi, Tamil, Bengali with BCP-47 mapping.
2. **Speech Recognition (STT):** Continuous speech recognition via Web Speech API with interim and final transcript streaming.
3. **Mutual-Exclusion Audio Controller:** VoiceEngine ensures microphone is stopped before any speech/audio begins, with 400ms safe guard buffer.
4. **Offline Bundled Audio Architecture:** Checks `/audio/{lang}/{scenario}.mp3` with clean fallback to native system voices.
5. **Scheme Knowledge Base:** Structured criteria for PM SVANidhi, e-Shram, PM-JAY, and BOCW.
6. **High-Fidelity Indic PDF Generator:** Uses system Unicode font rendering (Nirmala UI / Noto Sans) onto an off-screen canvas to guarantee zero garbled text for Kannada and Devanagari.
7. **Privacy Minimization:** Restricts storage to last-4 digits for Aadhaar and bank accounts, and provides full in-memory purge on reset.

---

## 4. Missing Functionality & Gaps Identified
1. **Language Content Inconsistencies:** Current `schemeRules.ts` still references uncorrected loan tranche values (₹20,000 flat) instead of the restructured progressive tranches (₹15,000 / ₹25,000 / ₹50,000).
2. **Missing Consent Step:** The current conversational flow transitions directly from scheme match to asking for citizen name without an explicit purpose disclosure and consent check.
3. **Absence of CoV & LoR Guidance:** The interview questions do not guide vendors on Certificate of Vending or Letter of Recommendation.
4. **Documentation Gaps:** Dedicated script documentation files (`docs/scripts/*.md`) and technical architecture specs (`docs/architecture/*.md`) need formal baseline creation.

---

## 5. Technical, Security & Dependency Risks
- **Audio Availability on Desktop OS:** Windows machines lacking Indian voice packs cannot synthesize Kannada or Tamil via browser TTS; authentic bundled recordings or clear warning states are required.
- **Client-Side Data Retention:** All state is held in memory and volatile; user refresh clears data, but an explicit reset button is provided.
- **Zero Secrets Rule:** Application requires zero secret API keys out-of-the-box, ensuring zero key leakage risk.

---

## 6. Recommended Implementation Order
1. **Phase B:** Author formal multilingual script documentation (`docs/scripts/`).
2. **Phase C:** Refactor `src/lib/schemeRules.ts` with accurate financial tranches, interest subsidy conditions, CoV/LoR rules, and source verification metadata.
3. **Phase D & E:** Implement conversational step progression with explicit consent check and CoV/LoR guidance in `src/App.tsx`.
4. **Phase F & G:** Enhance voice fallback status and UI accessibility.
5. **Phase H & I:** Execute privacy checks, build verification, and test documentation.
6. **Phase J, K & L:** Complete operational documentation and produce the final CTO completion report.
