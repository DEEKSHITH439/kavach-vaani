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
  Info
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
    
    // Fallback ensure matchedScheme is never null so Rights Card always renders
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-3 sm:p-6 pb-24 selection:bg-orange-500 font-sans">
      {/* Top Prototype Sandbox Notice Bar */}
      <div className="w-full max-w-2xl bg-amber-950/40 border border-amber-500/30 rounded-xl px-3.5 py-2 mb-3 flex flex-wrap items-center justify-between text-[11px] text-amber-300 gap-2">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <strong>{t.sandboxNotice}</strong>
        </span>
        <span className="text-[10px] text-amber-400/90 font-mono bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/20">
          {t.zeroKeysBadge}
        </span>
      </div>

      {/* Top Navbar */}
      <header className="w-full max-w-2xl flex items-center justify-between py-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">{t.appTitle}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {selectedLanguage.nativeLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{t.appSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 sm:px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all text-xs flex items-center gap-1.5 active:scale-95"
            title="How to Use & Journey Flow"
          >
            <HelpCircle className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline text-[11px] font-semibold">{t.howItWorks}</span>
          </button>

          <button
            onClick={() => setShowKeyModal(true)}
            className="p-2 sm:px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all text-xs flex items-center gap-1.5 active:scale-95"
            title="Zero-Key Guarantee"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline text-[11px] font-semibold">{t.zeroKeyMode}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 sm:px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all text-xs flex items-center gap-1.5 active:scale-95"
            title={t.resetConversation}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-2xl flex flex-col gap-5">
        {/* Step Indicator Progress Bar */}
        <div className="w-full bg-slate-900/70 p-2.5 rounded-2xl border border-slate-800/80 flex items-center justify-between text-[11px] overflow-x-auto">
          <span className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${stage === 'INTENT' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500'}`}>
            {t.steps.speakNeed}
          </span>
          <span className="text-slate-700 px-1">➔</span>
          <span className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${stage === 'SCHEME_MATCHED' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500'}`}>
            {t.steps.schemeMatch}
          </span>
          <span className="text-slate-700 px-1">➔</span>
          <span className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${stage === 'CONSENT' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500'}`}>
            {t.steps.consentCheck}
          </span>
          <span className="text-slate-700 px-1">➔</span>
          <span className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${(stage === 'INTERVIEW' || stage === 'CONFIRMATION') ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500'}`}>
            {t.steps.details}
          </span>
          <span className="text-slate-700 px-1">➔</span>
          <span className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${stage === 'RIGHTS_CARD' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500'}`}>
            {t.steps.rightsCard}
          </span>
        </div>

        {/* Dialect Selector */}
        <LanguageSelector
          currentLanguage={selectedLanguage}
          onSelect={handleLanguageChange}
          disabled={isListening || isSpeaking}
          t={t}
        />

        {/* Live Audio Interaction Hero Card */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Header Tagline Callout */}
          <div className="mb-4 text-center">
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-white bg-clip-text text-transparent">
              "{t.tagline}"
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-lg mx-auto font-medium">
              {t.supportingText}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 border-t border-slate-800/80 pt-3">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-pulse' : isListening ? 'bg-orange-400 animate-ping' : 'bg-slate-500'}`} />
              <span className="font-semibold text-slate-300">
                {playbackState.isPlaying
                  ? playbackState.source === 'bundled_audio'
                    ? `${t.voiceEngine.playingBundled} (${playbackState.languageLabel})`
                    : `${t.voiceEngine.speakingSystem} (${playbackState.languageLabel})`
                  : t.voiceEngine.empatheticEngine}
              </span>
            </div>
            {playbackState.isPlaying && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-mono font-bold">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                {playbackState.source === 'bundled_audio' ? t.voiceEngine.offlineRecording : t.voiceEngine.systemTts}
              </span>
            )}
          </div>

          {/* Big Mic & Soundwaves */}
          <VoiceVisualizer
            isListening={isListening}
            isSpeaking={isSpeaking}
            onClick={handleMicToggle}
            statusLabel={statusMessage}
          />

          {/* Spoken Transcript Bubble */}
          {spokenTranscript && (
            <div className="mt-4 p-3.5 rounded-2xl bg-black/50 border border-slate-800 text-xs text-slate-200">
              <div className="text-[10px] uppercase font-bold text-orange-400 mb-1 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" /> {t.voiceEngine.whatWeHeard}
              </div>
              <p className="text-sm font-medium leading-relaxed italic text-white">"{spokenTranscript}"</p>
            </div>
          )}

          {/* Quick Demo Voice Prompts for Evaluators */}
          {stage === 'INTENT' && (
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                {t.scenarios.orTestPresets}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickDemoTrigger('street-vendor')}
                  className="px-3 py-1.5 rounded-xl bg-orange-950/40 hover:bg-orange-900/60 border border-orange-500/30 text-orange-200 text-xs font-medium transition-all active:scale-95"
                >
                  {t.scenarios.teaVendor}
                </button>
                <button
                  onClick={() => handleQuickDemoTrigger('accident')}
                  className="px-3 py-1.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-200 text-xs font-medium transition-all active:scale-95"
                >
                  {t.scenarios.autoDriver}
                </button>
                <button
                  onClick={() => handleQuickDemoTrigger('construction')}
                  className="px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-200 text-xs font-medium transition-all active:scale-95"
                >
                  {t.scenarios.constructionWorker}
                </button>
              </div>
            </div>
          )}
        </div>

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
          <div className="bg-slate-900 border-2 border-orange-500/50 rounded-3xl p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-2 mb-3 text-orange-400">
              <Lock className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">{t.consent.title}</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {t.scripts.consentIntro}
            </p>

            <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5 mb-5 space-y-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.consent.dataMinimization}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.consent.zeroPersistence}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.consent.noAutomatedSubmission}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
              >
                {t.consent.declineButton}
              </button>
              <button
                onClick={proceedToInterview}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
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
              <div className="p-4 rounded-2xl bg-orange-950/40 border border-orange-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-orange-300 block">{t.interview.sayHaanToSubmit}</span>
                  <span className="text-[11px] text-slate-400">{t.interview.summaryVerified}</span>
                </div>
                <button
                  onClick={finalizeApplication}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
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
      </main>

      {/* How it Works / Instructions Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-5 h-5 text-orange-400" />
              <h3 className="text-base font-bold text-white">{t.modal.howTitle}</h3>
            </div>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">{t.modal.step1Title}</strong>
                {t.modal.step1Desc}
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">{t.modal.step2Title}</strong>
                {t.modal.step2Desc}
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">{t.modal.step3Title}</strong>
                {t.modal.step3Desc}
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">{t.modal.step4Title}</strong>
                {t.modal.step4Desc}
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">{t.modal.step5Title}</strong>
                {t.modal.step5Desc}
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all"
            >
              {t.modal.gotItBtn}
            </button>
          </div>
        </div>
      )}

      {/* Optional API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">{t.modal.keyTitle}</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
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
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                {t.modal.closeBtn}
              </button>
              <button
                onClick={() => {
                  setKeySaved(true);
                  setTimeout(() => setShowKeyModal(false), 500);
                }}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1"
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
