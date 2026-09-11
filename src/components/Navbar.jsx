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
  Globe 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMemory } from '../context/MemoryContext';

export default function Navbar() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { stats, vocabulary, dueWords } = useMemory();

  const navItems = [
    { path: '/', label: t.nav.dashboard, icon: Sparkles },
    { path: '/analyzer', label: t.nav.analyzer, icon: Split, badge: 'Smart' },
    { path: '/wordpool', label: t.nav.vault, icon: BrainCircuit, count: dueWords.length },
    { path: '/exams', label: t.nav.exams, icon: GraduationCap, badge: 'YDS/IELTS' },
    { path: '/grammar', label: t.nav.grammar, icon: BookOpen, badge: 'A1-C1' },
    { path: '/translator', label: t.nav.translator, icon: Languages },
    { path: '/bot', label: t.nav.bot, icon: Bot, badge: 'AI' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-violet-900/40 backdrop-blur-xl bg-obsidian-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Link */}
          <Link 
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-500 to-fuchsia-500 p-[1.5px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
              <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-violet-300 to-fuchsia-300">
                REMACHINE
              </span>
              <div className="text-[10px] font-mono tracking-widest text-purple-400/70 uppercase">
                Obsidian English Intelligence
              </div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-violet-900/50 text-purple-200 border border-purple-500/40 shadow-sm shadow-purple-500/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-obsidian-850/80 border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400 animate-pulse' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-fuchsia-600 text-white animate-bounce">
                          {item.count}
                        </span>
                      )}
                      {item.badge && !item.count && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-950/80 text-purple-300 border border-purple-500/20 font-mono">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Widgets & Language Switch */}
          <div className="flex items-center gap-3">
            {/* Streak & Memory status */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-obsidian-900/90 border border-purple-500/20 text-xs font-mono text-amber-400 shadow-inner">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{stats.streak} {t.common.days}</span>
            </div>

            <Link
              to="/wordpool"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-obsidian-900/90 border border-purple-500/20 text-xs font-mono text-purple-300 hover:border-purple-400 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>{vocabulary.length} {t.common.words}</span>
            </Link>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              title="Türkçe / English Toggle"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-950/70 hover:bg-violet-900/80 text-purple-200 border border-purple-500/30 text-xs font-semibold tracking-wide transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>{lang.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="md:hidden flex items-center overflow-x-auto py-2 space-x-1 border-t border-purple-900/30 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-violet-800/80 text-purple-100 border border-purple-400/50'
                      : 'text-slate-400 hover:text-slate-200 bg-obsidian-900/60'
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
