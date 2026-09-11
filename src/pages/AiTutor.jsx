import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  RotateCcw,
  Zap,
  Lightbulb
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMemory } from '../context/MemoryContext';
import { initialBotMessages, generateBotResponse } from '../utils/aiBotEngine';

export default function AiTutor() {
  const { t } = useLanguage();
  const { speakText } = useMemory();

  const [selectedPersona, setSelectedPersona] = useState('ielts'); // 'ielts' | 'yds' | 'casual' | 'academic'
  const [messages, setMessages] = useState(initialBotMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const personas = [
    { id: 'ielts', label: t.bot.ieltsPersona, icon: '🎙️' },
    { id: 'yds', label: t.bot.ydsPersona, icon: '🎓' },
    { id: 'casual', label: t.bot.casualPersona, icon: '☕' },
    { id: 'academic', label: t.bot.academicPersona, icon: '💼' }
  ];

  const quickPrompts = [
    { text: "I am agree with the policy despite of some risks.", label: "Gramer Düzeltme Denemesi" },
    { text: "Could you ask me a Band 8.0 IELTS Speaking Part 3 question on technology?", label: "IELTS Speaking Simülasyonu" },
    { text: "YDS'de zıtlık bağlaçlarını çözerken en çok yapılan tuzaklar nelerdir?", label: "YDS Taktik Sorusu" }
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
    }, 600);
  };

  const handleClearChat = () => {
    setMessages(initialBotMessages);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
              <Bot className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {t.bot.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {t.bot.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 rounded-lg bg-obsidian-900 border border-purple-500/20 hover:border-purple-400 text-slate-400 hover:text-white text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sohbeti Sıfırla</span>
          </button>
        </div>

        {/* Persona Switcher Pills */}
        <div className="flex items-center overflow-x-auto py-1 space-x-2 border-t border-purple-900/30 pt-3">
          <span className="text-xs font-semibold text-purple-300 mr-2 shrink-0">{t.bot.personaSelect}</span>
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPersona(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedPersona === p.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-obsidian-900/80 text-slate-400 hover:text-white border border-purple-500/20'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="glass-panel rounded-2xl border border-purple-500/30 flex flex-col h-[560px] overflow-hidden shadow-2xl">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isBot ? 'bg-purple-600/30 border border-purple-500/40 text-purple-300' : 'bg-fuchsia-600/30 border border-fuchsia-500/40 text-fuchsia-300'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble & Feedback */}
                <div className="space-y-2">
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isBot 
                      ? 'bg-obsidian-900/90 border border-purple-500/20 text-slate-100 rounded-tl-sm' 
                      : 'bg-purple-600 text-white rounded-tr-sm shadow-md'
                  }`}>
                    <div className="whitespace-pre-line font-sans">{msg.text}</div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-900/30 text-[10px] text-slate-400 font-mono">
                      <span>{msg.timestamp}</span>
                      {isBot && (
                        <button
                          onClick={() => speakText(msg.text)}
                          className="text-slate-400 hover:text-purple-300 p-0.5"
                          title={t.common.listen}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Real-time Grammatical Feedback Card (if coach detected issues/tips) */}
                  {msg.feedback && (
                    <div className="bg-amber-950/40 border border-amber-500/40 p-3.5 rounded-xl space-y-1.5 text-xs animate-fadeIn">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.bot.feedbackTitle}</span>
                        {msg.feedback.bandScore && (
                          <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-amber-900/60 font-mono text-amber-200">
                            {msg.feedback.bandScore}
                          </span>
                        )}
                      </div>

                      <div className="text-amber-100/90 font-medium">
                        <span className="text-slate-400">Öneri: </span>
                        {msg.feedback.correction}
                      </div>

                      <div className="text-[11px] text-amber-200/80 italic">
                        {msg.feedback.rule}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-purple-400 font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>AI Dil Koçu yanıt hazırlıyor...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 border-t border-purple-900/30 bg-obsidian-950/70 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-purple-400 shrink-0">Hızlı Pratik:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.text)}
              className="px-2.5 py-1 rounded-md bg-obsidian-900 hover:bg-violet-950 text-slate-300 hover:text-purple-200 border border-purple-500/20 text-[11px] whitespace-nowrap transition-colors"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-obsidian-950 border-t border-purple-900/40">
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
              placeholder={t.bot.inputPlaceholder}
              className="flex-1 bg-obsidian-900 border border-purple-500/30 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
