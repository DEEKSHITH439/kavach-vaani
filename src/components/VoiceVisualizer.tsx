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
        {/* Indian Flag Tricolor Outer Aura ("Outlet")
            Layers: Saffron (Kesari #FF671F / #FF9933) on outer glow,
            Pure White (#FFFFFF) middle circle with Navy accent,
            and India Green (#046A38 / #138808) inner border */}
        
        {/* Layer 1: Outermost Saffron / Kesari Glow Aura */}
        <div
          className={`absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full transition-all duration-500 pointer-events-none p-1.5 ${
            isSpeaking
              ? 'bg-gradient-to-tr from-[#FF671F]/50 via-white/40 to-[#046A38]/50 animate-spin [animation-duration:8s] blur-[2px]'
              : isListening
              ? 'bg-gradient-to-t from-[#046A38]/40 via-white/50 to-[#FF671F]/50 animate-pulse'
              : 'bg-gradient-to-b from-[#FF671F]/30 via-white/40 to-[#046A38]/30 shadow-lg'
          }`}
        />

        {/* Layer 2: Flag Tricolor Concentric Disc - Saffron top, White middle, Green bottom */}
        <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden flex flex-col pointer-events-none shadow-md border-2 border-white/80">
          <div className="flex-1 bg-[#FF671F] opacity-35" />
          <div className="flex-1 bg-white opacity-95 flex items-center justify-center">
            {/* Subtle Ashoka Blue Ring accent in white band */}
            <div className="w-full h-[2px] bg-[#06038D]/25" />
          </div>
          <div className="flex-1 bg-[#046A38] opacity-35" />
        </div>

        {/* Dynamic ripple rings when listening (Tricolor pulses) */}
        {isListening && (
          <>
            <div className="absolute w-56 h-56 rounded-full border-2 border-[#FF671F]/60 animate-ping pointer-events-none" />
            <div className="absolute w-48 h-48 rounded-full border-2 border-[#046A38]/60 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Pulsing rings when assistant is speaking */}
        {isSpeaking && (
          <>
            <div className="absolute w-60 h-60 rounded-full border-2 border-[#FF671F]/70 animate-ping pointer-events-none" />
            <div className="absolute w-50 h-50 rounded-full border-2 border-[#06038D]/60 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Central Round Red Button - Requested Red color with White text/icon */}
        <button
          onClick={onClick}
          aria-label={isListening ? "Stop listening" : isSpeaking ? "Stop speaking" : "Tap to speak"}
          className={`relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-xl ${
            isSpeaking
              ? 'bg-[#DC2626] text-white ring-4 ring-amber-300 scale-105 shadow-red-700/50'
              : isListening
              ? 'bg-[#DC2626] text-white ring-4 ring-orange-300 scale-105 animate-pulse shadow-red-700/40'
              : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-red-800/35 hover:scale-102 ring-2 ring-white/60'
          }`}
        >
          {isSpeaking ? (
            <Volume2 className="w-12 h-12 sm:w-14 sm:h-14 animate-bounce text-white stroke-[2.5]" />
          ) : (
            <Mic className={`w-11 h-11 sm:w-12 sm:h-12 ${isListening ? 'animate-pulse' : ''} text-white stroke-[2.4]`} />
          )}
          <span className="text-[11px] font-black uppercase tracking-wider mt-1.5 text-white drop-shadow-sm">
            {isSpeaking ? 'SPEAKING' : isListening ? 'LISTENING' : 'TAP TO SPEAK'}
          </span>
        </button>
      </div>

      {/* Visual rhythmic soundwave bars (active when listening or speaking) */}
      {(isListening || isSpeaking) && (
        <div className="h-8 flex items-center justify-center gap-1.5 mt-4 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 shadow-2xs">
          {[30, 65, 95, 50, 100, 75, 85, 40, 90, 35, 70, 45].map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-[#DC2626] transition-all duration-150"
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
        <div className="mt-3 px-4 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-semibold text-red-800 text-center max-w-sm">
          {statusLabel}
        </div>
      )}
    </div>
  );
};
