import React, { useState, useEffect, useRef } from 'react';
import { 
  Languages, 
  ArrowLeftRight, 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  Layers, 
  BookOpen,
  Loader2,
  BookmarkCheck,
  Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMemory } from '../context/MemoryContext';
import { translateText } from '../utils/translatorEngine';

export default function Translator() {
  const { t } = useLanguage();
  const { addWord, batchAddWords, speakText, vocabulary } = useMemory();

  const [sourceLang, setSourceLang] = useState('en'); // 'en' | 'tr'
  const [targetLang, setTargetLang] = useState('tr');
  const [inputText, setInputText] = useState("encouraged");
  const [selectedTone, setSelectedTone] = useState('academic'); // 'academic' | 'formal' | 'casual' | 'literal'
  const [translationResult, setTranslationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoAddedWordsCount, setAutoAddedWordsCount] = useState(0);

  const debounceTimerRef = useRef(null);

  // Auto-translate on mount and as user types (debounced)
  useEffect(() => {
    if (!inputText.trim()) {
      setTranslationResult(null);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(() => {
      performTranslation(inputText);
    }, 380); // 380ms debounce for smooth typing

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [inputText, sourceLang, targetLang, selectedTone]);

  const performTranslation = async (textToTranslate) => {
    if (!textToTranslate || !textToTranslate.trim()) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await translateText(textToTranslate, sourceLang, targetLang, selectedTone);
      setTranslationResult(result);

      // AUTOMATICALLY ADD EXTRACTED KEYWORDS AND TRANSLATED WORD TO MEMORY VAULT!
      if (result) {
        const wordsToSave = [];

        // 1. Add the main word/query if single word or short phrase
        if (textToTranslate.trim().split(/\s+/).length <= 4) {
          wordsToSave.push({
            word: sourceLang === 'en' ? textToTranslate.trim() : result.translatedText,
            ipa: `/${textToTranslate.trim().toLowerCase()}/`,
            pos: 'vocabulary',
            meaningTr: sourceLang === 'en' ? result.translatedText : textToTranslate.trim(),
            exampleEn: sourceLang === 'en' ? textToTranslate.trim() : result.translatedText,
            exampleTr: sourceLang === 'en' ? result.translatedText : textToTranslate.trim(),
            level: 'B2',
            tags: ['Auto-Translator', 'Vault']
          });
        }

        // 2. Add any extracted keywords from the sentence
        if (result.extractedKeywords && result.extractedKeywords.length > 0) {
          result.extractedKeywords.forEach(kw => {
            wordsToSave.push({
              word: kw.word,
              ipa: kw.ipa,
              pos: kw.pos,
              meaningTr: kw.meaningTr,
              exampleEn: textToTranslate,
              exampleTr: result.translatedText,
              level: kw.level,
              tags: ['Auto-Translator', kw.level]
            });
          });
        }

        if (wordsToSave.length > 0) {
          const addedCount = batchAddWords(wordsToSave);
          setAutoAddedWordsCount(addedCount);
        }
      }
    } catch (err) {
      console.error('Auto translation error', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLangs = () => {
    const newSource = targetLang;
    const newTarget = sourceLang;
    setSourceLang(newSource);
    setTargetLang(newTarget);
    const newText = translationResult ? translationResult.translatedText : '';
    setInputText(newText);
  };

  const handleToneChange = (toneKey) => {
    setSelectedTone(toneKey);
    if (translationResult?.tones?.[toneKey]) {
      setTranslationResult(prev => ({
        ...prev,
        translatedText: prev.tones[toneKey]
      }));
    }
  };

  const handleCopy = () => {
    if (!translationResult) return;
    navigator.clipboard.writeText(translationResult.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
              <Languages className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {t.translator.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {t.translator.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono text-emerald-300">
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>Canlı Otomatik Çeviri & Otomatik Havuz Senkronu</span>
            </div>
          </div>
        </div>

        {/* Tone Selector Pills */}
        <div className="flex items-center overflow-x-auto py-1 space-x-2 border-t border-purple-900/30 pt-3">
          <span className="text-xs font-semibold text-purple-300 mr-2 shrink-0">{t.translator.tones}:</span>
          {[
            { key: 'academic', label: t.translator.academic },
            { key: 'formal', label: t.translator.formal },
            { key: 'casual', label: t.translator.casual },
            { key: 'literal', label: t.translator.literal },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleToneChange(item.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedTone === item.key
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-obsidian-900/80 text-slate-400 hover:text-white border border-purple-500/20'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Translation Dual-Panel Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Source Text Box */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono">
              {sourceLang === 'en' ? '🇬🇧 English' : '🇹🇷 Türkçe'}
            </span>

            <button
              onClick={handleSwapLangs}
              className="p-1.5 rounded-lg bg-obsidian-900 border border-purple-500/20 hover:border-purple-400 text-purple-300 hover:text-white transition-all"
              title="Dilleri Değiştir"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Yazmaya başlayın, anında otomatik çevrilecek... (Örn: encouraged, wherefore, persevere)"
            className="w-full bg-obsidian-950/80 border border-purple-500/20 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400 resize-none font-sans"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => speakText(inputText, sourceLang === 'en' ? 'en-US' : 'tr-TR')}
              className="p-2 rounded-lg bg-obsidian-900 border border-purple-500/20 text-slate-400 hover:text-purple-300"
              title={t.common.listen}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-purple-400 font-mono">
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Çevriliyor...</span>
                </>
              ) : (
                <span className="text-slate-500">Yazarken anlık çevrilir</span>
              )}
            </div>
          </div>
        </div>

        {/* Target Translation Box */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
            <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-wider font-mono">
              {targetLang === 'en' ? '🇬🇧 English' : '🇹🇷 Türkçe'} ({selectedTone.toUpperCase()})
            </span>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30 font-mono">
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Havuza Eklendi</span>
              </span>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? t.common.copied : t.common.copyText}</span>
              </button>
            </div>
          </div>

          <div className="min-h-[120px] p-3 text-sm text-slate-100 font-medium leading-relaxed bg-obsidian-950/40 rounded-xl border border-purple-900/20 flex flex-col justify-between">
            {isLoading ? (
              <div className="flex items-center gap-2 text-xs text-purple-400 font-mono py-8 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Canlı Nöral Çeviri Yapılıyor...</span>
              </div>
            ) : (
              <div>
                <div className="text-base sm:text-lg font-bold text-purple-200">
                  {translationResult?.translatedText || 'Çeviri bekleniyor...'}
                </div>

                {/* Alternative Dictionary Definitions if available */}
                {translationResult?.dictEntries && translationResult.dictEntries.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-purple-900/30 space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-mono block">Sözlük Anlamları:</span>
                    {translationResult.dictEntries.map((group, gi) => (
                      <div key={gi} className="text-xs text-slate-300">
                        <span className="text-purple-400 font-mono text-[11px] mr-1.5">{group.pos}:</span>
                        <span>{group.words.slice(0, 4).join(', ')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => speakText(translationResult?.translatedText || '', targetLang === 'en' ? 'en-US' : 'tr-TR')}
              className="p-2 rounded-lg bg-obsidian-900 border border-purple-500/20 text-slate-400 hover:text-purple-300"
              title={t.common.listen}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <span className="text-[10px] text-slate-500 font-mono">
              Otomatik Hafıza Havuzu Aktif
            </span>
          </div>
        </div>

      </div>

      {/* Extracted Key Terms (All Automatically Added into Memory Pool) */}
      {translationResult?.extractedKeywords && translationResult.extractedKeywords.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>{t.translator.extractedKeywords}</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <BookmarkCheck className="w-3.5 h-3.5" />
              Tüm kelimeler hafıza havuzuna otomatik kaydedildi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {translationResult.extractedKeywords.map((kw, idx) => (
              <div
                key={idx}
                className="bg-obsidian-900/80 p-3.5 rounded-xl border border-purple-500/20 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-purple-200">{kw.word}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 font-mono">
                      {kw.level}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 line-clamp-1">{kw.meaningTr}</div>
                </div>

                <div className="px-2 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Havuzda</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
