import React from 'react';
import { Scheme } from '../lib/schemeRules';
import { CheckCircle2, Award, ArrowRight, Sparkles } from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  matchedReason: string;
  onConfirmApply: () => void;
  langCode: string;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  matchedReason,
  onConfirmApply,
  langCode
}) => {
  const nativeDesc = scheme.benefitDescriptionNative[langCode] || scheme.benefitDescriptionNative['en'];

  return (
    <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-orange-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-amber-500 text-slate-950 font-black text-[10px] uppercase px-4 py-1 rounded-bl-xl tracking-wider flex items-center gap-1">
        <Sparkles className="w-3 h-3" /> Best Entitlement Match
      </div>

      <div className="flex items-start gap-3 mt-1 mb-3">
        <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/30 text-orange-400">
          <Award className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">{scheme.name}</h2>
          <p className="text-xs font-bold text-orange-400">{scheme.nameNative}</p>
        </div>
      </div>

      {/* Benefit Amount Callout */}
      <div className="my-3 p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
            Government Grant / Loan Limit
          </span>
          <span className="text-xl font-black text-emerald-400">{scheme.benefitAmount}</span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-950/70 text-emerald-300 rounded-full border border-emerald-500/30">
          Zero Collateral
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-3">
        {nativeDesc}
      </p>

      <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 mb-4">
        <span className="text-[11px] font-semibold text-orange-300 block mb-1">
          Why you qualify (Voice AI Analysis):
        </span>
        <p className="text-[11px] text-slate-300">{matchedReason}</p>
      </div>

      <div className="flex items-center gap-2 mb-5">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="text-xs text-slate-300">
          No paperwork needed. Complete by speaking in 90 seconds.
        </span>
      </div>

      <button
        onClick={onConfirmApply}
        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-orange-950/50 flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <span>Fill This Application By Voice (बोलकर भरें)</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
