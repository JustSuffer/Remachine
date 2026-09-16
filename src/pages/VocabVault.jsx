import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Plus, 
  RotateCw, 
  Volume2, 
  Check, 
  Clock, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Upload, 
  X,
  Layers,
  Award,
  Sparkles,
  Command
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useMemory } from '../context/MemoryContext';

export default function VocabVault() {
  const { t } = useLanguage();
  const { 
    vocabulary, 
    dueWords, 
    masteredWords, 
    addWord, 
    reviewWord, 
    deleteWord, 
    exportData, 
    importData, 
    speakText 
  } = useMemory();

  const [activeView, setActiveView] = useState('flashcard');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newWordData, setNewWordData] = useState({
    word: '',
    ipa: '',
    pos: 'noun',
    meaningTr: '',
    meaningEn: '',
    exampleEn: '',
    exampleTr: '',
    tags: 'YDS, IELTS, B2',
    level: 'B2'
  });

  const filteredVocabulary = vocabulary.filter(item => {
    const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.meaningTr.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedTag === 'all') return true;
    if (selectedTag === 'due') return dueWords.some(d => d.id === item.id);
    if (selectedTag === 'learning') return item.status === 'learning';
    if (selectedTag === 'mastered') return item.status === 'mastered';
    if (selectedTag === 'yds') return item.tags && item.tags.some(t => t.toLowerCase().includes('yds'));
    if (selectedTag === 'ielts') return item.tags && item.tags.some(t => t.toLowerCase().includes('ielts'));
    return true;
  });

  const flashcardDeck = dueWords.length > 0 ? dueWords : vocabulary;
  const currentCard = flashcardDeck[currentCardIndex] || null;

  // Keyboard controls: Space to flip, 1, 2, 3 to grade
  useEffect(() => {
    if (activeView !== 'flashcard' || isModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleGradeCard(0);
        if (e.key === '2') handleGradeCard(3);
        if (e.key === '3') handleGradeCard(5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, isFlipped, currentCardIndex, isModalOpen]);

  const handleGradeCard = (grade) => {
    if (!currentCard) return;
    reviewWord(currentCard.id, grade);
    setIsFlipped(false);

    if (currentCardIndex + 1 < flashcardDeck.length) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
      setCurrentCardIndex(0);
    }
  };

  const handleCreateWord = (e) => {
    e.preventDefault();
    if (!newWordData.word.trim() || !newWordData.meaningTr.trim()) return;

    addWord({
      ...newWordData,
      tags: newWordData.tags.split(',').map(s => s.trim()).filter(Boolean)
    });

    setNewWordData({
      word: '',
      ipa: '',
      pos: 'noun',
      meaningTr: '',
      meaningEn: '',
      exampleEn: '',
      exampleTr: '',
      tags: 'YDS, IELTS, B2',
      level: 'B2'
    });
    setIsModalOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const success = importData(content);
        if (success) alert('Hafıza havuzu yedeği başarıyla yüklendi!');
        else alert('Hatalı dosya formatı!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Header bar */}
      <div className="surface-card p-5 sm:p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-white">
            {t.vault.title}
          </h1>
          <p className="text-xs text-zinc-400">
            {t.vault.subtitle}
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-obsidian-900 rounded-xl border border-white/[0.06] text-xs">
            <button
              onClick={() => {
                setActiveView('flashcard');
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeView === 'flashcard'
                  ? 'bg-brand-950 text-brand-200 border border-brand-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Kart Tekrarı ({dueWords.length})
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeView === 'list'
                  ? 'bg-brand-950 text-brand-200 border border-brand-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Kelime Listesi ({vocabulary.length})
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-glow-violet transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Kelime Ekle</span>
          </button>
        </div>
      </div>

      {/* FLASHCARD REVIEW VIEW */}
      {activeView === 'flashcard' && (
        <div className="max-w-2xl mx-auto space-y-4">
          
          {currentCard ? (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 px-2">
                <span>
                  Kart {currentCardIndex + 1} / {flashcardDeck.length}
                </span>
                <span className="text-brand-400">
                  {currentCard.status === 'due' ? 'Tekrar Bekliyor' : 'Öğreniliyor'}
                </span>
              </div>

              {/* Minimalist Flashcard */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer min-h-[320px] rounded-2xl surface-card p-8 flex flex-col justify-between relative select-none hover:border-brand-500/40 transition-all duration-200 group"
              >
                {!isFlipped ? (
                  /* Front */
                  <div className="space-y-5 my-auto text-center">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-obsidian-900 border border-white/[0.08] text-xs font-mono text-brand-300">
                      <span>{currentCard.pos.toUpperCase()}</span>
                      <span>•</span>
                      <span>{currentCard.level || 'B2'}</span>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        {currentCard.word}
                      </h2>
                      {currentCard.ipa && (
                        <p className="text-sm font-mono text-zinc-400">
                          {currentCard.ipa}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(currentCard.word);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t.common.listen}</span>
                    </button>
                  </div>
                ) : (
                  /* Back */
                  <div className="space-y-4 my-auto animate-fadeIn">
                    <div className="text-center space-y-1">
                      <span className="text-xs text-brand-400 font-mono">Türkçe Anlamı</span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                        {currentCard.meaningTr}
                      </h3>
                      {currentCard.meaningEn && (
                        <p className="text-xs text-zinc-400 italic">
                          "{currentCard.meaningEn}"
                        </p>
                      )}
                    </div>

                    {currentCard.exampleEn && (
                      <div className="bg-obsidian-900/90 p-3.5 rounded-xl border border-white/[0.06] space-y-1 text-left">
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                          <span>Örnek Cümle:</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(currentCard.exampleEn);
                            }}
                            className="text-zinc-400 hover:text-brand-300 p-0.5"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-100 font-medium leading-relaxed">
                          {currentCard.exampleEn}
                        </p>
                        {currentCard.exampleTr && (
                          <p className="text-[11px] text-zinc-400 italic">
                            {currentCard.exampleTr}
                          </p>
                        )}
                      </div>
                    )}

                    {currentCard.collocations && currentCard.collocations.length > 0 && (
                      <div className="text-left text-xs font-mono">
                        <span className="text-[10px] text-zinc-500 block mb-1">Eşdizimler:</span>
                        <div className="flex flex-wrap gap-1">
                          {currentCard.collocations.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-obsidian-900 text-brand-300 text-[11px] border border-white/[0.04]">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-center pt-3 border-t border-white/[0.06] text-[11px] text-zinc-500 font-mono flex items-center justify-center gap-1">
                  <span>Çevirmek için tıkla veya</span>
                  <span className="px-1.5 py-0.2 rounded bg-obsidian-850 border border-white/[0.08] text-zinc-300">Space</span>
                </div>
              </div>

              {/* Rating Buttons with Shortcuts */}
              {isFlipped && (
                <div className="grid grid-cols-3 gap-2.5 animate-fadeIn font-mono text-xs">
                  <button
                    onClick={() => handleGradeCard(0)}
                    className="p-3 rounded-xl bg-red-950/40 hover:bg-red-950/70 text-red-200 border border-red-500/30 flex flex-col items-center gap-1 transition-all"
                  >
                    <div className="font-bold flex items-center gap-1">
                      <span>Unuttum</span>
                      <span className="text-[10px] opacity-60">(1)</span>
                    </div>
                    <span className="text-[10px] text-red-400">1 dk</span>
                  </button>

                  <button
                    onClick={() => handleGradeCard(3)}
                    className="p-3 rounded-xl bg-amber-950/40 hover:bg-amber-950/70 text-amber-200 border border-amber-500/30 flex flex-col items-center gap-1 transition-all"
                  >
                    <div className="font-bold flex items-center gap-1">
                      <span>Zor</span>
                      <span className="text-[10px] opacity-60">(2)</span>
                    </div>
                    <span className="text-[10px] text-amber-400">1 gün</span>
                  </button>

                  <button
                    onClick={() => handleGradeCard(5)}
                    className="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-200 border border-emerald-500/30 flex flex-col items-center gap-1 transition-all"
                  >
                    <div className="font-bold flex items-center gap-1">
                      <span>Kolay</span>
                      <span className="text-[10px] opacity-60">(3)</span>
                    </div>
                    <span className="text-[10px] text-emerald-400">4+ gün</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="surface-card p-8 rounded-2xl text-center space-y-3">
              <Award className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Tüm tekrarlar tamamlandı.</h3>
              <p className="text-xs text-zinc-400">Yeni kelimeler eklemek için çevirmen veya kelime ekleme panelini kullanabilirsiniz.</p>
            </div>
          )}

        </div>
      )}

      {/* WORD BANK LIST VIEW */}
      {activeView === 'list' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="surface-card p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Kelime veya Türkçe anlam ara..."
                className="w-full surface-input rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-1 text-xs font-mono">
              {['all', 'due', 'learning', 'mastered', 'yds', 'ielts'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    selectedTag === tag
                      ? 'bg-brand-950 text-brand-300 border border-brand-500/40'
                      : 'bg-obsidian-900 text-zinc-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {tag === 'all' ? 'Tümü' : tag === 'due' ? 'Tekrar Bekleyen' : tag}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <button
                onClick={exportData}
                className="p-1.5 rounded-lg bg-obsidian-900 border border-white/[0.08] text-zinc-400 hover:text-white flex items-center gap-1"
                title="JSON Yedek İndir"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Yedekle</span>
              </button>

              <label className="p-1.5 rounded-lg bg-obsidian-900 border border-white/[0.08] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Yükle</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredVocabulary.map((item) => (
              <div
                key={item.id}
                className="surface-card p-4 rounded-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-zinc-100">
                          {item.word}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-obsidian-800 text-brand-300 font-mono">
                          {item.level || 'B2'}
                        </span>
                      </div>
                      {item.ipa && (
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          {item.ipa}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speakText(item.word)}
                        className="p-1 text-zinc-500 hover:text-brand-300"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteWord(item.id)}
                        className="p-1 text-zinc-600 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-brand-200 font-medium">
                    {item.meaningTr}
                  </div>

                  {item.exampleEn && (
                    <div className="mt-2 text-[11px] text-zinc-400 line-clamp-2 bg-obsidian-900/70 p-2 rounded border border-white/[0.04]">
                      "{item.exampleEn}"
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>Tekrar: {item.interval} gün</span>
                  <span className={`px-1.5 py-0.2 rounded ${
                    item.status === 'mastered' ? 'bg-emerald-950 text-emerald-300' : 'bg-obsidian-800 text-zinc-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Modal Add Word */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
          <div className="surface-card w-full max-w-md p-6 rounded-2xl shadow-elevated space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-base font-bold text-white">
                Kelime Ekle
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWord} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Kelime / Kalıp</label>
                  <input
                    type="text"
                    required
                    value={newWordData.word}
                    onChange={(e) => setNewWordData({ ...newWordData, word: e.target.value })}
                    placeholder="E.g. deteriorate"
                    className="w-full surface-input rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">IPA Fonetik</label>
                  <input
                    type="text"
                    value={newWordData.ipa}
                    onChange={(e) => setNewWordData({ ...newWordData, ipa: e.target.value })}
                    placeholder="/dɪˈtɪə.ri.ə.reɪt/"
                    className="w-full surface-input rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Türkçe Anlamı</label>
                <input
                  type="text"
                  required
                  value={newWordData.meaningTr}
                  onChange={(e) => setNewWordData({ ...newWordData, meaningTr: e.target.value })}
                  placeholder="E.g. kötüleşmek, bozulmak"
                  className="w-full surface-input rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Örnek Cümle</label>
                <textarea
                  rows={2}
                  value={newWordData.exampleEn}
                  onChange={(e) => setNewWordData({ ...newWordData, exampleEn: e.target.value })}
                  placeholder="E.g. The weather deteriorated rapidly."
                  className="w-full surface-input rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-obsidian-900 text-zinc-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
