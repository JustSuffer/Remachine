import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  BrainCircuit, 
  Split, 
  GraduationCap, 
  Bot, 
  BookOpen, 
  Volume2, 
  Flame, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Languages
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMemory } from '../context/MemoryContext';

export default function Dashboard() {
  const { t } = useLanguage();
  const { vocabulary, dueWords, masteredWords, stats, speakText } = useMemory();

  const quickActions = [
    {
      path: '/analyzer',
      title: t.dashboard.action1Title,
      desc: t.dashboard.action1Desc,
      icon: Split,
      tag: 'Morphology',
      tagColor: 'text-purple-300 bg-purple-950/60'
    },
    {
      path: '/wordpool',
      title: t.dashboard.action2Title,
      desc: t.dashboard.action2Desc,
      icon: BrainCircuit,
      tag: `${dueWords.length} ${t.common.dueForReview}`,
      tagColor: 'text-fuchsia-300 bg-fuchsia-950/60 animate-pulse'
    },
    {
      path: '/exams',
      title: t.dashboard.action3Title,
      desc: t.dashboard.action3Desc,
      icon: GraduationCap,
      tag: 'YDS • IELTS',
      tagColor: 'text-indigo-300 bg-indigo-950/60'
    },
    {
      path: '/translator',
      title: 'Canlı Otomatik Çevirmen',
      desc: 'Yazarken gerçek zamanlı çeviri yapın, kelimeleri otomatik havuzunuza aktarın.',
      icon: Languages,
      tag: 'Canlı Nöral Çeviri',
      tagColor: 'text-emerald-300 bg-emerald-950/60'
    },
    {
      path: '/grammar',
      title: 'A1-C1 Grammar Atlası',
      desc: 'Tüm zamanlar, modallar, devrik yapılar ve sınav tuzakları kütüphanesi.',
      icon: BookOpen,
      tag: 'Tüm Konular',
      tagColor: 'text-amber-300 bg-amber-950/60'
    },
    {
      path: '/bot',
      title: t.dashboard.action4Title,
      desc: t.dashboard.action4Desc,
      icon: Bot,
      tag: 'Band 8+ Feedback',
      tagColor: 'text-violet-300 bg-violet-950/60'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-purple-500/30 shadow-2xl shadow-purple-950/40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-900/60 border border-violet-500/40 text-xs font-mono text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            <span>Remachine Memory & Intelligence Core</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t.dashboard.welcome}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.dashboard.welcomeDesc}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/translator"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-200"
            >
              <Languages className="w-4 h-4" />
              <span>Canlı Çevirmene Git</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/wordpool"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-obsidian-900/90 hover:bg-obsidian-850 text-purple-200 border border-purple-500/30 text-sm font-semibold hover:border-purple-400 transition-all duration-200"
            >
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span>Kelime Havuzu ({dueWords.length})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-xl border border-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.common.streak}</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              {stats.streak} <span className="text-sm font-normal text-slate-400">{t.common.days}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Hafıza serisini koruyorsun</p>
          </div>
        </div>

        <Link to="/wordpool" className="glass-panel p-5 rounded-xl border border-purple-500/20 flex flex-col justify-between hover:border-purple-400 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.common.totalWords}</span>
            <BrainCircuit className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono">
              {vocabulary.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{masteredWords.length} kelime kalıcı hafızada</p>
          </div>
        </Link>

        <Link to="/wordpool" className="glass-panel p-5 rounded-xl border border-purple-500/20 flex flex-col justify-between hover:border-purple-400 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.common.dueForReview}</span>
            <Clock className="w-4 h-4 text-fuchsia-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-fuchsia-400 font-mono">
              {dueWords.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Bugün tekrar bekleyenler</p>
          </div>
        </Link>

        <div className="glass-panel p-5 rounded-xl border border-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.dashboard.retentionRate}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              %{stats.accuracyRate}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Sınav ve SRS başarı oranı</p>
          </div>
        </div>

      </div>

      {/* Recommended Action Pathways */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>{t.dashboard.recommendedAction}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.path}
                className="glass-panel glass-panel-hover p-5 rounded-xl border border-purple-500/20 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-obsidian-900 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-200 transition-colors">
                        {action.title}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${action.tagColor}`}>
                        {action.tag}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {action.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recently Added Vocabulary Preview */}
      <div className="glass-panel p-6 rounded-xl border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
            <span>{t.dashboard.recentWords}</span>
          </h2>
          <Link
            to="/wordpool"
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
          >
            <span>{t.common.all}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {vocabulary.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="bg-obsidian-900/80 p-3.5 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-purple-200">{item.word}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(item.word);
                    }}
                    className="p-1 text-slate-400 hover:text-purple-300 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[11px] text-purple-400/80 font-mono mt-0.5">{item.ipa}</div>
                <div className="text-xs text-slate-300 mt-2 line-clamp-2">{item.meaningTr}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-purple-900/30 flex items-center justify-between text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 font-mono">
                  {item.level || 'B2'}
                </span>
                <span className="text-slate-400">
                  {item.interval}g tekrar
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
