import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const COOKIE_KEY = "cn_cookie_consent";

export type ConsentState = "accepted" | "essential" | null;

export function getConsent(): ConsentState {
  return (localStorage.getItem(COOKIE_KEY) as ConsentState) ?? null;
}

export default function CookieBanner() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
    // Load Google Analytics
    loadGA();
  };

  const essential = () => {
    localStorage.setItem(COOKIE_KEY, "essential");
    setVisible(false);
  };

  if (!visible) return null;

  const isDE = language === "de";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0f1623] border-t border-brand-gold/20 shadow-2xl px-5 py-4 md:py-5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <div className="flex-1 text-xs text-gray-300 leading-relaxed">
          <span className="font-semibold text-white">
            {isDE ? "Wir verwenden Cookies" : "We use cookies"}
          </span>{" "}
          {isDE
            ? "— darunter Google Analytics — um die Nutzung unserer Website zu verstehen und unser Angebot zu verbessern. Ihre Daten werden gemäß der "
            : "— including Google Analytics — to understand how our site is used and improve our services. Your data is processed in accordance with our "}
          <button
            onClick={() => {
              const nav = (window as any).__cnNavigate;
              if (nav) nav("privacy");
            }}
            className="underline text-brand-gold hover:text-brand-gold/80 transition-colors"
          >
            {isDE ? "Datenschutzerklärung" : "Privacy Policy"}
          </button>
          {isDE ? " verarbeitet." : "."}
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={essential}
            className="px-4 py-2 text-xs border border-white/20 text-gray-300 rounded hover:border-white/40 transition-colors"
          >
            {isDE ? "Nur Notwendige" : "Essential Only"}
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 text-xs bg-brand-gold text-brand-navy font-semibold rounded hover:brightness-110 transition-all"
          >
            {isDE ? "Alle akzeptieren" : "Accept All"}
          </button>
        </div>
      </div>
    </div>
  );
}

function loadGA() {
  const GA_ID = "G-XXXXXXXXXX"; // Replace with real GA ID before going live
  if (document.getElementById("ga-script")) return;
  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
  script.onload = () => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) { (window as any).dataLayer.push(args); }
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  };
}
