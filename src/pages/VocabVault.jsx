import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Plus, 
  RotateCw, 
  Volume2, 
  Check, 
  Clock, 
  Sparkles, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Upload, 
  X,
  Layers,
  Award
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

  const [activeView, setActiveView] = useState('flashcard'); // 'flashcard' | 'list'
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for adding custom word
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

  // Filtered list for word bank
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

  // Deck for flashcards: prioritize due words, then remaining
  const flashcardDeck = dueWords.length > 0 ? dueWords : vocabulary;
  const currentCard = flashcardDeck[currentCardIndex] || null;

  const handleGradeCard = (grade) => {
    if (!currentCard) return;
    reviewWord(currentCard.id, grade);
    setIsFlipped(false);

    if (currentCardIndex + 1 < flashcardDeck.length) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Completed deck!
      try {
        confetti({
          particleCount: 100,
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
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-600/20 border border-fuchsia-500/40 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-fuchsia-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {t.vault.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {t.vault.subtitle}
            </p>
          </div>
        </div>

        {/* Mode Switcher & Add Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-obsidian-950 p-1 rounded-xl border border-purple-500/30 flex items-center">
            <button
              onClick={() => {
                setActiveView('flashcard');
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'flashcard'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.vault.flashcardMode} ({dueWords.length})
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'list'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.vault.listMode} ({vocabulary.length})
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.vault.addNewWord}</span>
          </button>
        </div>
      </div>

      {/* FLASHCARD VIEW */}
      {activeView === 'flashcard' && (
        <div className="max-w-2xl mx-auto space-y-4">
          
          {currentCard ? (
            <div className="space-y-4">
              
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-2">
                <span>
                  Kart {currentCardIndex + 1} / {flashcardDeck.length}
                </span>
                <span className="text-purple-300">
                  {currentCard.status === 'due' ? '⚠️ Tekrar Zamanı Geldi' : 'Öğreniliyor'}
                </span>
              </div>

              {/* Interactive Flashcard with Flip Animation */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer min-h-[340px] rounded-2xl glass-panel border border-purple-500/40 p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-purple-400 shadow-2xl group"
              >
                {/* Background Glow */}
                <div className="absolute -top-16 -right-16 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

                {/* Card Front (English word + IPA + audio) */}
                {!isFlipped ? (
                  <div className="space-y-6 my-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-xs font-mono text-purple-300">
                      <span>{currentCard.pos.toUpperCase()}</span>
                      <span>•</span>
                      <span>{currentCard.level || 'B2'}</span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight group-hover:text-purple-200 transition-colors">
                        {currentCard.word}
                      </h2>
                      {currentCard.ipa && (
                        <p className="text-sm font-mono text-purple-400">
                          {currentCard.ipa}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(currentCard.word);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-900 border border-purple-500/30 hover:border-purple-400 text-purple-300 hover:text-white transition-all text-xs font-semibold"
                    >
                      <Volume2 className="w-4 h-4 text-purple-400" />
                      <span>{t.common.listen}</span>
                    </button>
                  </div>
                ) : (
                  /* Card Back (Turkish translation + Example sentence + Collocations) */
                  <div className="space-y-4 my-auto animate-fadeIn">
                    <div className="text-center space-y-1">
                      <span className="text-xs text-purple-400 font-mono">Türkçe Karşılığı</span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-purple-200">
                        {currentCard.meaningTr}
                      </h3>
                      {currentCard.meaningEn && (
                        <p className="text-xs text-slate-400 italic">
                          "{currentCard.meaningEn}"
                        </p>
                      )}
                    </div>

                    {currentCard.exampleEn && (
                      <div className="bg-obsidian-900/90 p-4 rounded-xl border border-purple-500/20 space-y-1.5 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-purple-400 font-mono">Örnek Cümle:</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(currentCard.exampleEn);
                            }}
                            className="text-slate-400 hover:text-purple-300 p-1"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-100 font-medium leading-relaxed">
                          {currentCard.exampleEn}
                        </p>
                        {currentCard.exampleTr && (
                          <p className="text-[11px] text-slate-400 italic">
                            {currentCard.exampleTr}
                          </p>
                        )}
                      </div>
                    )}

                    {currentCard.collocations && currentCard.collocations.length > 0 && (
                      <div className="text-left text-xs">
                        <span className="text-[10px] text-slate-400 font-mono block mb-1">Eşdizimler (Collocations):</span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentCard.collocations.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 text-[11px] border border-purple-500/20">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Flip Hint */}
                <div className="text-center pt-4 border-t border-purple-900/20 text-[11px] text-slate-500 font-mono">
                  {t.vault.cardFlipHint}
                </div>
              </div>

              {/* SRS Rating Action Buttons */}
              {isFlipped && (
                <div className="grid grid-cols-3 gap-2 sm:gap-3 animate-fadeIn">
                  <button
                    onClick={() => handleGradeCard(0)}
                    className="p-3 rounded-xl bg-red-950/70 hover:bg-red-900/80 text-red-200 border border-red-500/40 text-xs font-semibold flex flex-col items-center gap-1 transition-all"
                  >
                    <span>❌ Unuttum</span>
                    <span className="text-[10px] text-red-400 font-mono">1 dk içinde</span>
                  </button>

                  <button
                    onClick={() => handleGradeCard(3)}
                    className="p-3 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 text-amber-200 border border-amber-500/40 text-xs font-semibold flex flex-col items-center gap-1 transition-all"
                  >
                    <span>⚡ Zor Hatırlandı</span>
                    <span className="text-[10px] text-amber-400 font-mono">1 gün sonra</span>
                  </button>

                  <button
                    onClick={() => handleGradeCard(5)}
                    className="p-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-500/40 text-xs font-semibold flex flex-col items-center gap-1 transition-all"
                  >
                    <span>✅ Çok Kolay</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Kalıcı Hafıza</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl text-center space-y-3 border border-purple-500/30">
              <Award className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Tebrikler! Bugünlük tüm tekrarlar tamamlandı.</h3>
              <p className="text-xs text-slate-400">Yeni kelimeler eklemek için cümle parçalayıcıyı veya 'Yeni Kelime Ekle' butonunu kullanabilirsiniz.</p>
            </div>
          )}

        </div>
      )}

      {/* WORD BANK LIST VIEW */}
      {activeView === 'list' && (
        <div className="space-y-4">
          
          {/* Search and Filters */}
          <div className="glass-panel p-4 rounded-xl border border-purple-500/20 flex flex-wrap items-center justify-between gap-3">
            
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Kelime veya Türkçe anlam ara..."
                className="w-full bg-obsidian-950/90 border border-purple-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Tag filter pills */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['all', 'due', 'learning', 'mastered', 'yds', 'ielts'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-mono transition-all ${
                    selectedTag === tag
                      ? 'bg-purple-600 text-white border border-purple-400'
                      : 'bg-obsidian-900 text-slate-400 hover:text-white border border-purple-500/20'
                  }`}
                >
                  {tag === 'all' ? 'Tümü' : tag === 'due' ? 'Tekrarı Gelenler' : tag}
                </button>
              ))}
            </div>

            {/* Backup Export/Import */}
            <div className="flex items-center gap-2">
              <button
                onClick={exportData}
                className="p-2 rounded-lg bg-obsidian-900 border border-purple-500/30 hover:border-purple-400 text-purple-300 text-xs flex items-center gap-1"
                title={t.common.exportJson}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.common.exportJson}</span>
              </button>

              <label className="p-2 rounded-lg bg-obsidian-900 border border-purple-500/30 hover:border-purple-400 text-purple-300 text-xs flex items-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.common.importJson}</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

          </div>

          {/* Cards Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredVocabulary.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white group-hover:text-purple-200">
                          {item.word}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300 font-mono">
                          {item.level || 'B2'}
                        </span>
                      </div>
                      {item.ipa && (
                        <div className="text-[11px] text-purple-400/80 font-mono mt-0.5">
                          {item.ipa}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speakText(item.word)}
                        className="p-1 text-slate-400 hover:text-purple-300"
                        title={t.common.listen}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteWord(item.id)}
                        className="p-1 text-slate-500 hover:text-red-400"
                        title={t.common.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-purple-200 font-medium">
                    {item.meaningTr}
                  </div>

                  {item.exampleEn && (
                    <div className="mt-2 text-[11px] text-slate-400 line-clamp-2 bg-obsidian-950/60 p-2 rounded border border-purple-900/20">
                      "{item.exampleEn}"
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-purple-900/30 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono">
                    Tekrar: {item.interval} gün
                  </span>
                  <span className={`px-1.5 py-0.5 rounded font-mono ${
                    item.status === 'mastered' ? 'bg-emerald-950 text-emerald-300' : 'bg-purple-950 text-purple-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Add Custom Word Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-purple-500/40 shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                <span>{t.vault.modalTitle}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWord} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">{t.vault.wordLabel}</label>
                  <input
                    type="text"
                    required
                    value={newWordData.word}
                    onChange={(e) => setNewWordData({ ...newWordData, word: e.target.value })}
                    placeholder="E.g. corroborate"
                    className="w-full bg-obsidian-900 border border-purple-500/30 rounded-lg p-2 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">{t.vault.ipaLabel}</label>
                  <input
                    type="text"
                    value={newWordData.ipa}
                    onChange={(e) => setNewWordData({ ...newWordData, ipa: e.target.value })}
                    placeholder="E.g. /kəˈrɒb.ə.reɪt/"
                    className="w-full bg-obsidian-900 border border-purple-500/30 rounded-lg p-2 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">{t.vault.meaningLabel}</label>
                <input
                  type="text"
                  required
                  value={newWordData.meaningTr}
                  onChange={(e) => setNewWordData({ ...newWordData, meaningTr: e.target.value })}
                  placeholder="E.g. doğrulamak, teyit etmek"
                  className="w-full bg-obsidian-900 border border-purple-500/30 rounded-lg p-2 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">{t.vault.exampleLabel}</label>
                <textarea
                  rows={2}
                  value={newWordData.exampleEn}
                  onChange={(e) => setNewWordData({ ...newWordData, exampleEn: e.target.value })}
                  placeholder="E.g. Recent evidence corroborates his hypothesis."
                  className="w-full bg-obsidian-900 border border-purple-500/30 rounded-lg p-2 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">{t.vault.exampleTrLabel}</label>
                <input
                  type="text"
                  value={newWordData.exampleTr}
                  onChange={(e) => setNewWordData({ ...newWordData, exampleTr: e.target.value })}
                  placeholder="E.g. Son kanıtlar onun hipotezini doğrulamaktadır."
                  className="w-full bg-obsidian-900 border border-purple-500/30 rounded-lg p-2 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-obsidian-900 text-slate-300 hover:text-white"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  {t.common.save}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
