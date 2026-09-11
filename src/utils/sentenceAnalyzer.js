// Morphological Sentence Analyzer for Remachine
import { extensiveOfflineLexicon, fetchLiveTranslation } from './translatorEngine';

export const lexicalDictionary = extensiveOfflineLexicon;

export const presetSentences = [
  {
    title: "YDS C1 Zıtlık & Participle Yapısı",
    en: "Despite having encountered tremendous obstacles, the researchers persevered and unraveled the mystery.",
    tr: "Büyük engellerle karşılaşmış olmalarına rağmen, araştırmacılar yılmadı ve gizemi çözdü."
  },
  {
    title: "IELTS Band 8+ Çevre & Sürdürülebilirlik",
    en: "Adopting sustainable energy policies is indispensable to mitigate the severe impacts of climate change.",
    tr: "Sürdürülebilir enerji politikalarının benimsenmesi, iklim değişikliğinin şiddetli etkilerini hafifletmek için vazgeçilmezdir."
  },
  {
    title: "YDS / YÖKDİL Bilim & Sağlık Cümlesi",
    en: "The scientists scrutinized the empirical data carefully to substantiate their groundbreaking hypothesis.",
    tr: "Bilim insanları, çığır açan hipotezlerini kanıtlamak için deneysel verileri titizlikle inceledi."
  },
  {
    title: "C1 İleri Düzey Devrik (Inversion) Cümle",
    en: "Hardly had the government implemented the economic reforms when the market stabilized significantly.",
    tr: "Hükümet ekonomik reformları yürürlüğe koyar koymaz piyasa belirgin şekilde istikrar kazandı."
  }
];

function detectTense(sentence) {
  const s = sentence.toLowerCase();
  if (s.includes("had been ") || s.includes("had ")) return "Past Perfect / Past Perfect Continuous";
  if (s.includes("have been ") || s.includes("has been ")) return "Present Perfect Continuous / Passive";
  if (s.includes("have ") || s.includes("has ")) return "Present Perfect Tense";
  if (s.includes("will have been") || s.includes("will have")) return "Future Perfect Tense";
  if (s.includes("will be ") || s.includes("is going to be")) return "Future Continuous / Future Passive";
  if (s.includes("will ") || s.includes("shall ") || s.includes("going to")) return "Simple Future Tense";
  if (s.includes("was ") || s.includes("were ") || s.includes("ed ") || s.includes("persevered") || s.includes("unraveled") || s.includes("did")) return "Simple Past Tense";
  if (s.includes("is ") || s.includes("are ") || s.includes("am ")) return "Present Continuous / Present Simple";
  return "Simple Present / Academic Complex";
}

function detectClauseArchitecture(sentence) {
  const s = sentence.toLowerCase();
  const connectors = [];
  if (s.includes("despite") || s.includes("in spite of")) connectors.push("Prepositional Contrast Clause (Despite + Ving/Noun)");
  if (s.includes("although") || s.includes("even though") || s.includes("though")) connectors.push("Adverbial Clause of Concession (Although...)");
  if (s.includes("because") || s.includes("since") || s.includes("as ")) connectors.push("Adverbial Clause of Reason/Cause");
  if (s.includes("in order to") || s.includes("so as to") || s.includes("so that")) connectors.push("Clause of Purpose (Amaç Cümleciği)");
  if (s.includes("hardly") || s.includes("scarcely") || s.includes("no sooner") || s.includes("seldom") || s.includes("rarely")) connectors.push("Inverted Sentence Structure (Devrik Yapı)");
  if (s.includes("which") || s.includes("who") || s.includes("that") || s.includes("where") || s.includes("whose")) connectors.push("Relative / Adjective Clause (Sıfat Cümleciği)");
  if (s.includes("if ") || s.includes("provided that") || s.includes("unless")) connectors.push("Conditional Clause (Şart Cümleciği)");

  return connectors.length > 0 ? connectors.join(" + ") : "Independent Compound Clause (Bağımsız Birleşik Cümle)";
}

// Asynchronous Full Sentence Analyzer
export async function analyzeSentence(sentenceText) {
  if (!sentenceText || !sentenceText.trim()) return null;

  const rawText = sentenceText.trim();
  const tense = detectTense(rawText);
  const clauseStructure = detectClauseArchitecture(rawText);

  // Fetch full live translation for the sentence
  let naturalTranslation = "";
  const matchedPreset = presetSentences.find(p => p.en.toLowerCase() === rawText.toLowerCase());

  if (matchedPreset) {
    naturalTranslation = matchedPreset.tr;
  } else {
    try {
      const liveRes = await fetchLiveTranslation(rawText, 'en', 'tr');
      naturalTranslation = liveRes ? liveRes.translatedText : rawText;
    } catch (e) {
      naturalTranslation = rawText;
    }
  }

  // Tokenize words
  const rawTokens = rawText.split(/\s+/).map(tok => tok.replace(/^[“"'({\[]+|[.,;:!?")}\]]+$/g, '')).filter(Boolean);

  // Translate each token with lexicon or live single-word fetch
  const tokens = await Promise.all(rawTokens.map(async (cleanWord) => {
    const lower = cleanWord.toLowerCase();
    const dictInfo = lexicalDictionary[lower] || lexicalDictionary[cleanWord] || null;

    let pos = "Content Word";
    let meaning = "";
    let ipa = `/${lower}/`;
    let level = "B1";
    let collocations = [];
    let synonyms = [];
    let lemma = cleanWord;

    if (dictInfo) {
      meaning = dictInfo.tr;
      pos = dictInfo.pos;
      ipa = dictInfo.ipa || ipa;
      level = dictInfo.level || 'B2';
      collocations = dictInfo.collocations || [];
      synonyms = dictInfo.synonyms || [];
      lemma = dictInfo.lemma || cleanWord;
    } else {
      // Fast single word live translation
      try {
        const singleTrans = await fetchLiveTranslation(lower, 'en', 'tr');
        meaning = singleTrans?.translatedText || cleanWord;
      } catch (e) {
        meaning = cleanWord;
      }

      // Morphological guessing
      if (lower.endsWith('ly')) { pos = "Adverb (Zarf)"; level = "B1"; }
      else if (lower.endsWith('tion') || lower.endsWith('ment')) { pos = "Noun (İsim)"; level = "B2"; }
      else if (lower.endsWith('able') || lower.endsWith('ive') || lower.endsWith('al') || lower.endsWith('ous')) { pos = "Adjective (Sıfat)"; level = "B2"; }
      else if (lower.endsWith('ing')) { pos = "Gerund / Participle"; }
      else if (lower.endsWith('ed')) { pos = "Past Verb / Participle"; }
    }

    return {
      word: cleanWord,
      lower,
      pos,
      role: pos,
      meaningTr: meaning,
      ipa,
      level,
      collocations,
      synonyms,
      lemma
    };
  }));

  // Build clean literal translation
  const literalTranslation = tokens.map(t => t.meaningTr.split(',')[0].trim()).join(' ');

  return {
    rawText,
    tense,
    clauseStructure,
    tokens,
    naturalTranslation,
    literalTranslation,
    wordCount: tokens.length,
    academicWordCount: tokens.filter(t => t.level === 'B2' || t.level === 'C1').length
  };
}
