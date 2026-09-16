import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  BrainCircuit, 
  Split, 
  GraduationCap, 
  Bot, 
  BookOpen, 
  Volume2, 
  Flame, 
  TrendingUp, 
  ArrowRight, 
  Clock, 
  Languages, 
  Sparkles,
  Layers,
  CheckCircle2
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
      badge: 'Syntax Parser'
    },
    {
      path: '/wordpool',
      title: t.dashboard.action2Title,
      desc: t.dashboard.action2Desc,
      icon: BrainCircuit,
      badge: `${dueWords.length} ${t.common.dueForReview}`,
      highlight: dueWords.length > 0
    },
    {
      path: '/exams',
      title: '10 Deneme Sınavı',
      desc: '80 soruluk gerçek YDS, YÖKDİL ve IELTS deneme simülasyonları.',
      icon: GraduationCap,
      badge: '800 Soru Havuzu'
    },
    {
      path: '/translator',
      title: 'Canlı Çeviri & Otomasyon',
      desc: 'Yazarken gerçek zamanlı nöral çeviri, otomatik hafıza havuzu entegrasyonu.',
      icon: Languages,
      badge: 'Canlı Motor'
    },
    {
      path: '/grammar',
      title: 'A1 - C1 Grammar Atlası',
      desc: '12 zaman, modallar, devrik yapılar ve sınav tuzakları kütüphanesi.',
      icon: BookOpen,
      badge: '10 Kategori'
    },
    {
      path: '/bot',
      title: t.dashboard.action4Title,
      desc: t.dashboard.action4Desc,
      icon: Bot,
      badge: 'Band 8+ Koç'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Welcome Card */}
      <div className="surface-card p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Spaced Repetition & Exam Simulator Active</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t.dashboard.welcome}
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed">
            {t.dashboard.welcomeDesc}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/wordpool"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-semibold shadow-glow-violet transition-all"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Tekrarları Başlat ({dueWords.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/exams"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 text-zinc-200 border border-white/[0.1] hover:border-white/[0.2] text-xs sm:text-sm font-semibold transition-all"
            >
              <GraduationCap className="w-4 h-4 text-brand-400" />
              <span>Deneme Sınavı Seç</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        <div className="surface-card p-4 sm:p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>{t.common.streak}</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats.streak} <span className="text-xs font-normal text-zinc-500">{t.common.days}</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Kesintisiz çalışma serisi</p>
          </div>
        </div>

        <Link to="/wordpool" className="surface-card surface-card-hover p-4 sm:p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>{t.common.totalWords}</span>
            <Layers className="w-4 h-4 text-brand-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {vocabulary.length}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">{masteredWords.length} kelime kalıcı hafızada</p>
          </div>
        </Link>

        <Link to="/wordpool" className="surface-card surface-card-hover p-4 sm:p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>{t.common.dueForReview}</span>
            <Clock className="w-4 h-4 text-brand-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-300 font-mono">
              {dueWords.length}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Gözden geçirme bekleyenler</p>
          </div>
        </Link>

        <div className="surface-card p-4 sm:p-5 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>{t.dashboard.retentionRate}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              %{stats.accuracyRate}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">SRS ve test başarı oranı</p>
          </div>
        </div>

      </div>

      {/* Tools & Modules Grid */}
      <div className="space-y-3.5">
        <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-2">
          <span>Modüller ve Çalışma Alanları</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.path}
                className="surface-card surface-card-hover p-5 rounded-xl flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-obsidian-900 border border-white/[0.08] flex items-center justify-center text-brand-300 group-hover:border-brand-400/40 group-hover:bg-brand-950 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border ${
                      action.highlight 
                        ? 'bg-brand-950 text-brand-300 border-brand-500/40' 
                        : 'bg-obsidian-900 text-zinc-400 border-white/[0.06]'
                    }`}>
                      {action.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-100 group-hover:text-brand-200 transition-colors mt-4">
                    {action.title}
                  </h3>

                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 group-hover:text-zinc-300 font-mono">
                  <span>Aç</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recently Added Vocabulary Preview */}
      <div className="surface-card p-5 sm:p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-400" />
            <span>{t.dashboard.recentWords}</span>
          </h2>
          <Link
            to="/wordpool"
            className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-mono"
          >
            <span>{t.common.all}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {vocabulary.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="bg-obsidian-900/80 p-3.5 rounded-lg border border-white/[0.06] hover:border-white/[0.15] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-100">{item.word}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      speakText(item.word);
                    }}
                    className="p-1 text-zinc-500 hover:text-brand-300 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-brand-400/80 font-mono mt-0.5">{item.ipa}</div>
                <div className="text-xs text-zinc-300 mt-2 line-clamp-2">{item.meaningTr}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span className="px-1.5 py-0.5 rounded bg-obsidian-800 text-zinc-400">
                  {item.level || 'B2'}
                </span>
                <span>
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
