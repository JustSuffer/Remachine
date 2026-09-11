// Advanced Multi-Tier Translation Engine for Remachine
// Real-time Neural Translation + Rich Lexicon + Auto-Dictionary

export const extensiveOfflineLexicon = {
  // Common grammatical / functional words
  "the": { tr: "belirli artikel (o)", pos: "Article", level: "A1", ipa: "/ðiː/" },
  "a": { tr: "bir", pos: "Article", level: "A1", ipa: "/ə/" },
  "an": { tr: "bir", pos: "Article", level: "A1", ipa: "/æn/" },
  "is": { tr: "-dir / dır (olmak)", pos: "Verb", level: "A1", ipa: "/ɪz/" },
  "are": { tr: "-dirler (olmak)", pos: "Verb", level: "A1", ipa: "/ɑːr/" },
  "was": { tr: "idi (geçmiş)", pos: "Verb", level: "A1", ipa: "/wɒz/" },
  "were": { tr: "idiler (geçmiş)", pos: "Verb", level: "A1", ipa: "/wɜːr/" },
  "be": { tr: "olmak", pos: "Verb", level: "A1", ipa: "/biː/" },
  "been": { tr: "olunmuş / olmuş", pos: "Verb (Participle)", level: "A1", ipa: "/biːn/" },
  "have": { tr: "sahip olmak", pos: "Verb", level: "A1", ipa: "/hæv/" },
  "has": { tr: "sahip olmak", pos: "Verb", level: "A1", ipa: "/hæz/" },
  "had": { tr: "sahip oldu / -mişti", pos: "Verb", level: "A1", ipa: "/hæd/" },
  "having": { tr: "sahip olarak / -ip", pos: "Participle", level: "B1", ipa: "/ˈhævɪŋ/" },
  "do": { tr: "yapmak", pos: "Verb", level: "A1", ipa: "/duː/" },
  "does": { tr: "yapar", pos: "Verb", level: "A1", ipa: "/dʌz/" },
  "did": { tr: "yaptı", pos: "Verb", level: "A1", ipa: "/dɪd/" },
  "and": { tr: "ve", pos: "Conjunction", level: "A1", ipa: "/ænd/" },
  "or": { tr: "veya / ya da", pos: "Conjunction", level: "A1", ipa: "/ɔːr/" },
  "but": { tr: "fakat / ama", pos: "Conjunction", level: "A1", ipa: "/bʌt/" },
  "in": { tr: "içinde / -de", pos: "Preposition", level: "A1", ipa: "/ɪn/" },
  "on": { tr: "üzerinde / -de", pos: "Preposition", level: "A1", ipa: "/ɒn/" },
  "at": { tr: "-de / -da", pos: "Preposition", level: "A1", ipa: "/æt/" },
  "to": { tr: "-e / -a (yönelme / mastar)", pos: "Preposition", level: "A1", ipa: "/tuː/" },
  "for": { tr: "için / boyunca", pos: "Preposition", level: "A1", ipa: "/fɔːr/" },
  "with": { tr: "ile / birlikte", pos: "Preposition", level: "A1", ipa: "/wɪð/" },
  "without": { tr: "-sız / olmadan", pos: "Preposition", level: "A2", ipa: "/wɪˈðaʊt/" },
  "by": { tr: "tarafından / ile", pos: "Preposition", level: "A1", ipa: "/baɪ/" },
  "from": { tr: "-den / -dan", pos: "Preposition", level: "A1", ipa: "/frɒm/" },
  "as": { tr: "olarak / gibi / çünkü", pos: "Conjunction", level: "A2", ipa: "/æz/" },
  "that": { tr: "ki / şu / o", pos: "Pronoun / Conjunction", level: "A1", ipa: "/ðæt/" },
  "this": { tr: "bu", pos: "Pronoun", level: "A1", ipa: "/ðɪs/" },
  "which": { tr: "hangi / ki o", pos: "Pronoun", level: "A2", ipa: "/wɪtʃ/" },
  "who": { tr: "kim / ki o", pos: "Pronoun", level: "A1", ipa: "/huː/" },
  "where": { tr: "nerede / nereye", pos: "Adverb", level: "A1", ipa: "/weər/" },
  "wherefore": { tr: "bu nedenle, niçin, bundan ötürü", pos: "Adverb", level: "B2", ipa: "/ˈweə.fɔːr/" },

  // Verbs & Vocabulary
  "encourage": { tr: "teşvik etmek, cesaretlendirmek", pos: "Verb", level: "B1", ipa: "/ɪnˈkʌr.ɪdʒ/" },
  "encouraged": { tr: "teşvik edilmiş, cesaretlendirdi", pos: "Verb (Past)", level: "B1", ipa: "/ɪnˈkʌr.ɪdʒd/" },
  "encouraging": { tr: "cesaret verici, umut verici", pos: "Adjective", level: "B1", ipa: "/ɪnˈkʌr.ɪ.dʒɪŋ/" },
  "persevere": { tr: "azimle devam etmek, yılmamak", pos: "Verb", level: "C1", ipa: "/ˌpɜː.sɪˈvɪər/" },
  "persevered": { tr: "azimle devam etti, yılmadı", pos: "Verb (Past)", level: "C1", ipa: "/ˌpɜː.sɪˈvɪəd/" },
  "unravel": { tr: "çözmek, aydınlatmak", pos: "Verb", level: "B2", ipa: "/ʌnˈræv.əl/" },
  "unraveled": { tr: "çözdü, aydınlattı", pos: "Verb (Past)", level: "B2", ipa: "/ʌnˈræv.əld/" },
  "encounter": { tr: "karşılaşmak, yüz yüze gelmek", pos: "Verb", level: "B2", ipa: "/ɪnˈkaʊn.tər/" },
  "encountered": { tr: "karşılaştı", pos: "Verb (Past)", level: "B2", ipa: "/ɪnˈkaʊn.təd/" },
  "tremendous": { tr: "muazzam, devasa, olağanüstü", pos: "Adjective", level: "B2", ipa: "/trɪˈmen.dəs/" },
  "obstacle": { tr: "engel, mani", pos: "Noun", level: "B2", ipa: "/ˈɒb.stə.kəl/" },
  "obstacles": { tr: "engeller, maniler", pos: "Noun (Plural)", level: "B2", ipa: "/ˈɒb.stə.kəlz/" },
  "researcher": { tr: "araştırmacı", pos: "Noun", level: "B1", ipa: "/rɪˈsɜː.tʃər/" },
  "researchers": { tr: "araştırmacılar", pos: "Noun (Plural)", level: "B1", ipa: "/rɪˈsɜː.tʃəz/" },
  "mystery": { tr: "gizem, sır", pos: "Noun", level: "B1", ipa: "/ˈmɪs.tər.i/" },
  "despite": { tr: "-e rağmen, karşın", pos: "Preposition", level: "B1", ipa: "/dɪˈspaɪt/" },
  "substantiate": { tr: "somut kanıtla desteklemek, doğrulamak", pos: "Verb", level: "C1", ipa: "/səbˈstæn.ʃi.eɪt/" },
  "exacerbate": { tr: "kötüleştirmek, alevlendirmek", pos: "Verb", level: "B2", ipa: "/ɪɡˈzæs.ə.beɪt/" },
  "mitigate": { tr: "hafifletmek, etkisini azaltmak", pos: "Verb", level: "C1", ipa: "/ˈmɪt.ɪ.ɡeɪt/" },
  "ubiquitous": { tr: "her yerde bulunan, yaygın", pos: "Adjective", level: "C1", ipa: "/juːˈbɪk.wɪ.təs/" },
  "indispensable": { tr: "vazgeçilmez, zorunlu", pos: "Adjective", level: "B2", ipa: "/ˌɪn.dɪˈspen.sə.bəl/" },
  "sustainable": { tr: "sürdürülebilir", pos: "Adjective", level: "B2", ipa: "/səˈsteɪ.nə.bəl/" },
  "facilitate": { tr: "kolaylaştırmak, olanak sağlamak", pos: "Verb", level: "B2", ipa: "/fəˈsɪl.ɪ.teɪt/" },
  "scrutinize": { tr: "titizlikle incelemek", pos: "Verb", level: "C1", ipa: "/ˈskruː.tɪ.naɪz/" },
  "enhance": { tr: "artırmak, geliştirmek", pos: "Verb", level: "B2", ipa: "/ɪnˈhɑːns/" },
  "deteriorate": { tr: "kötüleşmek, bozulmak", pos: "Verb", level: "B2", ipa: "/dɪˈtɪə.ri.ə.reɪt/" },
  "stem from": { tr: "-den kaynaklanmak", pos: "Phrasal Verb", level: "B2", ipa: "/stɛm frɒm/" }
};

// Live Neural Translation API Fetcher
export async function fetchLiveTranslation(text, sourceLang = 'en', targetLang = 'tr') {
  if (!text || !text.trim()) return null;
  const cleanQuery = text.trim();

  // 1. Google Translate GTX Endpoint
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&dt=bd&dt=rm&q=${encodeURIComponent(cleanQuery)}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data && data[0] && Array.isArray(data[0])) {
        const fullTranslation = data[0].map(segment => segment[0]).filter(Boolean).join('');
        
        const dictEntries = [];
        if (data[1] && Array.isArray(data[1])) {
          data[1].forEach(group => {
            const pos = group[0];
            const words = group[1] || [];
            dictEntries.push({ pos, words });
          });
        }

        if (fullTranslation && fullTranslation.trim().length > 0) {
          return {
            translatedText: fullTranslation.trim(),
            dictEntries,
            source: 'Google Neural Engine'
          };
        }
      }
    }
  } catch (err) {
    console.warn('Google Translate API error, checking secondary fallback...', err);
  }

  // 2. Secondary API: MyMemory
  try {
    const langpair = `${sourceLang}|${targetLang}`;
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanQuery)}&langpair=${langpair}`;
    const response = await fetch(myMemoryUrl);
    if (response.ok) {
      const data = await response.json();
      if (data?.responseData?.translatedText) {
        return {
          translatedText: data.responseData.translatedText,
          dictEntries: [],
          source: 'MyMemory Engine'
        };
      }
    }
  } catch (err) {
    console.warn('MyMemory API error, falling back to local linguistic dictionary...', err);
  }

  // 3. Fallback: Offline Lexicon & Morphological Engine
  return getOfflineTranslation(cleanQuery, sourceLang, targetLang);
}

function getOfflineTranslation(text, sourceLang, targetLang) {
  const lower = text.toLowerCase().trim();
  
  if (extensiveOfflineLexicon[lower]) {
    const entry = extensiveOfflineLexicon[lower];
    return {
      translatedText: entry.tr,
      dictEntries: [{ pos: entry.pos, words: [entry.tr] }],
      source: 'Offline Lexicon Engine'
    };
  }

  const tokens = text.split(/\s+/);
  const translatedWords = tokens.map(tok => {
    const clean = tok.replace(/^[“"'({\[]+|[.,;:!?")}\]]+$/g, '').toLowerCase();
    if (extensiveOfflineLexicon[clean]) {
      return extensiveOfflineLexicon[clean].tr.split(',')[0];
    }
    return tok;
  });

  return {
    translatedText: translatedWords.join(' '),
    dictEntries: [],
    source: 'Morphological Rule Engine'
  };
}

// Full Translation Handler
export async function translateText(sourceText, sourceLang = 'en', targetLang = 'tr', tone = 'academic') {
  if (!sourceText || !sourceText.trim()) return null;

  const result = await fetchLiveTranslation(sourceText, sourceLang, targetLang);
  const baseTranslation = result ? result.translatedText : sourceText;

  // Extract keywords
  const extractedKeywords = extractKeyVocabulary(sourceText, baseTranslation);

  // Generate Tone Transformations
  const academic = modulateToAcademic(baseTranslation, targetLang);
  const formal = modulateToFormal(baseTranslation, targetLang);
  const casual = modulateToCasual(baseTranslation, targetLang);
  const literal = baseTranslation;

  let activeTranslation = baseTranslation;
  if (tone === 'academic') activeTranslation = academic;
  else if (tone === 'formal') activeTranslation = formal;
  else if (tone === 'casual') activeTranslation = casual;

  return {
    translatedText: activeTranslation,
    dictEntries: result?.dictEntries || [],
    tones: { academic, formal, casual, literal },
    extractedKeywords,
    engineSource: result?.source || 'Neural Engine'
  };
}

export function extractKeyVocabulary(sourceText, translationText) {
  const words = sourceText.split(/\s+/).map(w => w.replace(/^[“"'({\[]+|[.,;:!?")}\]]+$/g, ''));
  const found = [];
  const seen = new Set();

  words.forEach(w => {
    const lower = w.toLowerCase();
    if (lower.length > 2 && !seen.has(lower)) {
      seen.add(lower);
      
      let meaning = "";
      let pos = "Content Word";
      let ipa = `/${lower}/`;
      let level = "B2";

      if (extensiveOfflineLexicon[lower]) {
        const item = extensiveOfflineLexicon[lower];
        meaning = item.tr;
        pos = item.pos;
        ipa = item.ipa || ipa;
        level = item.level || level;
      } else {
        meaning = translationText && translationText.length <= 40 ? translationText : "Önemli bağlamsal kelime";
        if (lower.endsWith('ly')) { pos = "Adverb"; level = "B1"; }
        else if (lower.endsWith('tion') || lower.endsWith('ment')) { pos = "Noun"; level = "B2"; }
        else if (lower.endsWith('able') || lower.endsWith('ive') || lower.endsWith('al')) { pos = "Adjective"; level = "B2"; }
        else if (lower.endsWith('ed')) { pos = "Verb (Past)"; level = "B1"; }
      }

      found.push({
        word: lower,
        pos,
        ipa,
        meaningTr: meaning,
        level,
        exampleEn: sourceText
      });
    }
  });

  return found.slice(0, 6);
}

function modulateToAcademic(text, targetLang) {
  if (targetLang === 'tr') {
    return text
      .replace(/teşvik etti/gi, "yüreklendirmiş ve süreci ivmelendirmiştir")
      .replace(/cesaretlendirildi/gi, "önemli ölçüde teşvik edilmiştir")
      .replace(/önemli/gi, "kayda değer ve kritik")
      .replace(/zor/gi, "meşakkatli")
      .replace(/çözdü/gi, "aydınlığa kavuşturmuştur");
  } else {
    return text
      .replace(/\bbig\b/gi, "substantial")
      .replace(/\bshow\b/gi, "demonstrate conclusively")
      .replace(/\bhelp\b/gi, "facilitate");
  }
}

function modulateToFormal(text, targetLang) {
  if (targetLang === 'tr') {
    return text
      .replace(/yaptı/gi, "gerçekleştirmiştir")
      .replace(/istedi/gi, "talep etmiştir");
  } else {
    return text;
  }
}

function modulateToCasual(text, targetLang) {
  if (targetLang === 'tr') {
    return text
      .replace(/yüreklendirilmiştir/gi, "cesaret verildi")
      .replace(/icra edilmiştir/gi, "yapıldı");
  } else {
    return text;
  }
}
