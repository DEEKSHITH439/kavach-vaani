# Kavach Vaani – Security Audit Report

**Auditor:** Senior Security Lead & Technical Auditor  
**Date:** 27 November 2026  
**Status:** COMPLETED  

---

## 1. Secrets & Credentials Inspection
- **Frontend Code Inspection:** Inspected `src/App.tsx`, `src/lib/*`, and all React components. Zero hardcoded secrets, database passwords, or operational private keys exist.
- **Environment Variables:** Application operates 100% out of the box with zero secret keys required. An optional client-side modal allows evaluator experimentation without persistent storage.
- **Git Repository:** Clean git history, zero `.env` files tracked, `.gitignore` correctly ignores credentials and node modules.

---

## 2. Input Validation & Injection Risks
- **Cross-Site Scripting (XSS):** React JSX default HTML escaping prevents DOM injection.
- **jsPDF Injection / Corrupted Font Streams:** Replaced standard ASCII Helvetica string injection with off-screen Canvas rasterization (`documentGenerator.ts`). User input is drawn via canvas 2D primitives (`fillText`), completely neutralizing PostScript font stream exploits.
- **Numerical Sanitization:** Numerical inputs for Aadhaar and bank identifiers are sanitized via `answer.replace(/\D/g, '')`.

---

## 3. Data Minimization & Storage Risks
- **No Full Aadhaar Collection:** Full 12-digit Aadhaar numbers are never collected, logged, or saved. The system restricts input strictly to `aadhaarLast4`.
- **No Full Bank Numbers:** Restricts capture to `bankAccountLast4`.
- **Zero Local/Session Persistence:** Personal data is strictly held in volatile React component state and is never written to `localStorage`, `sessionStorage`, or IndexedDB.
- **Immediate Data Purge:** The `handleReset()` function resets all fields to empty strings upon user action.

---

## 4. Audio & Microphone Security
- **Explicit User Interaction Gate:** Microphone input is never triggered automatically without the user actively tapping the microphone.
- **Mutual Exclusion Lock:** `VoiceEngine` prevents the microphone from listening while audio is being played back, avoiding acoustic self-triggering loops.
- **Zero Audio Retention:** The application does not store audio buffers on disk or transmit audio to third-party endpoints.
