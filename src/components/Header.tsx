import React from "react";
import { Award, Briefcase, Calendar, ShieldCheck, Cpu } from "lucide-react";

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
          className="text-left font-serif text-lg md:text-xl font-bold tracking-widest text-brand-navy hover:opacity-90 transition-opacity flex items-center gap-2"
          id="brand-logo"
        >
          <Award className="w-5 h-5 text-brand-gold" />
          <span>PRESTIGE ADVISORY</span>
        </button>
        
        {/* Navigation Tabs */}
        <nav className="hidden md:flex gap-6 text-sm font-sans font-medium">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-2 py-1 transition-colors border-b-2 ${
              activeTab === "home" 
                ? "border-brand-navy text-brand-navy" 
                : "border-transparent text-gray-500 hover:text-brand-navy"
            }`}
            id="nav-home"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("expertise")}
            className={`px-2 py-1 transition-colors border-b-2 ${
              activeTab === "expertise" 
                ? "border-brand-navy text-brand-navy" 
                : "border-transparent text-gray-500 hover:text-brand-navy"
            }`}
            id="nav-expertise"
          >
            Expertise Hub
          </button>
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-2 py-1 transition-colors border-b-2 ${
              activeTab === "directory" 
                ? "border-brand-navy text-brand-navy" 
                : "border-transparent text-gray-500 hover:text-brand-navy"
            }`}
            id="nav-directory"
          >
            Advisors
          </button>
          <button
            onClick={() => setActiveTab("architect")}
            className={`px-2 py-1 flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === "architect" 
                ? "border-brand-gold text-brand-navy" 
                : "border-transparent text-gray-500 hover:text-brand-navy"
            }`}
            id="nav-architect"
          >
            <Cpu className="w-4 h-4 text-brand-gold" />
            Bespoke Architect
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenOnboarding}
            className="hidden sm:inline-flex bg-brand-navy text-white hover:bg-brand-navy-light px-4 py-2 rounded font-sans text-xs md:text-sm font-semibold tracking-wider transition-all shadow-sm active:scale-95"
            id="header-consult-btn"
          >
            Consult Now
          </button>
          <button
            onClick={() => setActiveTab("architect")}
            className="sm:hidden bg-brand-navy text-white p-2 rounded flex items-center justify-center transition-all active:scale-95"
            aria-label="Interactive Wealth Architect"
          >
            <Cpu className="w-5 h-5 text-brand-gold" />
          </button>
        </div>
      </div>
    </header>
  );
}
