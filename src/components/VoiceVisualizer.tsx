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
    <div className="flex flex-col items-center justify-center my-6">
      <div className="relative flex items-center justify-center">
        {/* Pulsing rings when listening */}
        {isListening && (
          <>
            <div className="absolute w-44 h-44 rounded-full bg-orange-500/20 animate-ping pointer-events-none" />
            <div className="absolute w-36 h-36 rounded-full bg-orange-500/30 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Pulsing rings when speaking back */}
        {isSpeaking && (
          <div className="absolute w-40 h-40 rounded-full bg-emerald-500/30 animate-pulse pointer-events-none" />
        )}

        {/* Central Big Interactive Mic Button */}
        <button
          onClick={onClick}
          aria-label={isListening ? "Stop listening" : "Tap and speak"}
          className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 ${
            isListening
              ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-orange-500/50 scale-105 ring-4 ring-orange-400'
              : isSpeaking
              ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/50 scale-105 ring-4 ring-emerald-400'
              : 'bg-gradient-to-tr from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-950/60'
          }`}
        >
          {isSpeaking ? (
            <Volume2 className="w-12 h-12 animate-bounce" />
          ) : (
            <Mic className={`w-12 h-12 ${isListening ? 'animate-pulse' : ''}`} />
          )}
          <span className="text-[11px] font-bold uppercase tracking-wider mt-1">
            {isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Tap & Speak'}
          </span>
        </button>
      </div>

      {/* Visual soundwave bars when active */}
      <div className="h-8 flex items-center gap-1.5 mt-5">
        {[40, 75, 90, 50, 100, 65, 80, 45, 95, 30].map((h, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-200 ${
              isListening
                ? 'bg-orange-500'
                : isSpeaking
                ? 'bg-emerald-400'
                : 'bg-slate-700/60'
            }`}
            style={{
              height: isListening || isSpeaking ? `${Math.max(15, (h * (isListening ? 0.9 : 0.7)))}%` : '6px',
              animationDuration: `${0.6 + (i * 0.1)}s`
            }}
          />
        ))}
      </div>

      <p className="text-sm font-medium text-slate-300 mt-2 text-center max-w-xs">
        {statusLabel}
      </p>
    </div>
  );
};
