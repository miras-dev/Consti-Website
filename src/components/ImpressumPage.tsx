import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function ImpressumPage() {
  const { language } = useLanguage();
  const isDE = language === "de";

  return (
    <div className="max-w-3xl mx-auto px-5 py-16 text-left font-sans">
      <h1 className="font-serif text-3xl font-bold text-brand-navy mb-8">Impressum</h1>

      <section className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <div>
          <h2 className="font-semibold text-brand-navy mb-1">{isDE ? "Angaben gemäß § 5 TMG" : "Information pursuant to § 5 TMG"}</h2>
          <p>Constantin Nixdorff<br />
            [ADDRESS — bitte vor Veröffentlichung ergänzen]<br />
            Deutschland
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-brand-navy mb-1">{isDE ? "Kontakt" : "Contact"}</h2>
          <p>
            E-Mail: <a href="mailto:constantin.nixdorff@mlp.de" className="text-brand-gold hover:underline">constantin.nixdorff@mlp.de</a>
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-brand-navy mb-1">{isDE ? "Berufsbezeichnung und berufsrechtliche Regelungen" : "Professional title and regulations"}</h2>
          <p>
            {isDE
              ? "Finanzberater / Vermögensberater. Die zuständige Aufsichtsbehörde ist die Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)."
              : "Financial Advisor / Wealth Advisor. The competent supervisory authority is the Federal Financial Supervisory Authority (BaFin)."}
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-brand-navy mb-1">{isDE ? "Haftung für Inhalte" : "Liability for content"}</h2>
          <p>
            {isDE
              ? "Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen."
              : "As a service provider, we are responsible for our own content on this website under general laws pursuant to § 7 para. 1 TMG. However, according to §§ 8 to 10 TMG, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity."}
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-brand-navy mb-1">{isDE ? "Urheberrecht" : "Copyright"}</h2>
          <p>
            {isDE
              ? "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers."
              : "The content and works created by the site operators on these pages are subject to German copyright law. Reproduction, editing, distribution and any kind of use outside the limits of copyright law require the written consent of the respective author or creator."}
          </p>
        </div>
      </section>
    </div>
  );
}
