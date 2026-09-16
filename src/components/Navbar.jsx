import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Sparkles, 
  BrainCircuit, 
  Split, 
  GraduationCap, 
  BookOpen, 
  Languages, 
  Bot, 
  Flame, 
  Layers, 
  Globe,
  Compass
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMemory } from '../context/MemoryContext';

export default function Navbar() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { stats, vocabulary, dueWords } = useMemory();

  const navItems = [
    { path: '/', label: t.nav.dashboard, icon: Compass },
    { path: '/analyzer', label: t.nav.analyzer, icon: Split },
    { path: '/wordpool', label: t.nav.vault, icon: BrainCircuit, count: dueWords.length },
    { path: '/exams', label: t.nav.exams, icon: GraduationCap, badge: '10 Deneme' },
    { path: '/grammar', label: t.nav.grammar, icon: BookOpen, badge: 'A1-C1' },
    { path: '/translator', label: t.nav.translator, icon: Languages },
    { path: '/bot', label: t.nav.bot, icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-obsidian-950/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand */}
          <Link 
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-950 border border-brand-500/30 flex items-center justify-center text-brand-300 shadow-subtle group-hover:border-brand-400/60 transition-colors">
              <BrainCircuit className="w-4 h-4 text-brand-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black tracking-wider text-slate-100 uppercase">
                Remachine
              </span>
              <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                Intelligence
              </span>
            </div>
          </Link>

          {/* Nav Items (Segmented Control Aesthetic) */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-obsidian-900/90 rounded-xl border border-white/[0.06]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-950 text-brand-200 border border-brand-500/40 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-400' : 'text-zinc-500'}`} />
                      <span>{item.label}</span>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full bg-brand-600 text-white">
                          {item.count}
                        </span>
                      )}
                      {item.badge && !item.count && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-obsidian-800 text-zinc-400 border border-white/[0.05] font-mono">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Metrics & Switch */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-obsidian-900 border border-white/[0.06] text-xs font-mono text-amber-300">
              <Flame className="w-3.5 h-3.5 fill-amber-400/20 text-amber-400" />
              <span>{stats.streak} {t.common.days}</span>
            </div>

            <Link
              to="/wordpool"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-obsidian-900 border border-white/[0.06] text-xs font-mono text-zinc-300 hover:border-brand-500/40 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-brand-400" />
              <span>{vocabulary.length} {t.common.words}</span>
            </Link>

            <button
              onClick={toggleLanguage}
              title="Türkçe / English Toggle"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-obsidian-900 hover:bg-obsidian-850 text-zinc-300 border border-white/[0.08] hover:border-white/[0.2] text-xs font-mono font-semibold transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>{lang.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center overflow-x-auto py-2 space-x-1 border-t border-white/[0.06] scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-brand-950 text-brand-200 border border-brand-500/40'
                      : 'text-zinc-400 hover:text-zinc-200 bg-obsidian-900/60'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

      </div>
    </header>
  );
}
