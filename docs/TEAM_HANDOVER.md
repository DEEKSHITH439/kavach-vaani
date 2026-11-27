# KAVACH VAANI (कवच वाणी) — TEAM HANDOVER & AI AGENT CONTEXT BRIEF

**Target Hackathon:** Build for Bharat (Round 2 Prototype Deadline: Nov 30, 2026, 11:59 PM)  
**Primary Repository:** `https://github.com/DEEKSHITH439/kavach-vaani`  
**Live Production URL:** `https://kavach-vaani.vercel.app/`  
**Working Mode:** Client-side Zero-Key Simulation (No secret API keys needed for evaluation)

---

## 1. Executive Summary & Objective

**Kavach Vaani** is an empathetic, voice-native welfare access and anti-extortion companion for India's 450M+ informal and gig economy workers (street vendors, construction laborers, gig drivers).

It bridges the severe digital-literacy and language barriers for unorganized workers by providing:
1. **Vernacular Voice Guidance:** Real-time voice interaction in 5 languages (English, Kannada, Hindi, Tamil, Bengali).
2. **Statutory Financial Schemes:** Accurate, legal-grade eligibility matching for PM SVANidhi (street vendors), PM-JAY (Ayushman Bharat), e-Shram, and BOCW Board welfare.
3. **Statutory Anti-Extortion & Rights Card:** Generates verifiable, audio-backed statutory rights under Section 18(3) of the Street Vendors Act, 2014, protecting vendors against unlawful spot evictions.
4. **Indic PDF Generation:** Client-side high-DPI canvas-rendered PDF summaries that render Indic scripts without font glyph corruption.

---

## 2. Technical Stack & Repository Architecture

- **Framework:** React 19 + TypeScript + Vite + Tailwind CSS 3.4.17
- **Icons & UI:** Lucide React, Canvas Confetti
- **Document Generation:** jsPDF with an off-screen HTML5 Canvas rasterization engine (`Nirmala UI` / Unicode system font stack)
- **Deployment:** Vercel SPA (`vercel.json` rewrites), Docker (`Dockerfile` multi-stage Node 18 + Nginx alpine, `docker-compose.yml` on port 3000)

### Key Files in `src/`:
- `src/App.tsx`: Main user journey (5-step pipeline: Speak Need ➔ Scheme Match ➔ DPDP Consent Gate ➔ Minimal Details ➔ Audio Rights Card).
- `src/lib/voiceEngine.ts`: Full duplex W3C SpeechRecognition (STT) + SpeechSynthesis (TTS) + HTML5 Audio fallback with acoustic echo cancellation (halts recognition before playback with 400ms buffer).
- `src/lib/schemeRules.ts`: Hardened, legally vetted financial scheme rules and statutory rights cards.
- `src/lib/documentGenerator.ts`: Indic-compatible PDF generation engine.
- `src/types.ts`: TypeScript contracts for schemes, voice states, language dialects, and user inputs.

---

## 3. Critical Statutory & Legal Ground Truths (DO NOT BREAK)

Any incoming developer or AI assistant working on this codebase **must strictly preserve** these verified legal and financial rules:

1. **PM SVANidhi Progressive Loan Tranches:**
   - **1st Tranche:** Up to ₹15,000 (collateral-free working capital).
   - **2nd Tranche:** Up to ₹25,000 (subject to timely repayment of 1st loan and lender assessment).
   - **3rd Tranche:** Up to ₹50,000 (subject to timely repayment of 2nd loan and lender assessment).
   - *Never claim loans are automatic or guaranteed.*
2. **7% Interest Subsidy:**
   - Codified strictly as an **interest subsidy for timely repayment**, NOT a loan waiver or cash grant.
3. **Eligibility Documents:**
   - Certificate of Vending (CoV) or Letter of Recommendation (LoR) issued by the Urban Local Body (ULB).
4. **Street Vendors Act 2014, Section 18(3):**
   - A street vendor cannot be relocated or evicted by the local authority from the place specified in their Certificate of Vending unless given **30 days' notice** in the prescribed manner.
   - *Never claim this provides blanket immunity from general law enforcement or penal code violations.*
5. **Privacy & Data Protection (DPDP Act 2023):**
   - The application has an explicit Purpose Specification Consent step before any data input.
   - Collects minimal details only (strictly last 4 digits of Aadhaar/Bank, zero full PII stored or transmitted).

---

## 4. Multilingual & Script Guidelines

The repository contains complete spoken script documentation in `docs/scripts/`:
- `docs/scripts/ENGLISH_MASTER.md`: Approved reference baseline.
- `docs/scripts/KANNADA.md`, `HINDI.md`, `TAMIL.md`, `BENGALI.md`: Complete scripts.
- *Status:* Marked `PENDING NATIVE-SPEAKER REVIEW`. Do NOT claim native speaker certification until physically verified by a native speaker.

---

## 5. Development & Contribution Rules for Teammate AI

When working on this repository:
1. **Pull Latest Changes First:**
   ```bash
   git pull origin main
   ```
2. **Run and Test Locally:**
   ```bash
   npm install
   npm run build
   npm run preview -- --port 3000
   ```
3. **Zero Secret Keys:**
   - Keep the app fully functional out-of-the-box in simulated/zero-key mode.
   - Do not make the app crash or fail if third-party API keys (e.g., Sarvam, ElevenLabs, OpenAI) are absent.
4. **Branches & Pull Requests:**
   - Create a feature branch (`git checkout -b feature/your-feature-name`), make atomic commits, and push to GitHub.
   - Do not force-push (`git push --force`) to `main`.
5. **Preserve Documentation:**
   - Update `docs/` and `pitch-deck/` if changing any architecture, schemes, or flows.
