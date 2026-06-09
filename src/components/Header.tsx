import React from "react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenOnboarding: () => void;
}

export default function Header({ activeTab, setActiveTab, onOpenOnboarding }: HeaderProps) {
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

        <button
          onClick={() => setActiveTab("contact")}
          className="bg-brand-navy text-white hover:bg-brand-navy-light px-5 py-2.5 font-sans text-xs font-medium tracking-[0.15em] uppercase transition-all rounded shadow-sm active:scale-95"
          id="header-contact-btn"
        >
          Contact
        </button>
      </div>
    </header>
  );
}
