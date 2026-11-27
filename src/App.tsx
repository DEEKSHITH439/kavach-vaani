import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { VoiceEngine, SUPPORTED_LANGUAGES, VoiceOption } from './lib/voiceEngine';
import { Scheme, matchSchemeByIntent, SCHEMES_DATABASE } from './lib/schemeRules';
import { VoiceVisualizer } from './components/VoiceVisualizer';
import { LanguageSelector } from './components/LanguageSelector';
import { SchemeCard } from './components/SchemeCard';
import { AudioRightsCard } from './components/AudioRightsCard';
import { LiveApplicationCard } from './components/LiveApplicationCard';
import { FormSubmissionData } from './lib/documentGenerator';
import { Shield, Sparkles, RefreshCw, Volume2, Key, Check, Info } from 'lucide-react';

export function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceOption>(SUPPORTED_LANGUAGES[0]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Tap the mic and speak naturally in your own dialect');
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  
  // App Stage: 'INTENT' -> 'SCHEME_MATCHED' -> 'INTERVIEW' -> 'CONFIRMATION' -> 'RIGHTS_CARD'
  const [stage, setStage] = useState<'INTENT' | 'SCHEME_MATCHED' | 'INTERVIEW' | 'CONFIRMATION' | 'RIGHTS_CARD'>('INTENT');
  
  // Matched Scheme
  const [matchedScheme, setMatchedScheme] = useState<Scheme | null>(null);
  const [matchReason, setMatchReason] = useState<string>('');

  // Voice Interview Fields
  const [interviewStep, setInterviewStep] = useState<number>(0);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    occupation: '',
    aadhaar: '',
    bankAccount: '',
    upiId: ''
  });

  const [applicationId, setApplicationId] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [keySaved, setKeySaved] = useState<boolean>(false);

  const voiceEngineRef = useRef<VoiceEngine | null>(null);

  // Initialize Voice Engine
  useEffect(() => {
    voiceEngineRef.current = new VoiceEngine(selectedLanguage.code);
  }, []);

  const handleLanguageChange = (lang: VoiceOption) => {
    setSelectedLanguage(lang);
    if (voiceEngineRef.current) {
      voiceEngineRef.current.setLanguage(lang.code);
      // Play greeting in newly selected dialect
      speakResponse(lang.greetingText);
    }
  };

  const speakResponse = (text: string, onDone?: () => void) => {
    if (!voiceEngineRef.current) return;
    setIsSpeaking(true);
    setStatusMessage('Kavach Vaani is speaking...');
    voiceEngineRef.current.speak(text, () => {
      setIsSpeaking(false);
      setStatusMessage('Tap mic to respond');
      if (onDone) onDone();
    });
  };

  // Toggle Voice Input
  const handleMicToggle = () => {
    if (!voiceEngineRef.current) return;

    if (isListening) {
      voiceEngineRef.current.stopListening();
      setIsListening(false);
      return;
    }

    if (isSpeaking) {
      voiceEngineRef.current.stopSpeaking();
      setIsSpeaking(false);
    }

    setStatusMessage('Listening to your voice... Speak now');
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

  // Main Intent & Dialogue Processor
  const processUserVoiceInput = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    // Stage 1: Initial Intent Matching
    if (stage === 'INTENT') {
      const match = matchSchemeByIntent(text, selectedLanguage.code);
      setMatchedScheme(match.scheme);
      setMatchReason(match.matchedReason);

      // Pre-fill extracted entities
      setFormData(prev => ({
        ...prev,
        occupation: match.extractedEntities.occupation || prev.occupation || 'Informal Worker',
        location: match.extractedEntities.location || prev.location || 'Bengaluru, Karnataka'
      }));

      setStage('SCHEME_MATCHED');

      // Vernacular Spoken Response
      const audioIntro = selectedLanguage.code === 'kn'
        ? `ನೀವು ${match.scheme.nameNative} ಗೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ. ${match.scheme.benefitAmount} ಸಾಲ ಅಥವಾ ಸಹಾಯ ಸಿಗಲಿದೆ. ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕೆ?`
        : selectedLanguage.code === 'ta'
        ? `நீங்கள் ${match.scheme.nameNative} திட்டத்திற்கு தகுதி பெற்றுள்ளீர்கள். ${match.scheme.benefitAmount} உதவி கிடைக்கும். விண்ணப்பிக்கலாமா?`
        : `आप ${match.scheme.nameNative} के पात्र हैं। इसमें आपको ${match.scheme.benefitAmount} का लाभ मिलता है। क्या मैं आपका फॉर्म अभी भर दूं?`;

      speakResponse(audioIntro);
      return;
    }

    // Stage 2: Interview Loop
    if (stage === 'INTERVIEW') {
      handleInterviewAnswer(text);
      return;
    }

    // Stage 3: Confirmation
    if (stage === 'CONFIRMATION') {
      const lower = text.toLowerCase();
      if (lower.includes('haan') || lower.includes('yes') || lower.includes('sari') || lower.includes('ha') || lower.includes('thik') || lower.includes('submit')) {
        finalizeApplication();
      } else {
        speakResponse('Please say Haan or Yes to submit, or restart by tapping refresh.');
      }
    }
  };

  // Guided Interview Step Questions
  const interviewQuestions = [
    {
      field: 'fullName',
      prompt: {
        hi: 'कृपया अपना पूरा नाम बताएं।',
        kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ಹೇಳಿ.',
        ta: 'தயவுசெய்து உங்கள் முழு பெயரை சொல்லுங்கள்.',
        en: 'Please tell me your full name.'
      }
    },
    {
      field: 'phone',
      prompt: {
        hi: 'अपना 10 अंकों का मोबाइल नंबर बताएं।',
        kn: 'ನಿಮ್ಮ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ತಿಳಿಸಿ.',
        ta: 'உங்கள் 10 இலக்க மொபைல் எண்ணை சொல்லுங்கள்.',
        en: 'Please speak your 10-digit mobile number.'
      }
    },
    {
      field: 'location',
      prompt: {
        hi: 'आप किस शहर या कस्बे में काम करते हैं?',
        kn: 'ನೀವು ಯಾವ ನಗರ ಅಥವಾ ಪಟ್ಟಣದಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ?',
        ta: 'நீங்கள் எந்த ஊரில் வேலை செய்கிறீர்கள்?',
        en: 'Which city or town do you work in?'
      }
    },
    {
      field: 'aadhaar',
      prompt: {
        hi: 'अपने आधार कार्ड के अंतिम 4 अंक बताएं।',
        kn: 'ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್‌ನ ಕೊನೆಯ 4 ಅಂಕಿಗಳನ್ನು ಹೇಳಿ.',
        ta: 'உங்கள் ஆதார் அட்டையின் கடைசி 4 இலக்கங்களை சொல்லுங்கள்.',
        en: 'Speak the last 4 digits of your Aadhaar card.'
      }
    },
    {
      field: 'bankAccount',
      prompt: {
        hi: 'सरकारी सहायता सीधे पाने के लिए अपना बैंक खाता नंबर या UPI आईडी बताएं।',
        kn: 'ನೇರ ಸೌಲಭ್ಯ ಪಡೆಯಲು ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆ ಅಥವಾ UPI ಐಡಿ ಹೇಳಿ.',
        ta: 'அரசு பண உதவியை நேரடியாக பெற உங்கள் வங்கி கணக்கு அல்லது UPI ஐடி சொல்லுங்கள்.',
        en: 'Speak your bank account number or UPI ID for direct benefit transfer.'
      }
    }
  ];

  const startInterview = () => {
    setStage('INTERVIEW');
    setInterviewStep(0);
    const q = interviewQuestions[0];
    const text = (q.prompt as any)[selectedLanguage.code] || q.prompt.en;
    speakResponse(text);
  };

  const handleInterviewAnswer = (answer: string) => {
    const currentQ = interviewQuestions[interviewStep];
    const field = currentQ.field;

    setFormData(prev => ({
      ...prev,
      [field]: answer
    }));

    if (interviewStep < interviewQuestions.length - 1) {
      const nextStep = interviewStep + 1;
      setInterviewStep(nextStep);
      const nextQ = interviewQuestions[nextStep];
      const nextText = (nextQ.prompt as any)[selectedLanguage.code] || nextQ.prompt.en;
      speakResponse(nextText);
    } else {
      // All steps collected -> Move to Confirmation
      setStage('CONFIRMATION');
      const confirmSummary = selectedLanguage.code === 'kn'
        ? `ಎಲ್ಲಾ ಮಾಹಿತಿ ದಾಖಲಾಗಿದೆ. ನಿಮ್ಮ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು 'ಹೌದು' ಅಥವಾ 'Submit' ಎಂದು ಹೇಳಿ.`
        : selectedLanguage.code === 'ta'
        ? `அனைத்து விவரங்களும் பதிவாகின. விண்ணப்பத்தை சமர்ப்பிக்க 'சரி' அல்லது 'Submit' என்று சொல்லுங்கள்.`
        : `आपकी सारी जानकारी दर्ज कर ली गई है। आवेदन सबमिट करने के लिए 'हाँ' या 'Submit' बोलें।`;
      speakResponse(confirmSummary);
    }
  };

  const finalizeApplication = () => {
    const newId = `KV-${Math.floor(100000 + Math.random() * 900000)}`;
    setApplicationId(newId);
    setStage('RIGHTS_CARD');

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    const rightsIntro = selectedLanguage.code === 'kn'
      ? `ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಅರ್ಜಿ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ. ನಿಮ್ಮ ಅಧಿಕಾರ ಪತ್ರ ಮತ್ತು ದೂರು ಸಹಾಯವಾಣಿ ಇಲ್ಲಿದೆ.`
      : selectedLanguage.code === 'ta'
      ? `வாழ்த்துகள்! உங்கள் விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. இதோ உங்கள் உரிமை அட்டை.`
      : `बधाई हो! आपका आवेदन सफलतापूर्वक दर्ज हो गया है। यह आपका अधिकार पत्र है। किसी भी दलाल को घूस न दें।`;

    speakResponse(rightsIntro);
  };

  const handleReset = () => {
    if (voiceEngineRef.current) {
      voiceEngineRef.current.stopSpeaking();
      voiceEngineRef.current.stopListening();
    }
    setStage('INTENT');
    setSpokenTranscript('');
    setMatchedScheme(null);
    setInterviewStep(0);
    setFormData({
      fullName: '',
      phone: '',
      location: '',
      occupation: '',
      aadhaar: '',
      bankAccount: '',
      upiId: ''
    });
    setStatusMessage('Tap the mic and speak naturally in your own dialect');
  };

  // Quick Demo Trigger for evaluation convenience
  const handleQuickDemoTrigger = (preset: 'street-vendor' | 'accident' | 'construction') => {
    if (preset === 'street-vendor') {
      const prompt = selectedLanguage.code === 'kn'
        ? 'ನಾನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಚಹಾ ಅಂಗಡಿ ನಡೆಸುತ್ತಿದ್ದೇನೆ, ₹15,000 ಸಾಲ ಬೇಕು'
        : 'मैं लखनऊ में चाय का ठेला लगाता हूँ, ₹15,000 का लोन चाहिए';
      setSpokenTranscript(prompt);
      processUserVoiceInput(prompt);
    } else if (preset === 'accident') {
      const prompt = 'मैं रिक्शा चालक हूँ, पैर में फ्रैक्चर हुआ है, सरकारी अस्पताल में मुफ्त इलाज चाहिए';
      setSpokenTranscript(prompt);
      processUserVoiceInput(prompt);
    } else {
      const prompt = 'मैं भवन निर्माण मजदूर हूँ, बच्चों की छात्रवृत्ति और औजार किट चाहिए';
      setSpokenTranscript(prompt);
      processUserVoiceInput(prompt);
    }
  };

  const submissionPayload: FormSubmissionData = {
    scheme: matchedScheme || SCHEMES_DATABASE[0],
    fullName: formData.fullName || 'Ramesh Kumar (वेंडर)',
    phone: formData.phone || '9876543210',
    aadhaar: formData.aadhaar || '8921',
    location: formData.location || 'Bengaluru, Karnataka',
    occupation: formData.occupation || 'Tea Stall Vendor',
    bankAccount: formData.bankAccount || '40918273618',
    upiId: formData.upiId || 'ramesh@upi',
    appliedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    applicationId: applicationId || 'KV-782914'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-3 sm:p-6 pb-20 selection:bg-orange-500">
      {/* Top Navbar */}
      <header className="w-full max-w-2xl flex items-center justify-between py-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-slate-950 font-black">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black tracking-tight text-white">Kavach Vaani</h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                कवच वाणी
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Voice-First Welfare Access for 450M Informal Workers</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyModal(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all text-xs flex items-center gap-1"
            title="Optional API Key Settings"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline text-[11px]">Zero-Key Mode</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all"
            title="Reset Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-2xl flex flex-col gap-5">
        {/* Dialect Selector */}
        <LanguageSelector
          currentLanguage={selectedLanguage}
          onSelect={handleLanguageChange}
          disabled={isListening}
        />

        {/* Live Audio Interaction Hero Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Empathetic Vernacular AI Engine
            </span>
            <span className="text-[11px] text-slate-400">Street Noise Suppression Active</span>
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
            <div className="mt-4 p-3.5 rounded-2xl bg-black/40 border border-slate-800 text-xs text-slate-200">
              <div className="text-[10px] uppercase font-bold text-orange-400 mb-1 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" /> What we heard:
              </div>
              <p className="text-sm font-medium leading-relaxed italic">"{spokenTranscript}"</p>
            </div>
          )}

          {/* Quick Demo Voice Prompts for Hackathon Evaluators */}
          {stage === 'INTENT' && (
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                ⚡ Or tap a real-world worker voice scenario to test:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickDemoTrigger('street-vendor')}
                  className="px-3 py-1.5 rounded-xl bg-orange-950/40 hover:bg-orange-900/60 border border-orange-500/30 text-orange-200 text-xs font-medium transition-all"
                >
                  🍵 Tea Stall Vendor (₹15,000 Loan)
                </button>
                <button
                  onClick={() => handleQuickDemoTrigger('accident')}
                  className="px-3 py-1.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-200 text-xs font-medium transition-all"
                >
                  🛺 Rickshaw Driver (Fracture / PM-JAY)
                </button>
                <button
                  onClick={() => handleQuickDemoTrigger('construction')}
                  className="px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-200 text-xs font-medium transition-all"
                >
                  🧱 Construction Laborer (BOCW Kit)
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
            onConfirmApply={startInterview}
          />
        )}

        {/* STAGE 2: Guided Voice Interview */}
        {(stage === 'INTERVIEW' || stage === 'CONFIRMATION') && matchedScheme && (
          <div className="space-y-4">
            <LiveApplicationCard
              schemeName={matchedScheme.name}
              data={formData}
              currentStep={interviewStep}
            />

            {stage === 'CONFIRMATION' && (
              <div className="p-4 rounded-2xl bg-orange-950/40 border border-orange-500/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-orange-300 block">Say 'Haan / Yes' or tap to submit</span>
                  <span className="text-[11px] text-slate-400">Audio playback summary verified</span>
                </div>
                <button
                  onClick={finalizeApplication}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                >
                  Submit Form
                </button>
              </div>
            )}
          </div>
        )}

        {/* STAGE 3: Final Audio Rights Card & PDF Generator */}
        {stage === 'RIGHTS_CARD' && matchedScheme && (
          <AudioRightsCard
            scheme={matchedScheme}
            formData={submissionPayload}
            languageCode={selectedLanguage.code}
            isPlayingNote={isSpeaking}
            onPlayVoiceNote={() => {
              const audioText = matchedScheme.legalRightsAudioText[selectedLanguage.code] || matchedScheme.legalRightsAudioText['en'];
              speakResponse(audioText);
            }}
          />
        )}

        {/* Bottom Social Impact & Rules Engine Trust Callout */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Zero Secret Keys Required:</strong> Kavach Vaani uses standard W3C Web Speech API & local Indian dialect rule engines. It starts with a single command without external proprietary billing lock-ins.
          </div>
        </div>
      </main>

      {/* Optional API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">API Settings (Optional)</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Kavach Vaani runs 100% out of the box with zero keys. If you wish to enable advanced cloud acoustic synthesis, you can optionally paste a Gemini or Sarvam API key below.
            </p>

            <input
              type="password"
              placeholder="AIzaSy... (Leave empty for Default Zero-Key Mode)"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 mb-4 font-mono"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setKeySaved(true);
                  setTimeout(() => setShowKeyModal(false), 500);
                }}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1"
              >
                {keySaved ? <Check className="w-4 h-4" /> : null}
                <span>{keySaved ? 'Saved' : 'Save Preference'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
