import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
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

  // Screen state: 'hub' | 'exam' | 'results'
  const [screenState, setScreenState] = useState('hub');

  // Available mock exams
  const mockExamsMeta = getAllMockExamsMeta();

  // Setup / Config modal state
  const [selectedExamId, setSelectedExamId] = useState(1);
  const [examDurationMins, setExamDurationMins] = useState(90); // 90 min default
  const [customDurationInput, setCustomDurationInput] = useState('90');
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [questionCount, setQuestionCount] = useState(80); // 80 questions default
  const [examMode, setExamMode] = useState('official'); // 'official' | 'practice'
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  // Active Exam state
  const [currentExamData, setCurrentExamData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { 0: 'A', 1: 'C' }
  const [flaggedQuestions, setFlaggedQuestions] = useState({}); // { 0: true }
  const [showPracticeExplanation, setShowPracticeExplanation] = useState(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(5400); // 90 mins in sec
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isOpticGridOpen, setIsOpticGridOpen] = useState(false);

  // Result filter
  const [resultFilter, setResultFilter] = useState('all'); // 'all' | 'wrong' | 'unanswered' | 'flagged'

  // Open setup for a chosen exam
  const handleOpenExamSetup = (examId) => {
    setSelectedExamId(examId);
    setIsSetupModalOpen(true);
  };

  // Start exam with configuration
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

  // Countdown timer
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

    // Confetti for completion
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#c084fc', '#f59e0b', '#10b981']
      });
    } catch (e) {}
  };

  // Stats calculation
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

  // Filtered questions in result scorecard
  const filteredResultQuestions = questions.map((q, idx) => ({ ...q, originalIdx: idx })).filter((q) => {
    const ans = userAnswers[q.originalIdx];
    if (resultFilter === 'wrong') return ans && ans !== q.correctAnswer;
    if (resultFilter === 'unanswered') return !ans;
    if (resultFilter === 'flagged') return flaggedQuestions[q.originalIdx];
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. MOCK EXAMS HUB & DASHBOARD (SELECTION SCREEN) */}
      {screenState === 'hub' && (
        <div className="space-y-6">
          
          {/* Main Hero Header */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-500/30 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-xs font-mono text-purple-300">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  <span>ÖSYM YDS / YÖKDİL & IELTS Standartları</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  10 Adet 80 Soruluk Büyük Deneme Sınavları
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Gerçek sınav formatında hazırlanmış 10 tam kapsamlı deneme sınavı. Süreyi isterseniz 90 dakika, isterseniz resmi 180 dakika veya dilediğiniz gibi ayarlayarak başlayabilirsiniz.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenExamSetup(1)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs sm:text-sm font-extrabold shadow-xl shadow-purple-600/30 transition-all hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Deneme 1'i Başlat</span>
                </button>
              </div>
            </div>
          </div>

          {/* 10 Deneme Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockExamsMeta.map((exam) => (
              <div
                key={exam.id}
                className="glass-panel glass-panel-hover p-5 sm:p-6 rounded-2xl border border-purple-500/20 hover:border-purple-400/50 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-obsidian-900 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-sm text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        {exam.id}
                      </div>
                      <div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono font-semibold border border-purple-500/20">
                          {exam.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs text-slate-400">
                      <span className="text-purple-300 font-bold">80 Soru</span> • 90/180 dk
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mt-3 group-hover:text-purple-200 transition-colors">
                    {exam.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {exam.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-purple-900/30 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>12 Bölüm</span>
                    <span>•</span>
                    <span>Tam YDS Müfredatı</span>
                  </div>

                  <button
                    onClick={() => handleOpenExamSetup(exam.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-500/30 hover:border-purple-400 text-xs font-bold transition-all shadow-md"
                  >
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    <span>Sınavı Ayarla & Başla</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 2. EXAM SETUP MODAL (DURATION, QUESTIONS, MODE CONFIGURATION) */}
      {isSetupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-xl p-6 sm:p-8 rounded-2xl border border-purple-500/40 shadow-2xl space-y-6 relative">
            
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
                  <Sliders className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {mockExamsMeta.find(e => e.id === selectedExamId)?.title}
                  </h3>
                  <p className="text-xs text-slate-400">Sınav süresi, soru sayısı ve çözüm modunu belirleyin</p>
                </div>
              </div>

              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Config Option 1: Sınav Süresi (Duration) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Sınav Süresi (Dakika)</span>
              </label>
              
              <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                {[
                  { label: "90 Dk (Hızlı)", mins: 90 },
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
                    className={`p-2.5 rounded-xl border font-bold transition-all ${
                      !isCustomDuration && examDurationMins === item.mins
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-obsidian-900 text-slate-300 border-purple-500/20 hover:border-purple-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Custom Duration Input */}
              <div className="pt-2 flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsCustomDuration(true)}
                  className={`px-3 py-2 rounded-xl border font-mono font-medium transition-all ${
                    isCustomDuration
                      ? 'bg-purple-600 text-white border-purple-400'
                      : 'bg-obsidian-900 text-slate-400 border-purple-500/20'
                  }`}
                >
                  Özel Süre Belirle:
                </button>
                {isCustomDuration && (
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={customDurationInput}
                    onChange={(e) => setCustomDurationInput(e.target.value)}
                    placeholder="Dakika (örn: 120)"
                    className="flex-1 bg-obsidian-900 border border-purple-500/30 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-purple-400 text-xs"
                  />
                )}
              </div>
            </div>

            {/* Config Option 2: Soru Sayısı (Question Count) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Soru Sayısı</span>
              </label>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {[
                  { label: "80 Soru (Tam Deneme)", count: 80 },
                  { label: "40 Soru (Yarı Deneme)", count: 40 },
                  { label: "20 Soru (Mini Drill)", count: 20 },
                ].map(item => (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => setQuestionCount(item.count)}
                    className={`p-2.5 rounded-xl border font-bold transition-all ${
                      questionCount === item.count
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-obsidian-900 text-slate-300 border-purple-500/20 hover:border-purple-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Config Option 3: Çözüm Modu (Official vs Practice) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Çözüm & Geri Bildirim Modu</span>
              </label>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setExamMode('official')}
                  className={`p-3.5 rounded-xl border text-left transition-all space-y-1 ${
                    examMode === 'official'
                      ? 'bg-purple-900/60 border-purple-400 text-white shadow-md'
                      : 'bg-obsidian-900 text-slate-400 border-purple-500/20 hover:border-purple-500/40'
                  }`}
                >
                  <div className="font-bold text-purple-200">⏱️ Resmi Sınav Modu</div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Süre işler, optik form açıktır. Açıklamalar sınav bitiminde ayrıntılı karne olarak sunulur.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setExamMode('practice')}
                  className={`p-3.5 rounded-xl border text-left transition-all space-y-1 ${
                    examMode === 'practice'
                      ? 'bg-purple-900/60 border-purple-400 text-white shadow-md'
                      : 'bg-obsidian-900 text-slate-400 border-purple-500/20 hover:border-purple-500/40'
                  }`}
                >
                  <div className="font-bold text-purple-200">💡 Çalışma & Anında Çözüm</div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Her soruda "Cevabı Kontrol Et" butonu ile açıklamaları anında inceleyebilirsiniz.
                  </p>
                </button>
              </div>
            </div>

            {/* Start CTA */}
            <div className="pt-2 flex justify-end gap-3 border-t border-purple-900/30">
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-obsidian-900 text-slate-400 hover:text-white text-xs font-semibold"
              >
                İptal
              </button>
              <button
                onClick={handleStartExam}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-purple-600/30 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Sınavı Başlat</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. ACTIVE EXAM SCREEN (80-QUESTION ENVIRONMENT WITH OPTICAL MATRIX) */}
      {screenState === 'exam' && currentQ && (
        <div className="space-y-6">
          
          {/* Top Sticky Bar */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-purple-500/30 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30 bg-obsidian-950/90 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="font-mono font-extrabold text-sm sm:text-base text-purple-300">
                Soru {currentIndex + 1} / {totalQuestions}
              </span>
              <span className="hidden sm:inline px-2.5 py-0.5 rounded bg-purple-950 text-[11px] text-purple-300 font-mono border border-purple-500/20">
                {currentQ.sectionName}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Timer */}
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-xs sm:text-sm font-bold border shadow-inner ${
                timeRemainingSeconds < 300
                  ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
                  : 'bg-obsidian-900 border-purple-500/30 text-amber-300'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeRemainingSeconds)}</span>
              </div>

              {/* Flag Question Button */}
              <button
                onClick={() => handleToggleFlag()}
                className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                  isFlagged
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                    : 'bg-obsidian-900 border-purple-500/20 text-slate-400 hover:text-white'
                }`}
                title="Soruyu İşaretle (Daha sonra bakmak için)"
              >
                <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span className="hidden sm:inline">{isFlagged ? 'İşaretlendi' : 'İşaretle'}</span>
              </button>

              {/* Toggle 80-Question Optical Matrix Drawer */}
              <button
                onClick={() => setIsOpticGridOpen(!isOpticGridOpen)}
                className="px-3 py-1.5 rounded-xl bg-violet-950 hover:bg-violet-900 text-purple-200 border border-purple-500/30 text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Soru Haritası ({Object.keys(userAnswers).filter(k => userAnswers[k]).length}/{totalQuestions})</span>
              </button>

              {/* Finish Exam Button */}
              <button
                onClick={handleFinishExam}
                className="px-4 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/40 text-xs font-bold transition-all"
              >
                Sınavı Bitir
              </button>
            </div>
          </div>

          {/* Main Layout: Question Card & Soru Haritası */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Question Card */}
            <div className={`space-y-6 ${isOpticGridOpen ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-500/30 space-y-6">
                
                {/* Section Badge */}
                <div className="flex items-center justify-between border-b border-purple-900/40 pb-3 text-xs font-mono">
                  <span className="text-purple-300 font-bold">
                    {currentQ.sectionName}
                  </span>
                  <span className="text-slate-500">
                    ÖSYM Soru No: {currentIndex + 1}
                  </span>
                </div>

                {/* Reading Passage if available */}
                {currentQ.passage && (
                  <div className="bg-obsidian-900/90 border border-purple-500/30 p-5 rounded-xl space-y-2 font-serif text-xs sm:text-sm text-slate-200 leading-relaxed">
                    <span className="text-[11px] font-bold text-purple-300 font-mono uppercase tracking-wider block">
                      📖 Paragraf Metni:
                    </span>
                    <p>{currentQ.passage}</p>
                  </div>
                )}

                {/* Question Text */}
                <div className="text-base sm:text-lg font-bold text-white leading-relaxed font-sans">
                  {currentQ.question}
                </div>

                {/* Options List (A, B, C, D, E) */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt) => {
                    const isSelected = currentAnswer === opt.key;
                    const isCorrect = opt.key === currentQ.correctAnswer;

                    let optionStyle = "bg-obsidian-900/80 border-purple-500/20 text-slate-200 hover:border-purple-400 hover:bg-obsidian-850";

                    if (examMode === 'practice' && showPracticeExplanation) {
                      if (isCorrect) {
                        optionStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-900/30";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "bg-red-950/80 border-red-500 text-red-200";
                      } else {
                        optionStyle = "bg-obsidian-950/50 border-transparent text-slate-500 opacity-60";
                      }
                    } else if (isSelected) {
                      optionStyle = "bg-purple-900/70 border-purple-400 text-white shadow-md shadow-purple-950/50";
                    }

                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectAnswer(opt.key)}
                        className={`w-full text-left p-4 rounded-xl border flex items-start gap-3.5 transition-all ${optionStyle}`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-purple-600 text-white' : 'bg-obsidian-950 text-slate-400 border border-purple-500/20'
                        }`}>
                          {opt.key}
                        </span>
                        <span className="text-xs sm:text-sm font-medium mt-0.5 leading-relaxed font-sans">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Practice Mode Instant Explanation Box */}
                {examMode === 'practice' && showPracticeExplanation && (
                  <div className="bg-violet-950/50 border border-violet-500/40 p-5 rounded-xl space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wide">
                      <HelpCircle className="w-4 h-4 text-purple-400" />
                      <span>{t.common.explanation}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                      {currentQ.explanation}
                    </p>
                    {currentQ.strategyTip && (
                      <div className="pt-2 border-t border-purple-900/30 text-xs text-amber-300/90 font-mono">
                        💡 Sınav Stratejisi: {currentQ.strategyTip}
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-purple-900/30">
                  <button
                    onClick={() => {
                      if (currentIndex > 0) {
                        setCurrentIndex(prev => prev - 1);
                        setShowPracticeExplanation(false);
                      }
                    }}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-obsidian-900 border border-purple-500/20 text-xs text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Önceki Soru</span>
                  </button>

                  <div className="flex items-center gap-3">
                    {examMode === 'practice' && !showPracticeExplanation && currentAnswer && (
                      <button
                        onClick={() => setShowPracticeExplanation(true)}
                        className="px-4 py-2 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-500/40 text-xs font-bold"
                      >
                        Cevabı Kontrol Et
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
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg transition-all"
                    >
                      <span>{currentIndex + 1 === totalQuestions ? 'Sınavı Tamamla' : 'Sonraki Soru'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* 80-Question Optical Matrix Navigator Grid */}
            {isOpticGridOpen && (
              <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-purple-500/30 space-y-4 max-h-[680px] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-purple-900/30 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    80 Soru Haritası
                  </h4>
                  <button
                    onClick={() => setIsOpticGridOpen(false)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono text-center">
                  <div className="p-1 rounded bg-purple-900/60 text-purple-200 border border-purple-500/30">
                    Cevaplandı ({Object.keys(userAnswers).filter(k => userAnswers[k]).length})
                  </div>
                  <div className="p-1 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                    İşaretli ({Object.keys(flaggedQuestions).filter(k => flaggedQuestions[k]).length})
                  </div>
                  <div className="p-1 rounded bg-obsidian-900 text-slate-400 border border-purple-900/30">
                    Boş ({totalQuestions - Object.keys(userAnswers).filter(k => userAnswers[k]).length})
                  </div>
                </div>

                {/* 1-80 Grid Matrix */}
                <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-1.5 pt-2">
                  {questions.map((q, idx) => {
                    const isAnswered = userAnswers[idx] !== undefined;
                    const ansLetter = userAnswers[idx];
                    const isCurrent = idx === currentIndex;
                    const flagged = flaggedQuestions[idx];

                    let cellStyle = "bg-obsidian-900 text-slate-400 border-purple-900/30 hover:border-purple-500/50";
                    if (isAnswered) {
                      cellStyle = "bg-purple-600 text-white font-bold border-purple-400 shadow-sm";
                    }
                    if (flagged) {
                      cellStyle += " ring-2 ring-amber-400";
                    }
                    if (isCurrent) {
                      cellStyle += " ring-2 ring-white scale-105";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setShowPracticeExplanation(false);
                        }}
                        className={`p-2 rounded-lg border text-xs font-mono flex flex-col items-center justify-center transition-all ${cellStyle}`}
                      >
                        <span>{idx + 1}</span>
                        {isAnswered && (
                          <span className="text-[9px] opacity-90">{ansLetter}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* 4. POST-EXAM RESULTS SCORECARD & DETAILED REVIEW */}
      {screenState === 'results' && (
        <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
          
          {/* Main Scorecard Header */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-500/40 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 mx-auto flex items-center justify-center shadow-lg shadow-purple-600/40">
              <Award className="w-8 h-8 text-white" />
            </div>

            <div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                {currentExamData?.meta.title}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                Sınav Performans Karnesi
              </h2>
            </div>

            {/* Score Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-purple-950/60 border border-purple-500/30 p-4 rounded-xl">
                <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">{ydsScore}</div>
                <div className="text-xs text-purple-200 mt-1">YDS / 100 Puan</div>
              </div>
              <div className="bg-emerald-950/60 border border-emerald-500/30 p-4 rounded-xl">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{correctCount}</div>
                <div className="text-xs text-emerald-200 mt-1">Doğru Sayısı</div>
              </div>
              <div className="bg-red-950/60 border border-red-500/30 p-4 rounded-xl">
                <div className="text-2xl sm:text-3xl font-black text-red-400 font-mono">{wrongCount}</div>
                <div className="text-xs text-red-200 mt-1">Yanlış Sayısı</div>
              </div>
              <div className="bg-obsidian-900 border border-purple-500/20 p-4 rounded-xl">
                <div className="text-2xl sm:text-3xl font-black text-slate-400 font-mono">{unansweredCount}</div>
                <div className="text-xs text-slate-300 mt-1">Boş Sayısı</div>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setScreenState('hub')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Deneme Listesine Dön</span>
              </button>
            </div>
          </div>

          {/* Question Review Section with Filter */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-900/30 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>Soruların Detaylı İncelemesi & Çözüm Anahtarı</span>
              </h3>

              <div className="flex items-center gap-1.5 text-xs font-mono">
                {['all', 'wrong', 'unanswered', 'flagged'].map((flt) => (
                  <button
                    key={flt}
                    onClick={() => setResultFilter(flt)}
                    className={`px-3 py-1 rounded-lg capitalize transition-all ${
                      resultFilter === flt
                        ? 'bg-purple-600 text-white'
                        : 'bg-obsidian-900 text-slate-400 hover:text-white border border-purple-500/20'
                    }`}
                  >
                    {flt === 'all' ? 'Tümü' : flt === 'wrong' ? 'Yanlışlar' : flt === 'unanswered' ? 'Boşlar' : 'İşaretliler'}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtered Questions List */}
            <div className="space-y-4">
              {filteredResultQuestions.map((q) => {
                const userAns = userAnswers[q.originalIdx];
                const isCorrect = userAns === q.correctAnswer;
                const isBlank = !userAns;

                return (
                  <div
                    key={q.id}
                    className="glass-panel p-5 rounded-2xl border border-purple-500/20 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-300">Soru {q.originalIdx + 1}</span>
                        <span className="text-slate-400">({q.sectionName})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCorrect && (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Doğru ({userAns})
                          </span>
                        )}
                        {!isCorrect && !isBlank && (
                          <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30 flex items-center gap-1">
                            <X className="w-3 h-3" /> Yanlış (Sen: {userAns} / Doğru: {q.correctAnswer})
                          </span>
                        )}
                        {isBlank && (
                          <span className="px-2 py-0.5 rounded bg-obsidian-900 text-slate-400 border border-purple-900/30">
                            Boş (Doğru: {q.correctAnswer})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-white">
                      {q.question}
                    </div>

                    {/* Options Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt) => (
                        <div
                          key={opt.key}
                          className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                            opt.key === q.correctAnswer
                              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                              : opt.key === userAns
                              ? 'bg-red-950/70 border-red-500 text-red-200'
                              : 'bg-obsidian-900/50 border-purple-900/20 text-slate-400'
                          }`}
                        >
                          <span className="font-mono font-bold">{opt.key})</span>
                          <span>{opt.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Detailed Explanation */}
                    <div className="bg-violet-950/40 border border-violet-500/30 p-4 rounded-xl text-xs text-slate-200 space-y-1">
                      <div className="font-bold text-purple-300 font-mono text-[11px]">ÇÖZÜM AÇIKLAMASI:</div>
                      <p className="leading-relaxed">{q.explanation}</p>
                      {q.strategyTip && (
                        <div className="text-amber-300/90 pt-1 font-mono text-[10px]">
                          💡 İpucu: {q.strategyTip}
                        </div>
                      )}
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
