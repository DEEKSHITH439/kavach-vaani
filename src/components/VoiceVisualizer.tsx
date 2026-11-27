import React from 'react';
import { Mic, Volume2 } from 'lucide-react';

interface VoiceVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  onClick: () => void;
  statusLabel: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isListening,
  isSpeaking,
  onClick,
  statusLabel
}) => {
  return (
    <div className="flex flex-col items-center justify-center my-4 sm:my-6">
      <div className="relative flex items-center justify-center">
        {/* Soft ripple aura rings when listening */}
        {isListening && (
          <>
            <div className="absolute w-52 h-52 rounded-full bg-orange-500/15 animate-ping pointer-events-none" />
            <div className="absolute w-40 h-40 rounded-full bg-orange-500/25 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Emerald aura when assistant is speaking */}
        {isSpeaking && (
          <>
            <div className="absolute w-48 h-48 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
            <div className="absolute w-38 h-38 rounded-full bg-emerald-500/25 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Outer ambient decorative ring */}
        <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-orange-400/20 via-amber-300/10 to-emerald-400/20 blur-md pointer-events-none" />

        {/* Central Big Interactive Mic Button with Official Emerald Glow */}
        <button
          onClick={onClick}
          aria-label={isListening ? "Stop listening" : isSpeaking ? "Stop speaking" : "Tap and speak"}
          className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-lg ${
            isListening
              ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-xl scale-105 ring-4 ring-orange-400 animate-pulse'
              : isSpeaking
              ? 'bg-gradient-to-tr from-emerald-700 to-teal-600 text-white shadow-xl scale-105 ring-4 ring-emerald-400'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-900/30 ring-4 ring-emerald-500/30 hover:scale-102'
          }`}
        >
          {isSpeaking ? (
            <Volume2 className="w-11 h-11 sm:w-12 sm:h-12 animate-bounce drop-shadow" />
          ) : (
            <Mic className={`w-11 h-11 sm:w-12 sm:h-12 ${isListening ? 'animate-pulse' : ''} drop-shadow`} />
          )}
          <span className="text-[11px] font-extrabold uppercase tracking-wider mt-1 text-white">
            {isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Tap & Speak'}
          </span>
        </button>
      </div>

      {/* Visual rhythmic soundwave bars (Clean Emerald Waveform) */}
      <div className="h-9 flex items-center justify-center gap-1.5 mt-5 px-5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm">
        {[30, 65, 95, 50, 100, 75, 85, 40, 90, 35, 70, 45].map((h, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-150 ${
              isListening
                ? 'bg-orange-500'
                : isSpeaking
                ? 'bg-emerald-600'
                : 'bg-emerald-300'
            }`}
            style={{
              height: isListening || isSpeaking ? `${Math.max(25, (h * (isListening ? 0.95 : 0.75)))}%` : '8px',
              animationDuration: `${0.5 + (i * 0.08)}s`
            }}
          />
        ))}
      </div>

      {/* Spoken Status pill label */}
      <div className="mt-3 px-5 py-1.5 rounded-full bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 text-center max-w-sm shadow-sm">
        {statusLabel}
      </div>
    </div>
  );
};
