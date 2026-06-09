import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ExpertiseHub from "./components/ExpertiseHub";
import WealthArchitect from "./components/WealthArchitect";
import ConsultantDirectory from "./components/ConsultantDirectory";
import Footer from "./components/Footer";
import { Calendar, Compass, ShieldCheck } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [initialSpecialty, setInitialSpecialty] = useState<string | undefined>(undefined);

  const handleStartArchitectWithSpecialty = (specialty: string) => {
    setInitialSpecialty(specialty);
    setActiveTab("architect");
    // Scroll smoothly to top when switching tab
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-gray-800 font-sans flex flex-col selection:bg-brand-gold-light selection:text-brand-navy">
      
      {/* Premium Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleNavigation} 
        onOpenOnboarding={() => handleNavigation("architect")} 
      />

      {/* Main Container */}
      <main className="flex-1 pt-16">
        
        {/* TAB 1: Overview and Brand Landing */}
        {activeTab === "home" && (
          <div className="animate-fadeIn">
            <Hero 
              onStartArchitect={() => handleNavigation("architect")} 
              onViewServices={() => handleNavigation("expertise")} 
              onViewAdvisors={() => handleNavigation("directory")} 
            />
            
            {/* Elegant Mid-page Showcase */}
            <section className="bg-white py-16 px-5 border-b border-border-subtle text-left">
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="font-sans text-[10px] font-bold text-brand-gold uppercase tracking-[0.25em]">
                    Institutional Rigor
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-brand-navy">
                    Fully BaFin Regulated Asset Custody Guards
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-gray-500 leading-relaxed">
                    All client assets are partitioned under strict legal protections. By registering as Sondervermögen (special-purpose assets), your core capital pool is structurally immune to credit threats, corporate litigation risks, or vendor-side disputes.
                  </p>
                </div>
                
                <div className="bg-background-soft p-6 rounded border border-gray-100 flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-navy/5 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-brand-gold" />
                    </div>
                    <span className="font-serif text-sm font-bold text-brand-navy">Capital Insurance Integration</span>
                  </div>
                  <p className="font-sans text-xs text-gray-400">
                    Sovereign-funded banking partnerships with top-tier deposit systems provide structural security thresholds far exceeding baseline European guidelines.
                  </p>
                </div>
              </div>
            </section>

            {/* Embedded Expertise Hub under overview to give premium infinite scroll experience */}
            <ExpertiseHub onTriggerAdvisor={handleStartArchitectWithSpecialty} />
          </div>
        )}

        {/* TAB 2: Specialized Expertise Hub Alone */}
        {activeTab === "expertise" && (
          <ExpertiseHub onTriggerAdvisor={handleStartArchitectWithSpecialty} />
        )}

        {/* TAB 3: Interactive Wealth Architect Onboarding Wizard */}
        {activeTab === "architect" && (
          <WealthArchitect 
            initialSpecialty={initialSpecialty} 
            setActiveTab={handleNavigation} 
          />
        )}

        {/* TAB 4: Certified Consultant Scheduling Directory */}
        {activeTab === "directory" && (
          <ConsultantDirectory />
        )}

      </main>

      {/* Global Regulatory Footer */}
      <Footer />

      {/* Mobile Sticky Consultation CTA matching original design specs */}
      <div className="fixed bottom-0 left-0 w-full p-5 z-40 md:hidden pointer-events-none">
        <div className="w-full h-16 pointer-events-auto shadow-xl">
          <button
            onClick={() => handleNavigation("directory")}
            className="w-full h-full bg-brand-navy text-white hover:bg-brand-navy-light rounded-lg font-sans text-xs font-bold tracking-[0.2em] flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform border border-brand-gold/30"
            id="mobile-sticky-cta"
          >
            <Calendar className="w-4 h-4 text-brand-gold animate-bounce" />
            SCHEDULE PRIVATE BRIEFING
          </button>
        </div>
      </div>

    </div>
  );
}
