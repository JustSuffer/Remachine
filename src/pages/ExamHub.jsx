import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Award, 
  Layers, 
  BookOpen, 
  Flag, 
  Play, 
  Sliders, 
  BarChart3,
  Check,
  AlertTriangle,
  X,
  ChevronRight,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useMemory } from '../context/MemoryContext';
import { getMockExam, getAllMockExamsMeta } from '../data/mockExamGenerator';

export default function ExamHub() {
  const { t } = useLanguage();
  const { vocabulary } = useMemory();

  const [screenState, setScreenState] = useState('hub');
  const mockExamsMeta = getAllMockExamsMeta();

  // Config Modal State
  const [selectedExamId, setSelectedExamId] = useState(1);
  const [examDurationMins, setExamDurationMins] = useState(90);
  const [customDurationInput, setCustomDurationInput] = useState('90');
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [questionCount, setQuestionCount] = useState(80);
  const [examMode, setExamMode] = useState('official');
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  // Active Exam State
  const [currentExamData, setCurrentExamData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [showPracticeExplanation, setShowPracticeExplanation] = useState(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(5400);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isOpticGridOpen, setIsOpticGridOpen] = useState(false);

  // Result filter
  const [resultFilter, setResultFilter] = useState('all');

  const handleOpenExamSetup = (examId) => {
    setSelectedExamId(examId);
    setIsSetupModalOpen(true);
  };

  const handleStartExam = () => {
    const fullExam = getMockExam(selectedExamId);
    const slicedQuestions = fullExam.questions.slice(0, questionCount);
    const finalDurationMins = isCustomDuration ? (parseInt(customDurationInput, 10) || 90) : examDurationMins;

    setCurrentExamData({
      meta: fullExam.meta,
      questions: slicedQuestions,
      totalCount: slicedQuestions.length,
      mode: examMode,
      durationMins: finalDurationMins
    });

    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setShowPracticeExplanation(false);
    setTimeRemainingSeconds(finalDurationMins * 60);
    setIsTimerRunning(true);
    setIsSetupModalOpen(false);
    setScreenState('exam');
  };

  // Timer
  useEffect(() => {
    let timer;
    if (screenState === 'exam' && isTimerRunning && timeRemainingSeconds > 0) {
      timer = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [screenState, isTimerRunning, timeRemainingSeconds]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (letter) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: prev[currentIndex] === letter ? undefined : letter
    }));
  };

  const handleToggleFlag = (idx = currentIndex) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleFinishExam = () => {
    setIsTimerRunning(false);
    setScreenState('results');

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#10b981', '#ffffff']
      });
    } catch (e) {}
  };

  const questions = currentExamData?.questions || [];
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  questions.forEach((q, idx) => {
    const ans = userAnswers[idx];
    if (!ans) unansweredCount++;
    else if (ans === q.correctAnswer) correctCount++;
    else wrongCount++;
  });

  const totalQuestions = questions.length;
  const scoreOut100 = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(1) : 0;
  const ydsScore = totalQuestions === 80 ? (correctCount * 1.25).toFixed(2) : scoreOut100;

  const currentQ = questions[currentIndex] || null;
  const currentAnswer = userAnswers[currentIndex];
  const isFlagged = flaggedQuestions[currentIndex] || false;

  const filteredResultQuestions = questions.map((q, idx) => ({ ...q, originalIdx: idx })).filter((q) => {
    const ans = userAnswers[q.originalIdx];
    if (resultFilter === 'wrong') return ans && ans !== q.correctAnswer;
    if (resultFilter === 'unanswered') return !ans;
    if (resultFilter === 'flagged') return flaggedQuestions[q.originalIdx];
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      
      {/* 1. MOCK EXAMS HUB (SELECTION SCREEN) */}
      {screenState === 'hub' && (
        <div className="space-y-6">
          
          {/* Hero Bar */}
          <div className="surface-card p-6 sm:p-8 rounded-2xl flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-zinc-300">
                <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
                <span>ÖSYM YDS & YÖKDİL Standartları</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                10 Büyük Deneme Sınavı Merkezi
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Her biri 80 özgün sorudan oluşan 10 tam kapsamlı deneme sınavı. Süreyi isterseniz resmi 180 dk, hızlı 90 dk veya dilediğiniz özel süreye ayarlayabilirsiniz.
              </p>
            </div>

            <button
              onClick={() => handleOpenExamSetup(1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-bold shadow-glow-violet transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Deneme 1'i Başlat</span>
            </button>
          </div>

          {/* 10 Deneme Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockExamsMeta.map((exam) => (
              <div
                key={exam.id}
                className="surface-card surface-card-hover p-5 sm:p-6 rounded-2xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-obsidian-900 border border-white/[0.08] flex items-center justify-center font-mono font-bold text-xs text-brand-300 group-hover:border-brand-500/40">
                        {exam.id}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-obsidian-900 text-zinc-400 font-mono border border-white/[0.06]">
                        {exam.difficulty}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-zinc-500">
                      80 Soru • 90/180 dk
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-3 group-hover:text-brand-200 transition-colors">
                    {exam.title}
                  </h3>

                  <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {exam.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-mono">12 Soru Bölümü</span>

                  <button
                    onClick={() => handleOpenExamSetup(exam.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-obsidian-900 hover:bg-brand-950 text-zinc-300 hover:text-brand-200 border border-white/[0.08] hover:border-brand-500/40 text-xs font-mono font-semibold transition-all"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Yapılandır & Başla</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 2. SETUP MODAL */}
      {isSetupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md">
          <div className="surface-card w-full max-w-lg p-6 rounded-2xl shadow-elevated space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-white">
                  {mockExamsMeta.find(e => e.id === selectedExamId)?.title}
                </h3>
                <p className="text-xs text-zinc-400">Sınav süresi, soru adedi ve çözüm modunu seçin</p>
              </div>
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                <span>Sınav Süresi</span>
              </label>

              <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                {[
                  { label: "90 Dk", mins: 90 },
                  { label: "180 Dk (Resmi)", mins: 180 },
                  { label: "60 Dk", mins: 60 },
                  { label: "45 Dk", mins: 45 },
                ].map(item => (
                  <button
                    key={item.mins}
                    type="button"
                    onClick={() => {
                      setIsCustomDuration(false);
                      setExamDurationMins(item.mins);
                    }}
                    className={`p-2 rounded-xl border transition-all ${
                      !isCustomDuration && examDurationMins === item.mins
                        ? 'bg-brand-950 text-brand-200 border-brand-500/50 font-bold'
                        : 'bg-obsidian-900 text-zinc-400 border-white/[0.06] hover:border-white/[0.15]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Custom */}
              <div className="pt-1 flex items-center gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setIsCustomDuration(true)}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    isCustomDuration
                      ? 'bg-brand-950 text-brand-200 border-brand-500/50'
                      : 'bg-obsidian-900 text-zinc-400 border-white/[0.06]'
                  }`}
                >
                  Özel Süre:
                </button>
                {isCustomDuration && (
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={customDurationInput}
                    onChange={(e) => setCustomDurationInput(e.target.value)}
                    placeholder="Dakika (örn: 120)"
                    className="flex-1 surface-input rounded-lg px-3 py-1 text-white text-xs font-mono"
                  />
                )}
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-400" />
                <span>Soru Sayısı</span>
              </label>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {[
                  { label: "80 Soru (Tam)", count: 80 },
                  { label: "40 Soru (Yarı)", count: 40 },
                  { label: "20 Soru (Hız)", count: 20 },
                ].map(item => (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => setQuestionCount(item.count)}
                    className={`p-2 rounded-xl border transition-all ${
                      questionCount === item.count
                        ? 'bg-brand-950 text-brand-200 border-brand-500/50 font-bold'
                        : 'bg-obsidian-900 text-zinc-400 border-white/[0.06] hover:border-white/[0.15]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400">Mod</label>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setExamMode('official')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    examMode === 'official'
                      ? 'bg-brand-950/60 border-brand-500/40 text-brand-200'
                      : 'bg-obsidian-900 text-zinc-400 border-white/[0.06]'
                  }`}
                >
                  <div className="font-bold">⏱️ Resmi Sınav Modu</div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Açıklamalar sınav bitince verilir.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setExamMode('practice')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    examMode === 'practice'
                      ? 'bg-brand-950/60 border-brand-500/40 text-brand-200'
                      : 'bg-obsidian-900 text-zinc-400 border-white/[0.06]'
                  }`}
                >
                  <div className="font-bold">💡 Anında Çözüm Modu</div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Her soruda anında açıklama gösterilir.</p>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-white/[0.06]">
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-obsidian-900 text-zinc-400 hover:text-white text-xs font-medium"
              >
                İptal
              </button>
              <button
                onClick={handleStartExam}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-glow-violet transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Sınavı Başlat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTIVE EXAM SCREEN */}
      {screenState === 'exam' && currentQ && (
        <div className="space-y-4">
          
          {/* Exam Header */}
          <div className="surface-card p-3.5 sm:p-4 rounded-xl flex items-center justify-between gap-3 sticky top-14 z-30 bg-obsidian-950/90 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 font-mono text-xs">
              <span className="font-bold text-zinc-200">
                Soru {currentIndex + 1} / {totalQuestions}
              </span>
              <span className="hidden sm:inline px-2 py-0.5 rounded bg-obsidian-900 text-zinc-400 border border-white/[0.06]">
                {currentQ.sectionName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-bold border ${
                timeRemainingSeconds < 300
                  ? 'bg-red-950 text-red-300 border-red-500 animate-pulse'
                  : 'bg-obsidian-900 border-white/[0.08] text-amber-300'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeRemainingSeconds)}</span>
              </div>

              <button
                onClick={() => handleToggleFlag()}
                className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-all ${
                  isFlagged
                    ? 'bg-amber-950 text-amber-300 border-amber-500'
                    : 'bg-obsidian-900 border-white/[0.08] text-zinc-400 hover:text-white'
                }`}
                title="İşaretle"
              >
                <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-400' : ''}`} />
                <span className="hidden sm:inline">{isFlagged ? 'İşaretli' : 'İşaretle'}</span>
              </button>

              <button
                onClick={() => setIsOpticGridOpen(!isOpticGridOpen)}
                className="px-2.5 py-1 rounded-lg bg-obsidian-900 hover:bg-obsidian-850 text-zinc-300 border border-white/[0.08] text-xs font-mono flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5 text-brand-400" />
                <span>Harita ({Object.keys(userAnswers).filter(k => userAnswers[k]).length}/{totalQuestions})</span>
              </button>

              <button
                onClick={handleFinishExam}
                className="px-3 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/40 text-xs font-mono font-bold transition-all"
              >
                Bitir
              </button>
            </div>
          </div>

          {/* Question & Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            
            <div className={`space-y-4 ${isOpticGridOpen ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
              <div className="surface-card p-6 sm:p-8 rounded-2xl space-y-6">
                
                {/* Passage */}
                {currentQ.passage && (
                  <div className="bg-obsidian-900/90 border border-white/[0.06] p-4 sm:p-5 rounded-xl space-y-2 text-xs sm:text-sm text-zinc-300 font-serif leading-relaxed">
                    <span className="text-[10px] font-mono text-brand-400 font-bold uppercase tracking-wider block">
                      Paragraf Metni:
                    </span>
                    <p>{currentQ.passage}</p>
                  </div>
                )}

                {/* Question */}
                <div className="text-sm sm:text-base font-bold text-zinc-100 leading-relaxed">
                  {currentQ.question}
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {currentQ.options.map((opt) => {
                    const isSelected = currentAnswer === opt.key;
                    const isCorrect = opt.key === currentQ.correctAnswer;

                    let optStyle = "bg-obsidian-900/70 border-white/[0.06] text-zinc-300 hover:border-white/[0.15] hover:bg-obsidian-850";

                    if (examMode === 'practice' && showPracticeExplanation) {
                      if (isCorrect) optStyle = "bg-emerald-950 text-emerald-200 border-emerald-500/60";
                      else if (isSelected && !isCorrect) optStyle = "bg-red-950 text-red-200 border-red-500/60";
                      else optStyle = "bg-obsidian-950 opacity-40 border-transparent";
                    } else if (isSelected) {
                      optStyle = "bg-brand-950/70 text-white border-brand-500/50 shadow-sm";
                    }

                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectAnswer(opt.key)}
                        className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition-all ${optStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-brand-600 text-white' : 'bg-obsidian-850 text-zinc-400 border border-white/[0.06]'
                        }`}>
                          {opt.key}
                        </span>
                        <span className="text-xs sm:text-sm font-medium mt-0.5 leading-relaxed">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Practice Mode Explanation */}
                {examMode === 'practice' && showPracticeExplanation && (
                  <div className="bg-brand-950/40 border border-brand-500/30 p-4 rounded-xl space-y-2 text-xs text-zinc-200 animate-fadeIn">
                    <span className="font-bold text-brand-300 font-mono block">Çözüm Açıklaması:</span>
                    <p className="leading-relaxed">{currentQ.explanation}</p>
                  </div>
                )}

                {/* Footer Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <button
                    onClick={() => {
                      if (currentIndex > 0) {
                        setCurrentIndex(prev => prev - 1);
                        setShowPracticeExplanation(false);
                      }
                    }}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/[0.08] text-xs font-mono text-zinc-400 hover:text-white disabled:opacity-30"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Önceki</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {examMode === 'practice' && !showPracticeExplanation && currentAnswer && (
                      <button
                        onClick={() => setShowPracticeExplanation(true)}
                        className="px-3.5 py-1.5 rounded-lg bg-brand-900 text-brand-200 border border-brand-500/40 text-xs font-mono font-bold"
                      >
                        Açıklamayı Gör
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowPracticeExplanation(false);
                        if (currentIndex + 1 < totalQuestions) {
                          setCurrentIndex(prev => prev + 1);
                        } else {
                          handleFinishExam();
                        }
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold font-mono transition-all shadow-glow-violet"
                    >
                      <span>{currentIndex + 1 === totalQuestions ? 'Sınavı Bitir' : 'Sonraki'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Soru Haritası Drawer */}
            {isOpticGridOpen && (
              <div className="lg:col-span-4 surface-card p-4 rounded-xl space-y-3 max-h-[640px] overflow-y-auto">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-300 pb-2 border-b border-white/[0.06]">
                  <span className="font-bold">Soru Haritası (1 - {totalQuestions})</span>
                  <button onClick={() => setIsOpticGridOpen(false)} className="text-zinc-500 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1 pt-1">
                  {questions.map((q, idx) => {
                    const isAnswered = userAnswers[idx] !== undefined;
                    const ansLetter = userAnswers[idx];
                    const isCurrent = idx === currentIndex;
                    const flagged = flaggedQuestions[idx];

                    let cellStyle = "bg-obsidian-900 text-zinc-400 border-white/[0.04] hover:border-white/[0.15]";
                    if (isAnswered) cellStyle = "bg-brand-600 text-white font-bold border-brand-400";
                    if (flagged) cellStyle += " ring-1 ring-amber-400";
                    if (isCurrent) cellStyle += " ring-2 ring-white";

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setShowPracticeExplanation(false);
                        }}
                        className={`p-1.5 rounded-lg border text-xs font-mono flex flex-col items-center justify-center transition-all ${cellStyle}`}
                      >
                        <span>{idx + 1}</span>
                        {isAnswered && <span className="text-[8px] opacity-90">{ansLetter}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* 4. POST-EXAM RESULTS SCORECARD */}
      {screenState === 'results' && (
        <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
          
          <div className="surface-card p-6 sm:p-8 rounded-2xl text-center space-y-5">
            <div className="w-12 h-12 rounded-xl bg-brand-950 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-300">
              <Award className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-brand-400">
                {currentExamData?.meta.title}
              </span>
              <h2 className="text-2xl font-extrabold text-white">
                Sınav Tamamlandı
              </h2>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="bg-obsidian-900 border border-white/[0.08] p-3.5 rounded-xl font-mono">
                <div className="text-2xl font-black text-brand-300">{ydsScore}</div>
                <div className="text-[11px] text-zinc-400 mt-1">YDS Puanı</div>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl font-mono">
                <div className="text-2xl font-black text-emerald-400">{correctCount}</div>
                <div className="text-[11px] text-emerald-200 mt-1">Doğru</div>
              </div>
              <div className="bg-red-950/40 border border-red-500/30 p-3.5 rounded-xl font-mono">
                <div className="text-2xl font-black text-red-400">{wrongCount}</div>
                <div className="text-[11px] text-red-200 mt-1">Yanlış</div>
              </div>
              <div className="bg-obsidian-900 border border-white/[0.08] p-3.5 rounded-xl font-mono">
                <div className="text-2xl font-black text-zinc-400">{unansweredCount}</div>
                <div className="text-[11px] text-zinc-400 mt-1">Boş</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setScreenState('hub')}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold font-mono transition-all"
              >
                Deneme Listesine Dön
              </button>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs font-mono">
              <span className="font-bold text-zinc-300 uppercase">Soru Çözüm İncelemesi</span>
              <div className="flex gap-1">
                {['all', 'wrong', 'unanswered', 'flagged'].map((flt) => (
                  <button
                    key={flt}
                    onClick={() => setResultFilter(flt)}
                    className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                      resultFilter === flt
                        ? 'bg-brand-950 text-brand-300 border border-brand-500/40'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {flt === 'all' ? 'Tümü' : flt === 'wrong' ? 'Yanlışlar' : flt === 'unanswered' ? 'Boşlar' : 'İşaretliler'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredResultQuestions.map((q) => {
                const userAns = userAnswers[q.originalIdx];
                const isCorrect = userAns === q.correctAnswer;
                const isBlank = !userAns;

                return (
                  <div
                    key={q.id}
                    className="surface-card p-4 sm:p-5 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-zinc-300">Soru {q.originalIdx + 1} ({q.sectionName})</span>
                      <div>
                        {isCorrect && <span className="text-emerald-400">✓ Doğru ({userAns})</span>}
                        {!isCorrect && !isBlank && <span className="text-red-400">✗ Yanlış (Sen: {userAns} / Doğru: {q.correctAnswer})</span>}
                        {isBlank && <span className="text-zinc-500">Boş (Doğru: {q.correctAnswer})</span>}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-100 font-medium">{q.question}</p>

                    <div className="bg-obsidian-900 p-3.5 rounded-lg border border-white/[0.06] text-xs text-zinc-300 space-y-1 font-sans">
                      <span className="font-bold text-brand-300 font-mono text-[10px] block">Açıklama:</span>
                      <p className="leading-relaxed">{q.explanation}</p>
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
