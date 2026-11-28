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
  HeartHandshake,
  Landmark,
  Compass,
  FileCheck,
  ChevronDown,
  ChevronUp
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
    languageCode: 'kn',
    languageLabel: 'ಕನ್ನಡ (Kannada)'
  });

  // App Stage: 'INTENT' -> 'SCHEME_MATCHED' -> 'CONSENT' -> 'INTERVIEW' -> 'CONFIRMATION' -> 'RIGHTS_CARD'
  const [stage, setStage] = useState<'INTENT' | 'SCHEME_MATCHED' | 'CONSENT' | 'INTERVIEW' | 'CONFIRMATION' | 'RIGHTS_CARD'>('INTENT');
  
  // Matched Scheme
  const [matchedScheme, setMatchedScheme] = useState<Scheme | null>(null);
  const [matchReason, setMatchReason] = useState<string>('');

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
  const [exampleQueriesOpen, setExampleQueriesOpen] = useState<boolean>(true);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [keySaved, setKeySaved] = useState<boolean>(false);

  const voiceEngineRef = useRef<VoiceEngine | null>(null);
  const isSpeakingRef = useRef<boolean>(false);

  // Initialize Voice Engine and Locale
  useEffect(() => {
    const initialLocale = getLocale(selectedLanguage.code);
    setT(initialLocale);
    setStatusMessage(initialLocale.voiceEngine.tapMicToSpeak);

    voiceEngineRef.current = new VoiceEngine(selectedLanguage.code, (state) => {
      setPlaybackState(state);
      setIsSpeaking(state.isPlaying);
      isSpeakingRef.current = state.isPlaying;
    });

    return () => {
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
    setT(newLocale);
    setStatusMessage(newLocale.voiceEngine.tapMicToSpeak);

    if (voiceEngineRef.current) {
      voiceEngineRef.current.setLanguage(lang.code);
    }

    const greetingText = newLocale.scripts.greeting;
    speakResponse(greetingText, 'greeting');
  };

  const speakResponse = (text: string, scenario?: AudioScenario, onDone?: () => void) => {
    if (!voiceEngineRef.current) return;

    voiceEngineRef.current.stopListening();
    setIsListening(false);

    setIsSpeaking(true);
    isSpeakingRef.current = true;
    setStatusMessage(t.voiceEngine.speakingToYou);

    voiceEngineRef.current.speak(text, {
      scenario,
      onEnd: () => {
        setTimeout(() => {
          setIsSpeaking(false);
          isSpeakingRef.current = false;
          setStatusMessage(t.voiceEngine.tapMicToReply);
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

    if (stage === 'INTENT') {
      const match = matchSchemeByIntent(text, selectedLanguage.code);
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center pb-20 font-sans relative overflow-x-hidden selection:bg-emerald-600 selection:text-white">
      
      {/* 1. Top MoHUA Bar (Dark Green Bar across top full width) */}
      <div className="w-full bg-[#046A38] text-white py-2 px-4 sm:px-8 flex items-center justify-between text-xs font-semibold shadow-xs">
        <div className="flex items-center gap-2">
          <span>Ministry of Housing & Urban Affairs (MoHUA)</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/90">
          <span>कवच वाणी</span>
          <span className="text-white/60">|</span>
          <span>Kavach Vaani</span>
        </div>
      </div>

      {/* 2. Top Header & Navbar: Kavach Vaani Logo, subtitle, Track Status, How It Works, Reset */}
      <header className="w-full max-w-6xl flex flex-wrap items-center justify-between py-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#046A38] flex items-center justify-center text-white shadow-md shadow-emerald-900/10 shrink-0">
            <Shield className="w-7 h-7 stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Kavach Vaani
              </h1>
              <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-emerald-100 text-[#046A38] border border-emerald-300">
                Aapki Suraksha, Aapki Awaaz
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              AI-Powered Voice Companion for Street Vendors & Informal Workers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 mt-3 sm:mt-0">
          {/* Track Status Button */}
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Radio className="w-4 h-4 text-[#046A38]" />
            <span>Track Status</span>
          </button>

          {/* How It Works Button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Info className="w-4 h-4 text-slate-600" />
            <span>How It Works</span>
          </button>

          {/* Reset Conversation Button */}
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all shadow-xs cursor-pointer active:scale-95"
            title={t.resetConversation}
            aria-label={t.resetConversation}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container - Vertical Hierarchy */}
      <main className="w-full max-w-5xl flex flex-col items-center gap-6 px-4 sm:px-6 mt-1">

        {/* 3. Hero Welcome Banner Card - Light Mint Green Background with curved waves */}
        <div className="w-full rounded-3xl bg-gradient-to-b from-[#E8F8F0] via-[#F0FBF5] to-[#E3F6ED] border border-emerald-100 p-8 sm:p-10 text-center relative overflow-hidden shadow-xs">
          {/* Subtle wave accents */}
          <div className="absolute -bottom-8 -left-8 w-64 h-32 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-64 h-32 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />

          {/* Pill Badge */}
          <div className="inline-block px-4 py-1 rounded-full bg-emerald-100/90 border border-emerald-300 text-[#046A38] text-[11px] font-black uppercase tracking-wider mb-3">
            YOUR VOICE. YOUR RIGHTS. YOUR ACCESS.
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Welcome to Kavach Vaani!
          </h2>

          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl mx-auto font-medium leading-relaxed">
            Discover government welfare schemes and understand your benefits through a simple conversation in your own language.
          </p>
        </div>

        {/* 4. Five-step Progress Indicator below welcome section */}
        <div className="w-full flex items-center justify-center overflow-x-auto py-2">
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold whitespace-nowrap">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${stage === 'INTENT' ? 'bg-[#046A38] text-white font-black shadow-xs' : 'bg-slate-100 text-slate-500'}`}>
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
                <span>Speak Need</span>
              </span>
              <span className="text-slate-400 font-bold">➔</span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${stage === 'SCHEME_MATCHED' ? 'bg-[#046A38] text-white font-black shadow-xs' : 'bg-slate-100 text-slate-500'}`}>
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
                <span>Scheme Match</span>
              </span>
              <span className="text-slate-400 font-bold">➔</span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${stage === 'CONSENT' ? 'bg-[#046A38] text-white font-black shadow-xs' : 'bg-slate-100 text-slate-500'}`}>
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
                <span>Consent Check</span>
              </span>
              <span className="text-slate-400 font-bold">➔</span>
            </div>

            {/* Step 4 */}
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${(stage === 'INTERVIEW' || stage === 'CONFIRMATION') ? 'bg-[#046A38] text-white font-black shadow-xs' : 'bg-slate-100 text-slate-500'}`}>
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">4</span>
                <span>Details</span>
              </span>
              <span className="text-slate-400 font-bold">➔</span>
            </div>

            {/* Step 5 */}
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${stage === 'RIGHTS_CARD' ? 'bg-[#046A38] text-white font-black shadow-xs' : 'bg-slate-100 text-slate-500'}`}>
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">5</span>
                <span>Rights & Downloads</span>
              </span>
            </div>
          </div>
        </div>

        {/* 5 & 6. Language Selection Heading & Cards Arranged Horizontally */}
        <div className="w-full">
          <LanguageSelector
            currentLanguage={selectedLanguage}
            onSelect={handleLanguageChange}
            disabled={isListening || isSpeaking}
            t={t}
          />
        </div>

        {/* 7 & 8. Centered Microphone & Supporting Text */}
        <div className="w-full flex flex-col items-center justify-center py-1">
          <VoiceVisualizer
            isListening={isListening}
            isSpeaking={isSpeaking}
            onClick={handleMicToggle}
            statusLabel={statusMessage}
          />
          <p className="text-xs sm:text-sm text-slate-700 text-center font-medium mt-1">
            Tap the mic and speak naturally in your dialect.
          </p>

          {/* Transcript / speech prompt pill matching reference */}
          <div className="mt-3.5 w-full max-w-xl py-2 px-5 rounded-full bg-[#EBF7F0] border border-emerald-200/80 flex items-center justify-center gap-2 text-xs shadow-2xs">
            <span className="flex items-center gap-1 text-[#046A38] font-black">
              <span className="flex items-center gap-0.5">
                <span className="w-0.5 h-3 bg-[#046A38] rounded-full"></span>
                <span className="w-0.5 h-4 bg-[#046A38] rounded-full"></span>
                <span className="w-0.5 h-2 bg-[#046A38] rounded-full"></span>
              </span>
              <span>What we heard:</span>
            </span>
            <span className="text-slate-500 italic truncate font-normal">
              {spokenTranscript ? `"${spokenTranscript}"` : 'Your speech will appear here...'}
            </span>
          </div>
        </div>

        {/* 9 & 10. Quick Example Queries Collapsible Section & Preset Cards (Exact match to Dashboard reference) */}
        {stage === 'INTENT' && (
          <div className="w-full max-w-4xl flex flex-col items-center gap-3">
            {/* Section Toggle Pill */}
            <button
              onClick={() => setExampleQueriesOpen(!exampleQueriesOpen)}
              className="w-full max-w-xl py-2 px-4 rounded-full bg-[#F1F5F9] hover:bg-slate-200/80 border border-slate-200 flex items-center justify-between text-xs font-black text-slate-700 transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2 w-full justify-center pl-4">
                <span>💡</span>
                <span className="tracking-wide">QUICK EXAMPLE QUERIES / ಉದಾಹರಣೆ ಪ್ರಶ್ನೆಗಳು:</span>
              </div>
              {exampleQueriesOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
              )}
            </button>

            {/* Presets 3-card horizontal grid */}
            {exampleQueriesOpen && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 animate-fade-in">
                {/* 1. Tea Vendor Card */}
                <button
                  onClick={() => handleQuickDemoTrigger('street-vendor')}
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#FFF8EE] hover:bg-[#FFF2DF] border border-amber-200 text-left transition-all active:scale-95 cursor-pointer shadow-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg shrink-0">
                      ☕
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                        Tea Vendor
                      </div>
                      <div className="text-[11px] text-slate-600 truncate mt-0.5">
                        PM SVANidhi Loan
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-700 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2. Auto Driver Card */}
                <button
                  onClick={() => handleQuickDemoTrigger('accident')}
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#EDFDF3] hover:bg-[#E2FAEB] border border-emerald-200 text-left transition-all active:scale-95 cursor-pointer shadow-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg shrink-0">
                      🛺
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                        Auto Driver
                      </div>
                      <div className="text-[11px] text-slate-600 truncate mt-0.5">
                        e-Shram, Social Security
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 3. Construction Worker Card */}
                <button
                  onClick={() => handleQuickDemoTrigger('construction')}
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#EEF5FF] hover:bg-[#E1EDFF] border border-blue-200 text-left transition-all active:scale-95 cursor-pointer shadow-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg shrink-0">
                      👷
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                        Construction Worker
                      </div>
                      <div className="text-[11px] text-slate-600 truncate mt-0.5">
                        BOCW Welfare, Insurance
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-700 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STAGE 1: Matched Scheme Card */}
        {stage === 'SCHEME_MATCHED' && matchedScheme && (
          <div className="w-full">
            <SchemeCard
              scheme={matchedScheme}
              matchedReason={matchReason}
              langCode={selectedLanguage.code}
              onConfirmApply={promptConsentStage}
              t={t}
            />
          </div>
        )}

        {/* STAGE 2: Explicit Privacy & Consent Gate */}
        {stage === 'CONSENT' && (
          <div className="w-full bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-7 shadow-md animate-fade-in">
            <div className="flex items-center gap-2.5 mb-3.5 text-[#046A38]">
              <span className="p-1.5 rounded-xl bg-emerald-100 text-[#046A38]">
                <Lock className="w-5 h-5" />
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{t.consent.title}</h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 font-medium">
              {t.scripts.consentIntro}
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-5 space-y-2.5 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#046A38] shrink-0" />
                <span>{t.consent.dataMinimization}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#046A38] shrink-0" />
                <span>{t.consent.zeroPersistence}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#046A38] shrink-0" />
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
                className="w-2/3 py-3.5 rounded-2xl bg-[#046A38] hover:bg-[#03542c] text-white font-black text-xs shadow-md shadow-emerald-800/20 active:scale-95 transition-all cursor-pointer"
              >
                {t.consent.agreeButton}
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: Guided Voice Interview */}
        {(stage === 'INTERVIEW' || stage === 'CONFIRMATION') && matchedScheme && (
          <div className="w-full space-y-4">
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
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">{t.interview.sayHaanToSubmit}</span>
                  <span className="text-[11px] text-slate-600">{t.interview.summaryVerified}</span>
                </div>
                <button
                  onClick={finalizeApplication}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#046A38] hover:bg-[#03542c] text-white font-extrabold text-xs shadow-md shadow-emerald-800/20 active:scale-95 transition-all cursor-pointer"
                >
                  {t.interview.submitDemoButton}
                </button>
              </div>
            )}
          </div>
        )}

        {/* STAGE 4: Final Audio Rights Card & Download Centre */}
        {stage === 'RIGHTS_CARD' && (
          <div id="audio-rights-card-section" className="w-full space-y-5 animate-fade-in scroll-mt-6">
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
      </main>

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

      {/* Optional Track Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="p-2 rounded-xl bg-emerald-100 text-[#046A38]">
                <Radio className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-black text-slate-900">Application Tracking</h3>
                <p className="text-xs text-slate-500">Live Status & Verification</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {applicationId ? (
                <>Your current Application ID is <strong className="text-[#046A38] font-mono">{applicationId}</strong>. Status: <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active Verification</span></>
              ) : (
                <>No application filed in this session yet. Tap the microphone and complete the voice interview to generate your trackable Application ID and legal protection slip.</>
              )}
            </p>
            <div className="flex items-center justify-end">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#046A38] hover:bg-[#03542c] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
