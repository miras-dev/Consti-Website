import React, { useState } from "react";
import { 
  Building, ShieldAlert, FileText, Send, User, ChevronRight, Landmark, RefreshCw, Cpu, CheckCircle, Sparkles, MessageSquare, Compass, BarChart3, Receipt, Calendar, ArrowRight, UserCheck
} from "lucide-react";
import { AdviceReport, ChatMessage } from "../types";
import { useLanguage } from "../contexts/LanguageContext";

interface WealthArchitectProps {
  initialSpecialty?: string;
  setActiveTab: (tab: string) => void;
}

export default function WealthArchitect({ initialSpecialty, setActiveTab }: WealthArchitectProps) {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>(t("architect.initializing"));
  
  // Form states
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [assets, setAssets] = useState<number>(1500000);
  const [riskTolerance, setRiskTolerance] = useState<string>("Adaptive Moderate Yield Optimized");
  const [goal, setGoal] = useState<string>("Strict Capital Wealth Preservation");
  const [regionalContext, setRegionalContext] = useState<string>("Germany (BaFin Protected Assets)");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    initialSpecialty ? [initialSpecialty] : ["Financial Planning", "Tax Optimization"]
  );

  // Generated advice state
  const [report, setReport] = useState<AdviceReport | null>(null);

  // Chat states
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  const specialtiesOptions = [
    "Financial Planning",
    "Investment & ETFs",
    "Retirement Planning",
    "Insurance Analysis",
    "Career Coaching",
    "Tax Optimization",
    "Salary Negotiation",
    "Internationals in Germany",
    "Sustainable Investing"
  ];

  const keyMap: Record<string, string> = {
    "Financial Planning": "module.planning.title",
    "Investment & ETFs": "module.investment.title",
    "Retirement Planning": "module.retirement.title",
    "Insurance Analysis": "module.insurance.title",
    "Career Coaching": "module.career.title",
    "Tax Optimization": "module.tax.title",
    "Salary Negotiation": "module.salary.title",
    "Internationals in Germany": "module.international.title",
    "Sustainable Investing": "module.sustainable.title",
  };

  const toggleSpecialty = (spec: string) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };

  const executeAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) {
      alert(language === "de" ? "Bitte geben Sie den Kundennamen an, um die Legacy-Validierungsprotokolle zu initiieren." : "Please specify client name to initialize legacy validation protocols.");
      return;
    }
    
    setLoading(true);
    
    const steps = language === "de" ? [
      "Sichere Übertragungsleitung wird aufgebaut...",
      "Kapitalpoolindizes werden strukturiert...",
      "Europäische Steuerschilde & BaFin-Compliance-Raster werden bewertet...",
      "SFDR Artikel 9 ESG-Mandate mit hoher Überzeugung werden ausgerichtet...",
      "Abschließender maßgeschneiderter strategischer Architekturbericht wird zusammengestellt..."
    ] : [
      "Establishing secure transmission line...",
      "Structuring capital pool indices...",
      "Evaluating European tax shields & BaFin compliance grids...",
      "Aligning SFDR Article 9 ESG high-conviction mandates...",
      "Compiling final bespoke strategic architecture report..."
    ];

    let currentStep = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setLoadingStep(steps[currentStep]);
      }
    }, 1300);

    try {
      const response = await fetch("/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clientName,
          assets,
          riskTolerance,
          goal,
          timeHorizon: 15,
          regionalContext,
          specialtiesSelected: selectedSpecialties,
          lang: language // Pass current active language
        })
      });

      if (!response.ok) {
        throw new Error("Advisory report compilation failed.");
      }

      const reportData: AdviceReport = await response.json();
      clearInterval(interval);
      setReport(reportData);
      
      // Initialize chat session with the senior advisor
      setChatLog([
        {
          id: "welcome",
          sender: "advisor",
          text: language === "de" 
            ? `Willkommen, ${clientName}. Ich habe Ihr Vermögensprofil sorgfältig geprüft. Die Neustrukturierung von €${assets.toLocaleString()} erfordert absolute Hingabe. Basierend auf Ihrem Ziel "${t(
                "architect.objOption" + (goal === "Strict Capital Wealth Preservation" ? "1" : goal === "Aggressive Compound Alternative Accumulation" ? "2" : goal === "Generational Legacy Estate Sinking Shield" ? "3" : "4")
              )}" unter der Gerichtsbarkeit von ${regionalContext} stellen unsere vorgeschlagene globale Allokation und die strategischen Steuerschilde den absolut neuesten Stand der Kapitalsicherung dar. Bitte sagen Sie mir, welche Anlageklassen oder Meilensteine Sie zuerst prüfen möchten?`
            : `Welcome, ${clientName}. I have carefully audited your wealth profile. Restructuring €${assets.toLocaleString()} requires absolute sovereign dedication. Based on your target goal of "${goal}" under ${regionalContext} jurisdiction, our recommended core global allocation and strategic structural tax shields represent the absolute state of the art in capital preservation dynamics. Please tell me, what primary assets or timeline milestones would you like to examine first?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setStep(4);
    } catch (error) {
      console.error(error);
      clearInterval(interval);
      alert(language === "de" 
        ? "Wir haben eine geringfügige Kommunikationsverzögerung mit dem BaFin-Validierungsserver festgestellt. Sicherer Ladevorgang wird wiederholt..." 
        : "We encountered a minor communication lag with the BaFin validation server. Retrying secure load...");
    } finally {
      setLoading(false);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatLog(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const chatHistory = [...chatLog, userMsg];
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          context: {
            name: clientName,
            assets,
            goal,
            riskTolerance,
            specialty: selectedSpecialties.map(s => t(keyMap[s] || s)).join(", ")
          },
          lang: language // Pass active language context to chat model
        })
      });

      if (!response.ok) {
        throw new Error("Advisor response failed.");
      }

      const data = await response.json();
      
      setChatLog(prev => [...prev, {
        id: Math.random().toString(),
        sender: "advisor",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error(err);
      setChatLog(prev => [...prev, {
        id: Math.random().toString(),
        sender: "advisor",
        text: t("chat.mockFallback"),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const resetArchitect = () => {
    setReport(null);
    setChatLog([]);
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-12" id="architect-workspace">
      
      {/* Onboarding Wizard Loading Screen */}
      {loading && (
        <div className="min-h-[450px] flex flex-col items-center justify-center space-y-6 text-center animate-pulse" id="loading-overlay">
          <div className="w-16 h-16 rounded-full border-2 border-brand-gold border-t-brand-navy animate-spin" />
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-brand-navy">{t("architect.loadingTitle")}</h3>
            <p className="font-sans text-xs text-brand-gold uppercase tracking-widest font-semibold">{loadingStep}</p>
          </div>
        </div>
      )}

      {/* STEP 1: Personal Details & Location */}
      {!loading && step === 1 && (
        <div className="bg-white border border-border-subtle p-8 rounded shadow-sm space-y-6 animate-fadeIn" id="wizard-step-1">
          <div className="space-y-2 text-center border-b border-gray-100 pb-5">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">{t("architect.step1")}</span>
            <h2 className="font-serif text-2xl font-bold text-brand-navy">{t("architect.setupTitle")}</h2>
            <p className="font-sans text-xs text-gray-500">{t("architect.setupDesc")}</p>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                {t("architect.nameLabel")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={t("architect.namePlaceholder")}
                  className="w-full bg-background-soft border border-gray-200 pl-10 pr-4 py-3 rounded text-sm outline-none focus:border-brand-navy text-brand-navy font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                {t("architect.emailLabel")}
              </label>
              <input 
                type="email" 
                value={clientEmail} 
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder={t("architect.emailPlaceholder")}
                className="w-full bg-background-soft border border-gray-200 px-4 py-3 rounded text-sm outline-none focus:border-brand-navy text-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                {t("architect.jurisdictionLabel")}
              </label>
              <select
                value={regionalContext}
                onChange={(e) => setRegionalContext(e.target.value)}
                className="w-full bg-background-soft border border-gray-200 px-4 py-3 rounded text-sm outline-none focus:border-brand-navy font-medium text-brand-navy"
              >
                <option value="Germany (BaFin Protected Assets)">{t("architect.jurOption1")}</option>
                <option value="Switzerland (FINMA Protected Portfolios)">{t("architect.jurOption2")}</option>
                <option value="Luxembourg (CSSF Sovereign Mutual Support)">{t("architect.jurOption3")}</option>
                <option value="Global Offshore Alignment">{t("architect.jurOption4")}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-brand-navy hover:bg-brand-navy-light text-white font-sans text-xs font-bold tracking-wider uppercase px-6 py-4 rounded flex items-center gap-2 transform active:scale-95 transition-all"
            >
              {t("architect.continueBtn")}
              <ChevronRight className="w-4 h-4 text-brand-gold" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Portfolio Capital Pools */}
      {!loading && step === 2 && (
        <div className="bg-white border border-border-subtle p-8 rounded shadow-sm space-y-6 animate-fadeIn" id="wizard-step-2">
          <div className="space-y-2 text-center border-b border-gray-100 pb-5">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">{t("architect.step2")}</span>
            <h2 className="font-serif text-2xl font-bold text-brand-navy">{t("architect.capitalTitle")}</h2>
            <p className="font-sans text-xs text-gray-500">{t("architect.capitalDesc")}</p>
          </div>

          <div className="space-y-6 text-left">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t("architect.assetRangeLabel")}
                </label>
                <span className="text-sm font-serif font-bold text-brand-gold">
                  €{assets.toLocaleString()}
                </span>
              </div>
              <input 
                type="range" 
                min="100000" 
                max="10000000" 
                step="50000" 
                value={assets} 
                onChange={(e) => setAssets(Number(e.target.value))}
                className="w-full accent-brand-gold cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-sans">
                <span>€100k</span>
                <span>€5M</span>
                <span>€10M+</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {t("architect.objectiveLabel")}
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-background-soft border border-gray-200 px-4 py-3 rounded text-sm outline-none focus:border-brand-navy font-medium text-brand-navy"
                >
                  <option value="Strict Capital Wealth Preservation">{t("architect.objOption1")}</option>
                  <option value="Aggressive Compound Alternative Accumulation">{t("architect.objOption2")}</option>
                  <option value="Generational Legacy Estate Sinking Shield">{t("architect.objOption3")}</option>
                  <option value="Tax preferred ESG Compound Returns">{t("architect.objOption4")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {t("architect.riskLabel")}
                </label>
                <select
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value)}
                  className="w-full bg-background-soft border border-gray-200 px-4 py-3 rounded text-sm outline-none focus:border-brand-navy font-medium text-brand-navy"
                >
                  <option value="Low Volatility Capital Defensive">{t("architect.riskOption1")}</option>
                  <option value="Adaptive Moderate Yield Optimized">{t("architect.riskOption2")}</option>
                  <option value="High Conviction Tactical Active Apex">{t("architect.riskOption3")}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <button
              onClick={() => setStep(1)}
              className="border border-gray-300 text-gray-500 hover:text-brand-navy py-3 px-6 rounded font-sans text-xs font-semibold uppercase transition-all"
            >
              {t("architect.prevStep")}
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-brand-navy hover:bg-brand-navy-light text-white font-sans text-xs font-bold tracking-wider uppercase px-6 py-4 rounded flex items-center gap-2 transform active:scale-95 transition-all"
            >
              {t("architect.configureFocus")}
              <ChevronRight className="w-4 h-4 text-brand-gold" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Selecting Advisory Focus & Execute */}
      {!loading && step === 3 && (
        <form onSubmit={executeAnalysis} className="bg-white border border-border-subtle p-8 rounded shadow-sm space-y-6 animate-fadeIn" id="wizard-step-3">
          <div className="space-y-2 text-center border-b border-gray-100 pb-5">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">{t("architect.step3")}</span>
            <h2 className="font-serif text-2xl font-bold text-brand-navy">{t("architect.focusTitle")}</h2>
            <p className="font-sans text-xs text-gray-500">{t("architect.focusDesc")}</p>
          </div>

          <div className="space-y-4 text-left">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t("architect.lensesLabel")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {specialtiesOptions.map((spec) => {
                const isSelected = selectedSpecialties.includes(spec);
                const specLabel = t(keyMap[spec] || spec);
                return (
                  <button
                    type="button"
                    key={spec}
                    onClick={() => toggleSpecialty(spec)}
                    className={`p-3 border rounded text-xs font-bold text-left transition-all ${
                      isSelected 
                        ? "bg-brand-navy text-white border-brand-navy shadow-inner" 
                        : "bg-background-soft text-gray-700 border-gray-200 hover:border-brand-navy"
                    }`}
                  >
                    {specLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="border border-gray-300 text-gray-500 hover:text-brand-navy py-3 px-6 rounded font-sans text-xs font-semibold uppercase transition-all"
            >
              {t("architect.prevStep")}
            </button>
            <button
              type="submit"
              className="bg-brand-navy hover:bg-brand-navy-light text-white font-sans text-xs font-bold tracking-wider uppercase px-8 py-4 rounded flex items-center gap-2 transform active:scale-95 transition-all shadow-md"
              id="submit-profiler-btn"
            >
              <Sparkles className="w-4 h-4 text-brand-gold" />
              {t("architect.submitBtn")}
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Beautiful Private Bank Strategic Report Presentation */}
      {!loading && step === 4 && report && (
        <div className="space-y-12 animate-fadeIn" id="generated-report-view">
          
          {/* Header Action Row */}
          <div className="flex justify-between items-center bg-brand-navy text-white px-5 py-4 rounded shadow-sm">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-brand-gold" />
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-brand-gold">{t("report.bannerProtocol")}</span>
            </div>
            <button
              onClick={resetArchitect}
              className="text-xs uppercase hover:text-brand-gold transition-colors font-sans flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              {t("report.resetBtn")}
            </button>
          </div>

          {/* Letter / Private Report Sheet */}
          <div className="bg-white border border-brand-gold/20 p-8 md:p-12 rounded shadow-md relative overflow-hidden" id="report-sheet">
            
            {/* Watermark Element */}
            <div className="absolute top-10 right-10 opacity-5 pointer-events-none select-none">
              <Building className="w-64 h-64 text-brand-navy" />
            </div>

            {/* Document Header */}
            <div className="border-b border-gray-100 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <p className="font-serif text-2xl font-black tracking-tight text-brand-navy">PRESTIGE ADVISORY</p>
                <p className="font-sans text-[10px] text-gray-400 capitalize tracking-widest font-bold">ZURICH • LONDON • BERLIN • NEW YORK</p>
              </div>
              <div className="text-right text-xs space-y-1 font-sans font-medium text-gray-500">
                <p>{t("report.date")} {new Date().toLocaleDateString(language === "de" ? "de-DE" : "en-GB")}</p>
                <p>{t("report.auditRef")} #PA-{Math.floor(Math.random() * 900000 + 100000)}</p>
                <p className="font-bold text-brand-gold text-[10px] uppercase">{t("report.confidential")}</p>
              </div>
            </div>

            {/* Formal Greeting Letter Block */}
            <div className="pt-8 space-y-4">
              <p className="font-serif text-lg font-bold text-brand-navy text-left">{t("report.proposalTitle")}</p>
              <p className="font-sans text-sm text-gray-600 leading-relaxed text-left whitespace-pre-wrap">
                {report.clientGreeting}
              </p>
            </div>

            {/* INTERACTIVE ASSET ALLOCATION SEGMENT */}
            <div className="pt-10 space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <BarChart3 className="w-5 h-5 text-brand-gold" />
                <h4 className="font-serif text-base font-bold text-brand-navy uppercase tracking-wider">{t("report.allocationTitle")}</h4>
              </div>

              {/* Advanced Custom React Interactive allocation visualizer */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
                
                {/* Horizontal segment bars */}
                <div className="md:col-span-7 space-y-4">
                  {report.assetAllocation.map((item, index) => {
                    const colors = [
                      "bg-brand-navy",
                      "bg-brand-gold",
                      "bg-brand-navy-light",
                      "bg-amber-300"
                    ];
                    const selectedColor = colors[index % colors.length];
                    return (
                      <div key={item.assetClass} className="space-y-1 text-left" id={`allocation-bar-${index}`}>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-sans font-bold text-gray-700">{item.assetClass}</span>
                          <span className="font-serif font-semibold text-brand-navy">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${selectedColor}`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <p className="font-sans text-[11px] text-gray-400">{language === "de" ? "Begründung" : "Rationale"}: {item.rationale}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Pie value box */}
                <div className="md:col-span-5 bg-background-soft p-5 rounded border border-gray-100 space-y-4 text-center flex flex-col justify-center">
                  <p className="font-sans text-xs uppercase tracking-widest text-brand-gold font-bold">{t("report.consolidatedPool")}</p>
                  <div>
                    <p className="text-3xl font-serif font-black text-brand-navy">€{assets.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">{t("report.allReallocated")}</p>
                  </div>
                  <div className="w-full bg-white px-3 py-2 rounded border border-gray-100 text-xs text-gray-500 font-sans italic text-center">
                    {t("report.esgIndex")}
                  </div>
                </div>

              </div>
            </div>

            {/* STRATEGIC PILLARS GRID */}
            <div className="pt-12 space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Compass className="w-5 h-5 text-brand-gold" />
                <h4 className="font-serif text-base font-bold text-brand-navy uppercase tracking-wider text-left">{t("report.pillarsTitle")}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.strategicPillars.map((pillar, idx) => (
                  <div key={idx} className="border-l-4 border-brand-gold bg-background-soft p-5 rounded text-left space-y-3 shadow-2xs">
                    <h5 className="font-serif text-sm font-bold text-brand-navy">{pillar.title}</h5>
                    <p className="font-sans text-xs text-gray-500 leading-relaxed">{pillar.description}</p>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">{t("report.actionableDeployment")}</p>
                      <ul className="space-y-1">
                        {pillar.steps.map((step, sIdx) => (
                          <li key={sIdx} className="font-sans text-xs text-gray-600 flex items-start gap-1.5">
                            <span className="text-brand-gold mt-1">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REGIONAL TACTICS */}
            <div className="pt-12 space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Receipt className="w-5 h-5 text-brand-gold" />
                <h4 className="font-serif text-base font-bold text-brand-navy uppercase tracking-wider text-left">{t("report.tacticsTitle")}</h4>
              </div>

              <div className="space-y-4">
                {report.regionalTactics.map((tac, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-start border-b border-gray-100 pb-3 text-left">
                    <div className="md:col-span-1">
                      <span className="font-serif text-xs font-bold text-brand-navy">{tac.name}</span>
                    </div>
                    <div className="md:col-span-3">
                      <p className="font-sans text-xs text-gray-500 leading-relaxed">{tac.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TIMELINE PHASES */}
            <div className="pt-12 space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <Calendar className="w-5 h-5 text-brand-gold" />
                <h4 className="font-serif text-base font-bold text-brand-navy uppercase tracking-wider text-left">{t("report.timelineTitle")}</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {report.timelinePhases.map((phase, idx) => (
                  <div key={idx} className="bg-background-soft p-5 border border-border-subtle rounded text-left space-y-2">
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="font-serif text-xs font-bold text-brand-navy">{phase.phase}</span>
                      <span className="font-sans text-[10px] bg-brand-gold-light text-brand-gold px-2 py-0.5 rounded font-bold uppercase">{phase.duration}</span>
                    </div>
                    <ul className="space-y-1">
                      {phase.actions.map((act, aIdx) => (
                        <li key={aIdx} className="font-sans text-[11px] text-gray-500 flex items-start gap-1.5">
                          <CheckCircle className="w-3 h-3 text-brand-gold mt-0.5 shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Regulatory Footer / Disclaimer */}
            <div className="border-t border-gray-100 pt-8 mt-12 text-center">
              <ShieldAlert className="w-5 h-5 leading-none mx-auto text-gray-400 mb-2" />
              <p className="font-sans text-[10px] text-gray-400 leading-relaxed max-w-2xl mx-auto italic">
                {report.disclaimer}
              </p>
            </div>

          </div>

          {/* EMBEDDED REAL AI ADVISORY CHAT BANNER */}
          <section className="bg-white border border-brand-gold/20 rounded shadow-md overflow-hidden" id="advisor-interface">
            
            {/* Header banner */}
            <div className="bg-brand-navy text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-brand-gold bg-brand-gold-light flex items-center justify-center shrink-0">
                  <span className="font-serif font-extrabold text-brand-navy text-sm">MP</span>
                </div>
                <div className="text-left">
                  <h5 className="font-serif text-sm font-bold text-brand-gold">{t("chat.seniorPartner")}</h5>
                  <p className="font-sans text-[10px] text-gray-300">{t("chat.activeSession")}</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold uppercase font-sans">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span>{t("chat.securedLine")}</span>
              </div>
            </div>

            {/* Chat message panel */}
            <div className="p-6 bg-background-soft/60 h-72 overflow-y-auto space-y-4 flex flex-col">
              {chatLog.map((msg, index) => {
                const isUser = msg.sender === "user";
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-lg ${
                      isUser ? "self-end items-end" : "self-start items-start"
                    }`}
                    id={`chat-msg-${index}`}
                  >
                    <span className="text-[9px] text-gray-400 mb-0.5 ">{msg.timestamp}</span>
                    <div className={`p-4 rounded text-xs leading-relaxed text-left ${
                      isUser 
                        ? "bg-brand-navy text-white rounded-br-none" 
                        : "bg-white text-gray-700 border border-border-subtle rounded-bl-none"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              {chatLoading && (
                <div className="self-start text-[11px] text-gray-400 italic">
                  {t("chat.loadingStatus")}
                </div>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendChatMessage} className="p-4 bg-white border-t flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={t("chat.inputPlaceholder")}
                className="flex-1 border px-4 py-3 rounded text-xs outline-none focus:border-brand-navy"
                disabled={chatLoading}
              />
              <button
                type="submit"
                className="bg-brand-navy hover:bg-brand-navy-light text-white font-sans text-xs font-bold tracking-wider uppercase px-5 py-3 rounded flex items-center gap-1.5"
                disabled={chatLoading}
              >
                <span>{t("chat.transmit")}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </section>

        </div>
      )}

    </div>
  );
}
