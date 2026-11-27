import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, AlertCircle, FileText, Download, Building2, UserCheck, Shield } from 'lucide-react';
import { generateApplicationPDF } from '../lib/documentGenerator';
import { LocaleStructure } from '../locales';

interface ApplicationTrackerProps {
  t: LocaleStructure;
  initialApplicationId?: string;
  languageCode: string;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  t,
  initialApplicationId = 'KV-DEMO-782914',
  languageCode
}) => {
  const [searchQuery, setSearchQuery] = useState(initialApplicationId);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'portal_info'>('status');

  // Realistic mock tracking data for hackathon demo
  const sampleStatusData = {
    applicationId: searchQuery || initialApplicationId,
    schemeName: 'PM SVANidhi (Urban Street Vendors)',
    applicantName: 'Ramesh Kumar',
    submissionDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    currentStatus: 'UNDER_ULB_VERIFICATION',
    ulbName: 'Bruhat Bengaluru Mahanagara Palike (BBMP) - Ward 142',
    steps: [
      {
        id: 1,
        title: 'Application Received via Kavach Vaani Assisted Voice',
        status: 'COMPLETED',
        date: 'Today, Just Now',
        desc: 'Zero-key digital simulation packet registered in municipality intake queue.'
      },
      {
        id: 2,
        title: 'Certificate of Vending (CoV) / LoR Verification',
        status: 'IN_PROGRESS',
        date: 'In Progress (SLA: 48 Hours)',
        desc: 'Town Vending Committee (TVC) checking survey register.'
      },
      {
        id: 3,
        title: 'Lending Bank Allocation (SBI / Canara / PNB)',
        status: 'PENDING',
        date: 'Next Stage',
        desc: 'Direct collateral-free credit sanction of ₹15,000 for 1st tranche.'
      },
      {
        id: 4,
        title: 'Direct Benefit Transfer (DBT) to Bank Account',
        status: 'PENDING',
        date: 'Final Stage',
        desc: '7% p.a. interest subsidy credited quarterly on timely digital repayments.'
      }
    ]
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 400);
  };

  const handleDownloadSlip = () => {
    generateApplicationPDF({
      scheme: {
        id: 'pm-svanidhi',
        name: 'PM SVANidhi',
        nameNative: { kn: 'ಪಿಎಂ ಸ್ವನಿಧಿ', hi: 'पीएम स्वनिधि', ta: 'பிஎம் ஸ்வநிதி', bn: 'পিএম স্বনিধি', en: 'PM SVANidhi' },
        category: 'street-vendor',
        benefitAmountSummary: 'Up to ₹15,000 (1st) ➔ ₹25,000 (2nd) ➔ ₹50,000 (3rd)',
        benefitAmount: 'Working capital loan up to ₹15,000 (1st), ₹25,000 (2nd), ₹50,000 (3rd)',
        benefitDescription: 'Collateral-free working capital loan in 3 tranches with 7% p.a. interest subsidy.',
        criteriaSummary: 'Urban street vendors vending on or before eligible survey dates.',
        requiredDocuments: [{ name: 'Certificate of Vending (CoV) or Letter of Recommendation (LoR)', description: 'Issued by local ULB / TVC', mandatory: true }],
        officialPortalUrl: 'https://pmsvanidhi.mohua.gov.in',
        administeringAuthority: 'Ministry of Housing and Urban Affairs (MoHUA)',
        localAuthority: { agencyName: 'Urban Local Body (Municipal Corporation / Municipality) / TVC', localAuthorityNative: {} },
        grievanceHelpline: '1800-11-1979 / Contact Local ULB',
        protectionAct: 'The Street Vendors (Protection of Livelihood and Regulation of Street Vending) Act, 2014 (Section 18(3))',
        sourceReferences: { authority: 'MoHUA', publicationDate: '19 January 2026' },
        legalRightsAudioText: {},
        legalRightsSummary: 'Statutory 30-day notice prior to relocation under Street Vendors Act 2014.'
      },
      fullName: 'Ramesh Kumar',
      phone: '9876543210',
      aadhaarLast4: '4589',
      location: 'Bengaluru, Karnataka',
      occupation: 'Street Vendor (Tea Stall)',
      bankAccountLast4: '1234',
      upiId: 'ramesh@upi',
      appliedDate: sampleStatusData.submissionDate,
      applicationId: sampleStatusData.applicationId,
      isSimulation: true
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Live Application Tracker & Portal Status</h3>
            <p className="text-[11px] text-slate-400">Track your government application & ULB verification status</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              activeTab === 'status' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Track Status
          </button>
          <button
            onClick={() => setActiveTab('portal_info')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              activeTab === 'portal_info' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Govt Portals
          </button>
        </div>
      </div>

      {activeTab === 'status' ? (
        <div>
          {/* Tracking Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Application ID (e.g., KV-KN-123456)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isSearching ? 'Checking...' : 'Check'}</span>
            </button>
          </form>

          {/* Status Result Card */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Application ID</span>
                <span className="font-mono font-bold text-sm text-orange-400">#{sampleStatusData.applicationId}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Assigned Authority</span>
                <span className="text-xs font-medium text-slate-200">{sampleStatusData.ulbName}</span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-3">
              {sampleStatusData.steps.map((step, idx) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="pt-0.5">
                    {step.status === 'COMPLETED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : step.status === 'IN_PROGRESS' ? (
                      <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center text-[9px] text-slate-500">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${step.status === 'COMPLETED' ? 'text-emerald-300' : step.status === 'IN_PROGRESS' ? 'text-amber-300' : 'text-slate-400'}`}>
                        {step.title}
                      </span>
                      <span className="text-[10px] text-slate-500">{step.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Application Slip CTA */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Legally-compliant simulation receipt</span>
              </span>
              <button
                onClick={handleDownloadSlip}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-semibold flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-orange-400" />
                <span>Download Applied Form Slip</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Official Portal Directory */
        <div className="space-y-3">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-orange-300">PM SVANidhi Portal (MoHUA)</span>
              <a
                href="https://pmsvanidhi.mohua.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-blue-400 underline hover:text-blue-300"
              >
                pmsvanidhi.mohua.gov.in ↗
              </a>
            </div>
            <p className="text-[11px] text-slate-400">
              Check loan sanction status, track town vending committee survey entry, and verify 7% interest subsidy DBT credit.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-300">PM-JAY Ayushman Bharat (NHA)</span>
              <a
                href="https://beneficiary.nha.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-blue-400 underline hover:text-blue-300"
              >
                beneficiary.nha.gov.in ↗
              </a>
            </div>
            <p className="text-[11px] text-slate-400">
              Download your Ayushman Golden Card and search empanelled hospitals for cashless secondary & tertiary hospital treatment up to ₹5 Lakhs.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-300">National e-Shram Portal</span>
              <a
                href="https://eshram.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-blue-400 underline hover:text-blue-300"
              >
                eshram.gov.in ↗
              </a>
            </div>
            <p className="text-[11px] text-slate-400">
              Update UAN details, verify unorganized worker category, and link family welfare social security benefits.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
