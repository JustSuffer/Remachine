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
  Award, 
  Layers,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useMemory } from '../context/MemoryContext';
import { ydsQuestions, ieltsQuestions, generateAdaptiveQuiz } from '../data/examQuestions';

export default function ExamHub() {
  const { t } = useLanguage();
  const { vocabulary } = useMemory();

  const [activeTab, setActiveTab] = useState('yds'); // 'yds' | 'ielts' | 'adaptive'
  const [questions, setQuestions] = useState(ydsQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Switch tabs
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setIsExamCompleted(false);
    setIsTimerRunning(false);

    if (tabKey === 'yds') {
      setQuestions(ydsQuestions);
      setTimeRemaining(600);
    } else if (tabKey === 'ielts') {
      setQuestions(ieltsQuestions);
      setTimeRemaining(480);
    } else if (tabKey === 'adaptive') {
      const generated = generateAdaptiveQuiz(vocabulary);
      setQuestions(generated && generated.length > 0 ? generated : ydsQuestions);
      setTimeRemaining(300);
    }
  };

  // Timer countdown
  useEffect(() => {
    let timer;
    if (isTimerRunning && timeRemaining > 0 && !isExamCompleted) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !isExamCompleted) {
      setIsExamCompleted(true);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeRemaining, isExamCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (key) => {
    if (isExamCompleted) return;
    if (!isTimerRunning) setIsTimerRunning(true);
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: key }));
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishExam();
    }
  };

  const finishExam = () => {
    setIsExamCompleted(true);
    setIsTimerRunning(false);
    
    // Check score
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) correct++;
    });
    const percentage = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setShowExplanation(false);
    setIsExamCompleted(false);
    setCurrentIndex(0);
    setTimeRemaining(activeTab === 'yds' ? 600 : activeTab === 'ielts' ? 480 : 300);
    setIsTimerRunning(false);
    if (activeTab === 'adaptive') {
      const generated = generateAdaptiveQuiz(vocabulary);
      setQuestions(generated && generated.length > 0 ? generated : ydsQuestions);
    }
  };

  const currentQ = questions && questions[currentIndex] ? questions[currentIndex] : null;
  const userChoice = selectedAnswers[currentIndex];
  const isAnswered = userChoice !== undefined;

  // Calculate score stats
  let totalCorrect = 0;
  let totalWrong = 0;
  let totalUnanswered = 0;
  (questions || []).forEach((q, idx) => {
    if (selectedAnswers[idx] === undefined) {
      totalUnanswered++;
    } else if (selectedAnswers[idx] === q.correctAnswer) {
      totalCorrect++;
    } else {
      totalWrong++;
    }
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Tabs */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {t.exams.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {t.exams.subtitle}
              </p>
            </div>
          </div>

          {/* Exam Mode Tabs */}
          <div className="bg-obsidian-950 p-1 rounded-xl border border-purple-500/30 flex flex-wrap gap-1">
            <button
              onClick={() => handleTabChange('yds')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'yds'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.exams.ydsTab}
            </button>
            <button
              onClick={() => handleTabChange('ielts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ielts'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.exams.ieltsTab}
            </button>
            <button
              onClick={() => handleTabChange('adaptive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'adaptive'
                  ? 'bg-fuchsia-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.exams.adaptiveTab}</span>
            </button>
          </div>
        </div>

        {/* Status Bar: Time & Question Progress */}
        {!isExamCompleted && (
          <div className="flex items-center justify-between pt-3 border-t border-purple-900/30 text-xs">
            <div className="flex items-center gap-2 font-mono text-purple-300">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>
                {t.exams.question} {currentIndex + 1} {t.exams.of} {questions.length}
              </span>
            </div>

            <div className={`flex items-center gap-1.5 font-mono px-3 py-1 rounded-full border ${
              timeRemaining < 60 ? 'bg-red-950/80 border-red-500/50 text-red-300 animate-pulse' : 'bg-obsidian-900 border-purple-500/30 text-slate-300'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
        )}
      </div>

      {/* QUESTION ACTIVE CARD */}
      {!isExamCompleted && currentQ ? (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-500/30 space-y-6">
          
          {/* Question Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-purple-950 border border-purple-500/30 text-purple-300 font-bold">
                {currentQ.examType}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-obsidian-900 text-slate-300 border border-purple-900/40">
                {currentQ.category}
              </span>
            </div>
            <span className="text-xs font-mono text-amber-400">
              {currentQ.difficulty}
            </span>
          </div>

          {/* Reading passage if applicable */}
          {currentQ.passage && (
            <div className="bg-obsidian-900/90 border border-purple-500/30 p-5 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block">
                📖 IELTS Academic Reading Passage:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
                {currentQ.passage}
              </p>
            </div>
          )}

          {/* Question Stem */}
          <div className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {currentQ.question}
          </div>

          {/* Choices / Options */}
          <div className="space-y-2.5">
            {(currentQ.options || []).map((opt) => {
              const isSelected = userChoice === opt.key;
              const isCorrect = opt.key === currentQ.correctAnswer;
              
              let optionStyle = "bg-obsidian-900/80 border-purple-500/20 text-slate-200 hover:border-purple-400 hover:bg-obsidian-850";
              
              if (showExplanation) {
                if (isCorrect) {
                  optionStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-900/30";
                } else if (isSelected && !isCorrect) {
                  optionStyle = "bg-red-950/80 border-red-500 text-red-200";
                } else {
                  optionStyle = "bg-obsidian-950/50 border-transparent text-slate-500 opacity-60";
                }
              } else if (isSelected) {
                optionStyle = "bg-purple-900/60 border-purple-400 text-white shadow-md shadow-purple-950/50";
              }

              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelectOption(opt.key)}
                  className={`w-full text-left p-4 rounded-xl border flex items-start gap-3 transition-all ${optionStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-purple-600 text-white' : 'bg-obsidian-950 text-slate-400 border border-purple-500/20'
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

          {/* Explanation Box */}
          {showExplanation && (
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
                  💡 {t.exams.strategyTip}: {currentQ.strategyTip}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-900/30">
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex(prev => prev - 1);
                  setShowExplanation(false);
                }
              }}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl bg-obsidian-900 border border-purple-500/20 text-xs text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400"
            >
              {t.common.previous}
            </button>

            <div className="flex items-center gap-3">
              {!showExplanation && isAnswered && (
                <button
                  onClick={handleCheckAnswer}
                  className="px-4 py-2 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-500/40 text-xs font-bold transition-all"
                >
                  {t.exams.checkAnswer}
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all"
              >
                <span>{currentIndex + 1 === questions.length ? t.exams.finishExam : t.exams.nextQuestion}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      ) : null}

      {/* COMPLETED EXAM REPORT CARD */}
      {isExamCompleted && (
        <div className="glass-panel p-8 rounded-2xl border border-purple-500/40 space-y-6 text-center max-w-2xl mx-auto">
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 mx-auto flex items-center justify-center shadow-lg shadow-purple-600/40">
            <Award className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">
              {t.exams.resultsTitle}
            </h2>
            <p className="text-xs text-slate-300">
              {activeTab === 'yds' ? 'YDS / YÖKDİL Simülasyonu' : activeTab === 'ielts' ? 'IELTS Academic Simülasyonu' : 'Kişiselleştirilmiş Hafıza Quiz'}
            </p>
          </div>

          {/* Score Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-950/60 border border-emerald-500/30 p-4 rounded-xl">
              <div className="text-2xl font-black text-emerald-400 font-mono">{totalCorrect}</div>
              <div className="text-xs text-emerald-200 mt-1">{t.exams.correctAnswers}</div>
            </div>
            <div className="bg-red-950/60 border border-red-500/30 p-4 rounded-xl">
              <div className="text-2xl font-black text-red-400 font-mono">{totalWrong}</div>
              <div className="text-xs text-red-200 mt-1">{t.exams.wrongAnswers}</div>
            </div>
            <div className="bg-purple-950/60 border border-purple-500/30 p-4 rounded-xl">
              <div className="text-2xl font-black text-purple-300 font-mono">
                %{questions.length > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0}
              </div>
              <div className="text-xs text-purple-200 mt-1">{t.common.successRate}</div>
            </div>
          </div>

          {/* Action */}
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Testi Yeniden Başlat</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
