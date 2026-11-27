export interface Scheme {
  id: string;
  name: string;
  nameNative: string;
  category: 'street-vendor' | 'construction' | 'gig-delivery' | 'health' | 'all';
  benefitAmount: string;
  benefitDescription: string;
  benefitDescriptionNative: Record<string, string>;
  criteriaSummary: string;
  requiredFields: Array<'aadhaar' | 'bankAccount' | 'upiId' | 'tradeType' | 'location' | 'dailyIncome'>;
  legalRightsSummary: string;
  legalRightsAudioText: Record<string, string>;
  grievanceHelpline: string;
  protectionAct: string;
}

export const SCHEMES_DATABASE: Scheme[] = [
  {
    id: 'pm-svanidhi',
    name: 'PM SVANidhi (Street Vendor Loan)',
    nameNative: 'पीएम स्वनिधि (स्ट्रीट वेंडर योजना)',
    category: 'street-vendor',
    benefitAmount: '₹10,000 - ₹50,000',
    benefitDescription: 'Collateral-free working capital micro-loan with 7% interest subsidy & UPI cashback.',
    benefitDescriptionNative: {
      hi: 'बिना किसी गारंटी के ₹10,000 से ₹50,000 तक का कार्यशील ऋण, 7% ब्याज सब्सिडी और डिजिटल कैशबैक के साथ।',
      kn: 'ಯಾವುದೇ ಗ್ಯಾರಂಟಿ ಇಲ್ಲದೆ ₹10,000 ದಿಂದ ₹50,000 ವರೆಗೆ ಕೆಲಸದ ಬಂಡವಾಳ ಸಾಲ, 7% ಬಡ್ಡಿ ಸಬ್ಸಿಡಿ ಮತ್ತು ಡಿಜಿಟಲ್ ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್.',
      ta: 'எந்தவித பிணையமும் இன்றி ₹10,000 முதல் ₹50,000 வரை குறைந்த வட்டி மூலதனக் கடன் மற்றும் கேஷ்பேக்.',
      bn: 'কোনো গ্যারান্টি ছাড়াই ₹১০,০০০ থেকে ₹৫০,০০০ পর্যন্ত ক্ষুদ্র ঋণ এবং ডিজিটাল ক্যাশব্যাক।',
      en: 'Collateral-free working capital loan up to ₹50,000 with 7% interest subsidy and UPI cashback.'
    },
    criteriaSummary: 'Urban street vendors, hawkers, tea/food stall owners with Vending Certificate or local recommendation.',
    requiredFields: ['aadhaar', 'tradeType', 'location', 'bankAccount', 'upiId'],
    legalRightsSummary: 'Protection against unlawful eviction under Street Vendors Act 2014 Section 3(3). No officer or police can seize goods without 30-day notice and Town Vending Committee (TVC) approval.',
    legalRightsAudioText: {
      hi: 'स्ट्रीट वेंडर्स कानून 2014 की धारा 3 के तहत, जब तक वेंडिंग सर्वे पूरा नहीं होता, किसी भी अधिकारी या पुलिस को आपको बिना 30 दिन के नोटिस के हटाने या सामान जब्त करने का अधिकार नहीं है। घूस न दें। शिकायत हेल्पलाइन: 1800-11-1979 पर संपर्क करें।',
      kn: 'ಬೀದಿ ವ್ಯಾಪಾರಿಗಳ ಕಾಯಿದೆ 2014 ರ ಪ್ರಕಾರ, 30 ದಿನಗಳ ಅಧಿಕೃತ ನೋಟಿಸ್ ಇಲ್ಲದೆ ಯಾವುದೇ ಪೊಲೀಸ್ ಅಥವಾ ಅಧಿಕಾರಿಗಳು ನಿಮ್ಮ ಅಂಗಡಿಯನ್ನು ತೆರವುಗೊಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ಲಂಚ ನೀಡಬೇಡಿ. ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆ: 1800-11-1979.',
      ta: 'தெருவோர வியாபாரிகள் சட்டம் 2014-இன் படி, 30 நாட்கள் முன் அறிவிப்பு இன்றி உங்களை அப்புறப்படுத்த காவல்துறைக்கோ அதிகாரிகளுக்கோ உரிமை இல்லை. லஞ்சம் கொடுக்காதீர்கள். உதவி எண்: 1800-11-1979.',
      bn: 'স্ট্রিট ভেন্ডর আইন ২০১৪ অনুযায়ী, ৩০ দিনের নোটিশ ছাড়া পুলিশ বা মিউনিসিপ্যালিটি আপনাকে উচ্ছেদ করতে পারে না। কাউকে ঘুষ দেবেন না। হেল্পলাইন: ১৮০০-১১-১৯৭৯।',
      en: 'Under Street Vendors Act 2014, no police or municipal officer can evict you without a 30-day written notice approved by the Town Vending Committee. Never pay bribes. Helpline: 1800-11-1979.'
    },
    grievanceHelpline: '1800-11-1979 (Toll Free) / 1064 (Anti-Corruption)',
    protectionAct: 'The Street Vendors (Protection of Livelihood and Regulation of Street Vending) Act, 2014'
  },
  {
    id: 'e-shram',
    name: 'e-Shram National Welfare Portal',
    nameNative: 'ई-श्रम राष्ट्रीय असंगठित श्रमिक कार्ड',
    category: 'all',
    benefitAmount: '₹2,00,000 Insurance Cover',
    benefitDescription: 'Free accidental death/disability insurance under PMSBY, pension access & direct DBT welfare transfers.',
    benefitDescriptionNative: {
      hi: 'दुर्घटना मृत्यु या पूर्ण विकलांगता पर ₹2 लाख का मुफ्त बीमा और सरकारी आपदा राहत सीधे खाते में।',
      kn: 'ಅಪಘಾತ ವಿಮೆ ₹2 ಲಕ್ಷ ಉಚಿತ ಹಾಗೂ ಸಾಮಾಜಿಕ ಭದ್ರತಾ ಪಿಂಚಣಿ ಯೋಜನೆಗಳ ನೇರ ಹಣ ವರ್ಗಾವಣೆ.',
      ta: 'விபத்து காப்பீடு ₹2 லட்சம் இலவசம் மற்றும் அரசு நலத்திட்டங்கள் வங்கிக் கணக்கில் நேரடியாக.',
      bn: 'দুর্ঘটনা বীমা ₹২ লক্ষ পর্যন্ত বিনামূল্যে এবং সরাসরি ব্যাঙ্ক অ্যাকাউন্টে সরকারি অনুদান।',
      en: '₹2 Lakh free accident insurance cover, pension eligibility & direct financial assistance during distress.'
    },
    criteriaSummary: 'Informal workers aged 16-59 not enrolled in EPFO or ESIC.',
    requiredFields: ['aadhaar', 'bankAccount', 'location'],
    legalRightsSummary: 'Universal UAN card valid across all 28 states and 8 UTs. Mandatory recognition as an unorganized worker under the Unorganised Workers Social Security Act 2008.',
    legalRightsAudioText: {
      hi: 'ई-श्रम कार्ड भारत भर में मान्य है। दलालों को एक भी रुपया न दें; यह पंजीकरण भारत सरकार द्वारा शत-प्रतिशत निःशुल्क है। हेल्पलाइन: 14434.',
      kn: 'ಇ-ಶ್ರಮ್ ಕಾರ್ಡ್ ಇಡೀ ಭಾರತದಲ್ಲಿ ಮಾನ್ಯವಾಗಿದೆ. ಯಾವುದೇ ಮಧ್ಯವರ್ತಿಗಳಿಗೆ ಹಣ ನೀಡಬೇಡಿ, ಇದು ಉಚಿತ. ಸಹಾಯವಾಣಿ: 14434.',
      ta: 'இ-ஷ்ரம் பதிவு முற்றிலும் இலவசம். எந்த இடைத்தரகர்களுக்கும் பணம் கொடுக்க வேண்டாம். உதவி எண்: 14434.',
      bn: 'ই-শ্রম কার্ড সম্পূর্ণ বিনামূল্যে তৈরি হয়। কোনো দালালকে এক টাকাও দেবেন না। হেল্পলাইন: ১৪৪৩৪।',
      en: 'e-Shram registration is 100% free under Government of India guidelines. Do not pay any fees to local agents or cafes. National Helpline: 14434.'
    },
    grievanceHelpline: '14434 (National e-Shram Helpline)',
    protectionAct: 'Unorganised Workers Social Security Act, 2008'
  },
  {
    id: 'pm-jay',
    name: 'Ayushman Bharat (PM-JAY)',
    nameNative: 'आयुष्मान भारत (पीएम-जेएवाई गोल्डन कार्ड)',
    category: 'health',
    benefitAmount: '₹5,00,000 / Year Cashless Hospitalization',
    benefitDescription: 'Cashless hospital treatment in 27,000+ empanelled government & private hospitals across India.',
    benefitDescriptionNative: {
      hi: 'प्रति परिवार प्रति वर्ष ₹5 लाख तक का मुफ्त इलाज (सरकारी और बड़े प्राइवेट अस्पतालों में)।',
      kn: 'ಪ್ರತಿ ಕುಟುಂಬಕ್ಕೆ ವಾರ್ಷಿಕ ₹5 ಲಕ್ಷದವರೆಗೆ ಉಚಿತ ಆಸ್ಪತ್ರೆ ಚಿಕಿತ್ಸೆ ಮತ್ತು ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ.',
      ta: 'ஆண்டுக்கு ₹5 லட்சம் வரை இலவச மருத்துவ சிகிச்சை மற்றும் அறுவை சிகிச்சை வசதி.',
      bn: 'প্রতি বছর পরিবারের জন্য ₹৫ লক্ষ টাকার বিনামূল্যে হাসপাতালে চিকিৎসা ও ওষুধ।',
      en: 'Cashless medical treatment up to ₹5,00,000 per family per year for secondary and tertiary hospitalization.'
    },
    criteriaSummary: 'Families identified under SECC deprivation criteria or registered informal workers with ration card.',
    requiredFields: ['aadhaar', 'location'],
    legalRightsSummary: 'Zero cost admission. Empanelled hospitals cannot deny emergency treatment or demand upfront payment under NHA guidelines.',
    legalRightsAudioText: {
      hi: 'आयुष्मान कार्ड के साथ अस्पताल में भर्ती होने पर आपको ₹1 भी खर्च नहीं करना है। दवाइयां, जांच और भोजन सब मुफ्त है। कोई पैसे मांगे तो तुरंत 14555 पर शिकायत करें।',
      kn: 'ಆಯುಷ್ಮಾನ್ ಕಾರ್ಡ್ ಹೊಂದಿರುವವರಿಗೆ ಯಾವುದೇ ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಹಣ ಕೇಳುವಂತಿಲ್ಲ. ಉಚಿತ ಚಿಕಿತ್ಸೆ ನಿಮ್ಮ ಹಕ್ಕು. ದೂರುಗಳಿಗೆ ಕರೆ ಮಾಡಿ: 14555.',
      ta: 'ஆயுஷ்மான் திட்டத்தின் கீழ் அனுமதிக்கப்பட்ட மருத்துவமனையில் ஒரு ரூபாயும் கட்டத் தேவையில்லை. கட்டணம் கேட்டால் 14555 எண்ணில் புகார் அளியுங்கள்.',
      bn: 'আয়ুষ্মান কার্ড থাকলে হাসপাতালে ভর্তি হতে কোনো টাকা লাগে না। কেউ টাকা চাইলে সাথে সাথে ১৪৫৫৫ এ অভিযোগ করুন।',
      en: 'Under PM-JAY, empanelled hospitals cannot charge any admission or medicine fees. Report extortion immediately to 14555.'
    },
    grievanceHelpline: '14555 / 1800-111-565',
    protectionAct: 'National Health Policy Mandate & NHA Anti-Fraud Guidelines'
  },
  {
    id: 'bocw-welfare',
    name: 'BOCW Construction Worker Welfare',
    nameNative: 'भवन एवं अन्य सन्निर्माण कर्मकार कल्याण बोर्ड',
    category: 'construction',
    benefitAmount: '₹20,000 - ₹50,000 Grants + Tool Kit',
    benefitDescription: 'Maternity assistance (₹15,000), children education scholarship, accidental disability cover and tool safety kit grant.',
    benefitDescriptionNative: {
      hi: 'निर्माण श्रमिकों के लिए औजार अनुदान, बच्चों की पढ़ाई की छात्रवृत्ति और दुर्घटना सहायता।',
      kn: 'ಕಟ್ಟಡ ಕಾರ್ಮಿಕರಿಗೆ ಉಪಕರಣ ಖರೀದಿ ಧನಸಹಾಯ, ಮಕ್ಕಳ ವಿದ್ಯಾಭ್ಯಾಸಕ್ಕೆ ವಿದ್ಯಾರ್ಥಿವೇತನ ಮತ್ತು ಹೆರಿಗೆ ಧನಸಹಾಯ.',
      ta: 'கட்டுமானத் தொழிலாளர் வாரியத்தின் மூலம் கல்வி உதவித்தொகை, உபகரண மானியம் மற்றும் பேறுகால உதவி.',
      bn: 'নির্মাণ শ্রমিকদের জন্য সন্তান ভাতা, পড়াশোনার বৃত্তি এবং সুরক্ষা সামগ্রীর অনুদান।',
      en: 'Tool kits, education scholarship for children, maternity assistance and disability pension.'
    },
    criteriaSummary: 'Engaged in building or construction work for not less than 90 days in the preceding 12 months.',
    requiredFields: ['aadhaar', 'bankAccount', 'tradeType', 'location'],
    legalRightsSummary: 'Funded by the mandatory 1% construction cess. Benefits are statutory rights, not charity.',
    legalRightsAudioText: {
      hi: 'यह आपका कानूनी अधिकार है जो भवन निर्माण सेस फंड से आता है। बिचौलियों को कमीशन न दें।',
      kn: 'ಇದು ನಿಮ್ಮ ಶ್ರಮದ ಹಕ್ಕು. ಮಧ್ಯವರ್ತಿಗಳಿಗೆ ಹಣ ನೀಡದೆ ನೇರವಾಗಿ ಸೌಲಭ್ಯ ಪಡೆಯಿರಿ.',
      ta: 'இது உங்கள் உழைப்பின் சட்டப்பூர்ವ உரிமை. யாருக்கும் லஞ்சம் தரவேண்டாம்.',
      bn: 'এটি আপনার আইনি অধিকার। কোনো দালালের মাধ্যমে আবেদন করবেন না।',
      en: 'Statutory welfare right funded by builder cess. Free from agent commissions.'
    },
    grievanceHelpline: '155214 / State Labour Office',
    protectionAct: 'Building and Other Construction Workers (RECS) Act, 1996'
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
  
  // Extract entities
  const entities: {
    occupation?: string;
    location?: string;
    need?: string;
    amount?: string;
  } = {};

  if (text.includes('vendor') || text.includes('tea') || text.includes('chai') || text.includes('stall') || text.includes('thela') || text.includes('street') || text.includes('rehari') || text.includes('vyaapari') || text.includes('dukaan') || text.includes('fruit') || text.includes('vegetable')) {
    entities.occupation = 'Street Vendor / Hawker';
  } else if (text.includes('construct') || text.includes('mason') || text.includes('labour') || text.includes('mazdoor') || text.includes('building') || text.includes('cement') || text.includes('painting') || text.includes('kuli') || text.includes('coolie')) {
    entities.occupation = 'Construction Worker';
  } else if (text.includes('auto') || text.includes('rickshaw') || text.includes('delivery') || text.includes('zomato') || text.includes('swiggy') || text.includes('driver') || text.includes('ola') || text.includes('uber')) {
    entities.occupation = 'Gig / Transport Worker';
  } else if (text.includes('maid') || text.includes('domestic') || text.includes('cooking') || text.includes('housekeep') || text.includes('kamwali')) {
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
  if (text.includes('loan') || text.includes('karz') || text.includes('sala') || text.includes('kadan') || text.includes('capital') || text.includes('money') || text.includes('paisa')) {
    entities.need = 'Working Capital / Business Loan';
  } else if (text.includes('hospital') || text.includes('fracture') || text.includes('bimari') || text.includes('illness') || text.includes('treatment') || text.includes('medical') || text.includes('chikitsa')) {
    entities.need = 'Healthcare & Hospitalization Coverage';
  } else if (text.includes('pension') || text.includes('insurance') || text.includes('bima') || text.includes('accident') || text.includes('security')) {
    entities.need = 'Social Security & Life Insurance';
  }

  // Matching logic
  if (entities.need === 'Healthcare & Hospitalization Coverage' || text.includes('hospital') || text.includes('fracture') || text.includes('bimari')) {
    return {
      scheme: SCHEMES_DATABASE[2], // PM-JAY
      matchedReason: 'High match: Free hospitalization & emergency medical treatment need identified.',
      extractedEntities: entities
    };
  }

  if (entities.occupation === 'Construction Worker' || text.includes('building') || text.includes('mazdoor') || text.includes('cement')) {
    return {
      scheme: SCHEMES_DATABASE[3], // BOCW
      matchedReason: 'High match: Construction laborer welfare and equipment grant qualification.',
      extractedEntities: entities
    };
  }

  if (entities.occupation === 'Street Vendor / Hawker' || entities.need === 'Working Capital / Business Loan' || text.includes('loan') || text.includes('stall') || text.includes('chai') || text.includes('15000') || text.includes('10000') || text.includes('20000')) {
    return {
      scheme: SCHEMES_DATABASE[0], // PM SVANidhi
      matchedReason: 'High match: Urban street vendor requiring collateral-free working capital microloan.',
      extractedEntities: entities
    };
  }

  // Default fallback to universal e-Shram
  return {
    scheme: SCHEMES_DATABASE[1], // e-Shram
    matchedReason: 'Universal match: Unorganized worker social security & accidental cover.',
    extractedEntities: entities
  };
}
