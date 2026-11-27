import React from 'react';
import { ShieldCheck, Download, AlertTriangle, PhoneCall, Volume2, Info, FileText } from 'lucide-react';
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
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Simulation Banner Notice */}
      <div className="bg-amber-950/60 border border-amber-500/40 rounded-xl p-3 mb-4 flex items-start gap-2 text-xs text-amber-200">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>{t.rightsCard.simulationNotice}</strong> Ref: <span className="font-mono font-bold text-white">#{formData.applicationId}</span>.
        </span>
      </div>

      {/* Top Badge */}
      <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">{t.rightsCard.title}</h3>
            <p className="text-xs text-emerald-400 font-medium">{t.rightsCard.subtitle}</p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/40 font-mono font-bold">
          REF: #{formData.applicationId}
        </span>
      </div>

      {/* Spoken Rights Box */}
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-emerald-400" /> {t.rightsCard.spokenLawAudio}
          </span>
          <button
            onClick={onPlayVoiceNote}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
              isPlayingNote
                ? 'bg-emerald-500 text-slate-950 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/40'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            {isPlayingNote ? t.rightsCard.playingRights : t.rightsCard.listenToRights}
          </button>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed italic bg-black/40 p-3 rounded-xl border border-white/5 font-medium">
          "{audioText}"
        </p>
      </div>

      {/* Legal Act Protection Highlights */}
      <div className="space-y-2 mb-5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-start gap-2">
          <span className="text-emerald-400 font-bold shrink-0">{t.rightsCard.statutoryProtection}</span>
          <span className="leading-relaxed">{scheme.legalRightsSummary}</span>
        </div>
        <div className="flex items-start gap-2 pt-1 border-t border-slate-800/80">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span className="text-amber-200 leading-relaxed">
            <strong>{t.rightsCard.zeroDalalNotice}</strong>
          </span>
        </div>
      </div>

      {/* Action CTA Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-bold">
          <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{t.rightsCard.grievanceContact} {scheme.grievanceHelpline}</span>
        </div>

        <button
          onClick={() => generateApplicationPDF(formData, 'application_summary')}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>{t.rightsCard.downloadPdf}</span>
        </button>
      </div>
    </div>
  );
};
