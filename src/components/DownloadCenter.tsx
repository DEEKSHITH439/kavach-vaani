import React, { useState } from 'react';
import { Download, FileText, ShieldAlert, Volume2, Share2, Check, ExternalLink, Info } from 'lucide-react';
import { Scheme } from '../lib/schemeRules';
import { FormSubmissionData, generateApplicationPDF, DocumentType } from '../lib/documentGenerator';
import { LocaleTranslations } from '../locales';

interface DownloadCenterProps {
  scheme: Scheme;
  formData: FormSubmissionData;
  t: LocaleTranslations;
  languageCode: string;
  onPlayAudio: () => void;
  isPlayingAudio: boolean;
}

export const DownloadCenter: React.FC<DownloadCenterProps> = ({
  scheme,
  formData,
  t,
  languageCode,
  onPlayAudio,
  isPlayingAudio
}) => {
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleDownload = async (type: DocumentType) => {
    setDownloadingDoc(type);
    try {
      await generateApplicationPDF(formData, type);
    } catch (e) {
      console.error('PDF Generation failed:', e);
    } finally {
      setDownloadingDoc(null);
    }
  };

  const getShareableSummary = (): string => {
    const rightsSummary = scheme.legalRightsAudioText[languageCode] || scheme.legalRightsAudioText['en'];
    return `🛡️ *Kavach Vaani - Welfare Rights Summary*\n` +
      `📌 *Scheme:* ${scheme.name}\n` +
      `💰 *Entitlement:* ${scheme.benefitAmountSummary}\n` +
      `⚖️ *Legal Protection:* Under Section 18(3) of Street Vendors Act 2014, 30 days notice is mandatory before eviction.\n` +
      `🚫 *Anti-Extortion:* Zero broker fees. Never pay bribes.\n` +
      `🌐 *Official Portal:* ${scheme.officialSupportChannels.portalUrl}\n` +
      `📞 *Helpline:* ${scheme.grievanceHelpline}\n` +
      `_Demo Reference: ${formData.applicationId}_`;
  };

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(getShareableSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-orange-400" />
            {t.downloads.sectionTitle}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{t.downloads.sectionSubtitle}</p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-950 text-orange-300 border border-orange-500/30">
          ID: #{formData.applicationId}
        </span>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-3 mb-5 flex items-start gap-2.5 text-xs text-amber-200">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Demonstration Only – Not an Official Government Approval or Submission Receipt.</strong> All generated PDFs and records are for hackathon demonstration. Please apply through official ULB or government channels.
        </p>
      </div>

      {/* 5 Required Outputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-5">
        {/* Output 1: Application Preparation Summary PDF */}
        <div className="bg-slate-950/60 border border-slate-800 hover:border-orange-500/40 rounded-2xl p-4 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-orange-400 font-bold text-xs mb-1">
              <FileText className="w-4 h-4" />
              <span>{t.downloads.appSummaryPdf}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              {t.downloads.appSummaryPdfDesc}
            </p>
          </div>
          <button
            onClick={() => handleDownload('application_summary')}
            disabled={downloadingDoc === 'application_summary'}
            className="w-full py-2 px-3 rounded-xl bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-white border border-orange-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingDoc === 'application_summary' ? 'Generating PDF...' : t.downloads.downloadBtn}</span>
          </button>
        </div>

        {/* Output 2: Audio Rights Card PDF */}
        <div className="bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>{t.downloads.rightsCardPdf}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              {t.downloads.rightsCardPdfDesc}
            </p>
          </div>
          <button
            onClick={() => handleDownload('rights_card')}
            disabled={downloadingDoc === 'rights_card'}
            className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingDoc === 'rights_card' ? 'Generating PDF...' : t.downloads.downloadBtn}</span>
          </button>
        </div>

        {/* Output 3: Scheme Information Summary PDF */}
        <div className="bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs mb-1">
              <FileText className="w-4 h-4" />
              <span>{t.downloads.schemeInfoPdf}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              {t.downloads.schemeInfoPdfDesc}
            </p>
          </div>
          <button
            onClick={() => handleDownload('scheme_summary')}
            disabled={downloadingDoc === 'scheme_summary'}
            className="w-full py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingDoc === 'scheme_summary' ? 'Generating PDF...' : t.downloads.downloadBtn}</span>
          </button>
        </div>

        {/* Output 4: Genuine Audio Explanation */}
        <div className="bg-slate-950/60 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs mb-1">
              <Volume2 className="w-4 h-4" />
              <span>{t.downloads.audioExplanation}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              {t.downloads.audioExplanationDesc}
            </p>
          </div>
          <button
            onClick={onPlayAudio}
            className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              isPlayingAudio
                ? 'bg-purple-600 text-white border-purple-400 animate-pulse'
                : 'bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white border-purple-500/40'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlayingAudio ? 'Playing...' : t.downloads.listenBtn}</span>
          </button>
        </div>
      </div>

      {/* Output 5: Shareable Rights Summary */}
      <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-left w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>{t.downloads.shareableRights}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {t.downloads.shareableRightsDesc}
          </p>
        </div>

        <button
          onClick={handleCopyShare}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? t.downloads.copiedNotice : t.downloads.shareBtn}</span>
        </button>
      </div>

      {/* Official Government Support Links */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <span className="flex items-center gap-1">
          <strong>Official Portal:</strong>
          <a
            href={scheme.officialSupportChannels.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline flex items-center gap-0.5"
          >
            {scheme.officialSupportChannels.portalUrl}
            <ExternalLink className="w-3 h-3" />
          </a>
        </span>
        <span>
          <strong>Helpline:</strong> {scheme.grievanceHelpline}
        </span>
      </div>
    </div>
  );
};
