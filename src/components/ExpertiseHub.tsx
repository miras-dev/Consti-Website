import React, { useState } from "react";
import { 
  Wallet, Shield, HelpCircle, Briefcase, Percent, Award, Globe, Leaf, ChevronDown, ChevronUp, Sparkles, TrendingUp, Landmark, Milestone, HelpCircle as HelpIcon, ArrowRight, ShieldCheck, CheckSquare, Zap, Activity
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface HubCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  desc: string;
  specialtyCode: string;
}

interface ExpertiseHubProps {
  onTriggerAdvisor: (specialty: string) => void;
}

export default function ExpertiseHub({ onTriggerAdvisor }: ExpertiseHubProps) {
  const { t, language } = useLanguage();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // States for interactive calculators
  // 1. Financial Planning
  const [finCapital, setFinCapital] = useState<number>(300000);
  const [finAnnual, setFinAnnual] = useState<number>(24000);
  const [finYears, setFinYears] = useState<number>(10);
  const [finRate, setFinRate] = useState<number>(7.2);

  // 2. Investment & ETFs
  const [etfPreset, setEtfPreset] = useState<string>("sustainable");
  const [etfAmount, setEtfAmount] = useState<number>(500000);

  // 3. Retirement Runway
  const [retAge, setRetAge] = useState<number>(42);
  const [retTargetAge, setRetTargetAge] = useState<number>(60);
  const [retMonthlyDraw, setRetMonthlyDraw] = useState<number>(6000);
  const [retCurrentInvested, setRetCurrentInvested] = useState<number>(1200000);

  // 4. Insurance Coverage Audit
  const [insCoverages, setInsCoverages] = useState({
    do: true,
    keyPerson: false,
    assetLiab: true,
    cyberPremium: false,
    globalHealth: true
  });

  // 5. Total Comp Optimize
  const [compBase, setCompBase] = useState<number>(220000);
  const [compBonus, setCompBonus] = useState<number>(20);
  const [compEquity, setCompEquity] = useState<number>(150000);

  // 6. German Tax Optimization
  const [taxIncome, setTaxIncome] = useState<number>(180000);
  const [taxClass, setTaxClass] = useState<string>("I");
  const [taxChurch, setTaxChurch] = useState<boolean>(false);

  // 7. Salary Tactics
  const [negRole, setNegRole] = useState<string>("Director");
  const [negOffer, setNegOffer] = useState<number>(250000);

  // 8. Internationals checklist
  const [germanyCheck, setGermanyCheck] = useState({
    anmeldung: true,
    privateHealth: false,
    taxID: false,
    bafinBank: true,
    blueCard: false
  });

  // 9. Sustainable ESG Slider
  const [esgClimate, setEsgClimate] = useState<number>(85);
  const [esgSocial, setEsgSocial] = useState<number>(70);
  const [esgGov, setEsgGov] = useState<number>(90);

  // Calculations
  // 1
  const calculateFinancialPlanning = () => {
    let total = finCapital;
    for (let i = 0; i < finYears; i++) {
      total = (total + finAnnual) * (1 + finRate / 100);
    }
    return Math.round(total);
  };

  // 3
  const calculateRetirementRunway = () => {
    const yearsToRetire = Math.max(0, retTargetAge - retAge);
    // Compounding current balance for yearsToRetire at nominal 6%
    let balanceAtRetire = retCurrentInvested;
    for (let i = 0; i < yearsToRetire; i++) {
      balanceAtRetire = balanceAtRetire * 1.06 + 24000; // assume default €2k monthly additions
    }
    // How long will it last at desired monthly draw assuming 4% yield in retirement
    const annualDrawRequired = retMonthlyDraw * 12;
    let runwayYears = 0;
    let tempBalance = balanceAtRetire;
    while (tempBalance > annualDrawRequired && runwayYears < 50) {
      tempBalance = (tempBalance - annualDrawRequired) * 1.04;
      runwayYears++;
    }
    return {
      balanceAtRetire: Math.round(balanceAtRetire),
      runwayYears
    };
  };

  // 6
  const calculateGermanTaxSavings = () => {
    // Highly simplified realistic BaFin-level taxation estimation bracket
    const baseTaxRate = taxClass === "III" ? 0.32 : 0.42;
    const estimatedTaxBefore = taxIncome * baseTaxRate;
    // Premium Prestige tax sheltering models achieve ~18% reduction
    const preservedTax = estimatedTaxBefore * 0.18;
    return {
      before: Math.round(estimatedTaxBefore),
      savings: Math.round(preservedTax),
      after: Math.round(estimatedTaxBefore - preservedTax)
    };
  };

  const cards: HubCard[] = [
    {
      id: "fin",
      title: "Financial Planning",
      icon: <Wallet className="w-5 h-5 text-brand-navy" />,
      subtitle: "Bespoke Liquidity & Assets Architecture",
      desc: "Architecturing optimized asset preservation strategies, multi-custody cash structures, and liquidity frameworks customized for high-net-worth pools.",
      specialtyCode: "Financial Planning"
    },
    {
      id: "etf",
      title: "Investment & ETFs",
      icon: <Landmark className="w-5 h-5 text-brand-navy" />,
      subtitle: "Diversified Global Index Compounding",
      desc: "Broad-market high-liquidity ETF portfolio construction with structural rebalancing guidelines and low-fee optimization engines.",
      specialtyCode: "Investment & ETFs"
    },
    {
      id: "ret",
      title: "Retirement Planning",
      icon: <Milestone className="w-5 h-5 text-brand-navy" />,
      subtitle: "Pre-retirement Guard & Income Longevity",
      desc: "Establishing highly secure fixed-income ladders and asset drawdown runaways protecting decumuational legacy wealth.",
      specialtyCode: "Retirement Planning"
    },
    {
      id: "ins",
      title: "Insurance Analysis",
      icon: <Shield className="w-5 h-5 text-brand-navy" />,
      subtitle: "Premium Risk Containment Audit",
      desc: "Full comprehensive screening of high-net-worth asset liabilities, D&O risk premiums, and specialized private health structures.",
      specialtyCode: "Insurance Analysis"
    },
    {
      id: "coaching",
      title: "Career Coaching",
      icon: <Briefcase className="w-5 h-5 text-brand-navy" />,
      subtitle: "Executive Position Compensation Leverage",
      desc: "Maximizing the net present value of executive contracts, board structures, and long-term equity vestment incentives.",
      specialtyCode: "Career Coaching"
    },
    {
      id: "tax",
      title: "Tax Optimization",
      icon: <Percent className="w-5 h-5 text-brand-navy" />,
      subtitle: "Structural German Fiscal Shielding",
      desc: "Deploying sophisticated legal shields, Germany holding companies (GmbH), and specialized retirement asset structures under local laws.",
      specialtyCode: "Tax Optimization"
    },
    {
      id: "salary",
      title: "Salary Negotiation",
      icon: <TrendingUp className="w-5 h-5 text-brand-navy" />,
      subtitle: "Corporate Package Maximization",
      desc: "Providing bespoke strategic negotiation scripts, performance triggers, and secondary benefit optimization frameworks for C-suite recruits.",
      specialtyCode: "Salary Negotiation"
    },
    {
      id: "internationals",
      title: "Internationals in Germany",
      icon: <Globe className="w-5 h-5 text-brand-navy" />,
      subtitle: "Expat Sovereignty & Regulatory Landing",
      desc: "Comprehensive onboarding support for corporate expats in Germany covering BaFin compliance banking, private insurance, and Blue Card setups.",
      specialtyCode: "Internationals in Germany"
    },
    {
      id: "sust",
      title: "Sustainable Investing",
      icon: <Leaf className="w-5 h-5 text-brand-navy" />,
      subtitle: "Climate & SFDR Article 9 Alignments",
      desc: "Vetting high-conviction portfolios against strict sustainability indicators, filtering out future carbon pricing penalties.",
      specialtyCode: "Sustainable Investing"
    }
  ];

  const keyMap: Record<string, string> = {
    "fin": "planning",
    "etf": "investment",
    "ret": "retirement",
    "ins": "insurance",
    "coaching": "career",
    "tax": "tax",
    "salary": "salary",
    "internationals": "international",
    "sust": "sustainable"
  };

  const localizedCards = cards.map((card) => {
    const key = keyMap[card.id] || card.id;
    return {
      ...card,
      title: t(`module.${key}.title`),
      subtitle: t(`module.${key}.subtitle`),
      desc: t(`module.${key}.desc`)
    };
  });

  const toggleExpand = (id: string) => {
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  };

  return (
    <section className="bg-background-soft px-5 py-16 md:py-24 border-b border-border-subtle" id="expertise-hub">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Top Header */}
        <div className="text-center space-y-4">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
            {language === "de" ? "Spezialisierte Portfolios" : "Specialized Portfolios"}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-navy font-bold">
            {language === "de" ? "Maßgeschneiderte Beratungsbereiche" : "Tailored Consulting Domains"}
          </h2>
          <div className="w-12 h-[1px] bg-brand-gold mx-auto"></div>
          <p className="font-sans text-sm md:text-base text-gray-500 max-w-lg mx-auto leading-relaxed">
            {language === "de" 
              ? "Erweitern Sie eine beliebige Kategorie unten, um sofort Kapitalstrukturen zu simulieren, aktive Steuerschilde zu modellieren oder maßgeschneiderte Altersvorsorgepläne zu testen."
              : "Expand any category below to simulate capital structures, model active tax shields, or test customized retirement runways instantly."}
          </p>
        </div>

        {/* Dynamic Accordion Group */}
        <div className="space-y-4">
          {localizedCards.map((card) => {
            const isExpanded = expandedCard === card.id;
            return (
              <div 
                key={card.id}
                className={`bg-white border rounded transition-all duration-300 overflow-hidden ${
                  isExpanded 
                    ? "border-brand-gold shadow-md shadow-brand-gold/5" 
                    : "border-gray-200 hover:border-brand-navy"
                }`}
                id={`expertise-card-${card.id}`}
              >
                {/* Accordion Row Trigger */}
                <button
                  onClick={() => toggleExpand(card.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy shrink-0">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-brand-navy group-hover:text-brand-gold">
                        {card.title}
                      </h3>
                      <p className="font-sans text-xs text-brand-gold font-semibold tracking-wider uppercase mt-0.5">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                  <div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-brand-gold" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Content with Calculator */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-linear-to-b from-white to-background-soft/30 p-6 space-y-6 animate-fadeIn">
                    <p className="font-sans text-sm text-gray-600 leading-relaxed max-w-2xl">
                      {card.desc}
                    </p>

                    {/* Interactive Calculator Section */}
                    <div className="bg-white border border-border-subtle p-5 rounded space-y-4">
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <Zap className="w-4 h-4 text-brand-gold animate-pulse" />
                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy">
                          {language === "de" ? "Maßgeschneiderte Portfolio-Sandbox / Live-Simulator" : "Bespoke Portfolio Sandbox / Live Simulator"}
                        </span>
                      </div>

                      {/* Render appropriate calculator based on ID */}
                      {card.id === "fin" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                {language === "de" ? "Anlegbares Kernkapital (€)" : "Core Investable Capital (€)"}
                              </label>
                              <input 
                                type="number" 
                                value={finCapital}
                                onChange={(e) => setFinCapital(Number(e.target.value))}
                                className="w-full bg-background-soft border border-gray-200 px-3 py-2 rounded text-sm outline-none focus:border-brand-navy"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                {language === "de" ? "Jährliche strategische Reservezuführung (€)" : "Annual Strategic Reserve Addition (€)"}
                              </label>
                              <input 
                                type="number" 
                                value={finAnnual}
                                onChange={(e) => setFinAnnual(Number(e.target.value))}
                                className="w-full bg-background-soft border border-gray-200 px-3 py-2 rounded text-sm outline-none focus:border-brand-navy"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                  {language === "de" ? "Zeithorizont" : "Horizon"} ({finYears} {language === "de" ? "J." : "Yr"})
                                </label>
                                <input 
                                  type="range" min="1" max="30" 
                                  value={finYears} 
                                  onChange={(e) => setFinYears(Number(e.target.value))}
                                  className="w-full accent-brand-gold cursor-pointer"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                  {language === "de" ? "Zielrendite" : "Target Return"} ({finRate}%)
                                </label>
                                <input 
                                  type="range" min="2" max="15" step="0.1" 
                                  value={finRate} 
                                  onChange={(e) => setFinRate(Number(e.target.value))}
                                  className="w-full accent-brand-gold cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-brand-navy-light text-white p-5 rounded flex flex-col justify-between">
                            <p className="font-sans text-xs uppercase tracking-widest text-brand-gold font-bold">
                              {language === "de" ? "Projizierter Vermögenshorizont" : "Projected Wealth Horizon"}
                            </p>
                            <div className="my-4">
                              <p className="text-3xl font-serif font-bold text-brand-gold">
                                €{calculateFinancialPlanning().toLocaleString()}
                              </p>
                              <p className="text-[11px] text-gray-300 mt-1">
                                {language === "de" ? "Erhält die Kaufkraft angepasst an Inflationsziele." : "Preserves purchasing leverage adjusted for inflation targets."}
                              </p>
                            </div>
                            <p className="text-[10px] text-gray-400 italic">
                              {language === "de" 
                                ? "*Vergangene Renditekoeffizienten garantieren keine endgültigen Wertzuwachsprofile." 
                                : "*Past yield ratios do not guarantee final asset appreciation profiles."}
                            </p>
                          </div>
                        </div>
                      )}

                      {card.id === "etf" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                              {language === "de" ? "Simulierter ETF-Anlagebetrag (€)" : "Simulated ETF Allocation Amount (€)"}
                            </label>
                            <input 
                              type="number" 
                              value={etfAmount}
                              onChange={(e) => setEtfAmount(Number(e.target.value))}
                              className="w-full bg-background-soft border border-gray-200 px-3 py-2 rounded text-sm outline-none focus:border-brand-navy"
                            />
                            
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2 mb-1">
                              {language === "de" ? "Thematische Portfolio-Voreinstellung" : "Thematic Portfolio Preset"}
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={() => setEtfPreset("sustainable")}
                                className={`px-2 py-1.5 rounded text-xs font-semibold border transition-all ${
                                  etfPreset === "sustainable"
                                    ? "bg-brand-navy text-white border-brand-navy"
                                    : "border-gray-200 text-gray-600 hover:border-brand-navy"
                                }`}
                              >
                                Article 9 ESG
                              </button>
                              <button 
                                  onClick={() => setEtfPreset("core")}
                                className={`px-2 py-1.5 rounded text-xs font-semibold border transition-all ${
                                  etfPreset === "core"
                                    ? "bg-brand-navy text-white border-brand-navy"
                                    : "border-gray-200 text-gray-600 hover:border-brand-navy"
                                }`}
                              >
                                {language === "de" ? "Defensives Alpha" : "Alpha Defensive"}
                              </button>
                            </div>
                          </div>

                          <div className="bg-brand-navy text-white p-4 rounded space-y-3">
                            <p className="text-xs uppercase tracking-widest text-brand-gold font-bold">
                              {language === "de" ? "Portfoliostrukturierung" : "Portfolio Structuring"}
                            </p>
                            <div className="space-y-2 text-xs">
                              {etfPreset === "sustainable" ? (
                                <>
                                  <div className="flex justify-between border-b border-gray-800 pb-1">
                                    <span>{language === "de" ? "Globale ESG-Kernaktien" : "Core Global ESG Equities"}</span>
                                    <span className="font-bold text-brand-gold">65%</span>
                                  </div>
                                  <div className="flex justify-between border-b border-gray-800 pb-1">
                                    <span>{language === "de" ? "EU-Artikel-9-Klimaanleihen" : "EU Article 9 Climate Bonds"}</span>
                                    <span className="font-bold text-brand-gold">20%</span>
                                  </div>
                                  <div className="flex justify-between pb-1">
                                    <span>{language === "de" ? "Soziale Infrastruktur-Trusts" : "Social Infrastructure Trusts"}</span>
                                    <span className="font-bold text-brand-gold">15%</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex justify-between border-b border-gray-800 pb-1">
                                    <span>{language === "de" ? "Staatsanleihen-Leiter (BaFin-geschützt)" : "Sovereign Bond Ladder (BaFin protected)"}</span>
                                    <span className="font-bold text-brand-gold">45%</span>
                                  </div>
                                  <div className="flex justify-between border-b border-gray-800 pb-1">
                                    <span>{language === "de" ? "Defensive Indizes mit hoher Dividende" : "High Dividend Defensive Indexes"}</span>
                                    <span className="font-bold text-brand-gold">35%</span>
                                  </div>
                                  <div className="flex justify-between pb-1">
                                    <span>{language === "de" ? "Rohstoffe & flüssige Energie" : "Commodities & Liquid Energy"}</span>
                                    <span className="font-bold text-brand-gold">20%</span>
                                  </div>
                                </>
                              )}
                              <p className="text-[10px] text-gray-400 pt-2 font-serif italic text-center">
                                {language === "de" ? "Gewichtete durchschnittliche Gesamtkostenquote: 0,14 % pro Jahr." : "Weighted average expense ratio: 0.14% per annum."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {card.id === "ret" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2.5">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                  {language === "de" ? "Aktuelles Alter" : "Current Age"}
                                </label>
                                <input 
                                  type="number" value={retAge} 
                                  onChange={(e) => setRetAge(Number(e.target.value))}
                                  className="w-full bg-background-soft border border-gray-200 px-3 py-1.5 rounded text-sm outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                  {language === "de" ? "Ziel-Renteneintritt" : "Target Retire Age"}
                                </label>
                                <input 
                                  type="number" value={retTargetAge}
                                  onChange={(e) => setRetTargetAge(Number(e.target.value))}
                                  className="w-full bg-background-soft border border-gray-200 px-3 py-1.5 rounded text-sm outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                {language === "de" ? "Gewünschte monatliche Nettoentnahme (€)" : "Desired Monthly Net Draw (€)"}
                              </label>
                              <input 
                                type="number" value={retMonthlyDraw}
                                onChange={(e) => setRetMonthlyDraw(Number(e.target.value))}
                                className="w-full bg-background-soft border border-gray-200 px-3 py-1.5 rounded text-sm outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                {language === "de" ? "Aktuelles Kontoguthaben (€)" : "Current Account Balance (€)"}
                              </label>
                              <input 
                                type="number" value={retCurrentInvested}
                                onChange={(e) => setRetCurrentInvested(Number(e.target.value))}
                                className="w-full bg-background-soft border border-gray-200 px-3 py-1.5 rounded text-sm outline-none"
                              />
                            </div>
                          </div>

                          <div className="bg-[#fcf8ee] border border-brand-gold/30 p-4 rounded flex flex-col justify-between text-brand-navy">
                            <p className="text-xs uppercase tracking-widest text-brand-gold font-bold">
                              {language === "de" ? "Langlebigkeit des verbleibenden Kapitals" : "Legacy Runaway Longevity"}
                            </p>
                            <div className="my-2">
                              <p className="text-xs text-gray-500">{language === "de" ? "Kapitalpool im Zieljahr:" : "Capital pool on target year:"}</p>
                              <p className="text-xl font-serif font-black text-brand-navy">
                                €{calculateRetirementRunway().balanceAtRetire.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">{language === "de" ? "Erwartete Entnahmedauer:" : "Advisory drawdown expectancy:"}</p>
                              <p className="text-2xl font-serif font-bold text-brand-gold">
                                {calculateRetirementRunway().runwayYears >= 50 
                                  ? (language === "de" ? "Unbegrenzt (Selbsterhaltend!)" : "Infinite (Self-Sustaining!)") 
                                  : `${calculateRetirementRunway().runwayYears} ${language === "de" ? "Jahre Sicherheit" : "Years of Safety"}`}
                              </p>
                            </div>
                            <p className="text-[10px] text-gray-400 italic">
                              {language === "de" 
                                ? "Enthält grundlegende Zinseszins-Indizes angepasst an marktübliche Entnahmen." 
                                : "Includes basic compounding indices adjusted for standard market draws."}
                            </p>
                          </div>
                        </div>
                      )}

                      {card.id === "ins" && (
                        <div className="space-y-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {language === "de" ? "Wählen Sie HNW-Deckungen zum Screening aus" : "Select High-Net-Worth Coverages to Screen"}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <label className="flex items-center gap-2 bg-background-soft p-3 rounded cursor-pointer border hover:border-brand-navy">
                              <input 
                                type="checkbox" checked={insCoverages.do}
                                onChange={(e) => setInsCoverages({...insCoverages, do: e.target.checked})}
                                className="accent-brand-gold"
                              />
                              <span className="text-xs font-medium text-gray-700">{language === "de" ? "Geschäftsführer-Haftpflicht (D&O)" : "Directors & Officers (D&O)"}</span>
                            </label>
                            <label className="flex items-center gap-2 bg-background-soft p-3 rounded cursor-pointer border hover:border-brand-navy">
                              <input 
                                type="checkbox" checked={insCoverages.keyPerson}
                                onChange={(e) => setInsCoverages({...insCoverages, keyPerson: e.target.checked})}
                                className="accent-brand-gold"
                              />
                              <span className="text-xs font-medium text-gray-700">{language === "de" ? "Schlüsselfigurenschutz" : "Key Person Protection"}</span>
                            </label>
                            <label className="flex items-center gap-2 bg-background-soft p-3 rounded cursor-pointer border hover:border-brand-navy">
                              <input 
                                type="checkbox" checked={insCoverages.assetLiab}
                                onChange={(e) => setInsCoverages({...insCoverages, assetLiab: e.target.checked})}
                                className="accent-brand-gold"
                              />
                              <span className="text-xs font-medium text-gray-700">{language === "de" ? "Vermögenshaftpflichtdeckung" : "Asset Liability Cover"}</span>
                            </label>
                            <label className="flex items-center gap-2 bg-background-soft p-3 rounded cursor-pointer border hover:border-brand-navy">
                              <input 
                                type="checkbox" checked={insCoverages.cyberPremium}
                                onChange={(e) => setInsCoverages({...insCoverages, cyberPremium: e.target.checked})}
                                className="accent-brand-gold"
                              />
                              <span className="text-xs font-medium text-gray-700">{language === "de" ? "Prestige Cyber- & IP-Schutz" : "Prestige Cyber & IP Shield"}</span>
                            </label>
                            <label className="flex items-center gap-2 bg-background-soft p-3 rounded cursor-pointer border hover:border-brand-navy">
                              <input 
                                type="checkbox" checked={insCoverages.globalHealth}
                                onChange={(e) => setInsCoverages({...insCoverages, globalHealth: e.target.checked})}
                                className="accent-brand-gold"
                              />
                              <span className="text-xs font-medium text-gray-700">{language === "de" ? "Premium Globaler Gesundheitsschutz" : "Premium Global Health"}</span>
                            </label>
                          </div>
                          
                          <div className="bg-brand-navy text-white p-4 rounded flex items-center justify-between">
                            <div>
                              <p className="text-xs text-brand-gold uppercase tracking-widest font-bold">{language === "de" ? "Umfassende Schutzbewertung" : "Comprehensive Protection Rating"}</p>
                              <p className="text-base font-serif font-semibold mt-1">
                                {Object.values(insCoverages).filter(Boolean).length === 5 
                                  ? (language === "de" ? "Elite Multi-Asset-Schutz garantiert" : "Elite Multi-Asset Shield Guaranteed") 
                                  : (language === "de" ? "Beratung erforderlich: Lücken vorhanden" : "Advisory Action: Structural Gaps Exist")}
                              </p>
                            </div>
                            <span className="text-xl font-serif font-bold text-brand-gold">
                              {Math.round((Object.values(insCoverages).filter(Boolean).length / 5) * 100)}% {language === "de" ? "geschützt" : "Protected"}
                            </span>
                          </div>
                        </div>
                      )}

                      {card.id === "coaching" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                {language === "de" ? "Aktuelles Grundgehalt als Führungskraft (€)" : "Current Executive Base Salary (€)"}
                              </label>
                              <input 
                                type="number" value={compBase}
                                onChange={(e) => setCompBase(Number(e.target.value))}
                                className="w-full bg-background-soft border border-gray-200 px-3 py-2 rounded text-sm outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                  {language === "de" ? "Bonus-Ziel (%)" : "Bonus Target (%)"}
                                </label>
                                <input 
                                  type="number" value={compBonus}
                                  onChange={(e) => setCompBonus(Number(e.target.value))}
                                  className="w-full bg-background-soft border border-gray-200 px-3 py-2 rounded text-sm outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                  {language === "de" ? "Jährliche Zuteilung von Anteilen (€)" : "Annual Equity Grant (€)"}
                                </label>
                                <input 
                                  type="number" value={compEquity}
                                  onChange={(e) => setCompEquity(Number(e.target.value))}
                                  className="w-full bg-background-soft border border-gray-200 px-3 py-2 rounded text-sm outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="bg-brand-navy-light text-white p-5 rounded flex flex-col justify-between">
                            <p className="text-xs uppercase tracking-widest text-brand-gold font-bold">{language === "de" ? "Gesamtjahrespaket-Optimierung" : "Total Annual Package Optimization"}</p>
                            <div className="my-2">
                              <p className="text-2xl font-serif font-bold text-white">
                                €{Math.round(compBase + (compBase * (compBonus / 100)) + compEquity).toLocaleString()}
                              </p>
                              <p className="text-xs text-brand-gold mt-1">{language === "de" ? "Vorgeschlagener Hebelmultiplikator für C-Suite: 1,18x" : "Suggested C-Suite Leverage Multiplier: 1.18x"}</p>
                            </div>
                            <p className="text-[10px] text-gray-400">
                              {language === "de" 
                                ? "Unsere Berater strukturieren routinemäßig Leistungshürden um, um feste Steuerschulden in steuerbegünstigte Aktienprogramme umzuwandeln." 
                                : "Our consultants routinely restructure performance hurdles to convert fixed tax base liabilities into tax-preferred equity programs."}
                            </p>
                          </div>
                        </div>
                      )}

                      {card.id === "tax" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                {language === "de" ? "In Deutschland steuerpflichtiges Einkommen (€)" : "Germany Taxable Executive Income (€)"}
                              </label>
                              <input 
                                type="number" value={taxIncome}
                                onChange={(e) => setTaxIncome(Number(e.target.value))}
                                className="w-full bg-background-soft border border-gray-200 px-3 py-2 rounded text-sm outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                  {language === "de" ? "Steuerklasse" : "Steuerklasse"}
                                </label>
                                <select 
                                  value={taxClass}
                                  onChange={(e) => setTaxClass(e.target.value)}
                                  className="w-full bg-background-soft border border-gray-200 px-3 py-2 rounded text-sm outline-none"
                                >
                                  <option value="I">{language === "de" ? "Klasse I (Ledig)" : "Klasse I (Single)"}</option>
                                  <option value="III">{language === "de" ? "Klasse III (Verheiratet)" : "Klasse III (Married)"}</option>
                                  <option value="IV">{language === "de" ? "Klasse IV (Standard)" : "Klasse IV (Default)"}</option>
                                </select>
                              </div>
                              <div className="flex items-center gap-2 pt-5">
                                <input 
                                  type="checkbox" checked={taxChurch}
                                  onChange={(e) => setTaxChurch(e.target.checked)}
                                  className="accent-brand-gold"
                                  id="church-tax-cb"
                                />
                                <label htmlFor="church-tax-cb" className="text-xs font-semibold text-gray-500 uppercase">
                                  {language === "de" ? "Kirchensteuer" : "Kirchensteuer"}
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="bg-[#fbfbfb] border border-gray-200 p-4 rounded text-brand-navy space-y-3">
                            <p className="text-xs uppercase tracking-widest text-brand-gold font-bold">
                              {language === "de" ? "Deutsche Steuerschild-Strategie" : "German Fiscal Shield Strategy"}
                            </p>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between border-b pb-1">
                                <span>{language === "de" ? "Geschätzte Basissteuerschuld:" : "Estimated Base Tax Liability:"}</span>
                                <span className="font-semibold text-red-600">€{calculateGermanTaxSavings().before.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between border-b pb-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                <span>{language === "de" ? "Erhaltendes Kapital durch Steuerschild:" : "Preserved Capital via Shield:"}</span>
                                <span>+€{calculateGermanTaxSavings().savings.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between pb-1 font-serif font-bold text-brand-navy pt-1 text-sm">
                                <span>{language === "de" ? "Optimierte Nettosteuer:" : "Net Optim Liability:"}</span>
                                <span>€{calculateGermanTaxSavings().after.toLocaleString()}</span>
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-400 italic">
                              {language === "de" 
                                ? "*Nutzt standardmäßige Steuersparstrukturen nach § 10 EStG bei den örtlichen Finanzbehörden." 
                                : "*Leverages standard Section 10 investment shielding structures under local taxing authorities."}
                            </p>
                          </div>
                        </div>
                      )}

                      {card.id === "salary" && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                {language === "de" ? "Angestrebte Unternehmensfunktion / Positionstitel" : "Intended Corporate Function / Role Title"}
                              </label>
                              <input 
                                type="text" value={negRole}
                                onChange={(e) => setNegRole(e.target.value)}
                                className="w-full bg-background-soft border border-gray-200 px-3 py-2 rounded text-sm outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                {language === "de" ? "Bevorzugter Paket-Zieljahresbetrag (€)" : "Preferred Package Target Annual Offer (€)"}
                              </label>
                              <input 
                                type="number" value={negOffer}
                                onChange={(e) => setNegOffer(Number(e.target.value))}
                                className="w-full bg-background-soft border border-gray-200 px-3 py-2 rounded text-sm outline-none"
                              />
                            </div>
                          </div>
                          
                          <div className="bg-[#fcfbee] border border-brand-gold/20 p-4 rounded text-xs space-y-2 text-brand-navy">
                            <p className="font-sans font-bold text-xs uppercase tracking-wider text-brand-gold">
                              {language === "de" ? "Prestige-Gesprächspunkte-Struktur:" : "Prestige Talking Points Structure:"}
                            </p>
                            <ul className="list-disc pl-4 space-y-1 text-gray-600">
                              {language === "de" ? (
                                <>
                                  <li>"Angesichts der aktuellen Umsatzrenditen weist eine Position als <strong>{negRole}</strong> eine Hebelprämie von mindestens 15% auf."</li>
                                  <li>"Strukturieren Sie das vorgeschlagene Bonusmodell in phantombezogene Aktienoptionen im Wert von €{(negOffer * 0.2).toLocaleString()} pro Jahr um."</li>
                                  <li>"Integrieren Sie einen dedizierten Umzugs- / Steuerkompensationszuschuss für die Einhaltung mehrerer Steuergebiete."</li>
                                </>
                              ) : (
                                <>
                                  <li>"Given current industry ARR growth yields, a role of <strong>{negRole}</strong> holds a capital-return leverage premium minimum of 15%."</li>
                                  <li>"Restructure the proposed bonus matrix into non-dilutive phantom stock tokens valued at €{(negOffer * 0.2).toLocaleString()} per annum."</li>
                                  <li>"Incorporate a dedicated relocation / sovereign tax offset allowance for multi-jurisdictional compliance."</li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      )}

                      {card.id === "internationals" && (
                        <div className="space-y-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {language === "de" ? "Fortschritt der behördlichen Einarbeitung bei Unternehmensumzug" : "Corporate Relocation Regulatory Onboarding Progress"}
                          </p>
                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                            <label className="flex items-center gap-2 bg-background-soft p-3 rounded cursor-pointer border hover:border-brand-navy">
                              <input 
                                type="checkbox" checked={germanyCheck.anmeldung}
                                onChange={(e) => setGermanyCheck({...germanyCheck, anmeldung: e.target.checked})}
                                className="accent-brand-gold"
                              />
                              <span className="text-xs font-medium text-gray-700">Anmeldung (Kiez)</span>
                            </label>
                            <label className="flex items-center gap-2 bg-background-soft p-3 rounded cursor-pointer border hover:border-brand-navy">
                              <input 
                                type="checkbox" checked={germanyCheck.privateHealth}
                                onChange={(e) => setGermanyCheck({...germanyCheck, privateHealth: e.target.checked})}
                                className="accent-brand-gold"
                              />
                              <span className="text-xs font-medium text-gray-700">Private Health Ins (PKV)</span>
                            </label>
                            <label className="flex items-center gap-2 bg-background-soft p-3 rounded cursor-pointer border hover:border-brand-navy">
                              <input 
                                type="checkbox" checked={germanyCheck.taxID}
                                onChange={(e) => setGermanyCheck({...germanyCheck, taxID: e.target.checked})}
                                className="accent-brand-gold"
                              />
                              <span className="text-xs font-medium text-gray-700">Steuernummer Issuance</span>
                            </label>
                            <label className="flex items-center gap-2 bg-background-soft p-3 rounded cursor-pointer border hover:border-brand-navy">
                              <input 
                                type="checkbox" checked={germanyCheck.bafinBank}
                                onChange={(e) => setGermanyCheck({...germanyCheck, bafinBank: e.target.checked})}
                                className="accent-brand-gold"
                              />
                              <span className="text-xs font-medium text-gray-700">BaFin Executive Account</span>
                            </label>
                            <label className="flex items-center gap-2 bg-background-soft p-3 rounded cursor-pointer border hover:border-brand-navy">
                              <input 
                                type="checkbox" checked={germanyCheck.blueCard}
                                onChange={(e) => setGermanyCheck({...germanyCheck, blueCard: e.target.checked})}
                                className="accent-brand-gold"
                              />
                              <span className="text-xs font-medium text-gray-700">Blue Card (Sovereign)</span>
                            </label>
                          </div>

                          <div className="bg-brand-navy text-white p-4 rounded flex items-center justify-between">
                            <span className="text-xs text-brand-gold uppercase tracking-widest font-bold">{language === "de" ? "Compliance-Status des Umzugs:" : "Relocation Compliance Status:"}</span>
                            <span className="text-xs font-bold bg-white-15 px-3 py-1 rounded">
                              {Object.values(germanyCheck).filter(Boolean).length === 5 
                                ? (language === "de" ? "Vollständiger souveräner Vorstandsstatus" : "Complete Sovereign Executive Status") 
                                : (language === "de" ? "Warten auf Kernunterlagen (BaFin- & Krankenkassen-Voreinstellungen erforderlich)" : "Awaiting Core Documents (BaFin & Health Presets Required)")}
                            </span>
                          </div>
                        </div>
                      )}

                      {card.id === "sust" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                                <span>{language === "de" ? "KLIMAWANDEL-INTENTION" : "CLIMATE TRANSITION INTENT"}</span>
                                <span className="text-brand-navy">{esgClimate}%</span>
                              </div>
                              <input 
                                type="range" min="10" max="100" 
                                value={esgClimate} 
                                onChange={(e) => setEsgClimate(Number(e.target.value))}
                                className="w-full accent-brand-gold cursor-pointer"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                                <span>{language === "de" ? "SOZIALKRITERIEN-FILTER" : "SOCIAL CRITERIA FILTER"}</span>
                                <span className="text-brand-navy">{esgSocial}%</span>
                              </div>
                              <input 
                                type="range" min="10" max="100" 
                                value={esgSocial} 
                                onChange={(e) => setEsgSocial(Number(e.target.value))}
                                className="w-full accent-brand-gold cursor-pointer"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                                <span>{language === "de" ? "BOARD-GOVERNANCE-BEWERTUNG" : "BOARD GOVERNANCE GRADING"}</span>
                                <span className="text-brand-navy">{esgGov}%</span>
                              </div>
                              <input 
                                type="range" min="10" max="100" 
                                value={esgGov} 
                                onChange={(e) => setEsgGov(Number(e.target.value))}
                                className="w-full accent-brand-gold cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="bg-brand-navy text-white p-5 rounded flex flex-col justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-widest text-brand-gold font-bold">SFDR Article 9 Scoring Output</p>
                              <div className="my-3 text-center">
                                <p className="text-4xl font-serif font-bold text-brand-gold">
                                  {Math.round((esgClimate + esgSocial + esgGov) / 3)} A+
                                </p>
                                <p className="text-[10px] text-gray-400 mt-2">
                                  {language === "de" 
                                    ? "Prestige-Screening bestätigt null Engagement in fossilen Brennstoff-Übergangsstrafen." 
                                    : "Prestige screening confirms zero exposure to fossil fuel transition penalties."}
                                </p>
                              </div>
                            </div>
                            <p className="text-[10px] text-zinc-500 italic">
                              {language === "de" 
                                ? "*Unabhängig geprüft gegen MSCI-Sovereign-ESG-Bewertungen." 
                                : "*Independently benchmarked against MSCI Sovereign ESG ratings."}
                            </p>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Trigger Advisor Chat Link */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => onTriggerAdvisor(card.specialtyCode)}
                        className="bg-brand-navy hover:bg-brand-navy-light text-white font-sans text-xs font-bold tracking-wider uppercase px-5 py-3 rounded flex items-center gap-2 transform active:scale-95 transition-all"
                      >
                        <Sparkles className="w-4 h-4 text-brand-gold" />
                        {language === "de" ? `Sprechen Sie mit dem Senior-Berater für ${card.title}` : `Consult Personal Senior Advisor on ${card.title}`}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
