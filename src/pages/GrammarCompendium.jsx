import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Volume2, 
  GraduationCap, 
  Code, 
  ChevronRight,
  AlertTriangle
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
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Header bar */}
      <div className="surface-card p-5 sm:p-6 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-white">
              {t.grammar.title}
            </h1>
            <p className="text-xs text-zinc-400">
              {t.grammar.subtitle}
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Konu veya kural ara..."
              className="w-full surface-input rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center overflow-x-auto py-1 space-x-1.5 scrollbar-none border-t border-white/[0.06] pt-3 text-xs font-mono">
          {grammarCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-brand-950 text-brand-300 border border-brand-500/40 shadow-sm'
                  : 'bg-obsidian-900 text-zinc-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {lang === 'tr' ? cat.nameTr : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Topics Index */}
        <div className="lg:col-span-4 space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {filteredTopics.map((topic) => {
            const isActive = activeTopic && activeTopic.id === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${
                  isActive
                    ? 'bg-brand-950/70 border-brand-500/50 shadow-sm'
                    : 'surface-card hover:border-white/[0.15] text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-1.5 py-0.2 rounded bg-obsidian-800 text-brand-300 font-bold">
                    {topic.level}
                  </span>
                  <span className="text-zinc-500 capitalize">{topic.category}</span>
                </div>

                <h3 className="text-sm font-bold text-zinc-100 mt-2">
                  {lang === 'tr' ? topic.titleTr : topic.titleEn}
                </h3>

                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {lang === 'tr' ? topic.summaryTr : topic.summaryEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Viewer */}
        <div className="lg:col-span-8">
          {activeTopic && (
            <div className="surface-card p-6 sm:p-8 rounded-2xl space-y-6">
              
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-brand-400">
                    <span>{activeTopic.level}</span>
                    <span>•</span>
                    <span className="capitalize">{activeTopic.category}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white">
                    {lang === 'tr' ? activeTopic.titleTr : activeTopic.titleEn}
                  </h2>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {lang === 'tr' ? activeTopic.summaryTr : activeTopic.summaryEn}
                  </p>
                </div>

                <Link
                  to="/exams"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold font-mono transition-all"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Deneme Çöz</span>
                </Link>
              </div>

              {/* Formula */}
              {activeTopic.formula && (
                <div className="bg-obsidian-900 p-4 rounded-xl border border-white/[0.06] space-y-1.5">
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider font-mono block">
                    Kural Formülü:
                  </span>
                  <div className="text-xs font-mono text-zinc-200 bg-obsidian-950 p-2.5 rounded-lg border border-white/[0.04]">
                    {activeTopic.formula}
                  </div>
                </div>
              )}

              {/* Signals */}
              {activeTopic.signalWords && activeTopic.signalWords.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono block">
                    Sinyal Sözcükler:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTopic.signalWords.map((sig, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-obsidian-900 text-brand-300 border border-white/[0.06] text-xs font-mono">
                        {sig}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sections */}
              {activeTopic.sections && (
                <div className="space-y-3">
                  {activeTopic.sections.map((sec, idx) => (
                    <div key={idx} className="bg-obsidian-900/60 border border-white/[0.06] p-4 rounded-xl space-y-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-200">
                        {sec.heading}
                      </h4>
                      <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line font-sans">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Traps */}
              {activeTopic.traps && activeTopic.traps.length > 0 && (
                <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sınav Tuzakları & Püf Noktaları</span>
                  </span>
                  <div className="space-y-1.5 text-xs text-amber-100/90 leading-relaxed">
                    {activeTopic.traps.map((trap, idx) => (
                      <p key={idx} className="bg-obsidian-950/70 p-2.5 rounded border border-amber-500/20">
                        {trap}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Examples */}
              {activeTopic.examples && activeTopic.examples.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono block">
                    Örnek Cümleler:
                  </span>
                  <div className="space-y-2.5">
                    {activeTopic.examples.map((ex, idx) => (
                      <div key={idx} className="bg-obsidian-900 p-3.5 rounded-xl border border-white/[0.06] space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-zinc-100">
                            "{ex.en}"
                          </p>
                          <button
                            onClick={() => speakText(ex.en)}
                            className="p-1 text-zinc-500 hover:text-white shrink-0"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-400 italic">
                          🇹🇷 {ex.tr}
                        </p>
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
