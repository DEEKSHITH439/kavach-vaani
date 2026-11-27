import React from 'react';
import { Award, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { Scheme } from '../lib/schemeRules';
import { LocaleTranslations } from '../locales';

interface SchemeCardProps {
  scheme: Scheme;
  matchedReason: string;
  onConfirmApply: () => void;
  langCode: string;
  t: LocaleTranslations;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  matchedReason,
  onConfirmApply,
  langCode,
  t
}) => {
  const schemeNameNative = scheme.nameNative[langCode] || scheme.nameNative['en'];

  return (
    <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-orange-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-amber-500 text-slate-950 font-black text-[10px] uppercase px-4 py-1 rounded-bl-xl tracking-wider flex items-center gap-1 shadow-md">
        <Sparkles className="w-3 h-3" /> Preliminary Match
      </div>

      <div className="flex items-start gap-3 mt-1 mb-3">
        <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/30 text-orange-400 shrink-0">
          <Award className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">{scheme.name}</h2>
          <p className="text-xs font-bold text-orange-400">{schemeNameNative}</p>
        </div>
      </div>

      {/* Benefit Amount Callout */}
      <div className="my-3 p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
            Progressive Working Capital Loan Structure
          </span>
          <span className="text-lg font-black text-emerald-400">{scheme.benefitAmountSummary}</span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-950/70 text-emerald-300 rounded-full border border-emerald-500/30 shrink-0">
          Zero Collateral Required
        </span>
      </div>

      {/* Tranche Breakdown */}
      {scheme.tranches && scheme.tranches.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          {scheme.tranches.map((tItem) => (
            <div key={tItem.stage} className="p-2.5 bg-black/40 rounded-xl border border-white/5">
              <span className="text-[10px] font-bold text-orange-300 block">{tItem.label}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">{tItem.conditionNative[langCode] || tItem.conditionNative['en']}</p>
            </div>
          ))}
        </div>
      )}

      {/* Interest Subsidy Callout */}
      {scheme.interestSubsidyInfo && (
        <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl mb-3 text-xs text-emerald-200 leading-relaxed">
          <strong>7% per year interest subsidy:</strong> {scheme.interestSubsidyInfo.descriptionNative[langCode] || scheme.interestSubsidyInfo.descriptionNative['en']}
        </div>
      )}

      {/* Reason for preliminary match */}
      <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 mb-4">
        <span className="text-[11px] font-semibold text-orange-300 block mb-1">
          Preliminary AI Analysis:
        </span>
        <p className="text-[11px] text-slate-300">{matchedReason}</p>
      </div>

      <div className="flex items-center gap-2 mb-5 text-xs text-amber-200/90">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          Final loan approval requires verification of your CoV / LoR and lender assessment.
        </span>
      </div>

      <button
        onClick={onConfirmApply}
        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-orange-950/50 flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <span>Check Eligibility & Review Requirements</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
