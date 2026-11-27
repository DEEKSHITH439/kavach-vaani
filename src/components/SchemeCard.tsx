import React from 'react';
import { Award, ArrowRight, Sparkles, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm relative overflow-hidden transition-all">
      {/* Top right chic badge */}
      <div className="absolute top-0 right-0 bg-emerald-800 text-white font-extrabold text-[10px] uppercase px-4 py-1.5 rounded-bl-2xl tracking-wider flex items-center gap-1.5 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
        <span>Verified Welfare Match</span>
      </div>

      {/* Scheme Header */}
      <div className="flex items-start gap-3.5 mt-1 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 shadow-sm">
          <Award className="w-6 h-6" />
        </div>
        <div className="pr-20">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">{scheme.name}</h2>
          <p className="text-xs font-bold text-emerald-700 mt-0.5">{schemeNameNative}</p>
        </div>
      </div>

      {/* Entitlement Highlight Card */}
      <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold block">
            Progressive Working Capital Loan Structure
          </span>
          <span className="text-lg sm:text-xl font-black text-emerald-800 tracking-tight">
            {scheme.benefitAmountSummary}
          </span>
        </div>
        <span className="text-[11px] font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 shrink-0 shadow-sm flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          Zero Collateral Required
        </span>
      </div>

      {/* Tranche Breakdown */}
      {scheme.tranches && scheme.tranches.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
          {scheme.tranches.map((tItem) => (
            <div key={tItem.stage} className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all shadow-sm">
              <div className="flex items-center gap-1 text-slate-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-xs font-extrabold tracking-tight">{tItem.label}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {tItem.conditionNative[langCode] || tItem.conditionNative['en']}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 7% Interest Subsidy Callout */}
      {scheme.interestSubsidyInfo && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl mb-4 text-xs text-emerald-900 leading-relaxed shadow-sm flex items-start gap-2">
          <span className="text-emerald-700 font-bold shrink-0 mt-0.5">💰 7% Subsidy:</span>
          <span>{scheme.interestSubsidyInfo.descriptionNative[langCode] || scheme.interestSubsidyInfo.descriptionNative['en']}</span>
        </div>
      )}

      {/* Reason for match */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-4">
        <span className="text-[11px] font-bold text-slate-700 block mb-1 uppercase tracking-wide">
          Preliminary AI Analysis:
        </span>
        <p className="text-xs text-slate-600 leading-relaxed">{matchedReason}</p>
      </div>

      {/* Verification note */}
      <div className="flex items-center gap-2 mb-5 text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="leading-tight">
          Final loan approval requires verification of your CoV / LoR and lender assessment.
        </span>
      </div>

      {/* CTA Button */}
      <button
        onClick={onConfirmApply}
        className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
      >
        <span>Check Eligibility & Review Requirements</span>
        <ArrowRight className="w-4 h-4 stroke-[3]" />
      </button>
    </div>
  );
};
