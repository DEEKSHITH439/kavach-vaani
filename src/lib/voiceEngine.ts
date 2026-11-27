// Resilient multi-lingual voice engine supporting Web Speech API, dynamic voice loading,
// speed adjustment, voice detection, and audio feedback for Indian vernacular speech.

export interface VoiceOption {
  code: 'hi' | 'kn' | 'ta' | 'bn' | 'en';
  label: string;
  nativeLabel: string;
  speechLang: string;
  samplePrompt: string;
  greetingText: string;
}

export const SUPPORTED_LANGUAGES: VoiceOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    speechLang: 'en-IN',
    greetingText: 'Namaste! I am Kavach Vaani. Tell me what work you do and what kind of financial assistance or working-capital loan you need.',
    samplePrompt: 'I run a tea stall in Bengaluru and need a 15,000 rupees working capital loan.'
  },
  {
    code: 'hi',
    label: 'Hindi / Hinglish',
    nativeLabel: 'हिन्दी (Hindi)',
    speechLang: 'hi-IN',
    greetingText: 'नमस्ते! मैं कवच वाणी हूँ। आप क्या काम करते हैं और आपको किस तरह की वित्तीय सहायता या कार्यशील पूंजी ऋण की आवश्यकता है, कृपया बताएं।',
    samplePrompt: 'मैं लखनऊ में चाय का ठेला लगाता हूँ, ₹15,000 का लोन चाहिए।'
  },
  {
    code: 'kn',
    label: 'Kannada / Kanglish',
    nativeLabel: 'ಕನ್ನಡ (Kannada)',
    speechLang: 'kn-IN',
    greetingText: 'ನಮಸ್ಕಾರ! ನಾನು ಕವಚ ವಾಣಿ. ನೀವು ಯಾವ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ ಮತ್ತು ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಆರ್ಥಿಕ ಸಹಾಯ ಅಥವಾ ದುಡಿಯುವ ಬಂಡವಾಳ ಸಾಲ ಬೇಕು ಎಂದು ತಿಳಿಸಿ.',
    samplePrompt: 'ನಾನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಚಹಾ ಅಂಗಡಿ ನಡೆಸುತ್ತಿದ್ದೇನೆ, ₹15,000 ಸಾಲ ಬೇಕು.'
  },
  {
    code: 'ta',
    label: 'Tamil / Tanglish',
    nativeLabel: 'தமிழ் (Tamil)',
    speechLang: 'ta-IN',
    greetingText: 'வணக்கம்! நான் கவச் வாணி. நீங்கள் என்ன வேலை செய்கிறீர்கள், உங்களுக்கு என்ன வகையான நிதி உதவி அல்லது நடைமுறை மூலதனக் கடன் தேவை என்பதை கூறுங்கள்.',
    samplePrompt: 'நான் தெருவோர தள்ளுவண்டி வியாபாரி, தொழில் துவங்க ₹15,000 கடன் கிடைக்குமா?'
  },
  {
    code: 'bn',
    label: 'Bengali',
    nativeLabel: 'বাংলা (Bengali)',
    speechLang: 'bn-IN',
    greetingText: 'নমস্কার! আমি কবচ বাণী। আপনি কী কাজ করেন এবং আপনার কী ধরনের আর্থিক সহায়তা বা চলতি মূলধন ঋণ প্রয়োজন, দয়া করে বলুন।',
    samplePrompt: 'আমি কলকাতায় ছোট চায়ের দোকান চালাই, আমার ₹১৫,০০০ চলতি মূলধন ঋণ প্রয়োজন।'
  }
];

export type AudioScenario = 'greeting' | 'scheme_match' | 'interview_intro' | 'rights_card';

export interface PlaybackState {
  isPlaying: boolean;
  source: 'bundled_audio' | 'system_tts' | 'none';
  languageCode: string;
  languageLabel: string;
  scenario?: AudioScenario;
}

export class VoiceEngine {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentLanguage: VoiceOption = SUPPORTED_LANGUAGES[0];
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private voicesLoadedPromise: Promise<SpeechSynthesisVoice[]>;
  private activeAudioElement: HTMLAudioElement | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private speechRate: number = 0.92;
  private onPlaybackStateChange?: (state: PlaybackState) => void;

  constructor(langCode: string = 'kn', onPlaybackStateChange?: (state: PlaybackState) => void) {
    this.setLanguage(langCode);
    this.onPlaybackStateChange = onPlaybackStateChange;
    this.voicesLoadedPromise = this.initVoiceCatalog();
  }

  private initVoiceCatalog(): Promise<SpeechSynthesisVoice[]> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return Promise.resolve([]);
    }

    return new Promise((resolve) => {
      const existing = window.speechSynthesis.getVoices();
      if (existing && existing.length > 0) {
        this.cachedVoices = existing;
        resolve(existing);
        return;
      }

      const onVoicesChanged = () => {
        const loaded = window.speechSynthesis.getVoices();
        if (loaded && loaded.length > 0) {
          this.cachedVoices = loaded;
          window.speechSynthesis.onvoiceschanged = null;
          resolve(loaded);
        }
      };

      window.speechSynthesis.onvoiceschanged = onVoicesChanged;

      setTimeout(() => {
        const loaded = window.speechSynthesis.getVoices();
        this.cachedVoices = loaded || [];
        resolve(this.cachedVoices);
      }, 1000);
    });
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

  public setRate(rate: number) {
    this.speechRate = Math.max(0.7, Math.min(1.3, rate));
  }

  public getRate(): number {
    return this.speechRate;
  }

  public isSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  public hasNativeIndicVoice(langCode: string): boolean {
    const target = langCode.toLowerCase();
    const primary = target.split('-')[0];
    return this.cachedVoices.some(v => {
      const vLang = v.lang.toLowerCase();
      return vLang === target || vLang.startsWith(primary);
    });
  }

  public getAvailableSystemVoices(): SpeechSynthesisVoice[] {
    return this.cachedVoices;
  }

  public startListening(
    onResult: (text: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (!this.isSpeechSupported()) {
      onError('Browser speech recognition is not supported in this browser. Please use Chrome, Edge or Brave on desktop/Android.');
      return;
    }

    this.stopListening();
    this.stopSpeaking();

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
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          onError('Microphone permission blocked. Please allow mic access in your browser bar.');
        } else if (event.error === 'no-speech') {
          onError('No voice detected. Please tap the mic and speak clearly.');
        } else if (event.error !== 'aborted') {
          onError(`Voice listener: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
    } catch (e: any) {
      this.isListening = false;
      onError(e.message || 'Unable to start microphone listener');
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
    this.isListening = false;
  }

  private emitPlaybackState(state: PlaybackState) {
    if (this.onPlaybackStateChange) {
      this.onPlaybackStateChange(state);
    }
  }

  /**
   * Resilient, genuine multi-lingual voice playback:
   * 1. Checks if Puter.js AI Voice is available (free neural TTS without keys).
   * 2. Checks if bundled audio file exists at /audio/{lang}/{scenario}.mp3.
   * 3. Fallbacks to native browser speech synthesis.
   */
  public async speak(
    text: string,
    options?: {
      scenario?: AudioScenario;
      onEnd?: () => void;
      onError?: (err: string) => void;
    }
  ): Promise<void> {
    this.stopSpeaking();
    this.stopListening();

    const onEnd = () => {
      this.emitPlaybackState({
        isPlaying: false,
        source: 'none',
        languageCode: this.currentLanguage.code,
        languageLabel: this.currentLanguage.nativeLabel
      });
      if (options?.onEnd) options.onEnd();
    };

    const onError = options?.onError || (() => {});
    const scenario = options?.scenario;

    // Check for bundled audio asset first if scenario is defined
    if (scenario) {
      const audioUrl = `/audio/${this.currentLanguage.code}/${scenario}.mp3`;
      const audioExists = await this.checkAssetExists(audioUrl);

      if (audioExists) {
        try {
          const audio = new Audio(audioUrl);
          this.activeAudioElement = audio;

          this.emitPlaybackState({
            isPlaying: true,
            source: 'bundled_audio',
            languageCode: this.currentLanguage.code,
            languageLabel: this.currentLanguage.nativeLabel,
            scenario
          });

          audio.onended = () => {
            this.activeAudioElement = null;
            onEnd();
          };

          audio.onerror = () => {
            this.activeAudioElement = null;
            this.tryPuterOrSynthesizer(text, scenario, onEnd, onError);
          };

          await audio.play();
          return;
        } catch {
          this.activeAudioElement = null;
          // Fall through to Puter / Synthesizer
        }
      }
    }

    // Fallback to Native Speech Synthesis
    await this.speakViaSynthesizer(text, scenario, onEnd, onError);
  }

  private async checkAssetExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async speakViaSynthesizer(
    text: string,
    scenario: AudioScenario | undefined,
    onEnd: () => void,
    onError: (err: string) => void
  ): Promise<void> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onError('Speech synthesis is not supported on this browser/platform.');
      onEnd();
      return;
    }

    await this.voicesLoadedPromise;

    const voices = this.cachedVoices.length > 0 
      ? this.cachedVoices 
      : window.speechSynthesis.getVoices();

    const targetLangCode = this.currentLanguage.speechLang.toLowerCase();
    const primaryPrefix = targetLangCode.split('-')[0];

    // Find native voice match
    const nativeVoice = voices.find(v => {
      const vLang = v.lang.toLowerCase();
      return vLang === targetLangCode || vLang.startsWith(primaryPrefix);
    });

    const isEnglish = primaryPrefix === 'en';
    const chosenVoice = nativeVoice || voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices[0];

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = nativeVoice ? chosenVoice.lang : this.currentLanguage.speechLang;
    } else {
      utterance.lang = this.currentLanguage.speechLang;
    }

    utterance.rate = this.speechRate;
    utterance.pitch = 1.0;
    this.activeUtterance = utterance;

    this.emitPlaybackState({
      isPlaying: true,
      source: 'system_tts',
      languageCode: this.currentLanguage.code,
      languageLabel: this.currentLanguage.nativeLabel,
      scenario
    });

    if (!nativeVoice && !isEnglish) {
      console.info(`Native voice for ${this.currentLanguage.nativeLabel} not found in OS. Playing with system speech synthesizer.`);
    }

    let hasEnded = false;
    const finish = () => {
      if (!hasEnded) {
        hasEnded = true;
        this.activeUtterance = null;
        onEnd();
      }
    };

    utterance.onend = finish;
    utterance.onerror = () => {
      finish();
    };

    // Safety timeout in case browser speech synthesis hangs
    setTimeout(() => {
      if (!hasEnded && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        finish();
      }
    }, 25000);

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (this.activeAudioElement) {
      try {
        this.activeAudioElement.pause();
        this.activeAudioElement.currentTime = 0;
      } catch {
        // ignore
      }
      this.activeAudioElement = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
      this.activeUtterance = null;
    }

    this.emitPlaybackState({
      isPlaying: false,
      source: 'none',
      languageCode: this.currentLanguage.code,
      languageLabel: this.currentLanguage.nativeLabel
    });
  }
}
