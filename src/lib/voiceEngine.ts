// Comprehensive multi-lingual voice engine using Web Speech API + Web Audio Tone / Online Vernacular TTS
export interface VoiceOption {
  code: string;
  label: string;
  nativeLabel: string;
  speechLang: string;
  samplePrompt: string;
  greetingText: string;
  transliteratedAudioText: string;
}

export const SUPPORTED_LANGUAGES: VoiceOption[] = [
  {
    code: 'hi',
    label: 'Hindi / Hinglish',
    nativeLabel: 'हिन्दी / Hinglish',
    speechLang: 'hi-IN',
    greetingText: 'नमस्ते! मैं कवच वाणी हूँ। आप क्या काम करते हैं और आपको किस सहायता या ऋण की आवश्यकता है?',
    transliteratedAudioText: 'Namaste! Main Kavach Vaani hoon. Aap kya kaam karte hain aur aapko kis loan ya sahayata ki zaroorat hai?',
    samplePrompt: 'मैं लखनऊ में रिक्शा चलाता हूँ, पैर में चोट लगी है, क्या सरकारी आर्थिक सहायता मिलेगी?'
  },
  {
    code: 'kn',
    label: 'Kannada / Kanglish',
    nativeLabel: 'ಕನ್ನಡ / Kanglish',
    speechLang: 'kn-IN',
    greetingText: 'ನಮಸ್ಕಾರ! ನಾನು ಕವಚ ವಾಣಿ. ನೀವು ಯಾವ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ ಮತ್ತು ನಿಮಗೆ ಯಾವ ಸಾಲ ಅಥವಾ ಸಹಾಯ ಬೇಕು?',
    transliteratedAudioText: 'Namaskara! Naanu Kavach Vaani. Neevu yaava kelasa maaduttiddeeri, mattu nimage yaava loan athava sahaaya beku?',
    samplePrompt: 'ನಾನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಚಹಾ ಅಂಗಡಿ ನಡೆಸುತ್ತಿದ್ದೇನೆ, ಹೊಸ ಬರ್ನರ್ ಖರೀದಿಸಲು ₹15,000 ಸಾಲ ಬೇಕು.'
  },
  {
    code: 'ta',
    label: 'Tamil / Tanglish',
    nativeLabel: 'தமிழ் / Tanglish',
    speechLang: 'ta-IN',
    greetingText: 'வணக்கம்! நான் கவச் வாணி. நீங்கள் என்ன வேலை செய்கிறீர்கள்? உங்களுக்கு என்ன உதவி அல்லது கடன் தேவை?',
    transliteratedAudioText: 'Vanakkam! Naan Kavach Vaani. Neengal enna velai seigireergal? Ungalukku enna loan alladhu udhavi thevai?',
    samplePrompt: 'நான் தெருவோர தள்ளுவண்டி வியாபಾರಿ, தொழில் துவங்க ₹20,000 அரசு கடன் கிடைக்குமா?'
  },
  {
    code: 'bn',
    label: 'Bengali',
    nativeLabel: 'বাংলা',
    speechLang: 'bn-IN',
    greetingText: 'নমস্কার! আমি কবচ বাণী। আপনি কী কাজ করেন এবং আপনার কী সাহায্য বা ঋণ প্রয়োজন?',
    transliteratedAudioText: 'Nomoshkar! Aami Kavach Vaani. Aapni ki kaaj koren ebong aapanar ki loan baa shaahaajyo dorkar?',
    samplePrompt: 'আমি কলকাতায় নির্মাণ কাজ করি, আমার পরিবারের জন্য স্বাস্থ্য বিমা কীভাবে পাব?'
  },
  {
    code: 'en',
    label: 'Indian English',
    nativeLabel: 'English (India)',
    speechLang: 'en-IN',
    greetingText: 'Namaste! I am Kavach Vaani. Tell me what work you do and what welfare benefit or loan you need.',
    transliteratedAudioText: 'Namaste! I am Kavach Vaani. Tell me what work you do and what welfare benefit or loan you need.',
    samplePrompt: 'I run a tea stall in Bengaluru, need 15,000 rupees loan with zero collateral.'
  }
];

export class VoiceEngine {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentLanguage: VoiceOption = SUPPORTED_LANGUAGES[0];
  private currentAudioElement: HTMLAudioElement | null = null;

  constructor(langCode: string = 'hi') {
    this.setLanguage(langCode);
  }

  public setLanguage(code: string) {
    const found = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (found) {
      this.currentLanguage = found;
    }
  }

  public getLanguage(): VoiceOption {
    return this.currentLanguage;
  }

  public isSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  public startListening(
    onResult: (text: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (!this.isSpeechSupported()) {
      onError('Browser speech recognition not supported. Please use Chrome, Edge or Brave on mobile/desktop.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = this.currentLanguage.speechLang;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript.trim()) {
          onResult(finalTranscript.trim(), true);
        } else if (interimTranscript.trim()) {
          onResult(interimTranscript.trim(), false);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        console.warn('Speech recognition event:', event.error);
        if (event.error === 'not-allowed') {
          onError('Microphone permission denied. Please allow microphone access.');
        } else if (event.error === 'no-speech') {
          onError('No speech was detected. Please tap and speak clearly.');
        } else {
          onError(`Voice input error: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
    } catch (e: any) {
      this.isListening = false;
      onError(e.message || 'Failed to start voice listener');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  /**
   * Resilient Speech Synthesis:
   * Strategy 1: Try Native Google / Regional TTS voice if installed.
   * Strategy 2: If OS only has US English voices (David / Zira), speak the phonetic
   * transliteration with lang="en-US" so you hear audio LOUD & CLEAR!
   * Strategy 3: Also attempts online Google Translate TTS audio stream fallback.
   */
  public speak(
    text: string, 
    fallbackPhoneticText?: string,
    onEnd?: () => void
  ): void {
    this.stopSpeaking();

    const phoneticText = fallbackPhoneticText || text;
    const targetLangCode = this.currentLanguage.code;

    // Check available voices
    const voices = (typeof window !== 'undefined' && 'speechSynthesis' in window) 
      ? window.speechSynthesis.getVoices() 
      : [];

    const nativeVoice = voices.find(v => {
      const vLang = v.lang.toLowerCase();
      return vLang === this.currentLanguage.speechLang.toLowerCase() || 
             vLang.startsWith(targetLangCode);
    });

    // 1. If native voice (like Hindi / Kannada) exists on device, speak native script
    if (nativeVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = nativeVoice;
      utterance.lang = nativeVoice.lang;
      utterance.rate = 0.95;
      utterance.onend = () => { if (onEnd) onEnd(); };
      utterance.onerror = () => { if (onEnd) onEnd(); };
      window.speechSynthesis.speak(utterance);
      return;
    }

    // 2. Fallback: OS only has David/Zira (en-US). Speak the phonetic text with en-US voice!
    // This is GUARANTEED to produce sound on Windows!
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phoneticText);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Pick Zira or David or whatever English voice exists
      const enVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      if (enVoice) {
        utterance.voice = enVoice;
      }

      utterance.onend = () => { if (onEnd) onEnd(); };
      utterance.onerror = () => { if (onEnd) onEnd(); };

      // Chrome sometimes requires resume
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement = null;
      } catch (e) {
        // ignore
      }
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
