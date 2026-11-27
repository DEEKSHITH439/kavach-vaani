import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, User, Phone, MapPin, CreditCard, Building } from 'lucide-react';
import { LocaleTranslations } from '../locales';

interface LiveApplicationCardProps {
  schemeName: string;
  data: {
    fullName: string;
    phone: string;
    location: string;
    occupation: string;
    aadhaar: string;
    bankAccount: string;
    upiId: string;
  };
  currentStep: number;
  t: LocaleTranslations;
}

export const LiveApplicationCard: React.FC<LiveApplicationCardProps> = ({
  schemeName,
  data,
  currentStep,
  t
}) => {
  const steps = [
    { label: t.interview.fields.fullName, value: data.fullName, icon: User, key: 'fullName' },
    { label: t.interview.fields.phone, value: data.phone, icon: Phone, key: 'phone' },
    { label: t.interview.fields.location, value: data.location, icon: MapPin, key: 'location' },
    { label: t.interview.fields.covStatus, value: data.occupation, icon: Building, key: 'occupation' },
    { label: t.interview.fields.aadhaarLast4, value: data.aadhaar ? `XXXX-XXXX-${data.aadhaar.slice(-4)}` : '', icon: ShieldCheck, key: 'aadhaar' },
    { label: t.interview.fields.bankAccountLast4, value: data.upiId || data.bankAccount, icon: CreditCard, key: 'upi' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-soft-lg backdrop-blur-xl">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-400">
            {t.interview.formTitle}
          </span>
          <h4 className="text-sm font-black text-white">{schemeName}</h4>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-500/30 text-[11px] font-extrabold text-orange-300 shadow-sm">
          <Clock className="w-3.5 h-3.5 animate-spin text-orange-400" />
          <span>{t.interview.stepCounter(Math.min(currentStep + 1, 6), 6)}</span>
        </div>
      </div>

      {/* Field Items */}
      <div className="space-y-2.5">
        {steps.map((s, idx) => {
          const isFilled = Boolean(s.value);
          const isCurrent = idx === currentStep;
          const Icon = s.icon;

          return (
            <div
              key={idx}
              className={`p-3 sm:p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 border ${
                isCurrent
                  ? 'bg-orange-500/10 border-orange-500/60 shadow-glow-saffron ring-1 ring-orange-500/40'
                  : isFilled
                  ? 'bg-slate-800/50 border-emerald-500/30 text-white'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isCurrent
                      ? 'bg-orange-500 text-slate-950 font-black'
                      : isFilled
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400">{s.label}</div>
                  <div className="text-sm font-bold text-white tracking-tight">
                    {s.value || (isCurrent ? <span className="text-orange-400 text-xs italic font-medium animate-pulse">{t.interview.awaitingVoice}</span> : <span className="text-slate-600 text-xs">—</span>)}
                  </div>
                </div>
              </div>

              {isFilled ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              ) : isCurrent ? (
                <div className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-ping mr-2" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
