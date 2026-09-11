import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import VaporTurbulenceCanvas from './components/VaporTurbulenceCanvas';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import SentenceAnalyzer from './pages/SentenceAnalyzer';
import VocabVault from './pages/VocabVault';
import ExamHub from './pages/ExamHub';
import GrammarCompendium from './pages/GrammarCompendium';
import Translator from './pages/Translator';
import AiTutor from './pages/AiTutor';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { MemoryProvider } from './context/MemoryContext';

function MainAppRoutes() {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen flex flex-col bg-obsidian-950 text-slate-100 font-sans selection:bg-purple-600 selection:text-white">
      {/* Interactive Obsidian & Deep Purple Vapor Turbulence Canvas */}
      <VaporTurbulenceCanvas />

      {/* Foreground Content Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analyzer" element={<SentenceAnalyzer />} />
              <Route path="/wordpool" element={<VocabVault />} />
              <Route path="/vault" element={<Navigate to="/wordpool" replace />} />
              <Route path="/exams" element={<ExamHub />} />
              <Route path="/grammar" element={<GrammarCompendium />} />
              <Route path="/translator" element={<Translator />} />
              <Route path="/bot" element={<AiTutor />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <footer className="w-full glass-panel border-t border-purple-900/30 py-6 mt-12 bg-obsidian-950/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300">
                REMACHINE
              </span>
              <span>— {t.appSubtitle}</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>SM-2 Memory Protocol</span>
              <span>•</span>
              <span>YDS & IELTS Engine</span>
              <span>•</span>
              <span>Obsidian Core</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <MemoryProvider>
          <MainAppRoutes />
        </MemoryProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
