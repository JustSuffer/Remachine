import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Volume2, 
  User, 
  RotateCcw,
  Sparkles,
  MessageSquare,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMemory } from '../context/MemoryContext';
import { initialBotMessages, generateBotResponse } from '../utils/aiBotEngine';

export default function AiTutor() {
  const { t } = useLanguage();
  const { speakText } = useMemory();

  const [selectedPersona, setSelectedPersona] = useState('ielts');
  const [messages, setMessages] = useState(initialBotMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const personas = [
    { id: 'ielts', label: 'IELTS Examiner', sub: 'Speaking & Writing Band 8+' },
    { id: 'yds', label: 'YDS Mentoru', sub: 'Gramer & Soru Taktikleri' },
    { id: 'casual', label: 'Konuşma Partneri', sub: 'Doğal İfade & Hata Düzeltme' },
    { id: 'academic', label: 'Akademik Koç', sub: 'C1/C2 Makale & Kelime Zenginleştirme' }
  ];

  const quickPrompts = [
    { text: "I am agree with the policy despite of some risks.", label: "Gramer Analizi Denemesi" },
    { text: "Could you ask me a Band 8.0 IELTS Speaking Part 3 question on technology?", label: "IELTS Speaking Simülasyonu" },
    { text: "YDS'de zıtlık bağlaçlarını çözerken dikkat edilmesi gereken en kritik 3 kural nedir?", label: "YDS Bağlaç Taktikleri" }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateBotResponse(text, selectedPersona);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 500);
  };

  const handleClearChat = () => {
    setMessages(initialBotMessages);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Header & Persona Selector */}
      <div className="surface-card p-5 sm:p-6 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-white">
              {t.bot.title}
            </h1>
            <p className="text-xs text-zinc-400">
              {t.bot.subtitle}
            </p>
          </div>

          <button
            onClick={handleClearChat}
            className="p-1.5 px-2.5 rounded-lg bg-obsidian-900 border border-white/[0.08] text-zinc-400 hover:text-white text-xs font-mono flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Sohbeti Sıfırla</span>
          </button>
        </div>

        {/* Persona Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/[0.06]">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPersona(p.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPersona === p.id
                  ? 'bg-brand-950/80 border-brand-500/50 shadow-sm'
                  : 'bg-obsidian-900 text-zinc-400 border-white/[0.06] hover:border-white/[0.15]'
              }`}
            >
              <div className={`text-xs font-bold ${selectedPersona === p.id ? 'text-brand-200' : 'text-zinc-200'}`}>
                {p.label}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5 leading-snug">
                {p.sub}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Workspace */}
      <div className="surface-card rounded-2xl flex flex-col h-[580px] overflow-hidden shadow-elevated">
        
        {/* Messages */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono ${
                  isBot ? 'bg-brand-950 text-brand-300 border border-brand-500/40' : 'bg-obsidian-850 text-zinc-400 border border-white/[0.1]'
                }`}>
                  {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                <div className="space-y-2">
                  <div className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                    isBot 
                      ? 'bg-obsidian-900/90 border border-white/[0.08] text-zinc-100' 
                      : 'bg-brand-600 text-white'
                  }`}>
                    <div className="whitespace-pre-line font-sans">{msg.text}</div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06] text-[10px] text-zinc-500 font-mono">
                      <span>{msg.timestamp}</span>
                      {isBot && (
                        <button
                          onClick={() => speakText(msg.text)}
                          className="text-zinc-400 hover:text-white p-0.5"
                          title={t.common.listen}
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Feedback Card */}
                  {msg.feedback && (
                    <div className="bg-obsidian-900 border border-amber-500/30 p-3 rounded-xl space-y-1 text-xs animate-fadeIn">
                      <div className="flex items-center justify-between text-amber-300 font-mono text-[11px] font-bold">
                        <span>Linguistics Feedback</span>
                        {msg.feedback.bandScore && (
                          <span className="text-[10px] text-zinc-400">{msg.feedback.bandScore}</span>
                        )}
                      </div>
                      <div className="text-zinc-200">
                        <span className="text-zinc-500">Öneri: </span>
                        {msg.feedback.correction}
                      </div>
                      <div className="text-[11px] text-zinc-400 italic">
                        {msg.feedback.rule}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-brand-400 font-mono">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Koç yanıt hazırlıyor...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-obsidian-950/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-mono">
          <span className="text-[11px] text-zinc-500 shrink-0">Hızlı Sorular:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.text)}
              className="px-2.5 py-1 rounded-lg bg-obsidian-900 hover:bg-obsidian-800 text-zinc-400 hover:text-white border border-white/[0.06] text-[11px] whitespace-nowrap transition-colors"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-obsidian-950 border-t border-white/[0.06]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="İngilizce veya Türkçe bir şey yazın..."
              className="flex-1 surface-input rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-glow-violet transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
