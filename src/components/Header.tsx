import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenOnboarding: () => void;
}

export default function Header({ activeTab, setActiveTab, onOpenOnboarding }: HeaderProps) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-border-subtle h-16 transition-all">
      <div className="flex justify-between items-center h-full px-5 max-w-7xl mx-auto">
        <button
          onClick={() => setActiveTab("home")}
          className="text-left font-serif text-xl md:text-2xl tracking-[0.12em] text-brand-navy hover:opacity-80 transition-opacity" style={{ fontWeight: 600 }}
          id="brand-logo"
        >
          Constantine Nixdorff
        </button>

        <div className="flex items-center gap-4">
          {/* Sliding Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="relative flex items-center bg-gray-100 hover:bg-gray-200/80 border border-transparent hover:border-gray-200 rounded-full p-0.5 w-16 h-8 cursor-pointer select-none transition-all active:scale-95 duration-300"
            title={language === "en" ? "Wechseln zu Deutsch" : "Switch to English"}
          >
            <div 
              className={`absolute top-0.5 bottom-0.5 rounded-full bg-brand-navy text-white w-[28px] shadow-md flex items-center justify-center font-sans text-[10px] font-bold tracking-wider transition-all duration-300 ${
                language === "de" ? "left-[calc(100%-30px)]" : "left-0.5"
              }`}
            >
              {language.toUpperCase()}
            </div>
            <div className="flex justify-between w-full px-2.5 text-[9px] font-bold text-gray-400 select-none">
              <span>EN</span>
              <span>DE</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("contact")}
            className="bg-brand-navy text-white hover:bg-brand-navy-light px-5 py-2.5 font-sans text-xs font-medium tracking-[0.15em] uppercase transition-all rounded shadow-sm active:scale-95"
            id="header-contact-btn"
          >
            {t("header.contact")}
          </button>
        </div>
      </div>
    </header>
  );
}

