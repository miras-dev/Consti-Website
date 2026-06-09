import React from "react";
import { ArrowRight, ChevronRight, Award, Shield, FileText, Sparkles, Building2, TrendingUp, Users } from "lucide-react";

interface HeroProps {
  onStartArchitect: () => void;
  onViewServices: () => void;
  onViewAdvisors: () => void;
}

export default function Hero({ onStartArchitect, onViewServices, onViewAdvisors }: HeroProps) {
  return (
    <div className="bg-white">
      {/* Hero Core */}
      <section className="relative pt-12 pb-16 md:py-24 px-5 overflow-hidden border-b border-border-subtle" id="hero-section">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text / Actions */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 z-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold-light border border-brand-gold/20 rounded">
              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-ping" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                Strategic Excellence
              </span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-brand-navy leading-tight tracking-tight max-w-2xl">
              Institutional Trust,<br />
              <span className="italic font-normal text-brand-gold">Bespoke Insights.</span>
            </h1>
            
            <p className="font-sans text-base md:text-lg text-gray-500 max-w-xl leading-relaxed">
              Navigating global markets with absolute precision. We provide sophisticated custody structures, localized tax mapping, and private wealth architecture for corporate entities and multi-generational family estates.
            </p>
            
            {/* CTA action cluster */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onStartArchitect}
                className="w-full sm:w-auto bg-brand-navy hover:bg-brand-navy-light text-white py-4 px-8 rounded font-sans text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 group transition-all duration-300 shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                id="hero-explore-btn"
              >
                Launch Wealth Architect
                <ArrowRight className="w-4 h-4 text-brand-gold group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onViewServices}
                className="w-full sm:w-auto border border-brand-gold text-brand-navy hover:bg-brand-gold-light py-4 px-8 rounded font-sans text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300"
                id="hero-cases-btn"
              >
                Explore Expertise Hub
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100 max-w-lg">
              <div>
                <p className="font-serif text-2xl font-bold text-brand-navy">€12.4B</p>
                <p className="font-sans text-[11px] text-gray-400 capitalize tracking-wider font-semibold">Assets Advised</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-brand-navy">BaFin</p>
                <p className="font-sans text-[11px] text-gray-400 capitalize tracking-wider font-semibold">Fully Regulated</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-brand-navy">99.2%</p>
                <p className="font-sans text-[11px] text-gray-400 capitalize tracking-wider font-semibold">Retain Rate</p>
              </div>
            </div>
          </div>

          {/* Right Floating Sculpture / Interactive Metric Board */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[350px] md:min-h-[450px]">
            {/* Abstract Floating Circles matching HTML placeholder */}
            <div className="absolute inset-0 bg-radial-gradient from-brand-gold-light/40 to-transparent opacity-60 z-0 rounded-full" />
            
            {/* Floating golden geometric widget */}
            <div className="w-72 h-72 rounded-full border border-brand-gold/10 flex items-center justify-center animate-soft-float relative z-10">
              <div className="w-56 h-56 rounded-full border border-brand-gold/25 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border border-brand-navy/10 flex items-center justify-center bg-white shadow-xl relative">
                  
                  {/* Floating asset balance preview */}
                  <div className="absolute -top-4 -right-12 bg-white/95 backdrop-blur border border-brand-gold/30 rounded p-3 shadow-lg max-w-[140px] text-left animate-soft-float delay-700">
                    <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+12.4% ARR</span>
                    </div>
                    <p className="font-sans text-[11px] text-gray-600 mt-1">Core ESG Portfolio</p>
                  </div>

                  <div className="absolute -bottom-6 -left-8 bg-brand-navy text-white rounded p-3 shadow-lg text-left max-w-[150px]">
                    <p className="font-sans text-[10px] uppercase text-brand-gold tracking-widest font-bold">Tax Yield</p>
                    <p className="font-serif text-xs font-semibold mt-1">Spezialfonds Active Shield</p>
                  </div>

                  {/* Icon centering */}
                  <Award className="w-16 h-16 text-brand-gold animate-slow-spin-reverse" />
                </div>
              </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-10 right-4 w-12 h-12 border border-brand-gold/20 rounded-full animate-pulse delay-500" />
            <div className="absolute bottom-16 right-12 w-6 h-6 bg-brand-gold/10 rounded-full animate-bounce" />
          </div>

        </div>
      </section>

      {/* Trust Quote Bar */}
      <section className="bg-brand-navy text-white py-12 px-5 relative overflow-hidden" id="trust-banner">
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <blockquote className="font-serif text-lg md:text-xl italic text-brand-gold-light leading-relaxed">
            "We don't believe in generic advice. Every portfolio we build is a permanent reflection of individual family legacy, corporate sovereignty, and focused growth targets."
          </blockquote>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-brand-gold font-bold">
            — Prestige Board of Directors
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 border-brand-gold/5 border rounded-full transform translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 border-brand-gold/5 border rounded-full transform -translate-x-20 translate-y-20" />
      </section>
    </div>
  );
}
