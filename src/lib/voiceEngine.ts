// Resilient multi-lingual voice engine supporting Web Speech API, dynamic voice loading,
// and clean audio element playback for authentic Indian vernacular speech.

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
  private onPlaybackStateChange?: (state: PlaybackState) => void;

  constructor(langCode: string = 'hi', onPlaybackStateChange?: (state: PlaybackState) => void) {
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

  public isSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  public hasNativeIndicVoice(langCode: string): boolean {
    const target = langCode.toLowerCase();
    return this.cachedVoices.some(v => {
      const vLang = v.lang.toLowerCase();
      return vLang === target || vLang.startsWith(target.split('-')[0]);
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
      onError('Browser speech recognition not supported in this browser. Please use Google Chrome or Edge.');
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
        if (event.error === 'not-allowed') {
          onError('Microphone permission blocked. Please allow mic access in your browser bar.');
        } else if (event.error === 'no-speech') {
          onError('No voice detected. Please tap the mic and speak.');
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
      } catch (e) {
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
   * 1. Checks if a genuine bundled audio file exists at public/audio/{lang}/{scenario}.mp3.
   * 2. If present, plays genuine offline regional recording via HTML5 Audio element.
   * 3. If audio file is missing or fails:
   *    - Checks if the host OS has a genuine regional voice pack (e.g. Google Hindi, Android Kannada).
   *    - If native voice exists, speaks the native text.
   *    - If native voice is missing on the OS, reports explicit message without transliteration or fallback to English.
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
    if (scenario && this.currentLanguage.code !== 'en') {
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
            this.speakViaSynthesizer(text, scenario, onEnd, onError);
          };

          await audio.play();
          return;
        } catch (e) {
          this.activeAudioElement = null;
          // Fall through to synthesizer
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

    // Look for genuine native language voice
    const nativeVoice = voices.find(v => {
      const vLang = v.lang.toLowerCase();
      return vLang === targetLangCode || vLang.startsWith(primaryPrefix);
    });

    if (!nativeVoice) {
      const isEnglish = primaryPrefix === 'en';
      if (!isEnglish) {
        const warningMsg = `Audio recording or native voice pack not installed for ${this.currentLanguage.nativeLabel} (${this.currentLanguage.label}). English transliteration is disabled to maintain authentic vernacular fidelity.`;
        onError(warningMsg);
        onEnd();
        return;
      }
    }

    const chosenVoice = nativeVoice || voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices[0];

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang;
    } else {
      utterance.lang = this.currentLanguage.speechLang;
    }

    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    this.activeUtterance = utterance;

    this.emitPlaybackState({
      isPlaying: true,
      source: 'system_tts',
      languageCode: this.currentLanguage.code,
      languageLabel: this.currentLanguage.nativeLabel,
      scenario
    });

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

    setTimeout(() => {
      if (!hasEnded && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        finish();
      }
    }, 15000);

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
      } catch (e) {
        // ignore
      }
      this.activeAudioElement = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
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
