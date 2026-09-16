import React, { useState, useEffect, useRef } from 'react';
import { 
  Languages, 
  ArrowLeftRight, 
  Volume2, 
  Copy, 
  Check, 
  Layers, 
  Loader2,
  CheckCircle2,
  BookmarkCheck,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMemory } from '../context/MemoryContext';
import { translateText } from '../utils/translatorEngine';

export default function Translator() {
  const { t } = useLanguage();
  const { addWord, batchAddWords, speakText, vocabulary } = useMemory();

  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('tr');
  const [inputText, setInputText] = useState("encouraged");
  const [selectedTone, setSelectedTone] = useState('academic');
  const [translationResult, setTranslationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const debounceTimerRef = useRef(null);

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
    }, 350);

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

      // Auto-add keywords to memory vault
      if (result) {
        const wordsToSave = [];
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
          batchAddWords(wordsToSave);
        }
      }
    } catch (err) {
      console.error('Translation error', err);
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
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Header bar */}
      <div className="surface-card p-5 sm:p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">
              {t.translator.title}
            </h1>
            <span className="badge-tag text-[10px]">
              Canlı Nöral Çeviri
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            {t.translator.subtitle}
          </p>
        </div>

        {/* Tone Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-obsidian-900 rounded-xl border border-white/[0.06] text-xs">
          {[
            { key: 'academic', label: 'Akademik (YDS)' },
            { key: 'formal', label: 'Resmi' },
            { key: 'casual', label: 'Günlük' },
            { key: 'literal', label: 'Yapısal' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleToneChange(item.key)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedTone === item.key
                  ? 'bg-brand-950 text-brand-300 border border-brand-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Dual Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Source Box */}
        <div className="surface-card p-5 rounded-2xl flex flex-col justify-between space-y-4 min-h-[260px]">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs font-mono text-zinc-400">
            <span className="font-bold text-zinc-200 uppercase">
              {sourceLang === 'en' ? 'İngilizce (English)' : 'Türkçe'}
            </span>

            <button
              onClick={handleSwapLangs}
              className="p-1.5 rounded-lg bg-obsidian-900 border border-white/[0.08] hover:border-white/[0.2] text-zinc-300 hover:text-white transition-all"
              title="Dilleri Değiştir"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Metin veya kelime yazın, anında çevrilecek..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none font-sans leading-relaxed"
          />

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs font-mono text-zinc-500">
            <button
              onClick={() => speakText(inputText, sourceLang === 'en' ? 'en-US' : 'tr-TR')}
              className="p-1.5 rounded-lg bg-obsidian-900 border border-white/[0.06] text-zinc-400 hover:text-brand-300 transition-colors"
              title={t.common.listen}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2">
              {isLoading && (
                <div className="flex items-center gap-1.5 text-brand-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Çevriliyor...</span>
                </div>
              )}
              <span>{inputText.length} karakter</span>
            </div>
          </div>
        </div>

        {/* Target Box */}
        <div className="surface-card p-5 rounded-2xl flex flex-col justify-between space-y-4 min-h-[260px]">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs font-mono text-zinc-400">
            <span className="font-bold text-brand-300 uppercase">
              {targetLang === 'en' ? 'İngilizce (English)' : 'Türkçe'}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                <BookmarkCheck className="w-3 h-3" />
                <span>Havuza Senkron</span>
              </span>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-obsidian-900 border border-white/[0.08] hover:border-white/[0.2] text-zinc-400 hover:text-white transition-all text-xs flex items-center gap-1"
                title="Kopyala"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex-1 text-sm font-medium text-zinc-100 leading-relaxed overflow-y-auto">
            {translationResult?.translatedText || (
              <span className="text-zinc-600">Çeviri bekleniyor...</span>
            )}

            {/* Dictionary definitions */}
            {translationResult?.dictEntries && translationResult.dictEntries.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5">
                <span className="text-[10px] text-zinc-500 font-mono block">Sözlük Anlamları:</span>
                {translationResult.dictEntries.map((group, gi) => (
                  <div key={gi} className="text-xs text-zinc-300">
                    <span className="text-brand-400 font-mono text-[11px] mr-1.5">{group.pos}:</span>
                    <span>{group.words.slice(0, 4).join(', ')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs font-mono text-zinc-500">
            <button
              onClick={() => speakText(translationResult?.translatedText || '', targetLang === 'en' ? 'en-US' : 'tr-TR')}
              className="p-1.5 rounded-lg bg-obsidian-900 border border-white/[0.06] text-zinc-400 hover:text-brand-300 transition-colors"
              title={t.common.listen}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            <span>Otomatik Senkron Aktif</span>
          </div>
        </div>

      </div>

      {/* Extracted vocabulary pills */}
      {translationResult?.extractedKeywords && translationResult.extractedKeywords.length > 0 && (
        <div className="surface-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-400" />
              <span>Hafıza Havuzuna Kaydedilen Kelimeler</span>
            </span>
            <span className="text-emerald-400">Otomatik Eklendi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {translationResult.extractedKeywords.map((kw, idx) => (
              <div
                key={idx}
                className="bg-obsidian-900 p-3 rounded-xl border border-white/[0.06] flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-zinc-100">{kw.word}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-obsidian-800 text-brand-300 font-mono">
                      {kw.level}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{kw.meaningTr}</div>
                </div>

                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Havuzda
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
