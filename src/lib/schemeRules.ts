// Single source of truth for statutory welfare schemes in Kavach Vaani.
// All financial figures, legal provisions, and regional texts are strictly mapped
// from the approved master baseline and verified official circulars.

export interface SchemeTranche {
  stage: number;
  maxAmount: number;
  label: string;
  condition: string;
  conditionNative: Record<string, string>;
}

export interface Scheme {
  id: string;
  name: string;
  nameNative: Record<string, string>;
  category: 'street-vendor' | 'construction' | 'gig-delivery' | 'health' | 'all';
  benefitAmountSummary: string;
  tranches?: SchemeTranche[];
  interestSubsidyInfo?: {
    ratePercent: number;
    description: string;
    descriptionNative: Record<string, string>;
  };
  criteriaSummary: string;
  requiredDocuments: Array<{
    code: string;
    name: string;
    nameNative: Record<string, string>;
    description: string;
  }>;
  legalRightsSummary: string;
  legalRightsAudioText: Record<string, string>;
  officialSupportChannels: {
    portalUrl: string;
    localAuthorityLabel: string;
    localAuthorityNative: Record<string, string>;
    verifiedHelpline?: string;
  };
  protectionAct: string;
  sourceReferences: {
    authority: string;
    officialUrl: string;
    provisions: string;
    lastVerifiedDate: string;
  };
}

export const SCHEMES_DATABASE: Scheme[] = [
  {
    id: 'pm-svanidhi',
    name: 'PM SVANidhi (PM Street Vendor’s AtmaNirbhar Nidhi)',
    nameNative: {
      en: 'PM SVANidhi (Street Vendor Loan Scheme)',
      kn: 'ಪಿಎಂ ಸ್ವನಿಧಿ (ಬೀದಿ ವ್ಯಾಪಾರಿಗಳ ಸ್ವಾವಲಂಬನೆ ನಿಧಿ)',
      hi: 'पीएम स्वनिधि (प्रधानमंत्री स्ट्रीट वेंडर आत्मनिर्भर निधि)',
      ta: 'பிஎம் ஸ்வநிதி (தெருவோர வியாபாரிகள் தற்சார்பு நிதி)',
      bn: 'পিএম স্বনিধি (প্রধানমন্ত্রী স্ট্রিট ভেন্ডর আত্মনির্ভর নিধি)'
    },
    category: 'street-vendor',
    benefitAmountSummary: 'Up to ₹15,000 (1st loan) ➔ ₹25,000 (2nd loan) ➔ ₹50,000 (3rd loan)',
    tranches: [
      {
        stage: 1,
        maxAmount: 15000,
        label: '1st Loan: Up to ₹15,000',
        condition: 'For eligible vendors with Certificate of Vending (CoV) or Letter of Recommendation (LoR).',
        conditionNative: {
          en: 'For eligible vendors with CoV or LoR.',
          kn: 'ವ್ಯಾಪಾರ ಪ್ರಮಾಣಪತ್ರ (CoV) ಅಥವಾ ಶಿಫಾರಸು ಪತ್ರ (LoR) ಹೊಂದಿರುವ ಅರ್ಹ ವ್ಯಾಪಾರಿಗಳಿಗೆ.',
          hi: 'वेंडिंग प्रमाण पत्र (CoV) या सिफारिश पत्र (LoR) रखने वाले पात्र वेंडरों के लिए।',
          ta: 'CoV அல்லது LoR வைத்துள்ள தகுதியான வியாபாரிகளுக்கு.',
          bn: 'CoV বা LoR থাকা যোগ্য বিক্রেতাদের জন্য।'
        }
      },
      {
        stage: 2,
        maxAmount: 25000,
        label: '2nd Loan: Up to ₹25,000',
        condition: 'Subject to successful and timely repayment of the first loan and lender approval.',
        conditionNative: {
          en: 'Subject to timely repayment of 1st loan and lender assessment.',
          kn: 'ಮೊದಲ ಸಾಲವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮರುಪಾವತಿಸಿದ ನಂತರ ಬ್ಯಾಂಕ್ ಮೌಲ್ಯಮಾಪನಕ್ಕೆ ಒಳಪಟ್ಟು.',
          hi: 'पहले ऋण के समय पर सफल पुनर्भुगतान और बैंक मूल्यांकन के अधीन।',
          ta: 'முதல் கடனை உரிய நேரத்தில் திருப்பிச் செலுத்திய பிறகு வங்கியின் ஒப்புதலுக்கு உட்பட்டது.',
          bn: 'প্রথম ঋণ সফলভাবে পরিশোধ এবং ব্যাঙ্কের মূল্যায়ন সাপেক্ষে।'
        }
      },
      {
        stage: 3,
        maxAmount: 50000,
        label: '3rd Loan: Up to ₹50,000',
        condition: 'Subject to successful and timely repayment of the second loan and lender approval.',
        conditionNative: {
          en: 'Subject to timely repayment of 2nd loan and lender assessment.',
          kn: 'ಎರಡನೇ ಸಾಲವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮರುಪಾವತಿಸಿದ ನಂತರ ಬ್ಯಾಂಕ್ ಮೌಲ್ಯಮಾಪನಕ್ಕೆ ಒಳಪಟ್ಟು.',
          hi: 'दूसरे ऋण के समय पर सफल पुनर्भुगतान और बैंक मूल्यांकन के अधीन।',
          ta: 'இரண்டாவது கடனை உரிய நேரத்தில் திருப்பிச் செலுத்திய பிறகு வங்கியின் ஒப்புதலுக்கு உட்பட்டது.',
          bn: 'দ্বিতীয় ঋণ সফলভাবে পরিশোধ এবং ব্যাঙ্কের মূল্যায়ন সাপেক্ষে।'
        }
      }
    ],
    interestSubsidyInfo: {
      ratePercent: 7,
      description: 'Timely repayment may make you eligible for an interest subsidy of 7% per year, subject to scheme rules. It reduces interest burden and is not a loan waiver or grant.',
      descriptionNative: {
        en: 'Timely repayment may make you eligible for 7% interest subsidy per annum to reduce interest burden (not a loan waiver).',
        kn: 'ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಮರುಪಾವತಿಸಿದರೆ ವರ್ಷಕ್ಕೆ ಶೇಕಡಾ 7 ರ ಬಡ್ಡಿ ಸಬ್ಸಿಡಿಗೆ ಅರ್ಹರಾಗಬಹುದು (ಇದು ಸಾಲ ಮನ್ನಾ ಅಥವಾ ಅನುದಾನವಲ್ಲ).',
        hi: 'समय पर पुनर्भुगतान करने पर 7% वार्षिक ब्याज सब्सिडी मिल सकती है (यह ऋण माफी या अनुदान नहीं है)।',
        ta: 'உரிய நேரத்தில் திருப்பிச் செலுத்தினால் ஆண்டுக்கு 7% வட்டி மானியம் கிடைக்கலாம் (இது கடன் தள்ளுபடி அல்ல).',
        bn: 'সময়মতো পরিশোধ করলে বার্ষিক ৭% সুদ ভর্তুকি পাওয়া যেতে পারে (এটি ঋণ মকুব বা অনুদান নয়)।'
      }
    },
    criteriaSummary: 'Urban street vendors vending on or before cutoff date, holding CoV, ID card or ULB Letter of Recommendation (LoR).',
    requiredDocuments: [
      {
        code: 'cov',
        name: 'Certificate of Vending (CoV)',
        nameNative: {
          en: 'Certificate of Vending (CoV)',
          kn: 'ವ್ಯಾಪಾರ ಪ್ರಮಾಣಪತ್ರ (CoV)',
          hi: 'वेंडिंग प्रमाण पत्र (CoV)',
          ta: 'வியாபாரச் சான்றிதழ் (CoV)',
          bn: 'ভেন্ডিং শংসাপত্র (CoV)'
        },
        description: 'Issued by the Town Vending Committee (TVC) or Urban Local Body (ULB).'
      },
      {
        code: 'lor',
        name: 'Letter of Recommendation (LoR)',
        nameNative: {
          en: 'Letter of Recommendation (LoR)',
          kn: 'ನಗರ ಸ್ಥಳೀಯ ಸಂಸ್ಥೆಯ ಶಿಫಾರಸು ಪತ್ರ (LoR)',
          hi: 'सिफारिश पत्र (LoR)',
          ta: 'பரிந்துரைக் கடிதம் (LoR)',
          bn: 'পুরসভার সুপারিশপত্র (LoR)'
        },
        description: 'Issued by the Urban Local Body for vendors left out of prior vending surveys.'
      }
    ],
    legalRightsSummary: 'Under Section 18(3) of the Street Vendors Act 2014, a street vendor cannot be relocated or evicted by the local authority from the place specified in their Certificate of Vending unless given thirty days notice in the prescribed manner. Applies specifically to the designated vending location and provides no general immunity from other applicable laws.',
    legalRightsAudioText: {
      en: 'Here is your Audio Rights Card. Applying for PM SVANidhi does not require paying commission to intermediaries. Never pay bribes to brokers. Under Section 18(3) of the Street Vendors Act 2014, a street vendor cannot be relocated or evicted by the local authority from the place specified in their Certificate of Vending unless given thirty days notice in the manner prescribed by the scheme. This protection applies specifically to the location mentioned in the Certificate of Vending and does not provide general immunity from other applicable laws. For official assistance, please use the official PM SVANidhi portal or contact your Urban Local Body.',
      kn: 'ಇದು ನಿಮ್ಮ ಕವಚ ವಾಣಿ ಆಡಿಯೋ ಅಧಿಕಾರ ಪತ್ರ. ಭಾಗ 1: ಪಿಎಂ ಸ್ವನಿಧಿ ಯೋಜನೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಮಧ್ಯವರ್ತಿಗಳಿಗೆ ಕಮಿಷನ್ ನೀಡುವ ಅಗತ್ಯವಿಲ್ಲ. ಯಾವುದೇ ದಲ್ಲಾಳಿಗಳಿಗೆ ಲಂಚ ಅಥವಾ ಅನಧಿಕೃತ ಶುಲ್ಕಗಳನ್ನು ನೀಡಬೇಡಿ. ಭಾಗ 2: ಬೀದಿ ವ್ಯಾಪಾರಿಗಳ ಕಾಯಿದೆ 2014 ರ ಸೆಕ್ಷನ್ 18(3) ರ ಪ್ರಕಾರ, ಯೋಜನೆಯಲ್ಲಿ ನಿಗದಿಪಡಿಸಿದ ರೀತಿಯಲ್ಲಿ ಮೂವತ್ತು ದಿನಗಳ ಮುಂಚಿತ ನೋಟಿಸ್ ನೀಡದೆ, ಬೀದಿ ವ್ಯಾಪಾರಿಯನ್ನು ಅವರ ವ್ಯಾಪಾರ ಪ್ರಮಾಣಪತ್ರದಲ್ಲಿ ನಿರ್ದಿಷ್ಟಪಡಿಸಿದ ಸ್ಥಳದಿಂದ ಸ್ಥಳೀಯ ಪ್ರಾಧಿಕಾರವು ಸ್ಥಳಾಂತರಿಸಲು ಅಥವಾ ತೆರವುಗೊಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ಈ ರಕ್ಷಣೆಯು ಕೇವಲ ವ್ಯಾಪಾರ ಪ್ರಮಾಣಪತ್ರದಲ್ಲಿ ಉಲ್ಲೇಖಿಸಲಾದ ಸ್ಥಳಕ್ಕೆ ಮಾತ್ರ ಅನ್ವಯಿಸುತ್ತದೆ ಮತ್ತು ಸಾಮಾನ್ಯ ಕಾನೂನುಗಳಿಂದ ವಿನಾಯಿತಿ ನೀಡುವುದಿಲ್ಲ. ಭಾಗ 3: ಅಧಿಕೃತ ಸಹಾಯಕ್ಕಾಗಿ, ದಯವಿಟ್ಟು ಅಧಿಕೃತ ಪಿಎಂ ಸ್ವನಿಧಿ ಪೋರ್ಟಲ್ ಬಳಸಿ ಅಥವಾ ನಿಮ್ಮ ನಗರ ಸ್ಥಳೀಯ ಸಂಸ್ಥೆಯನ್ನು (ULB) ಸಂಪರ್ಕಿಸಿ.',
      hi: 'यह आपका कवच वाणी ऑडियो अधिकार पत्र है। भाग 1: पीएम स्वनिधि के लिए आवेदन करने हेतु मध्यस्थों को कमीशन देने की कोई आवश्यकता नहीं है। दलालों को कोई रिश्वत या अनधिकृत शुल्क न दें। भाग 2: स्ट्रीट वेंडर्स अधिनियम 2014 की धारा 18(3) के तहत, किसी स्ट्रीट वेंडर को, योजना में निर्धारित तरीके से तीस दिनों का नोटिस दिए बिना, उसके वेंडिंग प्रमाण पत्र में निर्दिष्ट स्थान से स्थानीय निकाय द्वारा स्थानांतरित या बेदखल नहीं किया जा सकता है। यह सुरक्षा विशेष रूप से वेंडिंग प्रमाण पत्र में उल्लिखित स्थान पर ही लागू होती है और सामान्य कानूनों से कोई छूट प्रदान नहीं करती है। भाग 3: आधिकारिक सहायता के लिए, कृपया आधिकारिक पीएम स्वनिधि पोर्टल का उपयोग करें या अपने शहरी स्थानीय निकाय से संपर्क करें।',
      ta: 'இது உங்கள் கவச் வாணி ஆடியோ உரிமை அட்டை. பகுதி 1: பிஎம் ஸ்வநிதி திட்டத்திற்கு விண்ணப்பிக்க இடைத்தரகர்களுக்கு கமிஷன் தரவேண்டிய அவசியமில்லை. இடைத்தரகர்களுக்கு லஞ்சமோ அல்லது அங்கீகரிக்கப்படாத கட்டணங்களோ கொடுக்க வேண்டாம். பகுதி 2: தெருவோர வியாபாரிகள் சட்டம் 2014, பிரிவு 18(3)-இன் படி, திட்டத்தில் பரிந்துரைக்கப்பட்ட முறையில் முப்பது நாட்கள் முன் அறிவிப்பு தராமல், வியாபாரச் சான்றிதழில் குறிப்பிடப்பட்டுள்ள இடத்திலிருந்து ஒரு தெருவோர வியாபாரியை உள்ளாட்சி அமைப்பினர் இடமாற்றவோ அல்லது அப்புறப்படுத்தவோ முடியாது. இந்த பாதுகாப்பு சான்றிதழில் உள்ள இடத்திற்கு மட்டுமே பொருந்தும். பகுதி 3: அதிகாரப்பூர்வ தகவல்களுக்கு, தயவுசெய்து அதிகாரப்பூர்வ பிஎம் ஸ்வநிதி இணையதளத்தை பயன்படுத்தவும் அல்லது உங்கள் நகர்ப்புற உள்ளாட்சி அமைப்பை தொடர்பு கொள்ளவும்.',
      bn: 'এটি আপনার কবচ বাণী অডিও অধিকার পত্র। অংশ ১: পিএম স্বনিধি প্রকল্পে আবেদনের জন্য কোনো মধ্যস্থতাকারীকে কমিশন দেওয়ার প্রয়োজন নেই। কোনো দালালকে কোনো ঘুষ বা ফি দেবেন না। অংশ ২: স্ট্রিট ভেন্ডরস আইন ২০১৪-এর ধারা ১৮(৩) অনুযায়ী, প্রকল্পে নির্ধারিত পদ্ধতিতে ত্রিশ দিনের নোটিশ দেওয়া ছাড়া, ভেন্ডিং শংসাপত্রে উল্লিখিত স্থান থেকে কোনো স্ট্রিট ভেন্ডরকে স্থানীয় পুর কর্তৃপক্ষ স্থানান্তরিত বা উচ্ছেদ করতে পারে না। এই আইনি সুরক্ষা শুধুমাত্র ভেন্ডিং শংসাপত্রে নির্দিষ্ট স্থানের ক্ষেত্রেই প্রযোজ্য। অংশ ৩: অফিসিয়াল সহায়তার জন্য, অনুগ্রহ করে অফিসিয়াল পিএম স্বনিধি পোর্টাল ব্যবহার করুন বা আপনার নগর স্থানীয় সংস্থার (ULB) সাথে যোগাযোগ করুন।'
    },
    officialSupportChannels: {
      portalUrl: 'https://pmsvanidhi.mohua.gov.in',
      localAuthorityLabel: 'Urban Local Body (Municipal Corporation / Municipality) / Town Vending Committee',
      localAuthorityNative: {
        en: 'Urban Local Body (ULB) / Town Vending Committee (TVC)',
        kn: 'ನಗರ ಸ್ಥಳೀಯ ಸಂಸ್ಥೆ (ಪುರಸಭೆ / ಮಹಾನಗರ ಪಾಲಿಕೆ) / ಟೌನ್ ವೆಂಡಿಂಗ್ ಸಮಿತಿ (TVC)',
        hi: 'शहरी स्थानीय निकाय (नगर निगम / नगरपालिका) / टाउन वेंडिंग कमेटी (TVC)',
        ta: 'நகர்ப்புற உள்ளாட்சி அமைப்பு (மாநகராட்சி / நகராட்சி) / TVC',
        bn: 'নগর স্থানীয় পুরসভা / টাউন ভেন্ডিং কমিটি (TVC)'
      }
    },
    protectionAct: 'The Street Vendors (Protection of Livelihood and Regulation of Street Vending) Act, 2014 (Section 18(3))',
    sourceReferences: {
      authority: 'Ministry of Housing and Urban Affairs (MoHUA), Government of India',
      officialUrl: 'https://pmsvanidhi.mohua.gov.in',
      provisions: 'PM SVANidhi Restructuring Guidelines & Section 18(3) Street Vendors Act 2014',
      lastVerifiedDate: '2026-11-27'
    }
  },
  {
    id: 'e-shram',
    name: 'e-Shram National Welfare Portal',
    nameNative: {
      en: 'e-Shram Universal Unorganized Worker Portal',
      kn: 'ಇ-ಶ್ರಮ್ ರಾಷ್ಟ್ರೀಯ ಅಸಂಘಟಿತ ಕಾರ್ಮಿಕರ ಪೋರ್ಟಲ್',
      hi: 'ई-श्रम राष्ट्रीय असंगठित श्रमिक कार्ड',
      ta: 'இ-ஷ்ரம் தேசிய அமைப்புசாரா தொழிலாளர் நல அட்டை',
      bn: 'ই-শ্রম জাতীয় অসংগঠিত শ্রমিক কার্ড'
    },
    category: 'all',
    benefitAmountSummary: 'Universal UAN + Accidental Risk Cover under PMSBY guidelines',
    criteriaSummary: 'Unorganized workers aged 16-59 not enrolled in EPFO or ESIC.',
    requiredDocuments: [
      {
        code: 'aadhaar',
        name: 'Aadhaar Card with linked Mobile',
        nameNative: {
          en: 'Aadhaar Card',
          kn: 'ಆಧಾರ್ ಕಾರ್ಡ್',
          hi: 'आधार कार्ड',
          ta: 'ஆதார் அட்டை',
          bn: 'আধার কার্ড'
        },
        description: 'For unique identity verification.'
      }
    ],
    legalRightsSummary: 'Under the Unorganised Workers Social Security Act 2008, e-Shram registration is 100% free under Government of India guidelines. Do not pay any fees to local agents.',
    legalRightsAudioText: {
      en: 'e-Shram registration is 100% free under Government of India guidelines. Do not pay any fees or cuts to local agents. For verified support, consult the official e-Shram portal.',
      kn: 'ಇ-ಶ್ರಮ್ ನೋಂದಣಿ ಸಂಪೂರ್ಣ ಉಚಿತವಾಗಿದೆ. ಮಧ್ಯವರ್ತಿಗಳಿಗೆ ಹಣ ನೀಡಬೇಡಿ. ಅಧಿಕೃತ ಇ-ಶ್ರಮ್ ಪೋರ್ಟಲ್ ಸಂಪರ್ಕಿಸಿ.',
      hi: 'ई-श्रम पंजीकरण पूरी तरह निःशुल्क है। किसी भी दलाल को कोई राशि न दें। आधिकारिक ई-श्रम पोर्टल से जानकारी प्राप्त करें।',
      ta: 'இ-ஷ்ரம் பதிவு முற்றிலும் இலவசம். இடைத்தரகர்களுக்கு பணம் தரவேண்டாம்.',
      bn: 'ই-শ্রম নিবন্ধন সম্পূর্ণ বিনামূল্যে হয়। কোনো দালালকে এক টাকাও দেবেন না।'
    },
    officialSupportChannels: {
      portalUrl: 'https://eshram.gov.in',
      localAuthorityLabel: 'District Labour Office / Common Services Centre (CSC)',
      localAuthorityNative: {
        en: 'District Labour Department / Official CSC',
        kn: 'ಜಿಲ್ಲಾ ಕಾರ್ಮಿಕ ಇಲಾಖೆ / ಅಧಿಕೃತ CSC',
        hi: 'जिला श्रम विभाग / आधिकारिक सीएससी',
        ta: 'மாவட்ட தொழிலாளர் நலத்துறை / CSC',
        bn: 'জেলা শ্রম দফতর / সিএসসি'
      }
    },
    protectionAct: 'Unorganised Workers Social Security Act, 2008',
    sourceReferences: {
      authority: 'Ministry of Labour and Employment, Government of India',
      officialUrl: 'https://eshram.gov.in',
      provisions: 'National Database for Unorganised Workers Guidelines',
      lastVerifiedDate: '2026-11-27'
    }
  },
  {
    id: 'pm-jay',
    name: 'Ayushman Bharat (PM-JAY)',
    nameNative: {
      en: 'Ayushman Bharat (PM-JAY)',
      kn: 'ಆಯುಷ್ಮಾನ್ ಭಾರತ (ಪಿಎಂ-ಜೆಎವೈ)',
      hi: 'आयुष्मान भारत (पीएम-जेएवाई गोल्डन कार्ड)',
      ta: 'ஆயுஷ்மான் பாரத் (PM-JAY)',
      bn: 'আয়ুষ্মান ভারত (PM-JAY)'
    },
    category: 'health',
    benefitAmountSummary: 'Up to ₹5,00,000 / year cashless hospitalization per eligible family',
    criteriaSummary: 'Identified families under SECC deprived rural & designated urban occupational criteria, subject to state validation.',
    requiredDocuments: [
      {
        code: 'ration_card',
        name: 'Ration Card / Ayushman Family ID',
        nameNative: {
          en: 'Ration Card / SECC ID',
          kn: 'ರೇಷನ್ ಕಾರ್ಡ್ / SECC ವಿವರ',
          hi: 'राशन कार्ड / परिवार समग्र आईडी',
          ta: 'குடும்ப அட்டை (Ration Card)',
          bn: 'রেশন কার্ড / পরিবার আইডি'
        },
        description: 'For family verification.'
      }
    ],
    legalRightsSummary: 'Cashless hospital treatment at empanelled public and private hospitals. No hospital may demand cash deposits for covered secondary/tertiary procedures.',
    legalRightsAudioText: {
      en: 'Under PM-JAY, empanelled hospitals cannot charge admission fees or cash deposits for covered treatments. Check your eligibility at your nearest empanelled hospital or PM-JAY kiosk.',
      kn: 'ಆಯುಷ್ಮಾನ್ ಯೋಜನೆಯಡಿ ಅನುಮೋದಿತ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ನಗದು ರಹಿತ ಚಿಕಿತ್ಸೆ ಸಿಗುತ್ತದೆ. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಅಧಿಕೃತ ಆಸ್ಪತ್ರೆ ಕಿಯೋಸ್ಕ್ ಸಂಪರ್ಕಿಸಿ.',
      hi: 'आयुष्मान भारत के तहत पैनलबद्ध अस्पतालों में भर्ती और इलाज कैशलेस है। नजदीकी सरकारी अस्पताल या आयुष्मान मित्र से संपर्क करें।',
      ta: 'அங்கீகரிக்கப்பட்ட மருத்துவமனைகளில் அனுமதிக்கப்பட்ட சிகிச்சைக்கு பணம் செலுத்த தேவையில்லை.',
      bn: 'তালিকাভুক্ত হাসপাতালে চিকিৎসার জন্য কোনো নগদ টাকা নেওয়া নিষেধ।'
    },
    officialSupportChannels: {
      portalUrl: 'https://pmjay.gov.in',
      localAuthorityLabel: 'National Health Authority / District Civil Hospital Ayushman Mitra',
      localAuthorityNative: {
        en: 'District Hospital Ayushman Mitra',
        kn: 'ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆ ಆಯುಷ್ಮಾನ್ ಮಿತ್ರ',
        hi: 'जिला अस्पताल आयुष्मान मित्र',
        ta: 'மாவட்ட அரசு மருத்துவமனை ஆயுஷ்மான் மித்ரா',
        bn: 'জেলা হাসপাতাল আয়ুষ্মান মিত্র'
      }
    },
    protectionAct: 'National Health Authority Guidelines',
    sourceReferences: {
      authority: 'National Health Authority (NHA), Government of India',
      officialUrl: 'https://pmjay.gov.in',
      provisions: 'Ayushman Bharat PM-JAY Operational Guidelines',
      lastVerifiedDate: '2026-11-27'
    }
  },
  {
    id: 'bocw-welfare',
    name: 'BOCW Construction Worker Welfare',
    nameNative: {
      en: 'Building & Other Construction Workers Board',
      kn: 'ಕಟ್ಟಡ ಮತ್ತು ಇತರೆ ನಿರ್ಮಾಣ ಕಾರ್ಮಿಕರ ಕಲ್ಯಾಣ ಮಂಡಳಿ',
      hi: 'भवन एवं अन्य सन्निर्माण कर्मकार कल्याण बोर्ड',
      ta: 'கட்டுமானத் தொழிலாளர்கள் நல வாரியம்',
      bn: 'ভবন ও নির্মাণ শ্রমিক কল্যাণ পর্ষদ'
    },
    category: 'construction',
    benefitAmountSummary: 'Statutory welfare grants (education scholarships, tool assistance, maternity benefits)',
    criteriaSummary: 'Engaged in construction work for not less than 90 days in preceding 12 months, registered with State BOCW Board.',
    requiredDocuments: [
      {
        code: '90day_cert',
        name: '90-Day Work Certificate',
        nameNative: {
          en: '90-Day Work Certificate',
          kn: '90 ದಿನಗಳ ಕೆಲಸದ ಪ್ರಮಾಣಪತ್ರ',
          hi: '90 दिन का कार्य प्रमाण पत्र',
          ta: '90 நாள் பணிச் சான்றிதழ்',
          bn: '৯০ দিনের কাজের শংসাপত্র'
        },
        description: 'Issued by employer, registered contractor or trade union.'
      }
    ],
    legalRightsSummary: 'Statutory benefits funded by construction cess collected under law. Administered directly by the respective State Welfare Board.',
    legalRightsAudioText: {
      en: 'BOCW benefits are statutory rights funded by builder cess. Free from agent commissions. For verified status, contact your State Labour Office.',
      kn: 'ಕಟ್ಟಡ ಕಾರ್ಮಿಕರ ಸೌಲಭ್ಯಗಳು ಶಾಸನಬದ್ಧ ಹಕ್ಕುಗಳಾಗಿವೆ. ಮಧ್ಯವರ್ತಿಗಳಿಗೆ ಹಣ ನೀಡಬೇಡಿ. ನಿಮ್ಮ ಜಿಲ್ಲಾ ಕಾರ್ಮಿಕ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      hi: 'निर्माण श्रमिकों के लाभ उपकर निधि से संचालित होते हैं। किसी बिचौलिए को कमीशन न दें। जिला श्रम कार्यालय से संपर्क करें।',
      ta: 'கட்டுமான நல வாரிய பலன்கள் உங்களின் சட்டப்பூர்வ உரிமை. இடைத்தரகர்களுக்கு கமிஷன் தரவேண்டாம்.',
      bn: 'নির্মাণ শ্রমিকদের কল্যাণ ভাতা আপনার আইনি অধিকার। কোনো দালালের মাধ্যমে আবেদন করবেন না।'
    },
    officialSupportChannels: {
      portalUrl: 'https://labour.gov.in',
      localAuthorityLabel: 'State BOCW Welfare Board / District Labour Officer',
      localAuthorityNative: {
        en: 'State BOCW Board / District Labour Office',
        kn: 'ರಾಜ್ಯ ಕಟ್ಟಡ ಕಾರ್ಮಿಕರ ಕಲ್ಯಾಣ ಮಂಡಳಿ / ಜಿಲ್ಲಾ ಕಾರ್ಮಿಕ ಕಚೇರಿ',
        hi: 'राज्य भवन सन्निर्माण कर्मकार बोर्ड / जिला श्रम कार्यालय',
        ta: 'மாநில கட்டுமான நல வாரியம் / தொழிலாளர் நல அலுவலகம்',
        bn: 'রাজ্য নির্মাণ শ্রমিক কল্যাণ বোর্ড'
      }
    },
    protectionAct: 'Building and Other Construction Workers (RECS) Act, 1996',
    sourceReferences: {
      authority: 'Ministry of Labour and Employment & State Welfare Boards',
      officialUrl: 'https://labour.gov.in',
      provisions: 'BOCW Act 1996 & State BOCW Rules',
      lastVerifiedDate: '2026-11-27'
    }
  }
];

export function matchSchemeByIntent(userSpokenText: string, lang = 'hi'): {
  scheme: Scheme;
  matchedReason: string;
  extractedEntities: {
    occupation?: string;
    location?: string;
    need?: string;
    amount?: string;
  };
} {
  const text = (userSpokenText || '').toLowerCase();
  
  const entities: {
    occupation?: string;
    location?: string;
    need?: string;
    amount?: string;
  } = {};

  // Comprehensive multi-dialect vocabulary
  if (
    text.includes('vendor') || text.includes('tea') || text.includes('chai') || text.includes('stall') || 
    text.includes('thela') || text.includes('street') || text.includes('rehari') || text.includes('vyaapari') || 
    text.includes('dukaan') || text.includes('fruit') || text.includes('vegetable') || text.includes('vyapara') ||
    text.includes('angadi') || text.includes('thalluvandi') || text.includes('hawker')
  ) {
    entities.occupation = 'Street Vendor / Hawker';
  } else if (
    text.includes('construct') || text.includes('mason') || text.includes('labour') || text.includes('mazdoor') || 
    text.includes('building') || text.includes('cement') || text.includes('painting') || text.includes('kuli') || 
    text.includes('coolie') || text.includes('kattada')
  ) {
    entities.occupation = 'Construction Worker';
  } else if (
    text.includes('auto') || text.includes('rickshaw') || text.includes('delivery') || text.includes('zomato') || 
    text.includes('swiggy') || text.includes('driver') || text.includes('ola') || text.includes('uber')
  ) {
    entities.occupation = 'Gig / Transport Worker';
  } else if (
    text.includes('maid') || text.includes('domestic') || text.includes('cooking') || text.includes('housekeep') || 
    text.includes('kamwali') || text.includes('kelasa')
  ) {
    entities.occupation = 'Domestic Worker';
  }

  // Location extraction
  const cities = ['bengaluru', 'bangalore', 'lucknow', 'delhi', 'patna', 'mumbai', 'varanasi', 'kolkata', 'chennai', 'hyderabad', 'kanpur', 'ranchi'];
  for (const city of cities) {
    if (text.includes(city)) {
      entities.location = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  // Amount extraction
  const amountMatch = text.match(/(\d+[\d,]*\s*(?:thousand|k|rupees|hazar|sau|lakh|crore)?)/i);
  if (amountMatch) {
    entities.amount = amountMatch[1];
  }

  // Need extraction
  if (
    text.includes('loan') || text.includes('karz') || text.includes('sala') || text.includes('saala') || 
    text.includes('kadan') || text.includes('capital') || text.includes('money') || text.includes('paisa') || 
    text.includes('rokkha') || text.includes('duddu')
  ) {
    entities.need = 'Working Capital / Business Loan';
  } else if (
    text.includes('hospital') || text.includes('fracture') || text.includes('bimari') || text.includes('illness') || 
    text.includes('treatment') || text.includes('medical') || text.includes('chikitsa') || text.includes('maruthuvam')
  ) {
    entities.need = 'Healthcare & Hospitalization Coverage';
  } else if (
    text.includes('pension') || text.includes('insurance') || text.includes('bima') || text.includes('accident') || 
    text.includes('security')
  ) {
    entities.need = 'Social Security & Life Insurance';
  }

  // Prioritized statutory matching
  if (entities.need === 'Healthcare & Hospitalization Coverage' || text.includes('hospital') || text.includes('fracture') || text.includes('bimari')) {
    return {
      scheme: SCHEMES_DATABASE[2], // PM-JAY
      matchedReason: 'Preliminary match: Hospitalization & medical care requirement identified. Subject to official verification.',
      extractedEntities: entities
    };
  }

  if (entities.occupation === 'Construction Worker' || text.includes('building') || text.includes('mazdoor') || text.includes('cement')) {
    return {
      scheme: SCHEMES_DATABASE[3], // BOCW
      matchedReason: 'Preliminary match: Construction trade welfare qualification. Subject to 90-day verification by State Board.',
      extractedEntities: entities
    };
  }

  if (entities.occupation === 'Street Vendor / Hawker' || entities.need === 'Working Capital / Business Loan' || text.includes('loan') || text.includes('stall') || text.includes('chai') || text.includes('15000')) {
    return {
      scheme: SCHEMES_DATABASE[0], // PM SVANidhi
      matchedReason: 'Preliminary match: Urban street vendor seeking working capital. May be eligible for progressive loans starting up to ₹15,000.',
      extractedEntities: entities
    };
  }

  // Universal unorganized fallback
  return {
    scheme: SCHEMES_DATABASE[1], // e-Shram
    matchedReason: 'Universal match: Unorganized worker social security registration. Free government service.',
    extractedEntities: entities
  };
}
