import React from "react";
import { MapPin, Phone, Mail, Award, CheckCircle, Briefcase, FileText, Compass } from "lucide-react";

interface AboutConsultantProps {
  language: 'en' | 'de';
}

export default function AboutConsultant({ language }: AboutConsultantProps) {
  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Constantin Nixdorff
TITLE:Master of Science in Economics
ORG:Berlin Advice Center
TEL;TYPE=CELL,VOICE:+491727488509
EMAIL;TYPE=PREF,INTERNET:constantin.nixdorff@mlp.de
ADR;TYPE=WORK:;;Jean-Monnet Street 4;Berlin;;10557;Germany
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "constantin_nixdorff.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const t = {
    en: {
      practiceBadge: "Independent Advisory Practice",
      subHeader: "Master of Science in Economics",
      cardHeader: "Berlin Advice Center",
      cardDesc: "Independent Financial Advisor providing tailor-made economic strategies and asset structuring.",
      officeAddress: "Office Address",
      mobileHotline: "Mobile Hotline",
      securedEmail: "Secured Email",
      planRoute: "Plan Route",
      downloadVCard: "Download vCard Contact",
      focusAreasTitle: "My Consulting Focus Areas",
      segmentsTitle: "Target Client Segments",
      focusAreas: [
        "Banking, account and card",
        "Financing, real estate, practice, home",
        "Financial coaching",
        "Studies, career, self-employment",
        "Asset management, investment in funds and ETFs",
        "Sustainable, ethical investment",
        "Retirement planning, occupational pension schemes, sustainable retirement concepts",
        "Insurance"
      ],
      occupationalGroups: [
        "Students, young professionals",
        "Companies, businesses",
        "Start-ups, entrepreneurs, freelancers",
        "Employees, managers"
      ]
    },
    de: {
      practiceBadge: "Unabhängige Beratungspraxis",
      subHeader: "Master of Science in Volkswirtschaftslehre",
      cardHeader: "Berliner Beratungszentrum",
      cardDesc: "Unabhängiger Finanzberater für maßgeschneiderte ökonomische Strategien und Vermögensstrukturierung.",
      officeAddress: "Büroadresse",
      mobileHotline: "Mobilfunk-Hotline",
      securedEmail: "Gesicherte E-Mail",
      planRoute: "Route planen",
      downloadVCard: "vCard-Kontakt herunterladen",
      focusAreasTitle: "Meine Beratungsschwerpunkte",
      segmentsTitle: "Zielkundensegmente",
      focusAreas: [
        "Banking, Konto und Karte",
        "Finanzierung, Immobilien, Praxis, Heim",
        "Finanzcoaching",
        "Studium, Karriere, Selbstständigkeit",
        "Vermögensverwaltung, Investment in Fonds und ETFs",
        "Nachhaltiges, ethisches Investment",
        "Altersvorsorge, betriebliche Altersvorsorge, nachhaltige Vorsorgekonzepte",
        "Versicherungen"
      ],
      occupationalGroups: [
        "Studierende, Berufseinsteiger",
        "Unternehmen, Betriebe",
        "Start-ups, Unternehmer, Freiberufler",
        "Angestellte, Führungskräfte"
      ]
    }
  };

  return (
    <section className="bg-white py-20 px-5 border-b border-border-subtle" id="about-consultant">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 border-l-4 border-brand-gold pl-6">
          <span className="text-xs font-sans font-bold uppercase tracking-[0.25em] text-brand-gold block mb-2">
            {t[language].practiceBadge}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-brand-navy leading-tight" style={{ fontWeight: 700 }}>
            Constantin Nixdorff <br />
            <span className="italic" style={{ fontWeight: 600 }}>{t[language].subHeader}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Bio & Contact Card */}
          <div className="lg:col-span-5 bg-[#f7f9fb] border border-gray-100 rounded-lg p-8 shadow-xs space-y-8">
            
            {/* Title / Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-brand-gold">
                <Award className="w-5 h-5" />
                <span className="font-sans text-xs font-bold uppercase tracking-wider">{t[language].cardHeader}</span>
              </div>
              <h3 className="font-serif text-2xl text-brand-navy font-bold">Constantin Nixdorff</h3>
              <p className="font-sans text-sm text-gray-500">
                {t[language].cardDesc}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4 font-sans text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-navy">{t[language].officeAddress}</p>
                  <p>Jean-Monnet-Straße 4</p>
                  <p>10557 Berlin, Germany</p>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Jean-Monnet-Stra%C3%9Fe+4,+10557+Berlin" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-gold font-bold uppercase tracking-wider mt-1 hover:underline cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    {t[language].planRoute}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-navy">{t[language].mobileHotline}</p>
                  <a href="tel:+491727488509" className="hover:text-brand-gold transition-colors font-medium">
                    +49 172 7488509
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-navy">{t[language].securedEmail}</p>
                  <a href="mailto:constantin.nixdorff@mlp.de" className="hover:text-brand-gold transition-colors font-medium break-all">
                    constantin.nixdorff@mlp.de
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200/60">
              <button
                onClick={downloadVCard}
                className="w-full bg-brand-navy hover:bg-brand-navy-light text-white font-sans text-xs font-bold uppercase tracking-widest py-3.5 rounded flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
              >
                <FileText className="w-4 h-4 text-brand-gold" />
                {t[language].downloadVCard}
              </button>
            </div>
          </div>

          {/* Right: Focus Areas & Occupational Groups */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Focus Areas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Briefcase className="w-4 h-4 text-brand-gold" />
                <h4 className="font-serif text-xl font-bold text-brand-navy">{t[language].focusAreasTitle}</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t[language].focusAreas.map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start p-3.5 bg-[#f7f9fb] border border-gray-50 rounded transition-colors hover:bg-brand-gold-light/20">
                    <CheckCircle className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span className="font-sans text-xs sm:text-sm text-gray-700 font-medium leading-tight text-left">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Occupational Groups */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Award className="w-4 h-4 text-brand-gold" />
                <h4 className="font-serif text-xl font-bold text-brand-navy">{t[language].segmentsTitle}</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t[language].occupationalGroups.map((group, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start p-3.5 bg-[#f7f9fb] border border-gray-50 rounded transition-colors hover:bg-brand-gold-light/20">
                    <CheckCircle className="w-4 h-4 text-brand-navy shrink-0 mt-0.5" />
                    <span className="font-sans text-xs sm:text-sm text-gray-700 font-medium leading-tight text-left">
                      {group}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
