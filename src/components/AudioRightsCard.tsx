import React from 'react';
import { ShieldCheck, Download, AlertTriangle, PhoneCall, Volume2, Info } from 'lucide-react';
import { Scheme } from '../lib/schemeRules';
import { FormSubmissionData, generateApplicationPDF } from '../lib/documentGenerator';

interface AudioRightsCardProps {
  scheme: Scheme;
  formData: FormSubmissionData;
  languageCode: string;
  onPlayVoiceNote: () => void;
  isPlayingNote: boolean;
}

export const AudioRightsCard: React.FC<AudioRightsCardProps> = ({
  scheme,
  formData,
  languageCode,
  onPlayVoiceNote,
  isPlayingNote
}) => {
  const audioText = scheme.legalRightsAudioText[languageCode] || scheme.legalRightsAudioText['en'];

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
      {/* Simulation Banner Notice */}
      <div className="bg-amber-950/60 border border-amber-500/40 rounded-xl p-2.5 mb-4 flex items-center gap-2 text-[11px] text-amber-200">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Prototype Sandbox Simulation:</strong> Application ID <span className="font-mono font-bold text-white">#{formData.applicationId}</span> is generated for hackathon demonstration. Direct government portal submission is simulated.
        </span>
      </div>

      {/* Top Badge */}
      <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Audio Rights Card (अधिकार पत्र)</h3>
            <p className="text-[11px] text-emerald-400 font-medium">Statutory Entitlement & Anti-Extortion Record</p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/40 font-mono">
          REF: #{formData.applicationId}
        </span>
      </div>

      {/* Spoken Rights Box */}
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4" /> Spoken Anti-Harassment Law Audio
          </span>
          <button
            onClick={onPlayVoiceNote}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              isPlayingNote
                ? 'bg-emerald-500 text-slate-950 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            {isPlayingNote ? 'Playing Rights Note...' : 'Listen to Rights'}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed italic bg-black/30 p-2.5 rounded-xl border border-white/5">
          "{audioText}"
        </p>
      </div>

      {/* Legal Act Protection Highlights */}
      <div className="space-y-2 mb-5 text-xs text-slate-300">
        <div className="flex items-start gap-2">
          <span className="text-emerald-400 font-bold">✓ Protection:</span>
          <span>{scheme.legalRightsSummary}</span>
        </div>
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span className="text-amber-200">
            <strong>Zero Dalal Guarantee:</strong> Statutory welfare benefit. Do not pay any fees or commissions to local agents or cafes.
          </span>
        </div>
      </div>

      {/* Helplines & Download CTA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
        <a
          href={`tel:${scheme.grievanceHelpline.split(' ')[0]}`}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all border border-slate-700"
        >
          <PhoneCall className="w-4 h-4 text-red-400" />
          <span>Grievance: {scheme.grievanceHelpline.split('/')[0]}</span>
        </a>

        <button
          onClick={() => generateApplicationPDF(formData)}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Download Official PDF Card</span>
        </button>
      </div>
    </div>
  );
};
