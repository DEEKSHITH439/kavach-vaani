# Kavach Vaani – Data Flow Specification

```
[User Speaks / Taps] 
        │
        ▼
[VoiceEngine: STT / Keyword Extraction]
        │
        ▼
[SchemeRules: Statutory Matching (PM SVANidhi, e-Shram, PM-JAY, BOCW)]
        │
        ▼
[Stage 1: Vernacular Scheme Explanation Played to User]
        │
        ▼
[Stage 2: Explicit Privacy & Purpose Consent Gate]
        ├── If Declined ➔ Reset & Purge State
        └── If Consented ➔ Proceed to Step-by-Step Questions
                │
                ▼
[Stage 3: Information Collection (Name, Contact, CoV/LoR, Last-4 Identifiers)]
        │
        ▼
[Stage 4: Spoken Confirmation & Rights Card Generation]
        ├── Audio Rights Card (Sec 18(3) Notice Protection & ULB Support)
        └── High-DPI Indic Citizen PDF Generated for Download
```
