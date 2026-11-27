// Comprehensive multi-lingual voice engine using Web Speech API + dialect mappings
export interface VoiceOption {
  code: string;
  label: string;
  nativeLabel: string;
  speechLang: string;
  samplePrompt: string;
  greetingText: string;
}

export const SUPPORTED_LANGUAGES: VoiceOption[] = [
  {
    code: 'hi',
    label: 'Hindi / Hinglish',
    nativeLabel: 'हिन्दी / Hinglish',
    speechLang: 'hi-IN',
    greetingText: 'नमस्ते! मैं कवच वाणी हूँ। आप क्या काम करते हैं और आपको किस सहायता या ऋण की आवश्यकता है?',
    samplePrompt: 'मैं लखनऊ में रिक्शा चलाता हूँ, पैर में चोट लगी है, क्या सरकारी आर्थिक सहायता मिलेगी?'
  },
  {
    code: 'kn',
    label: 'Kannada / Kanglish',
    nativeLabel: 'ಕನ್ನಡ / Kanglish',
    speechLang: 'kn-IN',
    greetingText: 'ನಮಸ್ಕಾರ! ನಾನು ಕವಚ ವಾಣಿ. ನೀವು ಯಾವ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ ಮತ್ತು ನಿಮಗೆ ಯಾವ ಸಾಲ ಅಥವಾ ಸಹಾಯ ಬೇಕು?',
    samplePrompt: 'ನಾನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಚಹಾ ಅಂಗಡಿ ನಡೆಸುತ್ತಿದ್ದೇನೆ, ಹೊಸ ಬರ್ನರ್ ಖರೀದಿಸಲು ₹15,000 ಸಾಲ ಬೇಕು.'
  },
  {
    code: 'ta',
    label: 'Tamil / Tanglish',
    nativeLabel: 'தமிழ் / Tanglish',
    speechLang: 'ta-IN',
    greetingText: 'வணக்கம்! நான் கவச் வாணி. நீங்கள் என்ன வேலை செய்கிறீர்கள்? உங்களுக்கு என்ன உதவி அல்லது கடன் தேவை?',
    samplePrompt: 'நான் தெருவோர தள்ளுவண்டி வியாபாரி, தொழில் துவங்க ₹20,000 அரசு கடன் கிடைக்குமா?'
  },
  {
    code: 'bn',
    label: 'Bengali',
    nativeLabel: 'বাংলা',
    speechLang: 'bn-IN',
    greetingText: 'নমস্কার! আমি কবচ বাণী। আপনি কী কাজ করেন এবং আপনার কী সাহায্য বা ঋণ প্রয়োজন?',
    samplePrompt: 'আমি কলকাতায় নির্মাণ কাজ করি, আমার পরিবারের জন্য স্বাস্থ্য বিমা কীভাবে পাব?'
  },
  {
    code: 'en',
    label: 'Indian English',
    nativeLabel: 'English (India)',
    speechLang: 'en-IN',
    greetingText: 'Namaste! I am Kavach Vaani. Tell me what work you do and what welfare benefit or loan you need.',
    samplePrompt: 'I run a tea stall in Bengaluru, need 15,000 rupees loan with zero collateral.'
  }
];

export class VoiceEngine {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentLanguage: VoiceOption = SUPPORTED_LANGUAGES[0];

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

  // Test if browser supports speech recognition
  public isSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  // Start listening to voice input with error handling and noise adaptation
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

  // High quality multi-lingual text-to-speech with rate & pitch controls
  public speak(
    text: string, 
    onEnd?: () => void,
    customLang?: string
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not available');
      if (onEnd) onEnd();
      return;
    }

    // Cancel existing playback
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = customLang || this.currentLanguage.speechLang;
    utterance.rate = 0.95; // Slightly slower, empathetic cadence for rural/informal clarity
    utterance.pitch = 1.0;

    // Pick best matching native voice if available
    const voices = window.speechSynthesis.getVoices();
    const targetLang = customLang || this.currentLanguage.speechLang;
    const matchedVoice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0])) ||
                         voices.find(v => v.lang.includes('IN')) ||
                         voices[0];

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('TTS playback error:', e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
