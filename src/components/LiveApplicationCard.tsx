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
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {t.interview.formTitle}
          </span>
          <h4 className="text-base font-black text-slate-900 mt-1">{schemeName}</h4>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-[11px] font-extrabold text-emerald-800 shadow-sm">
          <Clock className="w-3.5 h-3.5 animate-spin text-emerald-600" />
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
              className={`p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 border ${
                isCurrent
                  ? 'bg-emerald-50/80 border-2 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                  : isFilled
                  ? 'bg-slate-50/80 border-slate-200 text-slate-900'
                  : 'bg-white border-slate-100 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isCurrent
                      ? 'bg-emerald-700 text-white font-black'
                      : isFilled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500">{s.label}</div>
                  <div className="text-sm font-bold text-slate-900 tracking-tight">
                    {s.value || (isCurrent ? <span className="text-emerald-700 text-xs italic font-semibold animate-pulse">{t.interview.awaitingVoice}</span> : <span className="text-slate-300 text-xs">—</span>)}
                  </div>
                </div>
              </div>

              {isFilled ? (
                <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
              ) : isCurrent ? (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping mr-2" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
