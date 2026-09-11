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
  Loader2
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
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    } catch (e) {}
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
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#c084fc', '#e879f9', '#ffffff']
      });
    } catch (e) {}
  };

  const handleCopyAnalysis = () => {
    if (!analysis) return;
    const text = `Remachine Sentence Analysis:\n\nSentence: ${analysis.rawText}\nTense: ${analysis.tense}\nClause: ${analysis.clauseStructure}\nNatural TR: ${analysis.naturalTranslation}\n\nWord Breakdown:\n` +
      analysis.tokens.map(t => `- ${t.word} (${t.pos}): ${t.meaningTr}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
            <Split className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {t.analyzer.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {t.analyzer.subtitle}
            </p>
          </div>
        </div>

        {/* Preset quick test sentences */}
        <div className="mt-4 pt-4 border-t border-purple-900/30">
          <div className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Hazır Örnek Akademik & YDS / IELTS Cümleleri:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {presetSentences.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSelectPreset(p)}
                className="text-xs px-3 py-1.5 rounded-lg bg-obsidian-900/90 hover:bg-violet-950 text-slate-300 hover:text-purple-200 border border-purple-500/20 hover:border-purple-500/40 transition-all font-mono"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Text Area */}
        <div className="mt-4 space-y-3">
          <div className="relative">
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
              className="w-full bg-obsidian-950/90 border border-purple-500/30 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all resize-none font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAnalyze()}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isLoading ? 'Çözümleniyor...' : t.analyzer.analyzeBtn}</span>
              </button>
              
              <button
                onClick={() => speakText(inputSentence)}
                className="p-2.5 rounded-xl bg-obsidian-900 border border-purple-500/30 hover:border-purple-400 text-purple-300 hover:text-white transition-all"
                title={t.common.listen}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAnalysis}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-obsidian-900 border border-purple-500/20 hover:border-purple-400 text-xs text-slate-300 hover:text-white transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? t.common.copied : t.common.copyText}</span>
              </button>

              <button
                onClick={() => {
                  setInputSentence('');
                  setAnalysis(null);
                }}
                className="p-2 rounded-lg bg-obsidian-900 border border-purple-500/20 hover:border-red-500/40 text-slate-400 hover:text-red-300 transition-all text-xs"
                title={t.common.clear}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Output Results */}
      {analysis && (
        <div className="space-y-6">
          
          {/* Sentence Architecture & Translations Card */}
          <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-900/40 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  {t.analyzer.structureBreakdown}
                </h2>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300">
                  {analysis.wordCount} {t.common.words}
                </span>
                <span className="px-2 py-0.5 rounded bg-fuchsia-950 border border-fuchsia-500/30 text-fuchsia-300">
                  {analysis.academicWordCount} B2/C1 Akademik
                </span>
              </div>
            </div>

            {/* Architecture Tags Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-obsidian-900/90 p-3.5 rounded-xl border border-purple-500/20 space-y-1">
                <span className="text-slate-400 text-[11px] block">{t.analyzer.detectedTense}:</span>
                <span className="font-bold text-purple-300 font-mono text-sm">{analysis.tense}</span>
              </div>

              <div className="bg-obsidian-900/90 p-3.5 rounded-xl border border-purple-500/20 space-y-1">
                <span className="text-slate-400 text-[11px] block">{t.analyzer.clauseType}:</span>
                <span className="font-bold text-fuchsia-300 font-mono text-sm">{analysis.clauseStructure}</span>
              </div>
            </div>

            {/* Translations comparison */}
            <div className="space-y-3 pt-2">
              <div className="bg-violet-950/40 border border-violet-500/30 p-4 rounded-xl">
                <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wide mb-1">
                  🇹🇷 {t.analyzer.naturalTrans}
                </div>
                <div className="text-sm font-medium text-slate-100 leading-relaxed">
                  {analysis.naturalTranslation}
                </div>
              </div>

              <div className="bg-obsidian-900/70 border border-purple-900/30 p-3.5 rounded-xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                  📐 {t.analyzer.literalTrans}
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  {analysis.literalTranslation}
                </div>
              </div>
            </div>

          </div>

          {/* Word-by-Word Breakdown Section */}
          <div className="space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <span>{t.analyzer.wordByWordTitle}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Her kelimenin fonetiğini, kökünü, eşdizimlerini inceleyin ve tek tıkla hafıza havuzunuza ekleyin.
                </p>
              </div>

              <button
                onClick={handleAddAllWords}
                disabled={allAdded}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  allAdded
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-600/30'
                }`}
              >
                {allAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t.common.allAdded}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>{t.analyzer.addAllToVault}</span>
                  </>
                )}
              </button>
            </div>

            {/* Word Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {analysis.tokens.map((token, index) => {
                const isAdded = addedWordsMap[token.word.toLowerCase()] || 
                  vocabulary.some(v => v.word.toLowerCase() === token.word.toLowerCase());

                return (
                  <div
                    key={index}
                    className="glass-panel p-4 rounded-xl border border-purple-500/20 hover:border-purple-400/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top bar: Word + Level + Sound */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-white group-hover:text-purple-200">
                              {token.word}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300 font-mono font-semibold">
                              {token.level || 'B2'}
                            </span>
                          </div>
                          {token.ipa && (
                            <div className="text-[11px] text-purple-400/80 font-mono mt-0.5">
                              {token.ipa}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => speakText(token.word)}
                          className="p-1.5 rounded-lg bg-obsidian-900 text-slate-400 hover:text-purple-300 transition-colors"
                          title={t.common.listen}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Part of Speech & Meaning */}
                      <div className="mt-2.5 space-y-1">
                        <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Tag className="w-3 h-3 text-purple-400" />
                          <span>{token.pos}</span>
                        </div>
                        <div className="text-xs font-semibold text-purple-200 mt-1">
                          {token.meaningTr}
                        </div>
                      </div>

                      {/* Collocations & Synonyms */}
                      {token.collocations && token.collocations.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-purple-900/30 text-[10px]">
                          <span className="text-slate-400 font-mono block">Collocations:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {token.collocations.map((c, ci) => (
                              <span key={ci} className="px-1.5 py-0.5 rounded bg-obsidian-900 text-purple-300 border border-purple-500/20">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action: Add to Vault */}
                    <div className="mt-4 pt-2 border-t border-purple-900/30 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">
                        Kök: {token.lemma}
                      </span>

                      <button
                        onClick={() => handleAddSingleWord(token)}
                        disabled={isAdded}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isAdded
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            : 'bg-violet-950 hover:bg-violet-900 text-purple-200 border border-purple-500/30 hover:border-purple-400'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Hafızada</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Havuza Ekle</span>
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
