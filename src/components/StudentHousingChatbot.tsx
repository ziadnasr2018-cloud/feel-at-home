import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Shield,
  GraduationCap,
  Minimize2,
} from 'lucide-react';
import { askCairoHousingAdvisor, ChatMessage } from '../services/gemini';

export const StudentHousingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: `Ahlan wa Sahlan! 👋 I am **Amm Gamal** (عم جمال), your Greater Cairo student housing mentor for **Feel at Home**.\n\nAsk me anything about finding apartments near your campus (Cairo Univ, Ain Shams, GUC, AUC, Benha), estimating commute times via the Metro, or reviewing lease contracts safely!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const botReply = await askCairoHousingAdvisor(messages, textToSend.trim());
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Best areas for Cairo University students?',
    'How do I avoid rental scams in Greater Cairo?',
    'Rooms near Ain Shams University & Metro Line 3',
    'What should I inspect in a Cairo flat before paying?',
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-amber-700 via-amber-600 to-orange-500 text-white p-3.5 rounded-full shadow-xl hover:scale-105 active:scale-95 transition flex items-center gap-2 cursor-pointer border-2 border-white/80"
          title="Chat with Amm Gamal (Cairo Housing Advisor)"
        >
          <Bot className="w-5 h-5" />
          <span className="text-xs font-bold hidden sm:inline">Ask Cairo Housing AI</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-stone-900 text-white p-4 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center font-bold text-white shadow-xs">
                <GraduationCap className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  Amm Gamal (عم جمال)
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                </h4>
                <p className="text-[10px] text-amber-300 font-medium">
                  Cairo Student Housing Mentor (Gemini 3.8)
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1 rounded-lg"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                    AG
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3 rounded-2xl leading-relaxed space-y-1 ${
                    m.sender === 'user'
                      ? 'bg-amber-600 text-white rounded-br-none shadow-xs'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span
                    className={`block text-[9px] text-right ${
                      m.sender === 'user' ? 'text-amber-200' : 'text-stone-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 font-bold text-[11px]">
                  AG
                </div>
                <div className="p-3 bg-white rounded-2xl border border-stone-200 text-stone-500 flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span>
                  <span>Amm Gamal is reviewing Cairo transit and maps...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-stone-100/90 border-t border-stone-200 flex gap-1.5 overflow-x-auto text-[10px]">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(undefined, qp)}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-900 rounded-lg border border-stone-200 whitespace-nowrap shrink-0 transition"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => handleSend(e)}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about areas, rents, metro stops, or contracts..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
