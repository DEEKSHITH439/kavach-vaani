# 📄 PITCH DECK CONTENT: KAVACH VAANI (कवच वाणी)
### Submission for Build for Bharat Hackathon (Round 2)
*(Export this document or copy text into Google Slides / Canva / LibreOffice to export your PDF)*

---

## SLIDE 1: Title & The Vision
**Headline:** Kavach Vaani (कवच वाणी)  
**Subhead:** The Voice-Native Welfare Access & Anti-Harassment Companion for India's 450 Million Informal Workers  
**Team:** EKALAVYA  
**Track:** Everyday Access for All / Public Infrastructure & Civic Services  

---

## SLIDE 2: Problem & Who Has It
**Who has the problem:**  
- **450+ million informal and unorganized workers** in India: street vendors, auto/rickshaw drivers, construction laborers, delivery gig workers, domestic helpers.
- Their families comprise over **1 billion citizens** relying on informal daily wages.

**The 3 Fatal Barriers:**
1. **Bureaucratic Jargon:** Multi-page digital portals filled with English/formal Hindi legalese.
2. **Functional Text Illiteracy:** Workers cannot type or read complex forms on glass screens.
3. **Predatory Middlemen (Dalals):** Corrupt local brokers charge ₹500 to ₹3,000 (up to 30% of entitlement) just to submit basic paperwork.

---

## SLIDE 3: Why Speaking is the Only Solution
- Informal workers rarely type, but **they communicate fluently in spoken regional dialects** (Bhojpuri, Kannada, Marathi, Tamil, Bengali, Hinglish).
- **Voice is the natural human interface**—it requires zero typing ability, zero digital literacy, and treats the citizen with dignity.
- Conversational audio removes shame and anxiety from public benefit access.

---

## SLIDE 4: Solution: Kavach Vaani in Action
**One Core Flow That Works End-to-End:**
1. **One-Touch Voice Entry:** A single pulsating microphone button. The app speaks in their dialect: *"Namaste! Tell me what work you do and what help or loan you need."*
2. **Vernacular Scheme Matching:** Automatically extracts occupation, city, and need; queries central/state entitlement rules (PM SVANidhi, e-Shram, PM-JAY, BOCW) and speaks the benefit in plain terms.
3. **Conversational Form Filling:** Gently asks single questions one by one. Populates a real-time visual government card with green checkmarks.
4. **Audio Rights Card:** Generates a spoken anti-harassment voice note and downloadable slip citing the **Street Vendors Act 2014**, anti-bribery warnings, and grievance helplines.

---

## SLIDE 5: What Changes Compared to Today
| Metric / Aspect | Status Quo (Today) | With Kavach Vaani |
|---|---|---|
| **Broker Fee** | ₹500 to ₹3,000 lost to middlemen | **₹0 (100% Free Direct Access)** |
| **Time to Complete** | 3-7 days visiting cyber cafes | **Under 2 minutes via voice** |
| **Completion Rate** | < 15% self-serve portal completion | **> 80% voice-guided completion** |
| **Legal Awareness** | Unaware of rights against police/municipal eviction | **Audio Rights Card protects legal entitlement** |

---

## SLIDE 6: What It Depends On & Cost Resiliency
**Architecture & Dependencies:**
- **Zero-Key Out-of-the-Box:** Runs locally via standard W3C Web Speech API & embedded deterministic rules engine. Starts with single command without paid API keys.
- **Acoustic Noise Filtering:** Client-side speech processing filters ambient street, market, and traffic noise before entity extraction.
- **Resilience Against Model Downtime / Price Hikes:**
  - If cloud LLM APIs experience price surges or outages, Kavach Vaani seamlessly falls back to client-side rule matches and offline voice caches.
  - Zero cloud dependency for core application filing.

---

## SLIDE 7: Launch Plan & Go-To-Market
**Phase 1: Grassroots Pilot (Months 1-3)**
- Partner with **NASVI (National Association of Street Vendors of India)** and local vendor unions in Bengaluru and Lucknow.
- Set up **"Vaani Kiosks"** at weekly vegetable mandis and auto stands for instant physical testing.

**Phase 2: Civic & NGO Network Distribution (Months 4-6)**
- Onboard 50+ grassroots NGOs and microfinance self-help groups (SHGs).
- Enable WhatsApp voice-note bot integration allowing workers to send audio notes directly.

**Phase 3: Scale & State Integration (Months 7-12)**
- Expand across 5 states: Karnataka, Uttar Pradesh, Bihar, Tamil Nadu, and West Bengal.
- Facilitate **500,000+ completed applications**, unlocking over ₹100 Crore in collateral-free working capital and emergency healthcare.

---

## SLIDE 8: Team & Vision
- **Team EKALAVYA:** Dedicated to bridging the digital divide through empathetic voice computing.
- **Repository:** https://github.com/DEEKSHITH439/kavach-vaani
- *“Every worker deserves welfare with dignity, without middlemen, in their own voice.”*
