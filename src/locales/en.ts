export interface LocaleTranslations {
  tagline: string;
  supportingText: string;
  sandboxNotice: string;
  zeroKeysBadge: string;
  appTitle: string;
  appSubtitle: string;
  howItWorks: string;
  zeroKeyMode: string;
  resetConversation: string;
  steps: {
    speakNeed: string;
    schemeMatch: string;
    consentCheck: string;
    details: string;
    rightsCard: string;
  };
  languageSelectLabel: string;
  regionalAudioBadge: string;
  voiceEngine: {
    tapAndSpeak: string;
    listening: string;
    speaking: string;
    tapMicToSpeak: string;
    tapMicToReply: string;
    speakingToYou: string;
    listeningActive: string;
    listeningPaused: string;
    whatWeHeard: string;
    playingBundled: string;
    speakingSystem: string;
    empatheticEngine: string;
    offlineRecording: string;
    systemTts: string;
    micPermissionBlocked: string;
    noSpeechDetected: string;
    voiceNotSupported: string;
  };
  scenarios: {
    orTestPresets: string;
    teaVendor: string;
    autoDriver: string;
    constructionWorker: string;
  };
  consent: {
    title: string;
    dataMinimization: string;
    zeroPersistence: string;
    noAutomatedSubmission: string;
    declineButton: string;
    agreeButton: string;
  };
  interview: {
    formTitle: string;
    stepCounter: (current: number, total: number) => string;
    awaitingVoice: string;
    sayHaanToSubmit: string;
    summaryVerified: string;
    submitDemoButton: string;
    fields: {
      fullName: string;
      phone: string;
      location: string;
      covStatus: string;
      aadhaarLast4: string;
      bankAccountLast4: string;
    };
    prompts: {
      fullName: string;
      phone: string;
      location: string;
      covStatus: string;
      aadhaarLast4: string;
      bankAccountLast4: string;
    };
  };
  rightsCard: {
    title: string;
    subtitle: string;
    simulationNotice: string;
    spokenLawAudio: string;
    listenToRights: string;
    playingRights: string;
    statutoryProtection: string;
    zeroDalalNotice: string;
    grievanceContact: string;
    downloadPdf: string;
    downloadAudio: string;
    downloadAllBundle: string;
    audioNotAvailableNote: string;
  };
  downloads: {
    sectionTitle: string;
    sectionSubtitle: string;
    appSummaryPdf: string;
    appSummaryPdfDesc: string;
    rightsCardPdf: string;
    rightsCardPdfDesc: string;
    schemeInfoPdf: string;
    schemeInfoPdfDesc: string;
    audioExplanation: string;
    audioExplanationDesc: string;
    shareableRights: string;
    shareableRightsDesc: string;
    downloadBtn: string;
    listenBtn: string;
    copiedNotice: string;
    shareBtn: string;
  };
  modal: {
    howTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    gotItBtn: string;
    keyTitle: string;
    keyDesc: string;
    closeBtn: string;
    saveBtn: string;
    savedBtn: string;
  };
  scripts: {
    greeting: string;
    schemeExplanation: string;
    consentIntro: string;
    confirmSummary: string;
  };
}

export const en: LocaleTranslations = {
  tagline: "Your Voice. Your Rights. Your Access.",
  supportingText: "Discover government welfare schemes and understand your benefits through a simple conversation in your own language.",
  sandboxNotice: "Build for Bharat Hackathon Prototype: Sandbox Simulation Mode Active",
  zeroKeysBadge: "Zero Secret Keys Required",
  appTitle: "Kavach Vaani",
  appSubtitle: "Multilingual Voice Companion for Financial Inclusion & Welfare",
  howItWorks: "How it Works",
  zeroKeyMode: "Zero-Key Mode",
  resetConversation: "Reset Conversation & Purge Data",
  steps: {
    speakNeed: "1. Speak Need",
    schemeMatch: "2. Scheme Match",
    consentCheck: "3. Consent Check",
    details: "4. Details",
    rightsCard: "5. Rights & Downloads"
  },
  languageSelectLabel: "Choose Voice Dialect / Select Language",
  regionalAudioBadge: "5 Languages Supported",
  voiceEngine: {
    tapAndSpeak: "Tap & Speak",
    listening: "Listening",
    speaking: "Speaking",
    tapMicToSpeak: "Tap the mic and speak naturally in your dialect",
    tapMicToReply: "Tap mic to reply",
    speakingToYou: "Kavach Vaani is speaking to you...",
    listeningActive: "Listening to your voice... Speak now",
    listeningPaused: "Listening paused. Tap mic to speak.",
    whatWeHeard: "What we heard:",
    playingBundled: "Playing Genuine Audio",
    speakingSystem: "Speaking via System Voice",
    empatheticEngine: "Empathetic Vernacular AI Engine",
    offlineRecording: "OFFLINE RECORDING",
    systemTts: "SYSTEM TTS",
    micPermissionBlocked: "Microphone permission blocked. Please allow mic access in your browser bar.",
    noSpeechDetected: "No voice detected. Please tap the mic and speak.",
    voiceNotSupported: "Browser speech recognition not supported in this browser. Please use Chrome or Edge."
  },
  scenarios: {
    orTestPresets: "⚡ Or tap a scenario preset button to test intent matching:",
    teaVendor: "🍵 Tea Stall Vendor (PM SVANidhi Loan)",
    autoDriver: "🛺 Rickshaw Driver (Fracture / PM-JAY)",
    constructionWorker: "🧱 Construction Laborer (BOCW Welfare)"
  },
  consent: {
    title: "Privacy Notice & Explicit Consent (Consent)",
    dataMinimization: "Data minimization: Only last 4 digits of Aadhaar/Bank are gathered.",
    zeroPersistence: "Zero cloud persistence: All inputs stay in memory and are purged on reset.",
    noAutomatedSubmission: "No automated submission without explicit final verbal review.",
    declineButton: "Decline / Stop",
    agreeButton: "Yes, I Agree & Give Consent (I Agree)"
  },
  interview: {
    formTitle: "Real-time Voice Populated Form",
    stepCounter: (current, total) => `Step ${current} of ${total}`,
    awaitingVoice: "Awaiting voice reply...",
    sayHaanToSubmit: "Say 'Yes / Submit' or tap to submit demo",
    summaryVerified: "Audio playback summary verified",
    submitDemoButton: "Submit Demo Application",
    fields: {
      fullName: "Citizen Name",
      phone: "Mobile Number",
      location: "Work Location / City",
      covStatus: "CoV / LoR Document",
      aadhaarLast4: "Aadhaar (Last 4)",
      bankAccountLast4: "Direct Bank / UPI"
    },
    prompts: {
      fullName: "Please tell me your full name.",
      phone: "Please speak your 10-digit mobile number.",
      location: "Which city or town do you operate in?",
      covStatus: "Do you have a Certificate of Vending (CoV) or Letter of Recommendation (LoR)?",
      aadhaarLast4: "For privacy, please speak only the last 4 digits of your Aadhaar card.",
      bankAccountLast4: "Speak the last 4 digits of your bank account or UPI ID for direct benefit transfer."
    }
  },
  rightsCard: {
    title: "Audio Rights Card (Statutory Rights)",
    subtitle: "Statutory Entitlement & Anti-Extortion Record",
    simulationNotice: "Demonstration Only – Not an Official Government Approval or Submission Receipt. Application ID generated for hackathon evaluation.",
    spokenLawAudio: "Spoken Anti-Harassment Law Audio",
    listenToRights: "Listen to Rights",
    playingRights: "Playing Rights Note...",
    statutoryProtection: "Statutory Protection:",
    zeroDalalNotice: "Zero Dalal Guarantee: Statutory welfare benefit. Do not pay any fees or commissions to local agents or brokers.",
    grievanceContact: "Official Verification Route:",
    downloadPdf: "Download Application Summary PDF",
    downloadAudio: "Download Spoken Rights Audio",
    downloadAllBundle: "Download Complete Welfare Pack",
    audioNotAvailableNote: "Offline audio recording is currently simulated via client SpeechSynthesis. You can replay the explanation anytime using the Listen button."
  },
  downloads: {
    sectionTitle: "Download & Documentation Centre",
    sectionSubtitle: "Official application preparation summaries, rights cards and shareable verified guides",
    appSummaryPdf: "Application Preparation Summary PDF",
    appSummaryPdfDesc: "Full summary with masked details, matched scheme rules, and official verification channels.",
    rightsCardPdf: "Audio Rights Card PDF",
    rightsCardPdfDesc: "Statutory Section 18(3) protection notice against unlawful spot evictions.",
    schemeInfoPdf: "Scheme Information Summary PDF",
    schemeInfoPdfDesc: "Three loan tranches breakdown (₹15k/₹25k/₹50k) and 7% interest subsidy details.",
    audioExplanation: "Audio Rights & Legal Guidance",
    audioExplanationDesc: "Vernacular spoken explanation of legal entitlements and anti-harassment laws.",
    shareableRights: "Shareable Rights Text Summary",
    shareableRightsDesc: "Quick WhatsApp/SMS summary to share with peer community members.",
    downloadBtn: "Download PDF",
    listenBtn: "Play Spoken Audio",
    copiedNotice: "Copied to clipboard!",
    shareBtn: "Copy Rights Summary"
  },
  modal: {
    howTitle: "How to Use Kavach Vaani",
    step1Title: "Step 1: Choose Language & State Your Need",
    step1Desc: "Select your native language. Tap the mic and speak what help or loan you need in everyday language.",
    step2Title: "Step 2: Hear Genuine Welfare Guidance",
    step2Desc: "Kavach Vaani explains PM SVANidhi progressive loan tranches (up to ₹15,000, ₹25,000, and ₹50,000) and the 7% interest subsidy upon timely repayment.",
    step3Title: "Step 3: Purpose-Bound Privacy Consent",
    step3Desc: "Before any details are collected, the assistant explains purpose and seeks explicit consent adhering to DPDP safeguards.",
    step4Title: "Step 4: Check CoV & Answer Minimal Questions",
    step4Desc: "The assistant asks for minimal necessary details: name, town, CoV/LoR status, and strictly the last 4 digits of Aadhaar/Bank.",
    step5Title: "Step 5: Audio Rights Card & Multilingual PDF",
    step5Desc: "Hear your statutory rights quoting Section 18(3) of Street Vendors Act 2014 and download your high-DPI Indic PDF summary.",
    gotItBtn: "Got it, let's start!",
    keyTitle: "Hackathon Zero-Key Guarantee",
    keyDesc: "Kavach Vaani runs 100% out of the box with zero secret keys required. Optional external TTS services can be configured here if desired.",
    closeBtn: "Close",
    saveBtn: "Save Preference",
    savedBtn: "Saved"
  },
  scripts: {
    greeting: "Namaste! I am Kavach Vaani. Tell me what work you do and what kind of financial assistance or working-capital loan you need.",
    schemeExplanation: "Based on the information you shared, you may be eligible to apply for a PM SVANidhi working-capital loan. This scheme provides collateral-free loans to eligible street vendors, subject to verification and lender approval. The scheme offers loans in three progressive stages. You may receive a first loan of up to ₹15,000. After successfully repaying the first loan and meeting the applicable requirements, you may be considered for a second loan of up to ₹25,000. Similarly, after successfully repaying the second loan, you may be considered for a third loan of up to ₹50,000. If you repay your loan on time, you may be eligible for an interest subsidy of 7% per year, subject to the scheme rules. This subsidy helps reduce your interest burden. It is not a loan waiver or a free grant. For application and eligibility verification, a valid Certificate of Vending or Letter of Recommendation may be used, subject to the applicable scheme requirements. The lending institution will also assess your application. For complete eligibility information, please consult your local Urban Local Body or the official PM SVANidhi portal. Would you like to check your eligibility now?",
    consentIntro: "To help check your eligibility and prepare your application, I will ask you a few simple questions one by one. Your information will be used for the application-related purpose explained to you. Please share only the information necessary for this process. Are you comfortable proceeding? If yes, let us begin with your full name.",
    confirmSummary: "All your information has been recorded. Say 'Yes' or 'Submit' to confirm your application summary."
  }
};
