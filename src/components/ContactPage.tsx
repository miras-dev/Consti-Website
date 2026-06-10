import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] pt-24 pb-20 px-5">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-14 border-l-4 border-brand-gold pl-6">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-brand-gold block mb-2">
            {t("contact.tag")}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-brand-navy leading-tight" style={{ fontWeight: 700 }}>
            {t("contact.title")} <br />
            <span className="italic" style={{ fontWeight: 600 }}>{t("contact.titleItalic")}</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left: Contact Info */}
          <div className="space-y-10">
            <p className="font-sans text-sm text-gray-500 leading-relaxed max-w-sm">
              {t("contact.desc")}
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-brand-gold-light border border-brand-gold/20 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">{t("contact.email")}</p>
                  <p className="font-serif text-base text-brand-navy">contact@nixdorff.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-brand-gold-light border border-brand-gold/20 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">{t("contact.privateLine")}</p>
                  <p className="font-serif text-base text-brand-navy">+49 30 000 0000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-brand-gold-light border border-brand-gold/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">{t("contact.headquarters")}</p>
                  <p className="font-serif text-base text-brand-navy">Unter den Linden, Berlin</p>
                  <p className="font-sans text-xs text-gray-400 mt-0.5">{t("contact.hqCities")}</p>
                </div>
              </div>
            </div>

            {/* Discretion note */}
            <div className="border border-brand-gold/20 bg-brand-gold-light rounded p-4">
              <p className="font-sans text-[11px] text-brand-navy/70 leading-relaxed">
                {t("contact.confidential")}
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-100 rounded p-8 shadow-sm">
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-1.5">{t("contact.fullName")}</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder={t("contact.namePlaceholder")}
                    className="w-full border border-gray-200 rounded px-4 py-3 font-serif text-sm text-brand-navy outline-none focus:border-brand-navy transition-colors bg-[#f7f9fb]"
                  />
                </div>
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-1.5">{t("contact.emailAddress")}</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder={t("contact.emailPlaceholder")}
                    className="w-full border border-gray-200 rounded px-4 py-3 font-serif text-sm text-brand-navy outline-none focus:border-brand-navy transition-colors bg-[#f7f9fb]"
                  />
                </div>
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-1.5">{t("contact.subject")}</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-200 rounded px-4 py-3 font-serif text-sm text-brand-navy outline-none focus:border-brand-navy transition-colors bg-[#f7f9fb]"
                  >
                    <option value="">{t("contact.subOption")}</option>
                    <option>{t("contact.subOption1")}</option>
                    <option>{t("contact.subOption2")}</option>
                    <option>{t("contact.subOption3")}</option>
                    <option>{t("contact.subOption4")}</option>
                    <option>{t("contact.subOption5")}</option>
                    <option>{t("contact.subOption6")}</option>
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-1.5">{t("contact.message")}</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder={t("contact.msgPlaceholder")}
                    className="w-full border border-gray-200 rounded px-4 py-3 font-serif text-sm text-brand-navy outline-none focus:border-brand-navy transition-colors bg-[#f7f9fb] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-navy text-white py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] rounded flex items-center justify-center gap-2 hover:bg-brand-navy-light transition-all active:scale-[0.99]"
                >
                  <Send className="w-3.5 h-3.5" />
                  {t("contact.sendBtn")}
                </button>
              </form>
            ) : (
              <div className="bg-white border border-brand-gold/30 rounded p-10 text-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-brand-gold-light border border-brand-gold/30 flex items-center justify-center mx-auto mb-5">
                  <Send className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="font-serif text-2xl text-brand-navy mb-3" style={{ fontWeight: 700 }}>{t("contact.receivedTitle")}</h3>
                <p className="font-sans text-xs text-gray-500 leading-relaxed">
                  {t("contact.receivedDesc")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
