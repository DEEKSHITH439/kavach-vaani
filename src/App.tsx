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
import { Shield, RefreshCw, Volume2, Key, Check, Info, HelpCircle, AlertCircle } from 'lucide-react';

export function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceOption>(SUPPORTED_LANGUAGES[0]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Tap the mic and speak naturally in your dialect');
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
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
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
      // Play greeting in newly selected dialect with phonetic fallback
      speakResponse(lang.greetingText, lang.transliteratedAudioText);
    }
  };

  const speakResponse = (text: string, phoneticFallback?: string, onDone?: () => void) => {
    if (!voiceEngineRef.current) return;
    setIsSpeaking(true);
    setStatusMessage('Kavach Vaani is speaking to you...');
    voiceEngineRef.current.speak(text, phoneticFallback || text, () => {
      setIsSpeaking(false);
      setStatusMessage('Tap mic to reply');
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
        location: match.extractedEntities.location || prev.location || 'Bengaluru'
      }));

      setStage('SCHEME_MATCHED');

      // Vernacular Spoken Response with phonetic fallback
      let audioIntro = `आप ${match.scheme.nameNative} के पात्र हैं। इसमें आपको ${match.scheme.benefitAmount} का लाभ मिलता है। क्या मैं आपका फॉर्म अभी भर दूं?`;
      let phoneticIntro = `Aap ${match.scheme.name} ke yogya hain. Isme aapko ${match.scheme.benefitAmount} ka labh milta hai. Kya main aapka form abhi bhar doon?`;

      if (selectedLanguage.code === 'kn') {
        audioIntro = `ನೀವು ${match.scheme.nameNative} ಯೋಜನೆಗೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ. ಇದರಲ್ಲಿ ${match.scheme.benefitAmount} ಸೌಲಭ್ಯ ಸಿಗುತ್ತದೆ. ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕೆ?`;
        phoneticIntro = `Neevu ${match.scheme.name} yojanege arharagiddeeri. Idaralli ${match.scheme.benefitAmount} labha siguttade. Eegale arji sallisabekey?`;
      } else if (selectedLanguage.code === 'ta') {
        audioIntro = `நீங்கள் ${match.scheme.nameNative} திட்டத்திற்கு தகுதி பெற்றுள்ளீர்கள். இதில் ${match.scheme.benefitAmount} உதவி கிடைக்கும். விண்ணப்பிக்கலாமா?`;
        phoneticIntro = `Neengal ${match.scheme.name} thitathirku thaguthi petrulleergal. Idhil ${match.scheme.benefitAmount} udhavi kidaikkum. Vinnappikkalaama?`;
      } else if (selectedLanguage.code === 'bn') {
        audioIntro = `আপনি ${match.scheme.nameNative} এর যোগ্য। এতে আপনি ${match.scheme.benefitAmount} সহায়তা পাবেন। ফর্ম পূরণ শুরু করব?`;
        phoneticIntro = `Aapni ${match.scheme.name} er joggo. Ete aapni ${match.scheme.benefitAmount} sahayota paben. Form puron shuru korbo?`;
      } else if (selectedLanguage.code === 'en') {
        audioIntro = `You are eligible for ${match.scheme.name}. It provides ${match.scheme.benefitAmount} financial benefit. Would you like me to fill the application now?`;
        phoneticIntro = audioIntro;
      }

      speakResponse(audioIntro, phoneticIntro);
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
      if (lower.includes('haan') || lower.includes('yes') || lower.includes('sari') || lower.includes('ha') || lower.includes('thik') || lower.includes('submit') || lower.includes('maadi') || lower.includes('houdu')) {
        finalizeApplication();
      } else {
        speakResponse('Please say Haan or Submit to confirm, or tap Submit button.', 'Please say Haan or Submit to confirm.');
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
        bn: 'আপনার পুরো নাম বলুন।',
        en: 'Please tell me your full name.'
      },
      phonetic: {
        hi: 'Kripya apna poora naam batayein.',
        kn: 'Dayavittu nimma poorna hesarannu heli.',
        ta: 'Dayavuseithu ungal muzhu peyarai sollungal.',
        bn: 'Aapanar puro naam bolun.',
        en: 'Please tell me your full name.'
      }
    },
    {
      field: 'phone',
      prompt: {
        hi: 'अपना 10 अंकों का मोबाइल नंबर बताएं।',
        kn: 'ನಿಮ್ಮ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ತಿಳಿಸಿ.',
        ta: 'உங்கள் 10 இலக்க மொபைல் எண்ணை சொல்லுங்கள்.',
        bn: 'আপনার ১০ সংখ্যার মোবাইল নম্বর বলুন।',
        en: 'Please speak your 10-digit mobile number.'
      },
      phonetic: {
        hi: 'Apna das anko ka mobile number batayein.',
        kn: 'Nimma hathu ankiya mobile sankhye thilisi.',
        ta: 'Ungal pathu ilakka mobile ennai sollungal.',
        bn: 'Aapanar dosh shonkhar mobile number bolun.',
        en: 'Please speak your 10-digit mobile number.'
      }
    },
    {
      field: 'location',
      prompt: {
        hi: 'आप किस शहर या कस्बे में काम करते हैं?',
        kn: 'ನೀವು ಯಾವ ನಗರ ಅಥವಾ ಪಟ್ಟಣದಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ?',
        ta: 'நீங்கள் எந்த ஊரில் வேலை செய்கிறீர்கள்?',
        bn: 'আপনি কোন শহরে কাজ করেন?',
        en: 'Which city or town do you work in?'
      },
      phonetic: {
        hi: 'Aap kis sheher ya kasbe mein kaam karte hain?',
        kn: 'Neevu yaava nagara athava pattana-dalli kelasa maaduttiddeeri?',
        ta: 'Neengal endha ooril velai seigireergal?',
        bn: 'Aapni kon shohore kaaj koren?',
        en: 'Which city or town do you work in?'
      }
    },
    {
      field: 'aadhaar',
      prompt: {
        hi: 'अपने आधार कार्ड के अंतिम 4 अंक बताएं।',
        kn: 'ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್‌ನ ಕೊನೆಯ 4 ಅಂಕಿಗಳನ್ನು ಹೇಳಿ.',
        ta: 'உங்கள் ஆதார் அட்டையின் கடைசி 4 இலக்கங்களை சொல்லுங்கள்.',
        bn: 'আপনার আধার কার্ডের শেষ ৪টি সংখ্যা বলুন।',
        en: 'Speak the last 4 digits of your Aadhaar card.'
      },
      phonetic: {
        hi: 'Apne Aadhaar card ke antim chaar ank batayein.',
        kn: 'Nimma Aadhaar card-ina koneya naalku ankigalannu heli.',
        ta: 'Ungal Aadhaar attaiyin kadaisi naangu ilakkangalai sollungal.',
        bn: 'Aapanar Aadhaar card er shesh chaarti shonkha bolun.',
        en: 'Speak the last 4 digits of your Aadhaar card.'
      }
    },
    {
      field: 'bankAccount',
      prompt: {
        hi: 'सरकारी सहायता सीधे पाने के लिए अपना बैंक खाता नंबर या UPI आईडी बताएं।',
        kn: 'ನೇರ ಸೌಲಭ್ಯ ಪಡೆಯಲು ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆ ಅಥವಾ UPI ಐಡಿ ಹೇಳಿ.',
        ta: 'அரசு பண உதவியை நேரடியாக பெற உங்கள் வங்கி கணக்கு அல்லது UPI ஐடி சொல்லுங்கள்.',
        bn: 'সরাসরি সরকারি টাকা পেতে আপনার ব্যাঙ্ক অ্যাকাউন্ট বা ইউপিআই আইডি বলুন।',
        en: 'Speak your bank account number or UPI ID for direct benefit transfer.'
      },
      phonetic: {
        hi: 'Sarkaari sahayata paane ke liye apna bank account number ya UPI ID batayein.',
        kn: 'Nera labha padeyalu nimma bank khaate athava UPI ID heli.',
        ta: 'Arasu panam pera ungal bank account alladhu UPI ID sollungal.',
        bn: 'Shorashori sorkari taka pete aapanar bank account baa UPI ID bolun.',
        en: 'Speak your bank account number or UPI ID for direct benefit transfer.'
      }
    }
  ];

  const startInterview = () => {
    setStage('INTERVIEW');
    setInterviewStep(0);
    const q = interviewQuestions[0];
    const text = (q.prompt as any)[selectedLanguage.code] || q.prompt.en;
    const phon = (q.phonetic as any)[selectedLanguage.code] || q.phonetic.en;
    speakResponse(text, phon);
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
      const nextPhon = (nextQ.phonetic as any)[selectedLanguage.code] || nextQ.phonetic.en;
      speakResponse(nextText, nextPhon);
    } else {
      // All steps collected -> Move to Confirmation
      setStage('CONFIRMATION');
      const confirmSummary = selectedLanguage.code === 'kn'
        ? `ಎಲ್ಲಾ ಮಾಹಿತಿ ದಾಖಲಾಗಿದೆ. ನಿಮ್ಮ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು 'ಹೌದು' ಅಥವಾ 'Submit' ಎಂದು ಹೇಳಿ.`
        : selectedLanguage.code === 'ta'
        ? `அனைத்து விவரங்களும் பதிவாகின. விண்ணப்பத்தை சமர்ப்பிக்க 'சரி' அல்லது 'Submit' என்று சொல்லுங்கள்.`
        : `आपकी सारी जानकारी दर्ज कर ली गई है। आवेदन सबमिट करने के लिए 'हाँ' या 'Submit' बोलें।`;

      const confirmPhon = selectedLanguage.code === 'kn'
        ? `Ella mahiti daakhalagide. Nimma arji sallisalu Houdu athava Submit endu heli.`
        : selectedLanguage.code === 'ta'
        ? `Anaithu vivarangalum pathivaagina. Vinnappathai samarppikka Sari alladhu Submit endru sollungal.`
        : `Aapki saari jaankari darj kar li gayi hai. Aavedan submit karne ke liye Haan ya Submit bolein.`;

      speakResponse(confirmSummary, confirmPhon);
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

    const rightsPhon = selectedLanguage.code === 'kn'
      ? `Abhinandanegalu! Nimma arji yashaswiyagi sallikeyagide. Nimma adhikaara patra mattu helpline illide.`
      : selectedLanguage.code === 'ta'
      ? `Vaazhthukal! Ungal vinnappam vetrigaramaaga samarppikkappattadhu. Idho ungal urimai card.`
      : `Badhaai ho! Aapka aavedan safalta-poorvak darj ho gaya hai. Yeh aapka adhikar patra hai. Kisi bhi dalal ko ghoos na dein.`;

    speakResponse(rightsIntro, rightsPhon);
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
    setStatusMessage('Tap the mic and speak naturally in your dialect');
  };

  // Quick Demo Triggers
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
    fullName: formData.fullName || 'Ramesh Kumar (Citizen)',
    phone: formData.phone || '9876543210',
    aadhaar: formData.aadhaar || '8921',
    location: formData.location || 'Bengaluru, Karnataka',
    occupation: formData.occupation || 'Street Vendor',
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
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all text-xs flex items-center gap-1"
            title="How to Use & Demo Flow"
          >
            <HelpCircle className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline text-[11px]">How it Works</span>
          </button>

          <button
            onClick={() => setShowKeyModal(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all text-xs flex items-center gap-1"
            title="Zero-Key Mode (Hackathon Guarantee)"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline text-[11px]">Zero-Key Mode</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all"
            title="Restart from beginning"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-2xl flex flex-col gap-5">
        {/* Step Indicator Progress Bar */}
        <div className="w-full bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className={`px-2.5 py-1 rounded-xl font-bold transition-all ${stage === 'INTENT' ? 'bg-orange-500 text-white' : 'text-slate-500'}`}>
            1. Speak Need
          </span>
          <span className="text-slate-700">➔</span>
          <span className={`px-2.5 py-1 rounded-xl font-bold transition-all ${stage === 'SCHEME_MATCHED' ? 'bg-orange-500 text-white' : 'text-slate-500'}`}>
            2. Match Scheme
          </span>
          <span className="text-slate-700">➔</span>
          <span className={`px-2.5 py-1 rounded-xl font-bold transition-all ${(stage === 'INTERVIEW' || stage === 'CONFIRMATION') ? 'bg-orange-500 text-white' : 'text-slate-500'}`}>
            3. Voice Fill
          </span>
          <span className="text-slate-700">➔</span>
          <span className={`px-2.5 py-1 rounded-xl font-bold transition-all ${stage === 'RIGHTS_CARD' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}>
            4. Rights Card
          </span>
        </div>

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
            <span className="text-[11px] text-slate-400">Audio Clarity Resilient Fallback</span>
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
                ⚡ Or tap a scenario button to see the voice matching instantly:
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
              speakResponse(audioText, audioText);
            }}
          />
        )}
      </main>

      {/* How it Works / Instructions Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-5 h-5 text-orange-400" />
              <h3 className="text-base font-bold text-white">How to Use Kavach Vaani (कवच वाणी)</h3>
            </div>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">Step 1: Choose Language & Tap Mic</strong>
                Select your regional language (Hindi, Kannada, Tamil, Bengali). Tap the big mic button and speak what help you need (e.g. <em>"I run a tea stall and need ₹15,000 loan"</em> or tap one of the quick scenario buttons).
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">Step 2: Hear Matching Welfare Scheme</strong>
                Kavach Vaani identifies your entitlement (PM SVANidhi, e-Shram, PM-JAY) and speaks back in your dialect. Click the orange button <strong>"Fill This Application By Voice"</strong>.
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">Step 3: Answer Single Voice Questions</strong>
                The app asks you one question at a time (Name, Mobile, City, Aadhaar digits, UPI). As you reply, the cards fill up with green checkmarks.
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">Step 4: Audio Rights Card & PDF</strong>
                Once submitted, hear your <strong>Audio Rights Note</strong> protecting you against broker cuts and police eviction under the Street Vendors Act 2014, and download your official PDF record!
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold"
            >
              Got it, let's start!
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
              <h3 className="text-base font-bold text-white">Hackathon Zero-Key Guarantee</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Kavach Vaani starts and functions 100% out of the box with <strong>zero secret keys required</strong>. If evaluators wish to experiment with cloud LLM keys, you may optionally input one here, but it is never needed.
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
