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
    <div className="flex flex-col items-center justify-center my-3 sm:my-5">
      <div className="relative flex items-center justify-center">
        {/* Soft emerald glow aura in background as in reference */}
        <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-emerald-100/70 pointer-events-none" />

        {/* Soft ripple aura rings when listening */}
        {isListening && (
          <>
            <div className="absolute w-52 h-52 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
            <div className="absolute w-44 h-44 rounded-full bg-emerald-500/30 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Emerald aura when assistant is speaking */}
        {isSpeaking && (
          <>
            <div className="absolute w-52 h-52 rounded-full bg-emerald-600/25 animate-ping pointer-events-none" />
            <div className="absolute w-44 h-44 rounded-full bg-emerald-600/35 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Central Round Green Mic Button - exact match to reference image */}
        <button
          onClick={onClick}
          aria-label={isListening ? "Stop listening" : isSpeaking ? "Stop speaking" : "Tap to speak"}
          className={`relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-lg ${
            isListening
              ? 'bg-[#046A38] text-white ring-4 ring-emerald-300 scale-105 animate-pulse shadow-emerald-700/30'
              : isSpeaking
              ? 'bg-[#046A38] text-white ring-4 ring-emerald-400 scale-105 shadow-emerald-700/30'
              : 'bg-[#046A38] hover:bg-[#03542c] text-white shadow-emerald-800/20 hover:scale-102'
          }`}
        >
          {isSpeaking ? (
            <Volume2 className="w-10 h-10 sm:w-11 sm:h-11 animate-bounce text-white stroke-[2.2]" />
          ) : (
            <Mic className={`w-10 h-10 sm:w-11 sm:h-11 ${isListening ? 'animate-pulse' : ''} text-white stroke-[2.2]`} />
          )}
          <span className="text-[11px] font-black uppercase tracking-wider mt-1.5 text-white">
            {isListening ? 'LISTENING' : isSpeaking ? 'SPEAKING' : 'TAP TO SPEAK'}
          </span>
        </button>
      </div>

      {/* Visual rhythmic soundwave bars (active when listening or speaking) */}
      {(isListening || isSpeaking) && (
        <div className="h-8 flex items-center justify-center gap-1.5 mt-4 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          {[30, 65, 95, 50, 100, 75, 85, 40, 90, 35, 70, 45].map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-[#046A38] transition-all duration-150"
              style={{
                height: `${Math.max(20, h * 0.85)}%`,
                animationDuration: `${0.5 + (i * 0.08)}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Spoken Status pill label when active */}
      {statusLabel && (isListening || isSpeaking) && (
        <div className="mt-3 px-4 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 text-center max-w-sm">
          {statusLabel}
        </div>
      )}
    </div>
  );
};
