import React, { useState } from "react";
import { Mail, Phone, MapPin, Landmark } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const [newsInput, setNewsInput] = useState<string>("");
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsInput.trim()) return;
    setSubscribed(true);
    setNewsInput("");
  };

  return (
    <footer className="bg-white border-t border-border-subtle pt-16 pb-12 px-5 text-left" id="footer-main">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Newsletter Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-background-soft p-6 md:p-8 rounded border border-gray-100">
          <div className="md:col-span-7 space-y-2">
            <h4 className="font-serif text-lg md:text-xl font-bold text-brand-navy">{t("footer.weeklyBrief")}</h4>
            <p className="font-sans text-xs md:text-sm text-gray-500 max-w-xl">
              {t("footer.briefDesc")}
            </p>
          </div>
          <div className="md:col-span-5 w-full">
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  type="email" 
                  value={newsInput}
                  onChange={(e) => setNewsInput(e.target.value)}
                  placeholder={t("footer.emailPlaceholder")}
                  className="bg-white border border-gray-200 px-4 py-3 rounded text-xs flex-1 outline-none focus:border-brand-navy"
                  required
                />
                <button 
                  type="submit"
                  className="bg-brand-navy hover:bg-brand-navy-light text-white font-sans text-xs font-bold uppercase tracking-wider px-5 py-3 rounded transform active:scale-95 transition-transform shrink-0"
                >
                  {t("footer.subscribe")}
                </button>
              </form>
            ) : (
              <div className="bg-brand-gold-light border border-brand-gold/20 p-3 rounded text-center text-xs text-brand-navy font-bold">
                {t("footer.subscribed")}
              </div>
            )}
          </div>
        </div>

        {/* Global Network, Navigation grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand Info Column */}
          <div className="space-y-4">
            <div className="font-serif text-lg text-brand-navy tracking-wide" style={{ fontWeight: 600 }}>
              Constantine Nixdorff
            </div>
            <p className="font-sans text-xs text-gray-500 leading-relaxed">
              {t("footer.brandDesc")}
            </p>
          </div>

          {/* Network Column */}
          <div className="space-y-4">
            <h5 className="font-sans text-[11px] font-bold uppercase tracking-widest text-brand-navy">{t("footer.globalNetwork")}</h5>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                <span>{t("footer.london")}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                <span>{t("footer.berlin")}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                <span>{t("footer.zurich")}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                <span>{t("footer.newyork")}</span>
              </li>
            </ul>
          </div>

          {/* Governance Column */}
          <div className="space-y-4">
            <h5 className="font-sans text-[11px] font-bold uppercase tracking-widest text-brand-navy">{t("footer.governance")}</h5>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li><button className="hover:text-brand-gold transition-colors block text-left">{t("footer.bafinAudit")}</button></li>
              <li><button className="hover:text-brand-gold transition-colors block text-left">{t("footer.sfdr")}</button></li>
              <li><button className="hover:text-brand-gold transition-colors block text-left">{t("footer.ethics")}</button></li>
              <li><button className="hover:text-brand-gold transition-colors block text-left">{t("footer.mifid")}</button></li>
            </ul>
          </div>

          {/* Legal Compliance Column */}
          <div className="space-y-4">
            <h5 className="font-sans text-[11px] font-bold uppercase tracking-widest text-brand-navy">{t("footer.securedPortals")}</h5>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li><button className="hover:text-brand-gold transition-colors block text-left">{t("footer.privacy")}</button></li>
              <li><button className="hover:text-brand-gold transition-colors block text-left">{t("footer.terms")}</button></li>
              <li><button className="hover:text-brand-gold transition-colors block text-left">{t("footer.esg")}</button></li>
              <li><button className="hover:text-brand-gold transition-colors block text-left">{t("footer.registry")}</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="border-t border-border-subtle pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-sans text-[10px] text-gray-400">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <div className="flex gap-4">
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white transition-all">
              <Landmark className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white transition-all">
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
