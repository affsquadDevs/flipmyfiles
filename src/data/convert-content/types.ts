// Shared types for the localized convert-page content bundles.
// Placeholders used inside the template strings (filled at render time):
//   {from} {to}           — uppercase format codes (e.g. PNG, JPG)
//   {fromName} {toName}    — full format names (NOT translated; e.g. "JPEG (…)")
//   {toUses}               — target format's common uses, joined
//   {fromUses}             — source format's common uses, joined
//   {toStrength} {toStrengths} — target format's strengths, joined
//   {fromDescFirst} {toDescFirst} — first sentence of each format's description

export interface FormatText {
  description: string;
  strengths: string[];
  commonUses: string[];
  technicalNote: string;
}

export interface BenefitTemplates {
  sizeReduction: string;
  compatibility: string;
  lossless: string;
  webOptimize: string;
  transparency: string;
  heic: string;
  mov: string;
  audioExtract: string;
  pdf: string;
  csv: string;
  xlsx: string;
  generic: string;
  targetUses: string;
  browser: string;
}

export interface FaqTemplates {
  howToQ: string;
  howToA: string;
  freeQ: string;
  freeA: string;
  differenceQ: string;
  differenceA: string;
  whenQ: string;
  whenA: string;
  qualityQ: string;
  qualityMediaA: string;
  qualityNonMediaA: string;
  privacyQ: string;
  privacyMediaA: string;
  privacyNonMediaA: string;
  maxSizeQ: string;
  maxSizeMediaA: string;
  maxSizeNonMediaA: string;
}

export interface ConvertContent {
  formats: Record<string, FormatText>;
  benefits: BenefitTemplates;
  faqs: FaqTemplates;
  introFallback: string;
}
