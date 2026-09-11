import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Volume2, 
  AlertTriangle, 
  GraduationCap, 
  CheckCircle2, 
  Layers, 
  Code, 
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMemory } from '../context/MemoryContext';
import { grammarCategories, grammarTopics } from '../data/grammarData';

export default function GrammarCompendium() {
  const { lang, t } = useLanguage();
  const { speakText } = useMemory();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTopicId, setActiveTopicId] = useState(grammarTopics[0].id);

  const filteredTopics = grammarTopics.filter((topic) => {
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    const matchesSearch = 
      topic.titleTr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.summaryTr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.signalWords.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const activeTopic = grammarTopics.find(t => t.id === activeTopicId) || filteredTopics[0] || grammarTopics[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {t.grammar.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {t.grammar.subtitle}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.grammar.searchGrammar}
              className="w-full bg-obsidian-950/90 border border-purple-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center overflow-x-auto py-1 space-x-2 scrollbar-none border-t border-purple-900/30 pt-3">
          {grammarCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-obsidian-900/80 text-slate-400 hover:text-white border border-purple-500/20'
              }`}
            >
              {lang === 'tr' ? cat.nameTr : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Topic Index */}
        <div className="lg:col-span-4 space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filteredTopics.map((topic) => {
            const isActive = activeTopic && activeTopic.id === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${
                  isActive
                    ? 'glass-panel bg-violet-950/70 border-purple-400 shadow-md shadow-purple-950/40'
                    : 'glass-panel bg-obsidian-900/50 border-purple-500/20 hover:border-purple-500/40 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono font-bold">
                    {topic.level}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {topic.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2">
                  {lang === 'tr' ? topic.titleTr : topic.titleEn}
                </h3>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {lang === 'tr' ? topic.summaryTr : topic.summaryEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Side: Deep Grammar Unit Viewer */}
        <div className="lg:col-span-8">
          {activeTopic && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-500/30 space-y-6">
              
              {/* Topic Header & Level */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-purple-900/40 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-purple-950 border border-purple-500/30 text-xs font-mono text-purple-300 mb-2">
                    <span>{activeTopic.level}</span>
                    <span>•</span>
                    <span className="capitalize">{activeTopic.category}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {lang === 'tr' ? activeTopic.titleTr : activeTopic.titleEn}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    {lang === 'tr' ? activeTopic.summaryTr : activeTopic.summaryEn}
                  </p>
                </div>

                <Link
                  to="/exams"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-all"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{t.grammar.testThisTopic}</span>
                </Link>
              </div>

              {/* Formula & Rule Box */}
              {activeTopic.formula && (
                <div className="bg-obsidian-950/90 border border-purple-500/30 p-4 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
                    <Code className="w-3.5 h-3.5" />
                    <span>{t.grammar.formula}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-purple-200 bg-obsidian-900 p-2.5 rounded-lg border border-purple-900/30">
                    {activeTopic.formula}
                  </div>
                </div>
              )}

              {/* Signal Words */}
              {activeTopic.signalWords && activeTopic.signalWords.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    {t.grammar.signalWords}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTopic.signalWords.map((sig, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-obsidian-900 text-purple-300 border border-purple-500/20 text-xs font-mono font-medium">
                        {sig}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Core Breakdown Sections */}
              {activeTopic.sections && (
                <div className="space-y-4">
                  {activeTopic.sections.map((sec, idx) => (
                    <div key={idx} className="bg-obsidian-900/60 border border-purple-500/20 p-4 rounded-xl space-y-2">
                      <h4 className="text-xs sm:text-sm font-bold text-purple-300">
                        {sec.heading}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Exam Traps Alert Box */}
              {activeTopic.traps && activeTopic.traps.length > 0 && (
                <div className="bg-amber-950/40 border border-amber-500/40 p-5 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>{t.grammar.examTraps}</span>
                  </div>
                  <div className="space-y-2 text-xs text-amber-100/90 leading-relaxed">
                    {activeTopic.traps.map((trap, idx) => (
                      <p key={idx} className="bg-obsidian-950/60 p-2.5 rounded border border-amber-500/20">
                        {trap}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Example Sentences */}
              {activeTopic.examples && activeTopic.examples.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    {t.grammar.examples}:
                  </span>

                  <div className="space-y-3">
                    {activeTopic.examples.map((ex, idx) => (
                      <div key={idx} className="bg-obsidian-900/90 border border-purple-500/30 p-4 rounded-xl space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs sm:text-sm font-semibold text-purple-200">
                            "{ex.en}"
                          </p>
                          <button
                            onClick={() => speakText(ex.en)}
                            className="p-1 text-slate-400 hover:text-purple-300 shrink-0"
                            title={t.common.listen}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-300 italic">
                          🇹🇷 {ex.tr}
                        </p>

                        {ex.note && (
                          <div className="text-[11px] text-purple-400/90 font-mono pt-1 border-t border-purple-900/30">
                            🔍 {ex.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
