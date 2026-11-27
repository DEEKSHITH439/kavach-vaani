import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { VoiceEngine, SUPPORTED_LANGUAGES, VoiceOption, PlaybackState, AudioScenario } from './lib/voiceEngine';
import { Scheme, matchSchemeByIntent, SCHEMES_DATABASE } from './lib/schemeRules';
import { VoiceVisualizer } from './components/VoiceVisualizer';
import { LanguageSelector } from './components/LanguageSelector';
import { SchemeCard } from './components/SchemeCard';
import { AudioRightsCard } from './components/AudioRightsCard';
import { LiveApplicationCard } from './components/LiveApplicationCard';
import { FormSubmissionData } from './lib/documentGenerator';
import { Shield, RefreshCw, Volume2, Key, Check, HelpCircle, Radio, Lock, FileCheck } from 'lucide-react';

export function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<VoiceOption>(SUPPORTED_LANGUAGES[0]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Tap the mic and speak naturally in your dialect');
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  
  // Real-time audio source indicator
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    source: 'none',
    languageCode: 'hi',
    languageLabel: 'हिन्दी'
  });

  // App Stage: 'INTENT' -> 'SCHEME_MATCHED' -> 'CONSENT' -> 'INTERVIEW' -> 'CONFIRMATION' -> 'RIGHTS_CARD'
  const [stage, setStage] = useState<'INTENT' | 'SCHEME_MATCHED' | 'CONSENT' | 'INTERVIEW' | 'CONFIRMATION' | 'RIGHTS_CARD'>('INTENT');
  
  // Matched Scheme
  const [matchedScheme, setMatchedScheme] = useState<Scheme | null>(null);
  const [matchReason, setMatchReason] = useState<string>('');

  // Voice Interview Fields - Privacy Safe: Stores only masked / minimal necessary fields
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

  // Approved Master Script Content Mapping
  const approvedScripts = {
    greeting: {
      en: "Namaste! I am Kavach Vaani. Tell me what work you do and what kind of financial assistance or working-capital loan you need.",
      kn: "ನಮಸ್ಕಾರ! ನಾನು ಕವಚ ವಾಣಿ. ನೀವು ಯಾವ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ ಮತ್ತು ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಆರ್ಥಿಕ ಸಹಾಯ ಅಥವಾ ದುಡಿಯುವ ಬಂಡವಾಳ ಸಾಲ ಬೇಕು ಎಂದು ತಿಳಿಸಿ.",
      hi: "नमस्ते! मैं कवच वाणी हूँ। आप क्या काम करते हैं और आपको किस तरह की वित्तीय सहायता या कार्यशील पूंजी ऋण की आवश्यकता है, कृपया बताएं।",
      ta: "வணக்கம்! நான் கவச் வாணி. நீங்கள் என்ன வேலை செய்கிறீர்கள், உங்களுக்கு என்ன வகையான நிதி உதவி அல்லது நடைமுறை மூலதனக் கடன் தேவை என்பதை கூறுங்கள்.",
      bn: "নমস্কার! আমি কবচ বাণী। আপনি কী কাজ করেন এবং আপনার কী ধরনের আর্থিক সহায়তা বা চলতি মূলধন ঋণ প্রয়োজন, দয়া করে বলুন।"
    },
    schemeExplanation: {
      en: "Based on the information you shared, you may be eligible to apply for a PM SVANidhi working-capital loan. This scheme provides collateral-free loans to eligible street vendors, subject to verification and lender approval. The scheme offers loans in three progressive stages. You may receive a first loan of up to ₹15,000. After successfully repaying the first loan and meeting the applicable requirements, you may be considered for a second loan of up to ₹25,000. Similarly, after successfully repaying the second loan, you may be considered for a third loan of up to ₹50,000. If you repay your loan on time, you may be eligible for an interest subsidy of 7% per year, subject to the scheme rules. This subsidy helps reduce your interest burden. It is not a loan waiver or a free grant. For application and eligibility verification, a valid Certificate of Vending or Letter of Recommendation may be used, subject to the applicable scheme requirements. The lending institution will also assess your application. For complete eligibility information, please consult your local Urban Local Body or the official PM SVANidhi portal. Would you like to check your eligibility now?",
      kn: "ನೀವು ಹಂಚಿಕೊಂಡ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ, ನೀವು 'ಪಿಎಂ ಸ್ವನಿಧಿ' ದುಡಿಯುವ ಬಂಡವಾಳ ಸಾಲಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಅರ್ಹತೆ ಹೊಂದಿರಬಹುದು. ಈ ಯೋಜನೆಯು ಅರ್ಹ ಬೀದಿ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಯಾವುದೇ ಭದ್ರತೆ ಅಥವಾ ಗ್ಯಾರಂಟಿ ಇಲ್ಲದೆ ಸಾಲ ಸೌಲಭ್ಯವನ್ನು ಒದಗಿಸುತ್ತದೆ, ಇದು ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆ ಮತ್ತು ಸಾಲ ನೀಡುವ ಬ್ಯಾಂಕಿನ ಅನುಮೋದನೆಗೆ ಒಳಪಟ್ಟಿರುತ್ತದೆ. ಈ ಯೋಜನೆಯು ಮೂರು ಹಂತಗಳಲ್ಲಿ ಸಾಲಗಳನ್ನು ನೀಡುತ್ತದೆ. ಮೊದಲ ಹಂತದಲ್ಲಿ ನೀವು ₹15,000 ವರೆಗೆ ಸಾಲವನ್ನು ಪಡೆಯಬಹುದು. ಮೊದಲ ಸಾಲವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮರುಪಾವತಿಸಿದ ನಂತರ ಮತ್ತು ಅನ್ವಯವಾಗುವ ಮಾನದಂಡಗಳನ್ನು ಪೂರೈಸಿದರೆ, ಎರಡನೇ ಹಂತದಲ್ಲಿ ₹25,000 ವರೆಗಿನ ಸಾಲಕ್ಕೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ. ಅದೇ ರೀತಿ ಎರಡನೇ ಸಾಲವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮರುಪಾವತಿಸಿದ ನಂತರ, ಮೂರನೇ ಹಂತದಲ್ಲಿ ₹50,000 ವರೆಗಿನ ಸಾಲಕ್ಕೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ. ನಿಮ್ಮ ಸಾಲವನ್ನು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಮರುಪಾವತಿಸಿದರೆ, ಯೋಜನೆಯ ನಿಯಮಗಳ ಪ್ರಕಾರ ನೀವು ವರ್ಷಕ್ಕೆ ಶೇಕಡಾ 7 ರ ಬಡ್ಡಿ ಸಬ್ಸಿಡಿಗೆ ಅರ್ಹರಾಗಬಹುದು. ಈ ಸಬ್ಸಿಡಿಯು ನಿಮ್ಮ ಬಡ್ಡಿಯ ಹೊರೆಯನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಇದು ಸಾಲ ಮನ್ನಾ ಅಥವಾ ಉಚಿತ ಅನುದಾನವಲ್ಲ. ಅರ್ಜಿ ಮತ್ತು ಅರ್ಹತಾ ಪರಿಶೀಲನೆಗಾಗಿ, ಮಾನ್ಯವಾದ ವ್ಯಾಪಾರ ಪ್ರಮಾಣಪತ್ರ (Certificate of Vending) ಅಥವಾ ಶಿಫಾರಸು ಪತ್ರವನ್ನು (Letter of Recommendation) ಬಳಸಬಹುದು. ಸಾಲ ನೀಡುವ ಹಣಕಾಸು ಸಂಸ್ಥೆಯು ನಿಮ್ಮ ಅರ್ಜಿಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ. ಸಂಪೂರ್ಣ ಮಾಹಿತಿಗಾಗಿ ನಿಮ್ಮ ನಗರ ಸ್ಥಳೀಯ ಸಂಸ್ಥೆ (ULB) ಅಥವಾ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಸಂಪರ್ಕಿಸಿ. ನಿಮ್ಮ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಲು ಬಯಸುವಿರಾ?",
      hi: "आपके द्वारा साझा की गई जानकारी के आधार पर, आप 'पीएम स्वनिधि' कार्यशील पूंजी ऋण के लिए आवेदन करने के पात्र हो सकते हैं। यह योजना पात्र स्ट्रीट वेंडरों को बिना किसी गारंटी के ऋण प्रदान करती है, जो सत्यापन और ऋणदाता बैंक की मंजूरी के अधीन है। यह योजना तीन क्रमिक चरणों में ऋण प्रदान करती है। आप पहली बार में ₹15,000 तक का ऋण प्राप्त कर सकते हैं। पहले ऋण का सफलतापूर्वक पुनर्भुगतान करने और लागू शर्तों को पूरा करने के बाद, आपको ₹25,000 तक के दूसरे ऋण के लिए विचार किया जा सकता है। इसी तरह दूसरे ऋण का सफलतापूर्वक पुनर्भुगतान करने के बाद, ₹50,000 तक के तीसरे ऋण के लिए विचार किया जा सकता है। यदि आप अपना ऋण समय पर चुकाते हैं, तो आप योजना के नियमों के अनुसार प्रति वर्ष 7% की ब्याज सब्सिडी के पात्र हो सकते हैं। यह सब्सिडी आपके ब्याज के बोझ को कम करने में मदद करती है। यह कोई ऋण माफी या मुफ्त अनुदान नहीं है। आवेदन और पात्रता सत्यापन के लिए, वैध वेंडिंग प्रमाण पत्र (Certificate of Vending) या सिफारिश पत्र (Letter of Recommendation) का उपयोग किया जा सकता है। ऋण देने वाला संस्थान भी आपके आवेदन का मूल्यांकन करेगा। पूर्ण पात्रता जानकारी के लिए अपने शहरी स्थानीय निकाय (ULB) या आधिकारिक पीएम स्वनिधि पोर्टल से परामर्श करें। क्या आप अभी अपनी पात्रता जांचना चाहते हैं?",
      ta: "நீங்கள் பகிர்ந்த தகவலின் அடிப்படையில், 'பிஎம் ஸ்வநிதி' நடைமுறை மூலதனக் கடனுக்கு விண்ணப்பிக்க நீங்கள் தகுதி பெற வாய்ப்புள்ளது. இத்திட்டம் தகுதியான தெருவோர வியாபாரிகளுக்கு பிணையமில்லாத கடன்களை வழங்குகிறது; இது ஆவண சரிபார்ப்பு மற்றும் கடன் வழங்கும் வங்கியின் ஒப்புதலுக்கு உட்பட்டது. இத்திட்டம் மூன்று படிப்படியான நிலைகளில் கடன்களை வழங்குகிறது. நீங்கள் முதல் கடனாக ₹15,000 வரை பெறலாம். முதல் கடனை வெற்றிகரமாக திருப்பிச் செலுத்தி, தேவையான நிபந்தனைகளை பூர்த்தி செய்த பிறகு, இரண்டாவது கடனாக ₹25,000 வரை நீங்கள் பரிசீலிக்கப்படலாம். அதேபோல் இரண்டாவது கடனை வெற்றிகரமாக திருப்பிச் செலுத்திய பிறகு, மூன்றாவது கடனாக ₹50,000 வரை பரிசீலிக்கப்படலாம். உங்கள் கடனை உரிய நேரத்தில் திருப்பிச் செலுத்தினால், திட்ட விதிகளின்படி ஆண்டுக்கு 7% வட்டி மானியம் பெற நீங்கள் தகுதியடையலாம். இது கடன் தள்ளுபடியோ அல்லது இலவச நிதியோ அல்ல. விண்ணப்பம் மற்றும் தகுதி சரிபார்ப்பிற்கு, செல்லுபடியாகும் வியாபாரச் சான்றிதழ் (Certificate of Vending) அல்லது பரிந்துரைக் கடிதம் (Letter of Recommendation) பயன்படுத்தப்படலாம். முழுமையான விவரங்களை அறிய உங்கள் உள்ளாட்சி அமைப்பை (ULB) அல்லது அதிகாரப்பூர்வ இணையதளத்தை அணுகவும். உங்கள் தகுதியை இப்போது சரிபார்க்க விரும்புகிறீர்களா?",
      bn: "আপনার দেওয়া তথ্যের ভিত্তিতে, আপনি 'পিএম স্বনিধি' চলতি মূলধন ঋণের জন্য আবেদন করার যোগ্য হতে পারেন। এই প্রকল্পটি উপযুক্ত স্ট্রিট ভেন্ডরদের জামানতহীন ঋণ প্রদান করে, যা নথি যাচাইকরণ এবং ঋণদাতা ব্যাঙ্কের অনুমোদনের ওপর নির্ভরশীল। এই প্রকল্পে তিনটি ধারাবাহিক ধাপে ঋণ দেওয়া হয়। আপনি প্রথম ধাপে ₹১৫,০০০ পর্যন্ত ঋণ পেতে পারেন। প্রথম ঋণটি সফলভাবে পরিশোধ করার পর এবং প্রযোজ্য শর্তাবলী পূরণ করলে, আপনি দ্বিতীয় ধাপে ₹২৫,০০০ পর্যন্ত ঋণের জন্য বিবেচিত হতে পারেন। একইভাবে দ্বিতীয় ঋণ সফলভাবে পরিশোধের পর, আপনি তৃতীয় ধাপে ₹৫০,০০০ পর্যন্ত ঋণের জন্য বিবেচিত হতে পারেন। যদি আপনি সময়মতো ঋণ পরিশোধ করেন, তবে প্রকল্পের নিয়ম অনুযায়ী আপনি বার্ষিক ৭% হারে সুদ ভর্তুকি পেতে পারেন। এটি কোনো ঋণ মকুব বা অনুদান নয়। আবেদন এবং যোগ্যতা যাচাইয়ের জন্য বৈধ ভেন্ডিং শংসাপত্র (Certificate of Vending) বা পুরসভার সুপারিশপত্র (Letter of Recommendation) ব্যবহার করা যেতে পারে। সম্পূর্ণ তথ্যের জন্য আপনার স্থানীয় পুরসভা (ULB) বা অফিসিয়াল পোর্টালে যোগাযোগ করুন। আপনি কি এখন আপনার যোগ্যতা যাচাই করতে চান?"
    },
    consentIntro: {
      en: "To help check your eligibility and prepare your application, I will ask you a few simple questions one by one. Your information will be used for the application-related purpose explained to you. Please share only the information necessary for this process. Are you comfortable proceeding? If yes, let us begin with your full name.",
      kn: "ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ಮತ್ತು ನಿಮ್ಮ ಅರ್ಜಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಲು ಸಹಾಯ ಮಾಡಲು, ನಾನು ಒಂದೊಂದಾಗಿ ಕೆಲವು ಸರಳ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳುತ್ತೇನೆ. ನಿಮಗೆ ವಿವರಿಸಿದಂತೆ ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಕೇವಲ ಅರ್ಜಿ ಸಂಬಂಧಿತ ಉದ್ದೇಶಕ್ಕಾಗಿ ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ. ದಯವಿಟ್ಟು ಈ ಪ್ರಕ್ರಿಯೆಗೆ ಅಗತ್ಯವಿರುವ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ಹಂಚಿಕೊಳ್ಳಿ. ಮುಂದುವರಿಯಲು ನಿಮಗೆ ಸಮ್ಮತಿಯೇ? ಹೌದಾದರೆ, ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರಿನೊಂದಿಗೆ ಆರಂಭಿಸೋಣ.",
      hi: "आपकी पात्रता जांचने और आपका आवेदन तैयार करने में मदद के लिए, मैं एक-एक करके कुछ आसान सवाल पूछूंगी। आपकी जानकारी का उपयोग केवल आपको बताए गए आवेदन संबंधी उद्देश्य के लिए ही किया जाएगा। कृपया इस प्रक्रिया के लिए केवल आवश्यक जानकारी ही साझा करें। क्या आप आगे बढ़ने में सहज हैं? यदि हाँ, तो आइए अपने पूरे नाम से शुरुआत करें।",
      ta: "உங்கள் தகுதியை சரிபார்த்து விண்ணப்பத்தை தயார் செய்ய உதவ, நான் எளிய கேள்விகளை ஒவ்வொன்றாக கேட்பேன். உங்களுக்கு விளக்கப்பட்ட விண்ணப்பம் தொடர்பான நோக்கத்திற்காக மட்டுமே உங்கள் தகவல் பயன்படுத்தப்படும். தயவுசெய்து இந்த செயல்முறைக்கு தேவையான தகவல்களை மட்டுமே பகிருங்கள். தொடர உங்களுக்கு விருப்பமா? ஆம் என்றால், உங்கள் முழு பெயருடன் தொடங்குவோம்.",
      bn: "আপনার যোগ্যতা যাচাই করতে এবং আপনার আবেদন প্রস্তুত করতে সাহায্য করার জন্য, আমি একে একে কয়েকটি সহজ প্রশ্ন করব। আপনার তথ্য শুধুমাত্র আপনাকে জানানো আবেদন সংক্রান্ত উদ্দেশ্যের জন্যই ব্যবহৃত হবে। অনুগ্রহ করে এই প্রক্রিয়ার জন্য কেবল প্রয়োজনীয় তথ্যটুকুই শেয়ার করুন। আপনি কি এগিয়ে যেতে প্রস্তুত? যদি হ্যাঁ হয়, তবে আপনার পুরো নাম দিয়ে শুরু করা যাক।"
    }
  };

  useEffect(() => {
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
    if (voiceEngineRef.current) {
      voiceEngineRef.current.setLanguage(lang.code);
    }

    const greetingText = approvedScripts.greeting[lang.code] || approvedScripts.greeting.en;
    speakResponse(greetingText, 'greeting');
  };

  const speakResponse = (text: string, scenario?: AudioScenario, onDone?: () => void) => {
    if (!voiceEngineRef.current) return;

    voiceEngineRef.current.stopListening();
    setIsListening(false);

    setIsSpeaking(true);
    isSpeakingRef.current = true;
    setStatusMessage('Kavach Vaani is speaking to you...');

    voiceEngineRef.current.speak(text, {
      scenario,
      onEnd: () => {
        setTimeout(() => {
          setIsSpeaking(false);
          isSpeakingRef.current = false;
          setStatusMessage('Tap mic to reply');
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
      setStatusMessage('Listening paused. Tap mic to speak.');
      return;
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

      const explanation = approvedScripts.schemeExplanation[selectedLanguage.code] || approvedScripts.schemeExplanation.en;
      speakResponse(explanation, 'scheme_match');
      return;
    }

    if (stage === 'CONSENT') {
      const lower = text.toLowerCase();
      if (lower.includes('haan') || lower.includes('yes') || lower.includes('sari') || lower.includes('ha') || lower.includes('houdu') || lower.includes('aam')) {
        proceedToInterview();
      } else {
        speakResponse('Please confirm with Yes / Haan to proceed, or you may stop anytime.');
      }
      return;
    }

    if (stage === 'INTERVIEW') {
      handleInterviewAnswer(text);
      return;
    }

    if (stage === 'CONFIRMATION') {
      const lower = text.toLowerCase();
      if (lower.includes('haan') || lower.includes('yes') || lower.includes('sari') || lower.includes('ha') || lower.includes('thik') || lower.includes('submit') || lower.includes('maadi') || lower.includes('houdu')) {
        finalizeApplication();
      } else {
        speakResponse('Please say Haan or Submit to confirm, or tap the Submit button.');
      }
    }
  };

  const promptConsentStage = () => {
    setStage('CONSENT');
    const consentText = approvedScripts.consentIntro[selectedLanguage.code] || approvedScripts.consentIntro.en;
    speakResponse(consentText, 'interview_intro');
  };

  const proceedToInterview = () => {
    setStage('INTERVIEW');
    setInterviewStep(0);
    const q = interviewQuestions[0];
    const text = (q.prompt as any)[selectedLanguage.code] || q.prompt.en;
    speakResponse(text);
  };

  // Structured Interview Questions including CoV / LoR status check
  const interviewQuestions = [
    {
      field: 'fullName',
      label: 'Citizen Name',
      prompt: {
        hi: 'कृपया अपना पूरा नाम बताएं।',
        kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ಹೇಳಿ.',
        ta: 'தயவுசெய்து உங்கள் முழு பெயரை சொல்லுங்கள்.',
        bn: 'আপনার পুরো নাম বলুন।',
        en: 'Please tell me your full name.'
      }
    },
    {
      field: 'phone',
      label: 'Mobile Contact',
      prompt: {
        hi: 'अपना 10 अंकों का मोबाइल नंबर बताएं।',
        kn: 'ನಿಮ್ಮ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ತಿಳಿಸಿ.',
        ta: 'உங்கள் 10 இலக்க மொபைல் எண்ணை சொல்லுங்கள்.',
        bn: 'আপনার ১০ সংখ্যার মোবাইল নম্বর বলুন।',
        en: 'Please speak your 10-digit mobile number.'
      }
    },
    {
      field: 'location',
      label: 'Work Town / City',
      prompt: {
        hi: 'आप किस शहर या कस्बे में वेंडिंग करते हैं?',
        kn: 'ನೀವು ಯಾವ ನಗರ ಅಥವಾ ಪಟ್ಟಣದಲ್ಲಿ ವ್ಯಾಪಾರ ಮಾಡುತ್ತಿದ್ದೀರಿ?',
        ta: 'நீங்கள் எந்த ஊரில் வியாபாரம் செய்கிறீர்கள்?',
        bn: 'আপনি কোন শহরে ব্যবসা করেন?',
        en: 'Which city or town do you operate in?'
      }
    },
    {
      field: 'covStatus',
      label: 'CoV / LoR Document',
      prompt: {
        hi: 'क्या आपके पास वेंडिंग प्रमाण पत्र (CoV) या नगर निकाय का सिफारिश पत्र (LoR) है?',
        kn: 'ನಿಮ್ಮ ಬಳಿ ವ್ಯಾಪಾರ ಪ್ರಮಾಣಪತ್ರ (CoV) ಅಥವಾ ಶಿಫಾರಸು ಪತ್ರ (LoR) ಇದೆಯೇ?',
        ta: 'உங்களிடம் வியாபாரச் சான்றிதழ் (CoV) அல்லது பரிந்துரைக் கடிதம் (LoR) உள்ளதா?',
        bn: 'আপনার কাছে কি ভেন্ডিং শংসাপত্র (CoV) বা পুরসভার সুপারিশপত্র (LoR) আছে?',
        en: 'Do you have a Certificate of Vending (CoV) or Letter of Recommendation (LoR)?'
      }
    },
    {
      field: 'aadhaarLast4',
      label: 'Aadhaar (Last 4)',
      prompt: {
        hi: 'सुरक्षा के लिए, केवल अपने आधार कार्ड के अंतिम 4 अंक बताएं।',
        kn: 'ಸುರಕ್ಷತೆಗಾಗಿ, ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್‌ನ ಕೊನೆಯ 4 ಅಂಕಿಗಳನ್ನು ಮಾತ್ರ ಹೇಳಿ.',
        ta: 'பாதுகாப்பிற்காக, உங்கள் ஆதார் அட்டையின் கடைசி 4 இலக்கங்களை மட்டும் சொல்லுங்கள்.',
        bn: 'সুরক্ষার জন্য, আপনার আধার কার্ডের শেষ ৪টি সংখ্যা বলুন।',
        en: 'For privacy, please speak only the last 4 digits of your Aadhaar card.'
      }
    },
    {
      field: 'bankAccountLast4',
      label: 'Bank Account (Last 4)',
      prompt: {
        hi: 'सरकारी ऋण सहायता के लिए अपने बैंक खाते के अंतिम 4 अंक या UPI आईडी बताएं।',
        kn: 'ನೇರ ಸಾಲ ಸೌಲಭ್ಯಕ್ಕಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಯ ಕೊನೆಯ 4 ಅಂಕಿ ಅಥವಾ UPI ಐಡಿ ಹೇಳಿ.',
        ta: 'நேரடி வங்கி பரிமாற்றத்திற்கு உங்கள் வங்கி கணக்கின் கடைசி 4 இலக்கம் அல்லது UPI ஐடி சொல்லுங்கள்.',
        bn: 'সরাসরি ব্যাঙ্ক সহায়তার জন্য আপনার অ্যাকাউন্টের শেষ ৪টি সংখ্যা বা ইউপিআই আইডি বলুন।',
        en: 'Speak the last 4 digits of your bank account or UPI ID for DBT transfer.'
      }
    }
  ];

  const handleInterviewAnswer = (answer: string) => {
    const currentQ = interviewQuestions[interviewStep];
    const field = currentQ.field;

    let sanitizedAnswer = answer;
    if (field === 'aadhaarLast4' || field === 'bankAccountLast4') {
      const digits = answer.replace(/\D/g, '');
      sanitizedAnswer = digits.length >= 4 ? digits.slice(-4) : digits || answer;
    }

    setFormData(prev => ({
      ...prev,
      [field]: sanitizedAnswer
    }));

    if (interviewStep < interviewQuestions.length - 1) {
      const nextStep = interviewStep + 1;
      setInterviewStep(nextStep);
      const nextQ = interviewQuestions[nextStep];
      const nextText = (nextQ.prompt as any)[selectedLanguage.code] || nextQ.prompt.en;
      speakResponse(nextText);
    } else {
      setStage('CONFIRMATION');
      const confirmSummary = selectedLanguage.code === 'kn'
        ? `ಎಲ್ಲಾ ಮಾಹಿತಿ ದಾಖಲಾಗಿದೆ. ನಿಮ್ಮ ಡೆಮೊ ಅರ್ಜಿ ಪರಿಶೀಲಿಸಲು 'ಹೌದು' ಅಥವಾ 'Submit' ಎಂದು ಹೇಳಿ.`
        : selectedLanguage.code === 'ta'
        ? `அனைத்து விவரங்களும் பதிவாகின. விண்ணப்பத்தை சமர்ப்பிக்க 'சரி' அல்லது 'Submit' என்று சொல்லுங்கள்.`
        : `आपकी सारी जानकारी दर्ज कर ली गई है। आवेदन सबमिट करने के लिए 'हाँ' या 'Submit' बोलें।`;

      speakResponse(confirmSummary);
    }
  };

  const finalizeApplication = () => {
    const newId = `KV-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
    setApplicationId(newId);
    
    // Fallback ensure matchedScheme is never null so Rights Card always renders
    const activeScheme = matchedScheme || SCHEMES_DATABASE[0];
    if (!matchedScheme) {
      setMatchedScheme(activeScheme);
    }
    
    setStage('RIGHTS_CARD');

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    const rightsCardSpeech = activeScheme.legalRightsAudioText[selectedLanguage.code] || activeScheme.legalRightsAudioText['en'] || approvedScripts.schemeExplanation.en;
    speakResponse(rightsCardSpeech, 'rights_card');

    // Smoothly scroll down so the user immediately sees the generated Rights Card below the hero
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
    setStatusMessage('Tap the mic and speak naturally in your dialect');
  };

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
    aadhaarLast4: formData.aadhaarLast4 || '8921',
    location: formData.location || 'Bengaluru, Karnataka',
    occupation: formData.occupation || 'Street Vendor',
    bankAccountLast4: formData.bankAccountLast4 || '6182',
    upiId: formData.upiId || 'ramesh@upi',
    appliedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    applicationId: applicationId || 'KV-DEMO-782914',
    isSimulation: true
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-3 sm:p-6 pb-20 selection:bg-orange-500">
      {/* Top Prototype Sandbox Notice Bar */}
      <div className="w-full max-w-2xl bg-amber-950/40 border border-amber-500/30 rounded-xl px-3 py-1.5 mb-2 flex items-center justify-between text-[11px] text-amber-300">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <strong>Build for Bharat Hackathon Prototype:</strong> Sandbox Simulation Mode Active
        </span>
        <span className="text-[10px] text-amber-400/80">Zero Secret Keys Required</span>
      </div>

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
                ಕವಚ ವಾಣಿ
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Multilingual Voice Companion for Financial Inclusion & Welfare</p>
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
            title="Reset Conversation & Purge Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-2xl flex flex-col gap-5">
        {/* Step Indicator Progress Bar */}
        <div className="w-full bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className={`px-2 py-1 rounded-xl font-bold transition-all ${stage === 'INTENT' ? 'bg-orange-500 text-white' : 'text-slate-500'}`}>
            1. Speak Need
          </span>
          <span className="text-slate-700">➔</span>
          <span className={`px-2 py-1 rounded-xl font-bold transition-all ${stage === 'SCHEME_MATCHED' ? 'bg-orange-500 text-white' : 'text-slate-500'}`}>
            2. Scheme Match
          </span>
          <span className="text-slate-700">➔</span>
          <span className={`px-2 py-1 rounded-xl font-bold transition-all ${stage === 'CONSENT' ? 'bg-orange-500 text-white' : 'text-slate-500'}`}>
            3. Consent Check
          </span>
          <span className="text-slate-700">➔</span>
          <span className={`px-2 py-1 rounded-xl font-bold transition-all ${(stage === 'INTERVIEW' || stage === 'CONFIRMATION') ? 'bg-orange-500 text-white' : 'text-slate-500'}`}>
            4. Details
          </span>
          <span className="text-slate-700">➔</span>
          <span className={`px-2 py-1 rounded-xl font-bold transition-all ${stage === 'RIGHTS_CARD' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}>
            5. Rights Card
          </span>
        </div>

        {/* Dialect Selector */}
        <LanguageSelector
          currentLanguage={selectedLanguage}
          onSelect={handleLanguageChange}
          disabled={isListening || isSpeaking}
        />

        {/* Live Audio Interaction Hero Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-pulse' : isListening ? 'bg-orange-400 animate-ping' : 'bg-slate-500'}`} />
              <span className="font-semibold text-slate-300">
                {playbackState.isPlaying
                  ? playbackState.source === 'bundled_audio'
                    ? `Playing Genuine ${playbackState.languageLabel} Audio`
                    : `Speaking ${playbackState.languageLabel} via System Voice`
                  : 'Empathetic Vernacular AI Engine'}
              </span>
            </div>
            {playbackState.isPlaying && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-mono">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                {playbackState.source === 'bundled_audio' ? 'OFFLINE RECORDING' : 'SYSTEM TTS'}
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
                ⚡ Or tap a scenario preset button to test intent matching:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickDemoTrigger('street-vendor')}
                  className="px-3 py-1.5 rounded-xl bg-orange-950/40 hover:bg-orange-900/60 border border-orange-500/30 text-orange-200 text-xs font-medium transition-all"
                >
                  🍵 Tea Stall Vendor (PM SVANidhi Loan)
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
                  🧱 Construction Laborer (BOCW Welfare)
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
          />
        )}

        {/* STAGE 2: Explicit Privacy & Consent Gate */}
        {stage === 'CONSENT' && (
          <div className="bg-slate-900 border-2 border-orange-500/50 rounded-3xl p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-2 mb-3 text-orange-400">
              <Lock className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Privacy Notice & Explicit Consent (सहमति)</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {approvedScripts.consentIntro[selectedLanguage.code] || approvedScripts.consentIntro.en}
            </p>

            <div className="bg-black/40 p-3 rounded-2xl border border-white/5 mb-5 space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Data minimization: Only last 4 digits of Aadhaar/Bank are gathered.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero cloud persistence: All inputs stay in memory and are purged on reset.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>No automated submission without explicit final verbal review.</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Decline / Stop
              </button>
              <button
                onClick={proceedToInterview}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
              >
                Yes, I Agree & Give Consent (हाँ, सहमत हूँ)
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
            />

            {stage === 'CONFIRMATION' && (
              <div className="p-4 rounded-2xl bg-orange-950/40 border border-orange-500/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-orange-300 block">Say 'Haan / Yes' or tap to submit demo</span>
                  <span className="text-[11px] text-slate-400">Audio playback summary verified</span>
                </div>
                <button
                  onClick={finalizeApplication}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                >
                  Submit Demo Application
                </button>
              </div>
            )}
          </div>
        )}

        {/* STAGE 4: Final Audio Rights Card & PDF Generator */}
        {stage === 'RIGHTS_CARD' && (
          <div id="audio-rights-card-section" className="scroll-mt-6 animate-fade-in">
            <AudioRightsCard
              scheme={matchedScheme || SCHEMES_DATABASE[0]}
              formData={submissionPayload}
              languageCode={selectedLanguage.code}
              isPlayingNote={isSpeaking}
              onPlayVoiceNote={() => {
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
              <h3 className="text-base font-bold text-white">How to Use Kavach Vaani (ಕವಚ ವಾಣಿ)</h3>
            </div>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">Step 1: Choose Language & State Your Need</strong>
                Select your language. Tap the mic and speak what help or loan you need (e.g. <em>"I run a tea stall and need ₹15,000 loan"</em>).
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">Step 2: Hear Genuine Welfare Guidance</strong>
                Kavach Vaani explains PM SVANidhi's 3-stage progressive loans (₹15,000 / ₹25,000 / ₹50,000) and the 7% interest subsidy upon timely repayment.
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">Step 3: Purpose-Bound Privacy Consent</strong>
                Before any details are collected, the assistant requests explicit consent and explains data usage safeguards.
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">Step 4: Check CoV & Answer Minimal Questions</strong>
                The app guides you regarding Certificate of Vending (CoV) or Letter of Recommendation (LoR) and captures only minimal necessary information.
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">Step 5: Audio Rights Card & PDF</strong>
                Once verified, hear your <strong>Audio Rights Card</strong> quoting Section 18(3) of the Street Vendors Act 2014, and download your official simulation slip!
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
              Kavach Vaani runs 100% out of the box with <strong>zero secret keys required</strong>. Optional external TTS services can be plugged in here if desired, but are completely optional.
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
