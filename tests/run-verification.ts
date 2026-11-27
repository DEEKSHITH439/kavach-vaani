import { matchSchemeByIntent, SCHEMES_DATABASE } from '../src/lib/schemeRules';
import { locales, getLocale } from '../src/locales/index';
import { SUPPORTED_LANGUAGES } from '../src/lib/voiceEngine';

interface TestResult {
  scenario: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, scenario: string, details: string) {
  results.push({
    scenario,
    passed: condition,
    details
  });
}

console.log('=== KAVACH VAANI COMPREHENSIVE AUTOMATED VERIFICATION SUITE ===\n');

// 1. Language Localization Verification
console.log('1. Testing Language Localizations (6 Languages: EN, HI, KN, TE, TA, BN)...');
const requiredLanguages = ['en', 'hi', 'kn', 'te', 'ta', 'bn'] as const;
for (const lang of requiredLanguages) {
  const loc = getLocale(lang);
  assert(Boolean(loc.tagline), `${lang}: Tagline present`, `Tagline: ${loc.tagline}`);
  assert(Boolean(loc.supportingText), `${lang}: Supporting text present`, loc.supportingText);
  assert(Boolean(loc.scripts.greeting), `${lang}: Greeting script present`, loc.scripts.greeting);
  assert(Boolean(loc.scripts.schemeExplanation), `${lang}: Scheme explanation present`, `Chars: ${loc.scripts.schemeExplanation.length}`);
  assert(Boolean(loc.scripts.consentIntro), `${lang}: Consent script present`, loc.scripts.consentIntro);
  assert(Boolean(loc.downloads.sectionTitle), `${lang}: Download center localized`, loc.downloads.sectionTitle);
}

// 2. Scenario 1: Kannada street vendor seeking loan
console.log('2. Testing Scenario 1: Kannada Street Vendor seeking ₹15,000 loan...');
const s1 = matchSchemeByIntent('ನಾನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಚಹಾ ಅಂಗಡಿ ನಡೆಸುತ್ತಿದ್ದೇನೆ, ₹15,000 ಸಾಲ ಬೇಕು', 'kn');
assert(s1.scheme.id === 'pm-svanidhi', 'Scenario 1: Scheme Match', `Matched ${s1.scheme.id}`);
assert(s1.extractedEntities.occupation === 'Street Vendor / Hawker', 'Scenario 1: Occupation', s1.extractedEntities.occupation || 'none');
assert(s1.extractedEntities.need === 'Working Capital / Business Loan', 'Scenario 1: Need', s1.extractedEntities.need || 'none');

// 3. Scenario 2: Hindi street vendor seeking loan
console.log('3. Testing Scenario 2: Hindi Street Vendor seeking loan...');
const s2 = matchSchemeByIntent('मैं लखनऊ में चाय का ठेला लगाता हूँ, ₹15,000 का लोन चाहिए', 'hi');
assert(s2.scheme.id === 'pm-svanidhi', 'Scenario 2: Scheme Match', `Matched ${s2.scheme.id}`);
assert(s2.extractedEntities.location === 'Lucknow', 'Scenario 2: Location extraction', s2.extractedEntities.location || 'none');

// 4. Scenario 3: English delivery / transport worker
console.log('4. Testing Scenario 3: English Delivery/Transport Worker seeking assistance...');
const s3 = matchSchemeByIntent('I am a delivery driver and auto driver needing social security', 'en');
assert(s3.extractedEntities.occupation === 'Gig / Transport Worker', 'Scenario 3: Occupation extraction', s3.extractedEntities.occupation || 'none');

// 5. Scenario 4: Tamil construction worker seeking benefits
console.log('5. Testing Scenario 4: Tamil Construction Worker seeking benefits...');
const s4 = matchSchemeByIntent('நான் கட்டிட கட்டுமான தொழிலாளி, நல வாரிய உதவி வேண்டும்', 'ta');
assert(s4.scheme.id === 'bocw-welfare', 'Scenario 4: Scheme Match', `Matched ${s4.scheme.id}`);
assert(s4.extractedEntities.occupation === 'Construction Worker', 'Scenario 4: Occupation', s4.extractedEntities.occupation || 'none');

// 6. Scenario 5: Bengali worker seeking healthcare information
console.log('6. Testing Scenario 5: Bengali Worker seeking healthcare information...');
const s5 = matchSchemeByIntent('আমি অসুস্থ, হাসপাতালে ভর্তি হতে হবে, বিনামূল্যে চিকিৎসা চাই', 'bn');
assert(s5.scheme.id === 'pm-jay', 'Scenario 5: Scheme Match', `Matched ${s5.scheme.id}`);
assert(s5.extractedEntities.need === 'Healthcare & Hospitalization Coverage', 'Scenario 5: Need', s5.extractedEntities.need || 'none');

// 7. Legal Constraints Check
console.log('7. Verifying Critical Legal & Statutory Constraints...');
const pmSvanidhi = SCHEMES_DATABASE.find(s => s.id === 'pm-svanidhi');
assert(Boolean(pmSvanidhi?.tranches && pmSvanidhi.tranches.length === 3), 'PM SVANidhi Tranches', 'Exact 3 tranches defined');
assert(pmSvanidhi?.tranches?.[0]?.maxAmount === 15000, 'Tranche 1 Amount', '₹15,000');
assert(pmSvanidhi?.tranches?.[1]?.maxAmount === 25000, 'Tranche 2 Amount', '₹25,000');
assert(pmSvanidhi?.tranches?.[2]?.maxAmount === 50000, 'Tranche 3 Amount', '₹50,000');
assert(pmSvanidhi?.interestSubsidyInfo?.ratePercent === 7, 'Interest Subsidy Rate', '7% interest subsidy per annum');
assert(pmSvanidhi?.protectionAct.includes('Section 18(3)'), 'Statutory Protection Act', pmSvanidhi?.protectionAct || '');

let totalPassed = 0;
let totalFailed = 0;
for (const r of results) {
  if (r.passed) {
    totalPassed++;
    console.log(`  [PASS] ${r.scenario}: ${r.details}`);
  } else {
    totalFailed++;
    console.error(`  [FAIL] ${r.scenario}: ${r.details}`);
  }
}

console.log(`\nTOTAL TESTS: ${results.length} | PASSED: ${totalPassed} | FAILED: ${totalFailed}`);

if (totalFailed > 0) {
  process.exit(1);
} else {
  console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
}
