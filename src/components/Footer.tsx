import React, { useState } from "react";
import { Award, Info, Mail, Phone, MapPin, Landmark } from "lucide-react";

export default function Footer() {
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
            <h4 className="font-serif text-lg md:text-xl font-bold text-brand-navy">The Weekly Brief</h4>
            <p className="font-sans text-xs md:text-sm text-gray-500 max-w-xl">
              Sophisticated market analytics, structural tax shielding adjustments, and regulatory compliance updates delivered directly to your workstation.
            </p>
          </div>
          <div className="md:col-span-5 w-full">
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  type="email" 
                  value={newsInput}
                  onChange={(e) => setNewsInput(e.target.value)}
                  placeholder="Corporate Email Address"
                  className="bg-white border border-gray-200 px-4 py-3 rounded text-xs flex-1 outline-none focus:border-brand-navy"
                  required
                />
                <button 
                  type="submit"
                  className="bg-brand-navy hover:bg-brand-navy-light text-white font-sans text-xs font-bold uppercase tracking-wider px-5 py-3 rounded transform active:scale-95 transition-transform shrink-0"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="bg-brand-gold-light border border-brand-gold/20 p-3 rounded text-center text-xs text-brand-navy font-bold">
                ✓ Strategic Subscription Authorized.
              </div>
            )}
          </div>
        </div>

        {/* Global Network, Navigation grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand Info Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 font-serif font-bold text-brand-navy tracking-widest text-[#000000]">
              <Award className="w-5 h-5 text-brand-gold" />
              <span>PRESTIGE ADVISORY</span>
            </div>
            <p className="font-sans text-xs text-gray-500 leading-relaxed">
              Global strategy. Institutional precision. We serve as the core private architect for the sovereign financial legacy of high-net-worth individuals, corporate entities, and family offices.
            </p>
          </div>

          {/* Network Column */}
          <div className="space-y-4">
            <h5 className="font-sans text-[11px] font-bold uppercase tracking-widest text-brand-navy">Global Network</h5>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                <span>London Branch (Mayfair)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                <span>Berlin Capital Hub (Mitte)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                <span>Zurich Head Office (Bahnhofstrasse)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                <span>New York Office (Wall Street)</span>
              </li>
            </ul>
          </div>

          {/* Governance Column */}
          <div className="space-y-4">
            <h5 className="font-sans text-[11px] font-bold uppercase tracking-widest text-brand-navy">Governance</h5>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li><button className="hover:text-brand-gold transition-colors block">BaFin Audit Standards</button></li>
              <li><button className="hover:text-brand-gold transition-colors block">SFDR ESG Regulations</button></li>
              <li><button className="hover:text-brand-gold transition-colors block">Ethics & Compliance Code</button></li>
              <li><button className="hover:text-brand-gold transition-colors block">MIFID II Protocol Alignment</button></li>
            </ul>
          </div>

          {/* Legal Compliance Column */}
          <div className="space-y-4">
            <h5 className="font-sans text-[11px] font-bold uppercase tracking-widest text-brand-navy">Secured Portals</h5>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li><button className="hover:text-brand-gold transition-colors block">Privacy Policy</button></li>
              <li><button className="hover:text-brand-gold transition-colors block">Terms of Service</button></li>
              <li><button className="hover:text-brand-gold transition-colors block">Corporate ESG Disclosures</button></li>
              <li><button className="hover:text-brand-gold transition-colors block">BaFin Registered Registry</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="border-t border-border-subtle pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-sans text-[10px] text-gray-400 capitalize">
            © {new Date().getFullYear()} Prestige Advisory Group. All rights reserved. Registered under BaFin reference regulatory numbers.
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
