import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ExpertiseHub from "./components/ExpertiseHub";
import ScrollytellingSection from "./components/ScrollytellingSection";
import WealthArchitect from "./components/WealthArchitect";
import ConsultantDirectory from "./components/ConsultantDirectory";
import ContactPage from "./components/ContactPage";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ChatWidget from "./components/ChatWidget";
import CookieBanner from "./components/CookieBanner";
import ImpressumPage from "./components/ImpressumPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import { Mail, ShieldCheck } from "lucide-react";
import { useLanguage } from "./contexts/LanguageContext";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (window.location.pathname === "/admin") {
      return "admin";
    }
    const p = window.location.pathname.replace("/", "");
    if (["expertise", "architect", "directory", "contact", "impressum", "privacy"].includes(p)) {
      return p;
    }
    return "home";
  });

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem("prestige_admin_token");
  });

  const { t } = useLanguage();

  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.pathname === "/admin") {
        setActiveTab("admin");
      } else {
        const p = window.location.pathname.replace("/", "");
        if (["expertise", "architect", "directory", "contact", "impressum", "privacy"].includes(p)) {
          setActiveTab(p);
        } else {
          setActiveTab("home");
        }
      }
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const handleStartArchitectWithSpecialty = (specialty: string) => {
    setInitialSpecialty(specialty);
    handleNavigation("architect");
  };

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    const path = tab === "home" ? "/" : tab === "admin" ? "/admin" : `/${tab}`;
    window.history.pushState({}, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Expose navigation for CookieBanner (outside React tree)
  useEffect(() => {
    (window as any).__cnNavigate = handleNavigation;
  }, []);

  const handleAdminLogin = (token: string) => {
    sessionStorage.setItem("prestige_admin_token", token);
    setAdminToken(token);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("prestige_admin_token");
    setAdminToken(null);
    handleNavigation("home");
  };

  const [initialSpecialty, setInitialSpecialty] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-gray-800 font-sans flex flex-col selection:bg-brand-gold-light selection:text-brand-navy">

      {/* Hide standard header on admin dashboard page to maximize screen space for table fields */}
      {activeTab !== "admin" ? (
        <Header
          activeTab={activeTab}
          setActiveTab={handleNavigation}
          onOpenOnboarding={() => handleNavigation("contact")}
        />
      ) : null}

      <main className={`flex-1 ${activeTab !== "admin" ? "pt-16" : ""}`}>

        {activeTab === "home" && (
          <div className="animate-fadeIn">
            <Hero
              onStartArchitect={() => handleNavigation("architect")}
              onViewServices={() => handleNavigation("expertise")}
              onViewAdvisors={() => handleNavigation("directory")}
            />

            <section className="bg-white py-16 px-5 border-b border-border-subtle text-left">
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="font-sans text-[10px] font-semibold text-brand-gold uppercase tracking-[0.25em]">
                    {t("custody.tag")}
                  </span>
                  <h3 className="font-serif text-2xl text-brand-navy" style={{ fontWeight: 700 }}>
                    {t("custody.title")}
                  </h3>
                  <p className="font-sans text-sm text-gray-500 leading-relaxed">
                    {t("custody.desc")}
                  </p>
                </div>

                <div className="bg-background-soft p-6 rounded border border-gray-100 flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-navy/5 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-brand-gold" />
                    </div>
                    <span className="font-serif text-sm font-light text-brand-navy">{t("custody.cardTitle")}</span>
                  </div>
                  <p className="font-sans text-xs text-gray-400">
                    {t("custody.cardDesc")}
                  </p>
                </div>
              </div>
            </section>

            <ScrollytellingSection onTriggerAdvisor={handleStartArchitectWithSpecialty} />
            <ExpertiseHub onTriggerAdvisor={handleStartArchitectWithSpecialty} />
          </div>
        )}

        {activeTab === "expertise" && (
          <ExpertiseHub onTriggerAdvisor={handleStartArchitectWithSpecialty} />
        )}

        {activeTab === "architect" && (
          <WealthArchitect
            initialSpecialty={initialSpecialty}
            setActiveTab={handleNavigation}
          />
        )}

        {activeTab === "directory" && (
          <ConsultantDirectory />
        )}

        {activeTab === "contact" && (
          <ContactPage />
        )}

        {activeTab === "impressum" && <ImpressumPage />}
        {activeTab === "privacy" && <PrivacyPolicyPage />}

        {activeTab === "admin" && (
          !adminToken ? (
            <AdminLogin onLoginSuccess={handleAdminLogin} />
          ) : (
            <AdminDashboard onLogout={handleAdminLogout} />
          )
        )}

      </main>

      {activeTab !== "admin" ? <Footer /> : null}
      {activeTab !== "admin" ? <ChatWidget /> : null}
      {activeTab !== "admin" ? <CookieBanner /> : null}

      {/* Mobile sticky contact CTA */}
      {activeTab !== "admin" && (
        <div className="fixed bottom-0 left-0 w-full p-4 z-40 md:hidden pointer-events-none">
          <div className="w-full h-14 pointer-events-auto shadow-xl">
            <button
              onClick={() => handleNavigation("contact")}
              className="w-full h-full bg-brand-navy text-white rounded font-sans text-xs font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform border border-brand-gold/30"
            >
              <Mail className="w-4 h-4 text-brand-gold" />
              {t("mobile.contact")}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
