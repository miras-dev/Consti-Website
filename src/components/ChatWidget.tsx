import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, RefreshCw } from "lucide-react";
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
        ? "Hallo! Ich bin Constantines Assistent. Wie kann ich Ihnen heute helfen?"
        : "Hi there! I'm Constantine's Assistant. How can I help you today?";

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

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.debug || errData.error || `HTTP ${response.status}`);
      }

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
      console.error("[ChatWidget] error:", err?.message);
      setChatLog((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "advisor",
          text: `[Debug] ${err?.message || "Unknown error"} — please share this with support.`,
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
        <div className="w-96 h-[80vh] bg-[#0f1623] border border-brand-gold/20 rounded-xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-fadeIn">
          {/* Header */}
          <div className="bg-[#0f1623] text-white p-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-brand-gold/50 bg-brand-gold/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-brand-gold" />
              </div>
              <div className="text-left">
                <h5 className="text-sm font-semibold text-white">{language === "de" ? "Constantines Assistent" : "Constantine's Assistant"}</h5>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                  <span className="text-[10px] text-gray-400">{language === "de" ? "Online" : "Online"}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 bg-[#151d2e] overflow-y-auto space-y-3.5 flex flex-col scrollbar-thin">
            {chatLog.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    isUser ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <span className="text-[8px] text-gray-500 mb-0.5 px-1">{msg.timestamp}</span>
                  <div
                    className={`p-3 rounded-lg text-xs leading-relaxed text-left whitespace-pre-line ${
                      isUser
                        ? "bg-brand-gold text-brand-navy font-medium rounded-br-none"
                        : "bg-[#1e2a3e] text-gray-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            {chatLoading && (
              <div className="self-start text-[10px] text-gray-500 italic flex items-center gap-1.5 px-1">
                <RefreshCw className="w-3 h-3 animate-spin text-brand-gold" />
                <span>{language === "de" ? "Schreibt..." : "Typing..."}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#0f1623] border-t border-white/10 flex gap-2 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={language === "de" ? "Stellen Sie eine Frage..." : "Ask a question..."}
              className="flex-1 border border-white/10 px-3.5 py-2.5 rounded-lg text-xs outline-none focus:border-brand-gold/50 bg-[#151d2e] text-gray-200 placeholder-gray-500"
              disabled={chatLoading}
            />
            <button
              type="submit"
              className="bg-brand-gold hover:brightness-110 text-brand-navy p-2.5 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
              disabled={chatLoading}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Automated assistant disclosure */}
          <div className="bg-[#0f1623] border-t border-white/5 py-1.5 px-3 text-center shrink-0">
            <span className="text-[9px] text-gray-600">
              {language === "de" ? "🤖 Automatisierter Assistent – kein Mensch" : "🤖 Automated assistant – not a human"}
            </span>
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
