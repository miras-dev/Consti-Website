import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, TrendingUp, Shield, BarChart3 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface HeroProps {
  onStartArchitect: () => void;
  onViewServices: () => void;
  onViewAdvisors: () => void;
}

const ALLOCATIONS = [
  { label: "Global Equities", pct: 42, color: "#0d1c2e" },
  { label: "Sovereign Bonds", pct: 23, color: "#D4AF37" },
  { label: "Alternatives", pct: 18, color: "#2e5e4e" },
  { label: "Real Estate", pct: 10, color: "#8b6914" },
  { label: "Cash & Liquidity", pct: 7, color: "#c0c0c0" },
];

const GERMAN_LABELS: Record<string, string> = {
  "Global Equities": "Globale Aktien",
  "Sovereign Bonds": "Staatsanleihen",
  "Alternatives": "Alternative Anlagen",
  "Real Estate": "Immobilien",
  "Cash & Liquidity": "Barmittel & Liquidität",
};

function PortfolioRing() {
  const { language, t } = useLanguage();
  const SIZE = 260;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R_OUTER = 108;
  const R_INNER = 72;
  const GAP = 2.5; // degrees between segments

  const localizedAllocations = ALLOCATIONS.map(a => ({
    ...a,
    label: language === "de" ? (GERMAN_LABELS[a.label] || a.label) : a.label
  }));

  // Convert pct → arc degrees
  const total = localizedAllocations.reduce((s, a) => s + a.pct, 0);
  let cursor = -90; // start at top

  const segments = localizedAllocations.map((a) => {
    const deg = (a.pct / total) * 360 - GAP;
    const start = cursor;
    const end = cursor + deg;
    cursor += deg + GAP;

    const toRad = (d: number) => (d * Math.PI) / 180;
    const x1 = CX + R_OUTER * Math.cos(toRad(start));
    const y1 = CY + R_OUTER * Math.sin(toRad(start));
    const x2 = CX + R_OUTER * Math.cos(toRad(end));
    const y2 = CY + R_OUTER * Math.sin(toRad(end));
    const x3 = CX + R_INNER * Math.cos(toRad(end));
    const y3 = CY + R_INNER * Math.sin(toRad(end));
    const x4 = CX + R_INNER * Math.cos(toRad(start));
    const y4 = CY + R_INNER * Math.sin(toRad(start));
    const large = deg > 180 ? 1 : 0;

    const d = [
      `M ${x1} ${y1}`,
      `A ${R_OUTER} ${R_OUTER} 0 ${large} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${R_INNER} ${R_INNER} 0 ${large} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ");

    return { ...a, d, deg };
  });

  const [hovered, setHovered] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="drop-shadow-xl"
        style={{ filter: "drop-shadow(0 8px 32px rgba(13,28,46,0.18))" }}
      >
        {segments.map((seg, i) => (
          <path
            key={seg.label}
            d={seg.d}
            fill={seg.color}
            opacity={animated ? (hovered === null || hovered === i ? 1 : 0.4) : 0}
            style={{
              transition: `opacity 0.3s ease, transform 0.3s ease`,
              transformOrigin: `${CX}px ${CY}px`,
              transform: hovered === i ? "scale(1.04)" : "scale(1)",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        {/* Centre text */}
        <text x={CX} y={CY - 10} textAnchor="middle" fill="#0d1c2e" fontSize="22" fontFamily="Lora, Georgia, serif" fontWeight="600">
          €12.4B
        </text>
        <text x={CX} y={CY + 10} textAnchor="middle" fill="#9ca3af" fontSize="9" fontFamily="DM Sans, sans-serif" letterSpacing="2">
          {t("hero.metricAssets").toUpperCase()}
        </text>

        {/* Hover label */}
        {hovered !== null && (
          <>
            <text x={CX} y={CY + 30} textAnchor="middle" fill="#D4AF37" fontSize="10" fontFamily="DM Sans, sans-serif" letterSpacing="1">
              {segments[hovered].label}
            </text>
            <text x={CX} y={CY + 44} textAnchor="middle" fill="#0d1c2e" fontSize="14" fontFamily="Lora, Georgia, serif" fontWeight="600">
              {segments[hovered].pct}%
            </text>
          </>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-5 space-y-1.5 w-full max-w-[220px]">
        {segments.map((a, i) => (
          <div
            key={a.label}
            className="flex items-center justify-between text-xs cursor-default"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ opacity: hovered === null || hovered === i ? 1 : 0.4, transition: "opacity 0.2s" }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: a.color }} />
              <span className="font-sans text-gray-600">{a.label}</span>
            </div>
            <span className="font-serif text-brand-navy font-semibold">{a.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero({ onStartArchitect, onViewServices }: HeroProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      {/* Hero Core */}
      <section className="relative overflow-hidden border-b border-border-subtle bg-white flex items-center" id="hero-section" style={{ minHeight: "92vh" }}>
        {/* Main Content Container centered with rest of the site */}
        <div className="max-w-7xl mx-auto px-5 md:px-16 w-full relative z-10">
          <div className="w-full lg:w-[60%] py-24 space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold-light border border-brand-gold/20 rounded w-fit">
              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-ping" />
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-gold">
                {t("hero.tag")}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.6rem] text-brand-navy leading-[1.08] tracking-tight max-w-xl" style={{ fontWeight: 700 }}>
              {t("hero.title")}<br />
              <span className="italic text-brand-gold" style={{ fontWeight: 600 }}>{t("hero.titleItalic")}</span>
            </h1>

            <p className="font-sans text-sm md:text-base text-gray-500 max-w-lg leading-relaxed">
              {t("hero.desc")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStartArchitect}
                className="w-full sm:w-auto bg-brand-navy hover:bg-brand-navy-light text-white py-4 px-8 rounded font-sans text-xs font-semibold tracking-[0.15em] uppercase flex items-center justify-center gap-2 group transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                {t("hero.btnLaunch")}
                <ArrowRight className="w-4 h-4 text-brand-gold group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onViewServices}
                className="w-full sm:w-auto border border-brand-gold text-brand-navy hover:bg-brand-gold-light py-4 px-8 rounded font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300"
              >
                {t("hero.btnExplore")}
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100 max-w-md">
              <div>
                <p className="font-serif text-2xl text-brand-navy" style={{ fontWeight: 700 }}>€12.4B</p>
                <p className="font-sans text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{t("hero.metricAssets")}</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-brand-navy" style={{ fontWeight: 700 }}>BaFin</p>
                <p className="font-sans text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{t("hero.metricRegulated")}</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-brand-navy" style={{ fontWeight: 700 }}>99.2%</p>
                <p className="font-sans text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{t("hero.metricRetention")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Absolute right hero image */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[45%] z-0">
          <img
            src="/Hero.png"
            alt="Constantine Nixdorff"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </section>

      {/* Trust Quote Bar */}
      <section className="bg-brand-navy text-white py-12 px-5 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
          <blockquote className="font-serif text-xl md:text-2xl italic text-brand-gold-light leading-relaxed" style={{ fontWeight: 500 }}>
            "{t("hero.quote")}"
          </blockquote>
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-gold font-semibold">
            — Constantine Nixdorff
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 border border-brand-gold/5 rounded-full transform translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 border border-brand-gold/5 rounded-full transform -translate-x-20 translate-y-20" />
      </section>
    </div>
  );
}

