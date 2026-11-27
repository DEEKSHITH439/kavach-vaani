import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { VoiceEngine, SUPPORTED_LANGUAGES, VoiceOption, PlaybackState, AudioScenario } from './lib/voiceEngine';
import { Scheme, matchSchemeByIntent, SCHEMES_DATABASE } from './lib/schemeRules';
import { getLocale, LocaleTranslations } from './locales';
import { VoiceVisualizer } from './components/VoiceVisualizer';
import { LanguageSelector } from './components/LanguageSelector';
import { SchemeCard } from './components/SchemeCard';
import { AudioRightsCard } from './components/AudioRightsCard';
import { LiveApplicationCard } from './components/LiveApplicationCard';
import { DownloadCenter } from './components/DownloadCenter';
import { ApplicationTracker } from './components/ApplicationTracker';
import { FormSubmissionData } from './lib/documentGenerator';
import { 
  Shield, 
  RefreshCw, 
  Volume2, 
  Key, 
  Check, 
  HelpCircle, 
  Radio, 
  Lock, 
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';

export function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceOption>(SUPPORTED_LANGUAGES[0]);
  const [t, setT] = useState<LocaleTranslations>(getLocale(SUPPORTED_LANGUAGES[0].code));
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  
  // Real-time audio source indicator
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    source: 'none',
    languageCode: 'en',
    languageLabel: 'English'
  });

  // App Stage: 'INTENT' -> 'SCHEME_MATCHED' -> 'CONSENT' -> 'INTERVIEW' -> 'CONFIRMATION' -> 'RIGHTS_CARD'
  const [stage, setStage] = useState<'INTENT' | 'SCHEME_MATCHED' | 'CONSENT' | 'INTERVIEW' | 'CONFIRMATION' | 'RIGHTS_CARD'>('INTENT');
  
  // Matched Scheme
  const [matchedScheme, setMatchedScheme] = useState<Scheme | null>(null);
  const [matchReason, setMatchReason] = useState<string>('');
  const [showTrackerModal, setShowTrackerModal] = useState<boolean>(false);

  // Voice Interview Fields - Privacy Safe: Stores minimal necessary fields with masking
  const [interviewStep, setInterviewStep] = useState<number>(0);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    occupation: '',
    covStatus: '',
    aadhaarLast4: '',
    bankAccountLast4: '',
    upiId: ''
  });

  const [applicationId, setApplicationId] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [keySaved, setKeySaved] = useState<boolean>(false);

  const voiceEngineRef = useRef<VoiceEngine | null>(null);
  const isSpeakingRef = useRef<boolean>(false);

  const currentLocaleRef = useRef<LocaleTranslations>(getLocale(SUPPORTED_LANGUAGES[0].code));

  // Initialize Voice Engine and Locale
  useEffect(() => {
    const initialLocale = getLocale(selectedLanguage.code);
    currentLocaleRef.current = initialLocale;
    setT(initialLocale);
    setStatusMessage(initialLocale.voiceEngine.tapMicToSpeak);

    voiceEngineRef.current = new VoiceEngine(selectedLanguage.code, (state) => {
      setPlaybackState(state);
      setIsSpeaking(state.isPlaying);
      isSpeakingRef.current = state.isPlaying;
    });

    // Warm, welcoming automated introduction on startup
    const welcomeTimer = setTimeout(() => {
      const welcomeText = initialLocale.scripts.greeting;
      speakResponse(welcomeText, 'greeting');
    }, 800);

    return () => {
      clearTimeout(welcomeTimer);
      if (voiceEngineRef.current) {
        voiceEngineRef.current.stopListening();
        voiceEngineRef.current.stopSpeaking();
      }
    };
  }, []);

  const handleLanguageChange = (lang: VoiceOption) => {
    if (voiceEngineRef.current) {
      voiceEngineRef.current.stopListening();
      voiceEngineRef.current.stopSpeaking();
    }
    setIsListening(false);
    setIsSpeaking(false);
    isSpeakingRef.current = false;

    setSelectedLanguage(lang);
    const newLocale = getLocale(lang.code);
    currentLocaleRef.current = newLocale;
    setT(newLocale);
    setStatusMessage(newLocale.voiceEngine.tapMicToSpeak);

    if (voiceEngineRef.current) {
      voiceEngineRef.current.setLanguage(lang.code);
    }

    const greetingText = newLocale.scripts.greeting;
    speakResponse(greetingText, 'greeting', undefined, newLocale);
  };

  const speakResponse = (
    text: string, 
    scenario?: AudioScenario, 
    onDone?: () => void,
    overrideLocale?: LocaleTranslations
  ) => {
    if (!voiceEngineRef.current) return;

    const activeLocale = overrideLocale || currentLocaleRef.current;

    voiceEngineRef.current.stopListening();
    setIsListening(false);

    setIsSpeaking(true);
    isSpeakingRef.current = true;
    setStatusMessage(activeLocale.voiceEngine.speakingToYou);

    voiceEngineRef.current.speak(text, {
      scenario,
      onEnd: () => {
        setTimeout(() => {
          setIsSpeaking(false);
          isSpeakingRef.current = false;
          setStatusMessage(currentLocaleRef.current.voiceEngine.tapMicToReply);
          if (onDone) onDone();
        }, 400);
      },
      onError: (errMsg: string) => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        setStatusMessage(errMsg);
      }
    });
  };

  const handleMicToggle = () => {
    if (!voiceEngineRef.current) return;

    if (isSpeakingRef.current) {
      voiceEngineRef.current.stopSpeaking();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    }

    if (isListening) {
      voiceEngineRef.current.stopListening();
      setIsListening(false);
      setStatusMessage(t.voiceEngine.listeningPaused);
      return;
    }

    setStatusMessage(t.voiceEngine.listeningActive);
    setIsListening(true);

    voiceEngineRef.current.startListening(
      (text, isFinal) => {
        setSpokenTranscript(text);
        if (isFinal) {
          setIsListening(false);
          processUserVoiceInput(text);
        }
      },
      (err) => {
        setIsListening(false);
        setStatusMessage(err);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const processUserVoiceInput = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    // Intent Stage Error Handling & Guidance
    if (stage === 'INTENT') {
      const match = matchSchemeByIntent(text, selectedLanguage.code);
      
      // If user said something vague or unrelated (e.g. only 1-2 generic words or no scheme matched)
      if (!match.scheme) {
        const errorFeedback = selectedLanguage.code === 'kn'
          ? "ನಾನು ಸರ್ಕಾರಿ ಸಾಲ ಮತ್ತು ಕಲ್ಯಾಣ ಯೋಜನೆಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ಉದಾಹರಣೆಗೆ: 'ನಾನು ಚಹಾ ಅಂಗಡಿ ನಡೆಸುತ್ತಿದ್ದೇನೆ, ₹15,000 ಸಾಲ ಬೇಕು' ಎಂದು ಹೇಳಿ."
          : selectedLanguage.code === 'hi'
          ? "मैं सरकारी ऋण और कल्याण योजनाओं में सहायता करता हूँ। उदाहरण के लिए कहें: 'मैं चाय की दुकान चलाता हूँ, ₹15,000 का लोन चाहिए'।"
          : selectedLanguage.code === 'ta'
          ? "நான் அரசு கடன் மற்றும் நலத்திட்டங்களில் உதவுகிறேன். உதாரணமாக: 'நான் டீ கடை நடத்துகிறேன், ₹15,000 கடன் வேண்டும்' என்று சொல்லுங்கள்."
          : selectedLanguage.code === 'bn'
          ? "আমি সরকারি ঋণ ও কল্যাণমূলক প্রকল্পে সাহায্য করি। উদাহরণস্বরূপ বলুন: 'আমি চায়ের দোকান চালাই, ₹১৫,০০০ ঋণ চাই'।"
          : "I help with government welfare schemes and vendor loans. For example, say: 'I run a tea stall and need ₹15,000 loan'.";
        
        speakResponse(errorFeedback);
        return;
      }

      setMatchedScheme(match.scheme);
      setMatchReason(match.matchedReason);

      setFormData(prev => ({
        ...prev,
        occupation: match.extractedEntities.occupation || prev.occupation || 'Informal Worker',
        location: match.extractedEntities.location || prev.location || 'Bengaluru'
      }));

      setStage('SCHEME_MATCHED');

      // Use verified localized scheme explanation
      const explanation = t.scripts.schemeExplanation;
      speakResponse(explanation, 'scheme_match');
      return;
    }

    if (stage === 'CONSENT') {
      const lower = text.toLowerCase();
      if (
        lower.includes('haan') || lower.includes('yes') || lower.includes('sari') || 
        lower.includes('ha') || lower.includes('houdu') || lower.includes('aam') ||
        lower.includes('agree') || lower.includes('ಹೌದು') || lower.includes('हाँ') ||
        lower.includes('சரி') || lower.includes('হ্যাঁ')
      ) {
        proceedToInterview();
      } else {
        speakResponse(
          selectedLanguage.code === 'kn' 
            ? "ಮುಂದುವರಿಯಲು ದಯವಿಟ್ಟು 'ಹೌದು' ಎಂದು ಹೇಳಿ, ಅಥವಾ ನೀವು ಯಾವಾಗ ಬೇಕಾದರೂ ನಿಲ್ಲಿಸಬಹುದು."
            : selectedLanguage.code === 'hi'
            ? "आगे बढ़ने के लिए कृपया 'हाँ' कहें, या आप कभी भी रोक सकते हैं।"
            : "Please confirm with Yes / Haan to proceed, or you may stop anytime."
        );
      }
      return;
    }

    if (stage === 'INTERVIEW') {
      handleInterviewAnswer(text);
      return;
    }

    if (stage === 'CONFIRMATION') {
      const lower = text.toLowerCase();
      if (
        lower.includes('haan') || lower.includes('yes') || lower.includes('sari') || 
        lower.includes('ha') || lower.includes('thik') || lower.includes('submit') || 
        lower.includes('maadi') || lower.includes('houdu') || lower.includes('ಹೌದು') || 
        lower.includes('हाँ') || lower.includes('சரி') || lower.includes('হ্যাঁ')
      ) {
        finalizeApplication();
      } else {
        speakResponse(t.scripts.confirmSummary);
      }
    }
  };

  const promptConsentStage = () => {
    setStage('CONSENT');
    const consentText = t.scripts.consentIntro;
    speakResponse(consentText, 'interview_intro');
  };

  const interviewFieldKeys = ['fullName', 'phone', 'location', 'covStatus', 'aadhaarLast4', 'bankAccountLast4'] as const;

  const proceedToInterview = () => {
    setStage('INTERVIEW');
    setInterviewStep(0);
    const firstPrompt = t.interview.prompts.fullName;
    speakResponse(firstPrompt);
  };

  const handleInterviewAnswer = (answer: string) => {
    const currentKey = interviewFieldKeys[interviewStep];

    let sanitizedAnswer = answer;
    if (currentKey === 'aadhaarLast4' || currentKey === 'bankAccountLast4') {
      const digits = answer.replace(/\D/g, '');
      if (digits.length < 4 && digits.length > 0) {
        // Helpful voice correction if user provided fewer than 4 digits
        const digitsError = selectedLanguage.code === 'kn'
          ? "ದಯವಿಟ್ಟು ಕನಿಷ್ಠ ಕೊನೆಯ 4 ಅಂಕಿಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿ."
          : selectedLanguage.code === 'hi'
          ? "कृपया सुरक्षा के लिए अंतिम 4 अंक स्पष्ट रूप से बताएं।"
          : "Please speak the last 4 digits clearly for verification.";
        speakResponse(digitsError);
        return;
      }
      sanitizedAnswer = digits.length >= 4 ? digits.slice(-4) : digits || answer;
    }

    setFormData(prev => ({
      ...prev,
      [currentKey]: sanitizedAnswer
    }));

    if (interviewStep < interviewFieldKeys.length - 1) {
      const nextStep = interviewStep + 1;
      setInterviewStep(nextStep);
      const nextKey = interviewFieldKeys[nextStep];
      const nextPrompt = t.interview.prompts[nextKey];
      speakResponse(nextPrompt);
    } else {
      setStage('CONFIRMATION');
      speakResponse(t.scripts.confirmSummary);
    }
  };

  const finalizeApplication = () => {
    const newId = `KV-${selectedLanguage.code.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setApplicationId(newId);

    const activeScheme = matchedScheme || SCHEMES_DATABASE[0];
    if (!matchedScheme) {
      setMatchedScheme(activeScheme);
    }

    setStage('RIGHTS_CARD');

    try {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    const rightsSpeech = activeScheme.legalRightsAudioText[selectedLanguage.code] || 
      activeScheme.legalRightsAudioText['en'] || 
      t.scripts.schemeExplanation;
    speakResponse(rightsSpeech, 'rights_card');

    // Smoothly scroll down so the user immediately sees the generated Rights Card & Download Center
    setTimeout(() => {
      const rightsElement = document.getElementById('audio-rights-card-section');
      if (rightsElement) {
        rightsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  const handleReset = () => {
    if (voiceEngineRef.current) {
      voiceEngineRef.current.stopSpeaking();
      voiceEngineRef.current.stopListening();
    }
    setIsListening(false);
    setIsSpeaking(false);
    isSpeakingRef.current = false;
    setStage('INTENT');
    setSpokenTranscript('');
    setMatchedScheme(null);
    setInterviewStep(0);
    setFormData({
      fullName: '',
      phone: '',
      location: '',
      occupation: '',
      covStatus: '',
      aadhaarLast4: '',
      bankAccountLast4: '',
      upiId: ''
    });
    setApplicationId('');
    setStatusMessage(t.voiceEngine.tapMicToSpeak);
  };

  const handleQuickDemoTrigger = (preset: 'street-vendor' | 'accident' | 'construction') => {
    let prompt = '';
    if (preset === 'street-vendor') {
      prompt = selectedLanguage.code === 'kn'
        ? 'ನಾನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಚಹಾ ಅಂಗಡಿ ನಡೆಸುತ್ತಿದ್ದೇನೆ, ₹15,000 ಸಾಲ ಬೇಕು'
        : selectedLanguage.code === 'hi'
        ? 'मैं लखनऊ में चाय का ठेला लगाता हूँ, ₹15,000 का लोन चाहिए'
        : selectedLanguage.code === 'ta'
        ? 'நான் தெருவோர தள்ளுவண்டி வியாபாரி, தொழில் துவங்க ₹15,000 கடன் கிடைக்குமா?'
        : selectedLanguage.code === 'bn'
        ? 'আমি চায়ের দোকান চালাই, আমার ₹১৫,০০০ চলতি মূলধন ঋণ প্রয়োজন'
        : 'I run a tea stall in Bengaluru, need 15,000 rupees working capital loan';
    } else if (preset === 'accident') {
      prompt = selectedLanguage.code === 'kn'
        ? 'ನಾನು ಆಟೋ ಚಾಲಕ, ಅಪಘಾತವಾಗಿ ಆಸ್ಪತ್ರೆಗೆ ದಾಖಲಾಗಿದ್ದೇನೆ, ಉಚಿತ ಚಿಕಿತ್ಸೆ ಬೇಕು'
        : selectedLanguage.code === 'hi'
        ? 'मैं रिक्शा चालक हूँ, पैर में फ्रैक्चर हुआ है, सरकारी अस्पताल में मुफ्त इलाज चाहिए'
        : 'I am an auto driver, met with an accident and need cashless hospital treatment under PM-JAY';
    } else {
      prompt = selectedLanguage.code === 'kn'
        ? 'ನಾನು ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಕಾರ್ಮಿಕ, ಉಪಕರಣ ಕಿಟ್ ಮತ್ತು ಮಕ್ಕಳ ವಿದ್ಯಾರ್ಥಿವೇತನ ಬೇಕು'
        : selectedLanguage.code === 'hi'
        ? 'मैं भवन निर्माण मजदूर हूँ, बच्चों की छात्रवृत्ति और औजार किट चाहिए'
        : 'I am a construction laborer seeking BOCW tool assistance and scholarship';
    }

    setSpokenTranscript(prompt);
    processUserVoiceInput(prompt);
  };

  const submissionPayload: FormSubmissionData = {
    scheme: matchedScheme || SCHEMES_DATABASE[0],
    fullName: formData.fullName || 'Ramesh Kumar (Citizen)',
    phone: formData.phone || '9876543210',
    aadhaarLast4: formData.aadhaarLast4 || '8921',
    location: formData.location || 'Bengaluru, Karnataka',
    occupation: formData.occupation || 'Street Vendor',
    covStatus: formData.covStatus || 'Available for Verification',
    bankAccountLast4: formData.bankAccountLast4 || '6182',
    upiId: formData.upiId || 'ramesh@upi',
    appliedDate: new Date().toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    applicationId: applicationId || `KV-${selectedLanguage.code.toUpperCase()}-782914`,
    isSimulation: true,
    languageCode: selectedLanguage.code
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col items-center selection:bg-emerald-600 selection:text-white font-sans w-full">
      {/* Top Official Government Portal Strip */}
      <div className="w-full bg-[#1B4332] text-white border-b border-[#2D6A4F] px-4 py-2 flex flex-wrap items-center justify-between text-[11px] font-medium shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-wide">
            <span>🏛️ Government of India</span>
            <span className="text-emerald-300">|</span>
            <span className="text-emerald-200">Ministry of Housing & Urban Affairs (MoHUA)</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-emerald-100">
            <span className="hidden sm:inline">Official Welfare Portal Simulation</span>
            <span className="px-2 py-0.5 rounded bg-emerald-800/80 border border-emerald-600 font-mono text-[10px] text-amber-300 font-bold">
              PM SVANidhi 2026
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-4 flex flex-col items-center">
        {/* Top Navbar Header */}
        <header className="w-full bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-900/20 text-white font-black shrink-0">
              <Shield className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kavach Vaani</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Aapki Suraksha, Aapki Awaaz
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Multilingual Voice Companion for Street Vendors & Informal Workers</p>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTrackerModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <Radio className="w-4 h-4 text-emerald-600" />
              <span>Track Status</span>
            </button>

            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2 sm:px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition-all text-xs font-bold flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">{t.howItWorks}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 hover:text-slate-900 transition-all active:scale-95 cursor-pointer"
              title={t.resetConversation}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Hero Welcome Banner - Fully localized */}
        <div className="w-full bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 rounded-3xl p-6 sm:p-7 shadow-sm mb-5 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              {t.tagline}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2.5">
              {selectedLanguage.code === 'kn' ? 'ಕವಚ ವಾಣಿಗೆ ಸ್ವಾಗತ!' : selectedLanguage.code === 'hi' ? 'कवच वाणी में आपका स्वागत है!' : selectedLanguage.code === 'te' ? 'కవచ్ వాణికి స్వాగతం!' : selectedLanguage.code === 'ta' ? 'கவச் வாணிக்கு நல்வரவு!' : selectedLanguage.code === 'bn' ? 'কবচ বাণীতে আপনাকে স্বাগতম!' : 'Welcome to Kavach Vaani!'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium mt-1.5 leading-relaxed">
              {t.supportingText}
            </p>
          </div>
        </div>

        {/* 5-Step Progress Guide Rail */}
        <div className="w-full bg-white p-2.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-bold overflow-x-auto shadow-sm mb-5">
          <span className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${stage === 'INTENT' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-400'}`}>
            1. {t.steps.speakNeed}
          </span>
          <span className="text-slate-300 px-1 font-bold">➔</span>
          <span className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${stage === 'SCHEME_MATCHED' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-400'}`}>
            2. {t.steps.schemeMatch}
          </span>
          <span className="text-slate-300 px-1 font-bold">➔</span>
          <span className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${stage === 'CONSENT' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-400'}`}>
            3. {t.steps.consentCheck}
          </span>
          <span className="text-slate-300 px-1 font-bold">➔</span>
          <span className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${(stage === 'INTERVIEW' || stage === 'CONFIRMATION') ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-400'}`}>
            4. {t.steps.details}
          </span>
          <span className="text-slate-300 px-1 font-bold">➔</span>
          <span className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${stage === 'RIGHTS_CARD' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-400'}`}>
            5. {t.steps.rightsCard}
          </span>
        </div>

        {/* Language Selector: English -> Hindi -> Kannada -> Tamil -> Bengali */}
        <div className="w-full mb-5">
          <LanguageSelector
            currentLanguage={selectedLanguage}
            onSelect={handleLanguageChange}
            disabled={isListening || isSpeaking}
            t={t}
          />
        </div>

        {/* Main Content Body: Responsive Split-Screen on Laptop (lg:grid lg:grid-cols-12), Vertical Stack on Mobile */}
        <main className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column (Laptop: 5 cols, Sticky) - Microphone & Voice Companion */}
            <div className="lg:col-span-5 w-full lg:sticky lg:top-4 space-y-4">
              <div className="w-full bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isSpeaking ? 'bg-emerald-500 animate-pulse' : isListening ? 'bg-orange-500 animate-ping' : 'bg-slate-400'}`} />
                    <span className="font-bold text-slate-700">
                      {playbackState.isPlaying
                        ? `${t.voiceEngine.speakingSystem} (${selectedLanguage.nativeLabel})`
                        : t.voiceEngine.empatheticEngine}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {selectedLanguage.nativeLabel}
                  </span>
                </div>

                {/* Central Mic Visualizer */}
                <VoiceVisualizer
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  onClick={handleMicToggle}
                  statusLabel={statusMessage}
                />

                {/* Spoken Transcript Bubble */}
                {spokenTranscript && (
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 shadow-sm animate-fade-in">
                    <div className="text-[10px] uppercase font-bold text-emerald-700 mb-1 flex items-center gap-1.5 tracking-wider">
                      <Volume2 className="w-3.5 h-3.5" /> {t.voiceEngine.whatWeHeard}
                    </div>
                    <p className="text-sm font-semibold leading-relaxed italic text-slate-900">"{spokenTranscript}"</p>
                  </div>
                )}

                {/* Quick Access Preset Cards */}
                {stage === 'INTENT' && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-center mb-2.5">
                      <span className="px-3 py-1 rounded-full bg-emerald-800 text-white font-bold text-xs tracking-wide">
                        {t.scenarios.orTestPresets}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => handleQuickDemoTrigger('street-vendor')}
                        className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-all active:scale-95 cursor-pointer shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">{t.scenarios.teaVendor.split('(')[0]}</div>
                          <div className="text-[11px] text-amber-800 font-medium">PM SVANidhi Loan</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-amber-700" />
                      </button>

                      <button
                        onClick={() => handleQuickDemoTrigger('accident')}
                        className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-all active:scale-95 cursor-pointer shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">{t.scenarios.autoDriver.split('(')[0]}</div>
                          <div className="text-[11px] text-emerald-800 font-medium">Fracture / PM-JAY</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-emerald-700" />
                      </button>

                      <button
                        onClick={() => handleQuickDemoTrigger('construction')}
                        className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition-all active:scale-95 cursor-pointer shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">{t.scenarios.constructionWorker.split('(')[0]}</div>
                          <div className="text-[11px] text-blue-800 font-medium">BOCW Welfare</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-blue-700" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (Laptop: 7 cols, Mobile: Stacked directly below) - Live Flow & Details */}
            <div className="lg:col-span-7 w-full space-y-5">
              {/* STAGE 0: Waiting for user to speak */}
              {stage === 'INTENT' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">
                    {t.steps.speakNeed}
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
                    {t.voiceEngine.tapMicToSpeak}
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      💡 Quick Example Queries / ಉದಾಹರಣೆಗಳು:
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                      <li>"I sell tea and need ₹15,000 working capital loan"</li>
                      <li>"ನಾನು ಬೀದಿ ವ್ಯಾಪಾರಿ, ನನಗೆ ವ್ಯಾಪಾರಕ್ಕೆ ಸಾಲ ಬೇಕು"</li>
                      <li>"मैं ठेला लगाता हूँ, मुझे ₹15,000 का सरकारी लोन चाहिए"</li>
                      <li>"నేను టీ దుకాణం నడుపుతున్నాను, వ్యాపార రుణం కావాలి"</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* STAGE 1: Matched Scheme Card */}
              {stage === 'SCHEME_MATCHED' && matchedScheme && (
                <SchemeCard
                  scheme={matchedScheme}
                  matchedReason={matchReason}
                  langCode={selectedLanguage.code}
                  onConfirmApply={promptConsentStage}
                  t={t}
                />
              )}

              {/* STAGE 2: Explicit Privacy & Consent Gate */}
              {stage === 'CONSENT' && (
                <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 shadow-sm animate-fade-in">
                  <div className="flex items-center gap-2.5 mb-3.5 text-emerald-800">
                    <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                      <Lock className="w-5 h-5" />
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{t.consent.title}</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 font-medium">
                    {t.scripts.consentIntro}
                  </p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-5 space-y-2.5 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{t.consent.dataMinimization}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{t.consent.zeroPersistence}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{t.consent.noAutomatedSubmission}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleReset}
                      className="w-1/3 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                    >
                      {t.consent.declineButton}
                    </button>
                    <button
                      onClick={proceedToInterview}
                      className="w-2/3 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md shadow-emerald-900/20 active:scale-95 transition-all cursor-pointer"
                    >
                      {t.consent.agreeButton}
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 3: Guided Voice Interview */}
              {(stage === 'INTERVIEW' || stage === 'CONFIRMATION') && matchedScheme && (
                <div className="space-y-4">
                  <LiveApplicationCard
                    schemeName={matchedScheme.name}
                    data={{
                      fullName: formData.fullName,
                      phone: formData.phone,
                      location: formData.location,
                      occupation: formData.covStatus ? `${formData.occupation} (${formData.covStatus})` : formData.occupation,
                      aadhaar: formData.aadhaarLast4,
                      bankAccount: formData.bankAccountLast4,
                      upiId: formData.upiId
                    }}
                    currentStep={interviewStep}
                    t={t}
                  />

                  {stage === 'CONFIRMATION' && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">{t.interview.sayHaanToSubmit}</span>
                        <span className="text-[11px] text-slate-600">{t.interview.summaryVerified}</span>
                      </div>
                      <button
                        onClick={finalizeApplication}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        {t.interview.submitDemoButton}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 4: Final Audio Rights Card & Download Centre */}
              {stage === 'RIGHTS_CARD' && (
                <div id="audio-rights-card-section" className="space-y-5 animate-fade-in scroll-mt-6">
                  <AudioRightsCard
                    scheme={matchedScheme || SCHEMES_DATABASE[0]}
                    formData={submissionPayload}
                    languageCode={selectedLanguage.code}
                    t={t}
                    isPlayingNote={isSpeaking}
                    onPlayVoiceNote={() => {
                      const currentScheme = matchedScheme || SCHEMES_DATABASE[0];
                      const audioText = currentScheme.legalRightsAudioText[selectedLanguage.code] || currentScheme.legalRightsAudioText['en'];
                      speakResponse(audioText, 'rights_card');
                    }}
                  />

                  {/* Comprehensive Download & Verification Center */}
                  <DownloadCenter
                    scheme={matchedScheme || SCHEMES_DATABASE[0]}
                    formData={submissionPayload}
                    t={t}
                    languageCode={selectedLanguage.code}
                    isPlayingAudio={isSpeaking}
                    onPlayAudio={() => {
                      const currentScheme = matchedScheme || SCHEMES_DATABASE[0];
                      const audioText = currentScheme.legalRightsAudioText[selectedLanguage.code] || currentScheme.legalRightsAudioText['en'];
                      speakResponse(audioText, 'rights_card');
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* How it Works / Instructions Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-soft-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="p-1.5 rounded-xl bg-orange-500/20 text-orange-400">
                <HelpCircle className="w-5 h-5" />
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">{t.modal.howTitle}</h3>
            </div>
            
            <div className="space-y-3 text-xs text-slate-300 font-medium">
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <strong className="text-orange-400 block mb-1 text-xs font-bold">{t.modal.step1Title}</strong>
                <p className="leading-relaxed">{t.modal.step1Desc}</p>
              </div>

              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <strong className="text-orange-400 block mb-1 text-xs font-bold">{t.modal.step2Title}</strong>
                <p className="leading-relaxed">{t.modal.step2Desc}</p>
              </div>

              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <strong className="text-orange-400 block mb-1 text-xs font-bold">{t.modal.step3Title}</strong>
                <p className="leading-relaxed">{t.modal.step3Desc}</p>
              </div>

              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <strong className="text-orange-400 block mb-1 text-xs font-bold">{t.modal.step4Title}</strong>
                <p className="leading-relaxed">{t.modal.step4Desc}</p>
              </div>

              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <strong className="text-orange-400 block mb-1 text-xs font-bold">{t.modal.step5Title}</strong>
                <p className="leading-relaxed">{t.modal.step5Desc}</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-orange-500/20"
            >
              {t.modal.gotItBtn}
            </button>
          </div>
        </div>
      )}

      {/* Live Application Tracker Modal */}
      {showTrackerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full relative">
            <button
              onClick={() => setShowTrackerModal(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-lg text-sm hover:bg-slate-700 z-10"
            >
              ✕
            </button>
            <ApplicationTracker
              t={t}
              initialApplicationId={applicationId || 'KV-DEMO-782914'}
              languageCode={selectedLanguage.code}
            />
          </div>
        </div>
      )}

      {/* Optional API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-soft-lg">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Key className="w-5 h-5" />
              </span>
              <h3 className="text-base font-black text-white">{t.modal.keyTitle}</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed font-medium">
              {t.modal.keyDesc}
            </p>

            <input
              type="password"
              placeholder="AIzaSy... (Leave empty for Zero-Key Mode)"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 mb-4 font-mono"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                {t.modal.closeBtn}
              </button>
              <button
                onClick={() => {
                  setKeySaved(true);
                  setTimeout(() => setShowKeyModal(false), 500);
                }}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                {keySaved ? <Check className="w-4 h-4" /> : null}
                <span>{keySaved ? t.modal.savedBtn : t.modal.saveBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
