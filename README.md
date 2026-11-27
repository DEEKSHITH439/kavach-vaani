# 🛡️ Kavach Vaani (कवच वाणी)
### Multilingual Voice-Native Welfare Access & Anti-Extortion Platform for India's 450M+ Informal & Gig Workers
**Build for Bharat Hackathon — Round 2 Prototype & Production Pipeline**

[![Build for Bharat](https://img.shields.io/badge/Build%20for%20Bharat-Round%202%20Prototype-FF671F?style=for-the-badge)](https://github.com/DEEKSHITH439/kavach-vaani)
[![License: MIT](https://img.shields.io/badge/License-MIT-046A38?style=for-the-badge)](LICENSE)
[![Zero Secret Keys](https://img.shields.io/badge/Zero%20Secret%20Keys-100%25%20Out--of--the--Box-06038D?style=for-the-badge)](README.md)
[![Vercel Deployment](https://img.shields.io/badge/Deploy%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

---

## 🎯 1. Problem & Target User
Over **450 million informal workers** across India (street vendors, gig delivery riders, domestic helpers, daily-wage laborers) are systematically cut off from government welfare safety nets (**PM SVANidhi**, **e-Shram**, **PM-JAY**, and **State BOCW Welfare Boards**).

Millions of crores in legitimate entitlements go unclaimed every year due to three foundational barriers:
1. **Bureaucratic Jargon & Multi-Page Forms:** Complex portals with English/formal legalese and CAPTCHAs.
2. **Functional Text Illiteracy:** Workers cannot type or read complex text comfortably on phone screens, but communicate fluently in spoken regional dialects.
3. **Predatory Middlemen (Dalals):** Corrupt local brokers demand **₹500 to ₹3,000 (up to 30% cut)** just to fill out basic government paperwork.

---

## 💡 2. What is Kavach Vaani?
**Kavach Vaani (कवच वाणी)** is an empathetic, voice-native welfare access companion.

Instead of typing or navigating confusing portals, a worker simply taps a single high-contrast mic button and speaks naturally in their everyday dialect:
- **English (India)**
- **Kannada (ಕನ್ನಡ / Kanglish)**
- **Hindi (हिन्दी / Hinglish)**
- **Tamil (தமிழ் / Tanglish)**
- **Bengali (বাংলা)**

### 🔄 The 5-Step End-to-End User Journey:
1. **One-Touch Voice Entry:** The user speaks naturally in their regional tongue: *"I run a tea stall in Bengaluru, need 15,000 rupees loan to buy a burner, but have no collateral."*
2. **Statutory Scheme Matching:** The engine extracts trade, location, and capital need; queries the knowledge base and speaks the matching scheme (**PM SVANidhi**, **e-Shram**, **PM-JAY**, or **BOCW**).
3. **Explicit Purpose & Privacy Consent Gate (DPDP Act Compliance):** Explains data usage clearly and requires affirmative verbal/visual consent before collecting any information.
4. **Step-by-Step Guided Voice Interview:** Asks single questions one at a time (Name, Contact, CoV/LoR status, last-4 digits of Aadhaar/Bank), visually checking them off in real time.
5. **Audio Rights Card & Indic PDF Record:** Plays an **Audio Rights Note** quoting statutory protections under **Section 18(3) of the Street Vendors Act 2014**, anti-bribery warnings, and generates an official downloadable PDF slip rendered in sharp native Indic script.

---

## ⚖️ 3. Verified Statutory & Financial Accuracy
All scheme rules are codified from official **MoHUA** circulars, Gazette of India statutes, and PIB releases:
- **Progressive Loan Structure:** 
  - 1st Tranche: Up to **₹15,000** (12-month tenure)
  - 2nd Tranche: Up to **₹25,000** (18-month tenure, upon timely repayment of 1st loan and lender assessment)
  - 3rd Tranche: Up to **₹50,000** (36-month tenure, upon timely repayment of 2nd loan and lender assessment)
- **7% Interest Subsidy:** Explicitly explained as an interest reduction subsidy on timely repayment, **not a loan waiver or free grant**.
- **Document Checks:** Verifies possession of **Certificate of Vending (CoV)** or **Letter of Recommendation (LoR)**, directing vendors to their Urban Local Body (ULB).
- **Street Vendors Act 2014 Section 18(3):** Correctly explains that thirty days' notice is required before relocation or eviction by the local authority **specifically from the location specified in a Certificate of Vending**. Does not claim general immunity from lawful law enforcement.

---

## 🚀 4. How to Run Locally & Deploy

### Quick Start with Docker (Single Command):
```bash
git clone https://github.com/DEEKSHITH439/kavach-vaani.git
cd kavach-vaani
docker compose up --build
```
Open **`http://localhost:3000`**

### Local Node.js Setup:
```bash
npm install
npm run build
npm run preview
# Or for local development:
npm run dev
```

### Vercel Deployment:
1. Import `DEEKSHITH439/kavach-vaani` on Vercel.
2. Framework: **Vite** (auto-detected).
3. Root Directory: `./`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**! (Pre-configured with `vercel.json` SPA rewrite rules).

---

## 📂 5. Comprehensive Documentation Suite
- **Baseline Audit:** [`docs/audit/PROJECT_BASELINE_AUDIT.md`](docs/audit/PROJECT_BASELINE_AUDIT.md)
- **Approved English Master Script:** [`docs/scripts/ENGLISH_MASTER.md`](docs/scripts/ENGLISH_MASTER.md)
- **Regional Scripts:**
  - Kannada: [`docs/scripts/KANNADA.md`](docs/scripts/KANNADA.md) *(Pending Native Review)*
  - Hindi: [`docs/scripts/HINDI.md`](docs/scripts/HINDI.md) *(Pending Native Review)*
  - Tamil: [`docs/scripts/TAMIL.md`](docs/scripts/TAMIL.md) *(Pending Native Review)*
  - Bengali: [`docs/scripts/BENGALI.md`](docs/scripts/BENGALI.md) *(Pending Native Review)*
  - Consistency Check: [`docs/scripts/MULTILINGUAL_CONSISTENCY_REPORT.md`](docs/scripts/MULTILINGUAL_CONSISTENCY_REPORT.md)
- **Technical Architecture:** [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md)
- **Data Flow:** [`docs/architecture/DATA_FLOW.md`](docs/architecture/DATA_FLOW.md)
- **Security & Privacy Audit:** [`docs/security/SECURITY_AUDIT.md`](docs/security/SECURITY_AUDIT.md) & [`docs/security/PRIVACY_AND_DATA_HANDLING.md`](docs/security/PRIVACY_AND_DATA_HANDLING.md)
- **QA & Testing:** [`docs/testing/TEST_RESULTS.md`](docs/testing/TEST_RESULTS.md) & [`docs/testing/MULTILINGUAL_QA.md`](docs/testing/MULTILINGUAL_QA.md)
- **Deployment Guide:** [`docs/deployment/DEPLOYMENT_GUIDE.md`](docs/deployment/DEPLOYMENT_GUIDE.md)
- **Known Limitations:** [`docs/operations/KNOWN_LIMITATIONS.md`](docs/operations/KNOWN_LIMITATIONS.md)
- **CTO Final Completion Report:** [`KAVACH_VAANI_FINAL_COMPLETION_REPORT.md`](KAVACH_VAANI_FINAL_COMPLETION_REPORT.md)
