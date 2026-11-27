import React from 'react';
import { ShieldCheck, Download, AlertTriangle, PhoneCall, Volume2, Info, Sparkles } from 'lucide-react';
import { Scheme } from '../lib/schemeRules';
import { FormSubmissionData, generateApplicationPDF } from '../lib/documentGenerator';
import { LocaleTranslations } from '../locales';

interface AudioRightsCardProps {
  scheme: Scheme;
  formData: FormSubmissionData;
  languageCode: string;
  t: LocaleTranslations;
  onPlayVoiceNote: () => void;
  isPlayingNote: boolean;
}

export const AudioRightsCard: React.FC<AudioRightsCardProps> = ({
  scheme,
  formData,
  languageCode,
  t,
  onPlayVoiceNote,
  isPlayingNote
}) => {
  const audioText = scheme.legalRightsAudioText[languageCode] || scheme.legalRightsAudioText['en'];

  return (
    <div className="bg-gradient-to-b from-slate-900/95 via-slate-900 to-slate-950 border-2 border-emerald-500/40 hover:border-emerald-500/60 rounded-3xl p-5 sm:p-7 shadow-soft-lg relative overflow-hidden backdrop-blur-xl transition-all">
      {/* Simulation Banner Notice */}
      <div className="bg-amber-950/50 border border-amber-500/30 rounded-2xl p-3 mb-4 flex items-start gap-2.5 text-xs text-amber-200 shadow-soft-sm">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>{t.rightsCard.simulationNotice}</strong> Ref: <span className="font-mono font-bold text-white bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/20">#{formData.applicationId}</span>
        </span>
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3.5 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg text-white tracking-tight">{t.rightsCard.title}</h3>
            <p className="text-xs text-emerald-400 font-semibold">{t.rightsCard.subtitle}</p>
          </div>
        </div>
        <span className="text-[11px] bg-emerald-950/80 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/40 font-mono font-extrabold shadow-sm">
          REF: #{formData.applicationId}
        </span>
      </div>

      {/* Spoken Rights Box */}
      <div className="bg-gradient-to-r from-emerald-950/50 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 mb-4 shadow-soft-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-3">
          <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" /> {t.rightsCard.spokenLawAudio}
          </span>
          <button
            onClick={onPlayVoiceNote}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-md ${
              isPlayingNote
                ? 'bg-emerald-400 text-slate-950 animate-pulse ring-2 ring-emerald-300'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-950/60'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlayingNote ? t.rightsCard.playingRights : t.rightsCard.listenToRights}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-black/40 p-3.5 rounded-xl border border-white/5 font-medium">
          "{audioText}"
        </p>
      </div>

      {/* Legal Act Protection Highlights */}
      <div className="space-y-2.5 mb-5 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-start gap-2.5">
          <span className="text-emerald-400 font-extrabold shrink-0 mt-0.5">{t.rightsCard.statutoryProtection}</span>
          <span className="leading-relaxed">{scheme.legalRightsSummary}</span>
        </div>
        <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800/80">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span className="text-amber-200 leading-relaxed">
            <strong>{t.rightsCard.zeroDalalNotice}</strong>
          </span>
        </div>
      </div>

      {/* Action CTA Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200 text-xs font-bold shadow-soft-sm">
          <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{t.rightsCard.grievanceContact} {scheme.grievanceHelpline}</span>
        </div>

        <button
          onClick={() => generateApplicationPDF(formData, 'application_summary')}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-950/40 transition-all active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>{t.rightsCard.downloadPdf}</span>
        </button>
      </div>
    </div>
  );
};
