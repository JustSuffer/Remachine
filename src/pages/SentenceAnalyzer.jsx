import React, { useState, useEffect } from 'react';
import { 
  Split, 
  Sparkles, 
  Volume2, 
  Plus, 
  Check, 
  Layers, 
  BookOpen, 
  ArrowRight, 
  Copy, 
  RotateCcw,
  Tag,
  Lightbulb,
  Loader2,
  BookmarkCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useMemory } from '../context/MemoryContext';
import { analyzeSentence, presetSentences } from '../utils/sentenceAnalyzer';

export default function SentenceAnalyzer() {
  const { t } = useLanguage();
  const { addWord, batchAddWords, speakText, addSentenceBreakdown, vocabulary } = useMemory();

  const [inputSentence, setInputSentence] = useState(presetSentences[0].en);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addedWordsMap, setAddedWordsMap] = useState({});
  const [allAdded, setAllAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    handleAnalyze(presetSentences[0].en);
  }, []);

  const handleAnalyze = async (overrideText) => {
    const text = overrideText !== undefined ? overrideText : inputSentence;
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const result = await analyzeSentence(text);
      setAnalysis(result);
      setAddedWordsMap({});
      setAllAdded(false);
      if (result) {
        addSentenceBreakdown({
          rawText: result.rawText,
          naturalTranslation: result.naturalTranslation,
          tense: result.tense
        });
      }
    } catch (err) {
      console.error('Sentence analysis error', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setInputSentence(preset.en);
    handleAnalyze(preset.en);
  };

  const handleAddSingleWord = (token) => {
    addWord({
      word: token.word,
      ipa: token.ipa,
      pos: token.pos,
      meaningTr: token.meaningTr,
      exampleEn: analysis.rawText,
      exampleTr: analysis.naturalTranslation,
      collocations: token.collocations,
      synonyms: token.synonyms,
      level: token.level,
      tags: ['Sentence-Extracted', token.level]
    });
    setAddedWordsMap(prev => ({ ...prev, [token.word.toLowerCase()]: true }));
  };

  const handleAddAllWords = () => {
    if (!analysis || !analysis.tokens) return;
    const wordsToAdd = analysis.tokens.map(token => ({
      word: token.word,
      ipa: token.ipa,
      pos: token.pos,
      meaningTr: token.meaningTr,
      exampleEn: analysis.rawText,
      exampleTr: analysis.naturalTranslation,
      collocations: token.collocations,
      synonyms: token.synonyms,
      level: token.level,
      tags: ['Sentence-Extracted', token.level]
    }));

    batchAddWords(wordsToAdd);
    setAllAdded(true);
    const updatedMap = {};
    analysis.tokens.forEach(t => {
      updatedMap[t.word.toLowerCase()] = true;
    });
    setAddedWordsMap(updatedMap);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#d8b4fe', '#ffffff']
      });
    } catch (e) {}
  };

  const handleCopyAnalysis = () => {
    if (!analysis) return;
    const text = `Remachine Syntax Analysis:\nSentence: ${analysis.rawText}\nTense: ${analysis.tense}\nClause: ${analysis.clauseStructure}\nNatural TR: ${analysis.naturalTranslation}\n\nBreakdown:\n` +
      analysis.tokens.map(t => `- ${t.word} (${t.pos}): ${t.meaningTr}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Top Header Card */}
      <div className="surface-card p-5 sm:p-6 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-white">
              {t.analyzer.title}
            </h1>
            <p className="text-xs text-zinc-400">
              {t.analyzer.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAnalysis}
              className="px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/[0.08] hover:border-white/[0.2] text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Kopyalandı' : 'Raporu Kopyala'}</span>
            </button>
          </div>
        </div>

        {/* Preset sample buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.06] text-xs font-mono">
          <span className="text-zinc-500 py-1">Örnekler:</span>
          {presetSentences.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSelectPreset(p)}
              className="px-2.5 py-1 rounded-lg bg-obsidian-900 hover:bg-obsidian-800 text-zinc-300 hover:text-white border border-white/[0.06] transition-all"
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Text Input */}
        <div className="space-y-3">
          <textarea
            rows={3}
            value={inputSentence}
            onChange={(e) => setInputSentence(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAnalyze();
              }
            }}
            placeholder={t.analyzer.inputPlaceholder}
            className="w-full surface-input rounded-xl p-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none font-sans leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAnalyze()}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-glow-violet transition-all"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Split className="w-4 h-4" />}
                <span>{isLoading ? 'Ayrıştırılıyor...' : t.analyzer.analyzeBtn}</span>
              </button>

              <button
                onClick={() => speakText(inputSentence)}
                className="p-2.5 rounded-xl bg-obsidian-900 border border-white/[0.08] text-zinc-400 hover:text-white transition-colors"
                title={t.common.listen}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                setInputSentence('');
                setAnalysis(null);
              }}
              className="p-2 text-zinc-500 hover:text-zinc-300 text-xs"
              title="Temizle"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Output */}
      {analysis && (
        <div className="space-y-6">
          
          {/* Architecture Card */}
          <div className="surface-card p-5 sm:p-6 rounded-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3 text-xs font-mono">
              <span className="font-bold text-zinc-200 uppercase tracking-wider">
                {t.analyzer.structureBreakdown}
              </span>
              <div className="flex items-center gap-2 text-zinc-400">
                <span>{analysis.wordCount} Kelime</span>
                <span>•</span>
                <span className="text-brand-300 font-bold">{analysis.academicWordCount} Akademik</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-obsidian-900 p-3.5 rounded-xl border border-white/[0.06]">
                <span className="text-zinc-500 text-[11px] block">{t.analyzer.detectedTense}:</span>
                <span className="font-bold text-zinc-200 mt-1 block">{analysis.tense}</span>
              </div>
              <div className="bg-obsidian-900 p-3.5 rounded-xl border border-white/[0.06]">
                <span className="text-zinc-500 text-[11px] block">{t.analyzer.clauseType}:</span>
                <span className="font-bold text-zinc-200 mt-1 block">{analysis.clauseStructure}</span>
              </div>
            </div>

            {/* Translations */}
            <div className="space-y-3 pt-2">
              <div className="bg-brand-950/40 border border-brand-500/20 p-4 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-brand-300 uppercase tracking-wider font-mono block">
                  Doğal Türkçe Çeviri
                </span>
                <p className="text-sm font-medium text-zinc-100 leading-relaxed">
                  {analysis.naturalTranslation}
                </p>
              </div>

              <div className="bg-obsidian-900 p-3.5 rounded-xl border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono block">
                  Yapısal / Birebir Çeviri Sıralaması
                </span>
                <p className="text-xs text-zinc-300 font-mono">
                  {analysis.literalTranslation}
                </p>
              </div>
            </div>
          </div>

          {/* Word by Word Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono">
                  {t.analyzer.wordByWordTitle}
                </h2>
                <p className="text-xs text-zinc-400">
                  Kelimeleri tek tek inceleyin veya tümünü tek tıkla hafıza havuzunuza aktarın.
                </p>
              </div>

              <button
                onClick={handleAddAllWords}
                disabled={allAdded}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                  allAdded
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-glow-violet'
                }`}
              >
                {allAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tümü Eklendi</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Hepsini Havuza Ekle</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {analysis.tokens.map((token, index) => {
                const isAdded = addedWordsMap[token.word.toLowerCase()] || 
                  vocabulary.some(v => v.word.toLowerCase() === token.word.toLowerCase());

                return (
                  <div
                    key={index}
                    className="surface-card p-4 rounded-xl flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-zinc-100">
                              {token.word}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-obsidian-800 text-brand-300 font-mono">
                              {token.level || 'B2'}
                            </span>
                          </div>
                          {token.ipa && (
                            <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                              {token.ipa}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => speakText(token.word)}
                          className="p-1 text-zinc-500 hover:text-brand-300 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-2 text-xs font-semibold text-brand-200">
                        {token.meaningTr}
                      </div>

                      <div className="mt-1 text-[11px] text-zinc-400 font-mono">
                        Rol: {token.pos}
                      </div>

                      {token.collocations && token.collocations.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-wrap gap-1">
                          {token.collocations.map((c, ci) => (
                            <span key={ci} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-obsidian-900 text-zinc-400 border border-white/[0.04]">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                      <span className="text-zinc-500">Kök: {token.lemma}</span>

                      <button
                        onClick={() => handleAddSingleWord(token)}
                        disabled={isAdded}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isAdded
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-obsidian-900 hover:bg-brand-950 text-zinc-300 hover:text-brand-200 border border-white/[0.08] hover:border-brand-500/40'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Havuzda</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Ekle</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
