import React, { useEffect, useRef, useState } from "react";

const MODULES = [
  {
    icon: "account_balance_wallet",
    title: "Financial Planning",
    subtitle: "Bespoke Liquidity & Assets Architecture",
    desc: "Holistic wealth architecture that integrates your current financial position with long-term aspirations, ensuring every asset serves a strategic purpose.",
    image: "/assets/services/planning.png",
    imageAlt: "Financial planning documents and charts on a desk",
    stats: [{ label: "Avg. Plan Horizon", value: "15 yrs" }, { label: "Capital Preserved", value: "94%" }, { label: "Tax Efficiency", value: "+62%" }],
  },
  {
    icon: "query_stats",
    title: "Investment & ETFs",
    subtitle: "Diversified Global Index Compounding",
    desc: "Evidence-based portfolio construction using diversified ETF strategies and direct investment vehicles optimised for global market participation.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    imageAlt: "Stock market trading screens with graphs",
    stats: [{ label: "Avg TER", value: "0.18%" }, { label: "YTD Return", value: "+11.2%" }, { label: "Sharpe Ratio", value: "1.42" }],
  },
  {
    icon: "auto_awesome_motion",
    title: "Retirement Planning",
    subtitle: "Pre-Retirement Guard & Income Longevity",
    desc: "Securing your legacy through precision projection modelling and tax-efficient withdrawal strategies designed for enduring financial independence.",
    image: "/assets/services/retirement.png",
    imageAlt: "Peaceful landscape representing long-term security",
    stats: [{ label: "Target Retire Age", value: "60" }, { label: "Monthly Draw", value: "€8,400" }, { label: "Longevity Cover", value: "30 yrs" }],
  },
  {
    icon: "shield",
    title: "Insurance Analysis",
    subtitle: "Premium Risk Containment Audit",
    desc: "Quantifying risk exposure and identifying sophisticated coverage solutions to protect human capital, assets, and generational wealth.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    imageAlt: "Professional signing an insurance or legal document",
    stats: [{ label: "Coverage Score", value: "62→94" }, { label: "Gaps Resolved", value: "3" }, { label: "Annual Premium", value: "€14.2K" }],
  },
  {
    icon: "psychology",
    title: "Career Coaching",
    subtitle: "Executive Trajectory Optimisation",
    desc: "Strategic professional development for executives and high-performers looking to maximise their lifetime earning potential and market influence.",
    image: "/assets/services/career.png",
    imageAlt: "Executive coaching session in a modern office",
    stats: [{ label: "Median Uplift", value: "+34%" }, { label: "Time to VP", value: "2.1 yrs" }, { label: "Equity Gained", value: "€180K" }],
  },
  {
    icon: "receipt_long",
    title: "Tax Optimisation",
    subtitle: "Cross-Border Compliance Mastery",
    desc: "Navigating complex tax landscapes to improve net returns through intelligent structuring and cross-border compliance mastery.",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80",
    imageAlt: "Tax and accounting documents with calculator",
    stats: [{ label: "Effective Rate Before", value: "42%" }, { label: "Effective Rate After", value: "26%" }, { label: "Annual Saving", value: "€28.4K" }],
  },
  {
    icon: "handshake",
    title: "Salary Negotiation",
    subtitle: "High-Stakes Executive Compensation",
    desc: "High-stakes negotiation advisory for executive contracts, compensation packages, and equity stakes to ensure your value is fully realised.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
    imageAlt: "Business professionals shaking hands after a deal",
    stats: [{ label: "Base Increase", value: "+€40K" }, { label: "Equity Unlocked", value: "€120K" }, { label: "Total Delta", value: "+€193K" }],
  },
  {
    icon: "public",
    title: "Internationals in Germany",
    subtitle: "Global Professionals, Local Precision",
    desc: "Specialised guidance for global professionals navigating the unique German financial, pension, and tax ecosystem with absolute confidence.",
    image: "/assets/services/international.png",
    imageAlt: "Berlin skyline representing Germany relocation",
    stats: [{ label: "Avg Tax Saving", value: "€9,200" }, { label: "Setup Time", value: "6 weeks" }, { label: "Compliance Risk", value: "Low" }],
  },
  {
    icon: "eco",
    title: "Sustainable Investing",
    subtitle: "ESG-Aligned Capital Strategy",
    desc: "Aligning your capital with future-proof ESG criteria, transforming environmental and social responsibility into a driver of long-term performance.",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80",
    imageAlt: "Green sustainable investment concept with nature",
    stats: [{ label: "ESG Rating", value: "AA" }, { label: "Carbon Offset", value: "94%" }, { label: "SDG Aligned", value: "7 Goals" }],
  },
];

interface Props {
  onTriggerAdvisor: (specialty: string) => void;
}

export default function ScrollytellingSection({ onTriggerAdvisor }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setActive = (i: number) => {
    if (i === activeIndex) return;
    setFading(true);
    setTimeout(() => {
      setPrevIndex(activeIndex);
      setActiveIndex(i);
      setFading(false);
    }, 220);
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(i); }); },
        { rootMargin: "-30% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [activeIndex]);

  const mod = MODULES[activeIndex];

  return (
    <section className="relative bg-[#f7f9fb] border-t border-gray-100">
      {/* Header */}
      <div className="px-5 md:px-16 max-w-7xl mx-auto pt-20 pb-10">
        <div className="border-l-4 border-brand-gold pl-6">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-brand-gold block mb-2">
            Our Capabilities
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-brand-navy leading-tight" style={{ fontWeight: 700 }}>
            Strategic Mastery<br />
            <span className="italic" style={{ fontWeight: 600 }}>Across Disciplines</span>
          </h2>
        </div>
      </div>

      {/* Scrollytelling Grid */}
      <div className="px-5 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 relative">

        {/* Left: scrolling items */}
        <div className="space-y-[35vh] pb-[35vh] pt-10">
          {MODULES.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="transition-all duration-500"
              style={{
                opacity: activeIndex === i ? 1 : 0.25,
                transform: activeIndex === i ? "translateX(0)" : "translateX(-10px)",
              }}
            >
              <span
                className="material-symbols-outlined mb-4 block"
                style={{ fontSize: "44px", color: activeIndex === i ? "#D4AF37" : "#9ca3af", transition: "color 0.5s ease" }}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-brand-gold block mb-1">
                {item.subtitle}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-brand-navy mb-3" style={{ fontWeight: 700 }}>
                {item.title}
              </h3>
              <p className="font-sans text-sm text-gray-500 leading-relaxed max-w-md mb-5">
                {item.desc}
              </p>
              <button
                onClick={() => onTriggerAdvisor(item.title)}
                className="inline-flex items-center gap-2 text-[10px] font-sans font-semibold uppercase tracking-widest text-brand-navy border border-brand-gold/40 px-5 py-2.5 rounded hover:bg-brand-gold/10 transition-colors"
                style={{ opacity: activeIndex === i ? 1 : 0, transition: "opacity 0.4s ease" }}
              >
                Explore Advisory
                <span className="material-symbols-outlined text-brand-gold" style={{ fontSize: "14px" }}>arrow_forward</span>
              </button>
            </div>
          ))}
        </div>

        {/* Right: sticky image panel */}
        <div className="hidden lg:block sticky top-20 h-[calc(100vh-80px)] py-10">
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-[#0d1c2e]">

            {/* Image with crossfade */}
            <img
              key={activeIndex}
              src={mod.image}
              alt={mod.imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: fading ? 0 : 1,
                transition: "opacity 0.3s ease",
              }}
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c2e] via-[#0d1c2e]/40 to-transparent" />

            {/* Stats overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              {/* Module title */}
              <div className="mb-5">
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-white/50 mb-2">Active Module</p>
                <p className="font-serif text-3xl text-white" style={{ fontWeight: 700 }}>{mod.title}</p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/15">
                {mod.stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-sans text-[11px] uppercase tracking-widest text-white/40 mb-1.5">{s.label}</p>
                    <p
                      className="font-serif text-2xl"
                      style={{ color: "#D4AF37", fontWeight: 600, opacity: fading ? 0 : 1, transition: "opacity 0.3s ease" }}
                    >
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress dots */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1.5">
                {MODULES.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: activeIndex === i ? "18px" : "4px",
                      height: "4px",
                      backgroundColor: activeIndex === i ? "#D4AF37" : "rgba(255,255,255,0.2)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
