# 🛡️ Kavach Vaani (कवच वाणी)
### Voice-Native Welfare Access & Anti-Extortion Companion for India's 450M+ Informal & Gig Workers
**Build for Bharat Hackathon — Round 2 Prototype**

[![Build for Bharat](https://img.shields.io/badge/Build%20for%20Bharat-Round%202%20Prototype-FF671F?style=for-the-badge)](https://github.com/DEEKSHITH439/kavach-vaani)
[![License: MIT](https://img.shields.io/badge/License-MIT-046A38?style=for-the-badge)](LICENSE)
[![Zero Key Required](https://img.shields.io/badge/Zero%20Secret%20Keys-100%25%20Out--of--the--Box-06038D?style=for-the-badge)](README.md)

---

## 🎯 1. Problem & Target User
Over **450 million informal workers** across India (street vendors, gig delivery riders, domestic helpers, daily-wage laborers) are systematically excluded from welfare safety nets (**PM SVANidhi**, **e-Shram**, **PM-JAY**, and **State BOCW Welfare Boards**).

Millions of crores in legitimate government entitlements remain unclaimed every year due to three foundational barriers:
1. **Bureaucratic Jargon & Text Forms:** Government portals are designed with multi-page forms, CAPTCHAs, and complex legal language.
2. **Functional Text Illiteracy:** Most workers cannot type or read complex text comfortably on smartphones, but they communicate fluently in spoken regional dialects.
3. **Predatory Middlemen (Dalals):** Corrupt local brokers and cyber cafe operators demand **₹500 to ₹3,000 (up to 30% cut)** just to fill out basic government forms.

---

## 💡 2. Solution: What is Kavach Vaani?
**Kavach Vaani (कवच वाणी)** is an empathetic, voice-native welfare access companion.

Instead of navigating text portals, a worker simply taps a single high-contrast mic button and speaks naturally in their everyday dialect (Hindi, Kannada, Tamil, Bengali, or code-mixed Hinglish).

### 🔄 The 4-Step End-to-End Core Flow:
1. **One-Touch Voice Entry & Dialect Intent Capture:**
   The user speaks naturally: *"I run a tea stall in Bengaluru, need 15,000 rupees to buy a new burner and glasses, but have no collateral."*
2. **Vernacular Scheme Matching:**
   Kavach Vaani extracts key entities (Occupation: *Street Vendor*, City: *Bengaluru*, Need: *Working Capital Loan*, Amount: *₹15,000*), matches with the statutory rules engine, and responds back in natural audio: *"You qualify for the PM SVANidhi street vendor loan of up to ₹20,000 with zero collateral. Shall I fill your form now?"*
3. **Conversational Form Filling:**
   Conducts a gentle, single-question voice interview, updating the application card visually with green checks in real time.
4. **Voice Confirmation & "Audio Rights Card":**
   Plays a spoken verification summary, submits the form, and generates an **Audio Rights Card**—a voice note and downloadable slip citing the **Street Vendors Act 2014**, anti-harassment safeguards, zero-bribe warnings, and direct grievance helplines.

---

## 🚀 3. Quick Start (Starts Without Any Secret Keys)
As per the hackathon requirements, Kavach Vaani **starts and functions 100% out of the box with zero secret keys required** (no OpenAI, Google, or external API keys needed).

### Option A: Using Docker Compose (Recommended - Single Command)
```bash
git clone https://github.com/DEEKSHITH439/kavach-vaani.git
cd kavach-vaani
docker compose up --build
```
Open your browser at: **`http://localhost:3000`**

### Option B: Local Node.js Setup
```bash
git clone https://github.com/DEEKSHITH439/kavach-vaani.git
cd kavach-vaani
npm install
npm run build
npm run preview
# Or for local development:
npm run dev
```
Open **`http://localhost:3000`** or the preview port shown.

---

## 🛠️ 4. What It Depends On & Resilience Strategy
| Dependency / Layer | Implementation | Fallback / Cost Resilience |
|---|---|---|
| **Speech-to-Text (STT)** | W3C Web Speech Recognition | Client-side acoustic filtering, client native speech fallback, zero API billing risk |
| **Text-to-Speech (TTS)** | W3C SpeechSynthesis Engine | Natural regional cadence tuned at 0.95x rate for clear vernacular comprehension |
| **Rules Engine** | Embedded Statutory Knowledge Base | Local deterministic scheme matcher (PM SVANidhi, e-Shram, PM-JAY, BOCW) |
| **Form & Card Engine** | jsPDF + Canvas Confetti | Client-side instant PDF & audio rights record generation with zero server overhead |
| **Optional LLM Enhancer** | User-configurable Gemini/Sarvam modal | Runs fully functional in **Zero-Key Mode** by default |

---

## 📊 5. Measurable Impact Target
- **Elimination of Middlemen:** Saves families an average of ₹1,200 per application in broker commissions.
- **Completion Rate:** Achieves 80%+ voice-guided form completion (vs <15% self-serve on existing government portals).
- **Scale:** Targeting 500,000+ completed applications in Year 1 across Karnataka, Uttar Pradesh, and Bihar.

---

## 🎥 6. Submission Deliverables
- **GitHub Repository:** [https://github.com/DEEKSHITH439/kavach-vaani](https://github.com/DEEKSHITH439/kavach-vaani)
- **Pitch Deck (PDF Script):** [pitch-deck/PITCH_DECK.md](pitch-deck/PITCH_DECK.md)
- **Demo Video Script:** [pitch-deck/DEMO_VIDEO_SCRIPT.md](pitch-deck/DEMO_VIDEO_SCRIPT.md)
