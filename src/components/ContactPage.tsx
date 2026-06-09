import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
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
            Get in Touch
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-brand-navy leading-tight" style={{ fontWeight: 700 }}>
            Begin Your <br />
            <span className="italic" style={{ fontWeight: 600 }}>Private Consultation</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left: Contact Info */}
          <div className="space-y-10">
            <p className="font-sans text-sm text-gray-500 leading-relaxed max-w-sm">
              Constantine Nixdorff and his team offer strictly private consultations for high-net-worth individuals and institutional clients. All enquiries are treated with absolute discretion.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-brand-gold-light border border-brand-gold/20 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Email</p>
                  <p className="font-serif text-base text-brand-navy">contact@nixdorff.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-brand-gold-light border border-brand-gold/20 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Private Line</p>
                  <p className="font-serif text-base text-brand-navy">+49 30 000 0000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-brand-gold-light border border-brand-gold/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Headquarters</p>
                  <p className="font-serif text-base text-brand-navy">Unter den Linden, Berlin</p>
                  <p className="font-sans text-xs text-gray-400 mt-0.5">Zürich · London · New York</p>
                </div>
              </div>
            </div>

            {/* Discretion note */}
            <div className="border border-brand-gold/20 bg-brand-gold-light rounded p-4">
              <p className="font-sans text-[11px] text-brand-navy/70 leading-relaxed">
                <span className="font-semibold text-brand-navy">Strictly Confidential.</span> All communications are encrypted and handled exclusively by the Nixdorff advisory team. Response within 24 hours.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-100 rounded p-8 shadow-sm">
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full border border-gray-200 rounded px-4 py-3 font-serif text-sm text-brand-navy outline-none focus:border-brand-navy transition-colors bg-[#f7f9fb]"
                  />
                </div>
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full border border-gray-200 rounded px-4 py-3 font-serif text-sm text-brand-navy outline-none focus:border-brand-navy transition-colors bg-[#f7f9fb]"
                  />
                </div>
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-1.5">Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-200 rounded px-4 py-3 font-serif text-sm text-brand-navy outline-none focus:border-brand-navy transition-colors bg-[#f7f9fb]"
                  >
                    <option value="">Select a topic</option>
                    <option>Wealth Architecture Consultation</option>
                    <option>Tax Optimisation</option>
                    <option>Investment Strategy</option>
                    <option>Retirement Planning</option>
                    <option>International Relocation (Germany)</option>
                    <option>Other Enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Briefly describe your financial situation or question..."
                    className="w-full border border-gray-200 rounded px-4 py-3 font-serif text-sm text-brand-navy outline-none focus:border-brand-navy transition-colors bg-[#f7f9fb] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-navy text-white py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] rounded flex items-center justify-center gap-2 hover:bg-brand-navy-light transition-all active:scale-[0.99]"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Enquiry
                </button>
              </form>
            ) : (
              <div className="bg-white border border-brand-gold/30 rounded p-10 text-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-brand-gold-light border border-brand-gold/30 flex items-center justify-center mx-auto mb-5">
                  <Send className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="font-serif text-2xl text-brand-navy mb-3" style={{ fontWeight: 700 }}>Enquiry Received</h3>
                <p className="font-sans text-xs text-gray-500 leading-relaxed">
                  Thank you. Constantine Nixdorff's team will respond to your enquiry within 24 hours under strict confidentiality.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
