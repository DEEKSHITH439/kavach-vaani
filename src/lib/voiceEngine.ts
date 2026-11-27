// Comprehensive multi-lingual voice engine using Web Speech API + dialect mappings
export interface VoiceOption {
  code: string;
  label: string;
  nativeLabel: string;
  speechLang: string;
  samplePrompt: string;
  greetingText: string;
  transliteratedAudioText: string; // Phonetic fallback text for crystal-clear TTS audio on any OS
}

export const SUPPORTED_LANGUAGES: VoiceOption[] = [
  {
    code: 'hi',
    label: 'Hindi / Hinglish',
    nativeLabel: 'हिन्दी / Hinglish',
    speechLang: 'hi-IN',
    greetingText: 'नमस्ते! मैं कवच वाणी हूँ। आप क्या काम करते हैं और आपको किस सहायता या ऋण की आवश्यकता है?',
    transliteratedAudioText: 'Namaste! Main Kavach Vaani hoon. Aap kya kaam karte hain aur aapko kis sahayata ya loan ki zaroorat hai?',
    samplePrompt: 'मैं लखनऊ में रिक्शा चलाता हूँ, पैर में चोट लगी है, क्या सरकारी आर्थिक सहायता मिलेगी?'
  },
  {
    code: 'kn',
    label: 'Kannada / Kanglish',
    nativeLabel: 'ಕನ್ನಡ / Kanglish',
    speechLang: 'kn-IN',
    greetingText: 'ನಮಸ್ಕಾರ! ನಾನು ಕವಚ ವಾಣಿ. ನೀವು ಯಾವ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ ಮತ್ತು ನಿಮಗೆ ಯಾವ ಸಾಲ ಅಥವಾ ಸಹಾಯ ಬೇಕು?',
    transliteratedAudioText: 'Namaskara! Naanu Kavach Vaani. Neevu yaava kelasa maaduttiddeeri, mattu nimage yaava saala athava sahaaya beku?',
    samplePrompt: 'ನಾನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಚಹಾ ಅಂಗಡಿ ನಡೆಸುತ್ತಿದ್ದೇನೆ, ಹೊಸ ಬರ್ನರ್ ಖರೀದಿಸಲು ₹15,000 ಸಾಲ ಬೇಕು.'
  },
  {
    code: 'ta',
    label: 'Tamil / Tanglish',
    nativeLabel: 'தமிழ் / Tanglish',
    speechLang: 'ta-IN',
    greetingText: 'வணக்கம்! நான் கவச் வாணி. நீங்கள் என்ன வேலை செய்கிறீர்கள்? உங்களுக்கு என்ன உதவி அல்லது கடன் தேவை?',
    transliteratedAudioText: 'Vanakkam! Naan Kavach Vaani. Neengal enna velai seigireergal? Ungalukku enna udhavi alladhu kadan thevai?',
    samplePrompt: 'நான் தெருவோர தள்ளுவண்டி வியாபಾರಿ, தொழில் துவங்க ₹20,000 அரசு கடன் கிடைக்குமா?'
  },
  {
    code: 'bn',
    label: 'Bengali',
    nativeLabel: 'বাংলা',
    speechLang: 'bn-IN',
    greetingText: 'নমস্কার! আমি কবচ বাণী। আপনি কী কাজ করেন এবং আপনার কী সাহায্য বা ঋণ প্রয়োজন?',
    transliteratedAudioText: 'Nomoshkar! Aami Kavach Vaani. Aapni ki kaaj koren ebong aapanar ki shaahaajyo baa rin proyojon?',
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
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor(langCode: string = 'hi') {
    this.setLanguage(langCode);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    this.availableVoices = window.speechSynthesis.getVoices();
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
   * Resilient Multi-lingual Text-To-Speech:
   * 1. Looks for a native dialect voice on the OS (e.g. Hindi, Kannada, Tamil, Bengali).
   * 2. If Windows/Chrome lacks that voice pack, it falls back to an Indian English (en-IN) voice
   *    and speaks the phonetic transliteration (Kanglish, Tanglish, Hinglish) so the user
   *    hears perfectly intelligible regional words instead of silence or broken robotic sounds!
   */
  public speak(
    text: string, 
    fallbackPhoneticText?: string,
    onEnd?: () => void,
    customLang?: string
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    if (this.availableVoices.length === 0) {
      this.availableVoices = window.speechSynthesis.getVoices();
    }

    const targetLangCode = (customLang || this.currentLanguage.speechLang).toLowerCase();
    const primaryPrefix = targetLangCode.split('-')[0]; // 'kn', 'hi', 'ta', 'bn', 'en'

    // Find native voice for this language
    const nativeVoice = this.availableVoices.find(v => {
      const vLang = v.lang.toLowerCase();
      return vLang === targetLangCode || vLang.startsWith(primaryPrefix);
    });

    // Indian English voice fallback
    const indianVoice = this.availableVoices.find(v => {
      const vLang = v.lang.toLowerCase();
      return vLang === 'en-in' || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('heera');
    });

    const anyEnglishVoice = this.availableVoices.find(v => v.lang.toLowerCase().startsWith('en')) || this.availableVoices[0];

    const utterance = new SpeechSynthesisUtterance();
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    if (nativeVoice) {
      // OS has the native language voice installed (e.g. Google Hindi, Microsoft Hemant)
      utterance.voice = nativeVoice;
      utterance.lang = nativeVoice.lang;
      utterance.text = text;
    } else {
      // Fallback: OS lacks Kannada/Tamil/Bengali voice pack.
      // Use Indian English voice with phonetic transliteration so it is spoken cleanly!
      utterance.voice = indianVoice || anyEnglishVoice;
      utterance.lang = utterance.voice?.lang || 'en-IN';
      utterance.text = fallbackPhoneticText || text;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('TTS playback error:', e);
      if (onEnd) onEnd();
    };

    // Chrome bug workaround: sometimes speech synthesis hangs if not resumed
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
