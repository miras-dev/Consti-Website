import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Landmark, ShieldCheck, RefreshCw } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface ChatMessage {
  id: string;
  sender: "user" | "advisor";
  text: string;
  timestamp: string;
}

export default function ChatWidget() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting based on language
  useEffect(() => {
    if (!isOpen) return;
    
    const greetingText =
      language === "de"
        ? "Guten Tag, ich bin Markus von Preußen, Senior-Vermögensberater bei Prestige Advisory. Wie kann ich Ihnen heute bei Ihrer Finanzplanung, Steuerstrukturierung oder Indexallokation behilflich sein?"
        : "Hello, I am Markus von Preußen, Senior Wealth Director at Prestige Advisory. How may I assist you today regarding our financial planning, tax structuring, or index compounding services?";

    setChatLog([
      {
        id: "greeting",
        sender: "advisor",
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  }, [language, isOpen]);

  // Scroll to bottom when log updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, chatLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatLog((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatLog.filter(m => m.id !== "greeting"), userMsg].map(m => ({
            sender: m.sender,
            text: m.text
          })),
          context: {
            name: "Valued Client",
            assets: 1500000,
            goal: "Capital Governance",
            specialty: "Comprehensive Advice"
          },
          lang: language
        })
      });

      if (!response.ok) throw new Error("Advisor network error.");

      const data = await response.json();

      setChatLog((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "advisor",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setChatLog((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "advisor",
          text: t("chat.mockFallback"),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end font-sans">
      {/* Floating Chat Box Window */}
      {isOpen && (
        <div className="w-96 h-[480px] bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-fadeIn">
          {/* Header */}
          <div className="bg-brand-navy text-white p-4 flex items-center justify-between border-b border-white/5 shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-brand-gold bg-brand-gold/10 flex items-center justify-center shrink-0">
                <span className="font-serif font-extrabold text-brand-gold text-xs">MP</span>
              </div>
              <div className="text-left">
                <h5 className="font-serif text-xs font-bold text-brand-gold">{t("chat.seniorPartner")}</h5>
                <div className="flex items-center gap-1 text-[8px] text-emerald-400 font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping shrink-0" />
                  <span>{t("chat.securedLine")}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 bg-[#f8fafc] overflow-y-auto space-y-3.5 flex flex-col scrollbar-thin">
            {chatLog.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    isUser ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <span className="text-[8px] text-gray-400 mb-0.5 px-1">{msg.timestamp}</span>
                  <div
                    className={`p-3 rounded text-xs leading-relaxed text-left whitespace-pre-line shadow-xs ${
                      isUser
                        ? "bg-brand-navy text-white rounded-br-none"
                        : "bg-white text-gray-700 border border-gray-100 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            {chatLoading && (
              <div className="self-start text-[10px] text-gray-400 italic flex items-center gap-1.5 px-1">
                <RefreshCw className="w-3 h-3 animate-spin text-brand-gold" />
                <span>{t("chat.loadingStatus")}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex gap-2 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={t("chat.inputPlaceholder")}
              className="flex-1 border border-gray-200 px-3.5 py-2.5 rounded-lg text-xs outline-none focus:border-brand-navy bg-gray-50 text-gray-700"
              disabled={chatLoading}
            />
            <button
              type="submit"
              className="bg-brand-navy hover:bg-brand-navy-light text-white p-2.5 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              disabled={chatLoading}
            >
              <Send className="w-4 h-4 text-brand-gold" />
            </button>
          </form>

          {/* Footer Audited Note */}
          <div className="bg-gray-50 border-t border-gray-100 py-1.5 px-3 flex items-center justify-center gap-1 shrink-0">
            <ShieldCheck className="w-3 h-3 text-brand-gold" />
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-semibold">BaFin Compliance Secure</span>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-brand-navy text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-brand-gold/30 group"
        title="Consult Markus"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-brand-gold group-hover:rotate-90 transition-transform" />
        ) : (
          <MessageSquare className="w-6 h-6 text-brand-gold animate-pulse" />
        )}
      </button>
    </div>
  );
}
