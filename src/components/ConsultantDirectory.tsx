import React, { useState } from "react";
import { 
  Users, Star, Calendar, Clock, Check, FileText, Landmark, ShieldCheck, Ticket, UserCheck, Sparkles, ChevronRight, CornerDownRight
} from "lucide-react";
import { Consultant } from "../types";

export default function ConsultantDirectory() {
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [clientBrief, setClientBrief] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  
  // Successful Booking state
  const [bookingPass, setBookingPass] = useState<any | null>(null);

  const consultants: Consultant[] = [
    {
      id: "markus",
      name: "Markus von Preußen",
      title: "Senior Wealth Architect & Partner",
      rating: 4.9,
      experience: "24 Years of Private Banking",
      specialty: "Core Asset Allocation & Multi-Generational Family Estates",
      avatarUrl: "MP",
      bio: "Former Principal Trustee at Sovereign Zurich Bank. Specializes in building highly defensive capital shielding portfolios and structuring multi-generational private asset allocations.",
      availableSlots: [
        "Wednesday 10:00 (CET)",
        "Wednesday 14:00 (CET)",
        "Thursday 11:30 (CET)",
        "Friday 09:00 (CET)"
      ]
    },
    {
      id: "elene",
      name: "Dr. Elene Keller",
      title: "Tax Strategy Director & Partner",
      rating: 5.0,
      experience: "18 Years in German Tax Legislation",
      specialty: "German Corporation Fiscal Shielding & Holding Structures",
      avatarUrl: "EK",
      bio: "Leading legal counsel specializing in German GmbH holdings, Sondervermögen structures under Section 26 of the Investment Code, and cross-border European capital shielding.",
      availableSlots: [
        "Tuesday 09:00 (CET)",
        "Tuesday 13:30 (CET)",
        "Thursday 15:00 (CET)",
        "Friday 14:00 (CET)"
      ]
    },
    {
      id: "gabriel",
      name: "Gabriel Vane",
      title: "Director of Alternative Assets & ESG",
      rating: 4.8,
      experience: "15 Years Alternative Capital Management",
      specialty: "SFDR Article 9 ESG Core Filters & Private Debt Placement",
      avatarUrl: "GV",
      bio: "Expert advisor modeling low-correlation alternative assets. Specializes in screening equity pools against EU Green Deal taxonomies to lock down tax-incentivized yield structures.",
      availableSlots: [
        "Monday 11:00 (CET)",
        "Wednesday 15:30 (CET)",
        "Thursday 10:00 (CET)"
      ]
    },
    {
      id: "sarah",
      name: "Sarah Jenkins",
      title: "Senior Retirement Architect",
      rating: 4.9,
      experience: "16 Years in Custody Structures & ETF Framing",
      specialty: "High-Liquidity ETF Ladders & Pension Decumulation Plans",
      avatarUrl: "SJ",
      bio: "Pioneered Vanguard model adaptations for European executive clients. Deep focus on establishing risk-proof debt ladders and decumulation runaways.",
      availableSlots: [
        "Monday 14:00 (CET)",
        "Tuesday 11:00 (CET)",
        "Friday 10:30 (CET)"
      ]
    }
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsultant || !selectedSlot || !clientBrief || !clientEmail) {
      alert("Please complete the required details before finalizing scheduling.");
      return;
    }

    const consultant = consultants.find(c => c.id === selectedConsultant);
    if (!consultant) return;

    // Build the high-end booking pass
    setBookingPass({
      passId: `PA-PASS-${Math.floor(Math.random() * 90000 + 10000)}`,
      consultantName: consultant.name,
      consultantTitle: consultant.title,
      slot: selectedSlot,
      brief: clientBrief,
      email: clientEmail,
      dateBooking: new Date().toLocaleDateString('en-GB')
    });
  };

  const handleCancelBooking = () => {
    setBookingPass(null);
    setSelectedSlot(null);
    setSelectedConsultant(null);
    setClientBrief("");
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-12" id="consultant-directory-workspace">
      
      {/* Dynamic Header */}
      <div className="text-center space-y-4 mb-12">
        <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
          Prestige Roster
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-brand-navy font-bold">
          Strategic Advisory Partners
        </h2>
        <div className="w-12 h-[1px] bg-brand-gold mx-auto"></div>
        <p className="font-sans text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
          Select an expert to request a private briefing. Our advisors are fully certified under BaFin guidelines.
        </p>
      </div>

      {!bookingPass ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Consultants Select Roster */}
          <div className="lg:col-span-7 space-y-6">
            {consultants.map((con) => {
              const isSelected = selectedConsultant === con.id;
              return (
                <div 
                  key={con.id}
                  onClick={() => { setSelectedConsultant(con.id); setSelectedSlot(null); }}
                  className={`bg-white p-6 border rounded cursor-pointer transition-all ${
                    isSelected 
                      ? "border-brand-gold shadow-md" 
                      : "border-gray-200 hover:border-brand-navy"
                  }`}
                  id={`consultant-card-${con.id}`}
                >
                  <div className="flex items-start gap-4 text-left">
                    {/* Portrait Avatar Placeholder */}
                    <div className="w-12 h-12 rounded bg-brand-navy text-brand-gold font-serif flex items-center justify-center font-bold text-base shrink-0 border border-brand-gold/30 shadow-xs">
                      {con.avatarUrl}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-center bg-transparent">
                        <h4 className="font-serif text-base font-bold text-brand-navy">{con.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-brand-gold">
                          <Star className="w-3.5 h-3.5 fill-brand-gold stroke-brand-gold" />
                          <span className="font-sans font-bold">{con.rating}</span>
                        </div>
                      </div>
                      <p className="font-sans text-xs text-brand-gold font-bold uppercase tracking-wider">{con.title}</p>
                      <p className="font-sans text-[11px] text-gray-400 font-bold">{con.experience}</p>
                      <p className="font-sans text-xs text-gray-600 leading-relaxed pt-2 border-t mt-2">{con.bio}</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-3">
                        <span className="bg-background-soft text-brand-navy text-[10px] font-bold px-2 py-1 rounded">
                          {con.specialty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking / Details Sidebar Section */}
          <div className="lg:col-span-5 bg-white border border-border-subtle p-6 rounded shadow-sm text-left sticky top-24">
            {selectedConsultant ? (
              <form onSubmit={handleBookingSubmit} className="space-y-5 animate-fadeIn" id="booking-form-element">
                <p className="font-serif font-bold text-sm text-brand-navy border-b pb-2 uppercase tracking-wide">
                  Schedule Private Briefing
                </p>

                {/* Date slots selector */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Available Consultation Openings
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {consultants.find(c => c.id === selectedConsultant)?.availableSlots.map(slot => {
                      const isSlotSelected = selectedSlot === slot;
                      return (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2.5 border rounded text-left text-xs font-semibold flex justify-between items-center transition-all ${
                            isSlotSelected 
                              ? "bg-brand-gold text-brand-navy border-brand-gold font-bold" 
                              : "bg-background-soft text-gray-700 border-gray-200 hover:border-brand-navy"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {slot}
                          </span>
                          {isSlotSelected && <Check className="w-4 h-4 text-brand-navy" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Briefing Text field */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Describe Capital Profile Brief
                  </label>
                  <textarea
                    value={clientBrief}
                    onChange={(e) => setClientBrief(e.target.value)}
                    placeholder="e.g., Seeking sovereign corporate structures for a tax GmbH in Berlin holding approximately €2M."
                    rows={3}
                    className="w-full bg-background-soft border border-gray-200 p-3 rounded text-xs outline-none focus:border-brand-navy text-gray-700"
                    required
                  />
                </div>

                {/* Email Inputs */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Contact Email (Encrypted Delivery)
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="partner@preußen-holdings.com"
                    className="w-full bg-background-soft border border-gray-200 p-2.5 rounded text-xs outline-none focus:border-brand-navy text-gray-700"
                    required
                  />
                </div>

                {/* Phone Inputs */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Contact Phone (Secured Line)
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+49 174 000000"
                    className="w-full bg-background-soft border border-gray-200 p-2.5 rounded text-xs outline-none focus:border-brand-navy text-gray-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-navy hover:bg-brand-navy-light text-white font-sans text-xs font-bold tracking-[0.1em] uppercase py-3.5 rounded flex items-center justify-center gap-1.5 transform active:scale-95 transition-all shadow-sm mt-3"
                  id="final-book-btn"
                >
                  <UserCheck className="w-4 h-4 text-brand-gold animate-bounce" />
                  Confirm Private Briefing
                </button>
              </form>
            ) : (
              <div className="p-8 text-center text-gray-400 space-y-3">
                <Landmark className="w-10 h-10 mx-auto opacity-30 text-brand-navy" />
                <p className="font-serif text-sm font-semibold text-brand-navy">Adviser Slot Locked</p>
                <p className="font-sans text-xs">Select a Senior Partner Consultant from the roster list on the left to activate scheduling.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* PREMIUM BOOKING TICKET PASS OR RECEIPT */
        <div className="max-w-md mx-auto bg-white border border-brand-gold p-8 rounded-lg shadow-xl relative overflow-hidden animate-fadeIn" id="schedule-pass-receipt">
          
          {/* Decorative Security Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-gold animate-pulse" />
          
          <div className="text-center space-y-4">
            <Ticket className="w-10 h-10 mx-auto text-brand-gold" />
            <h3 className="font-serif text-xl font-bold text-brand-navy">Bespoke briefing secured</h3>
            <p className="font-sans text-[10px] bg-brand-gold-light text-brand-gold px-3 py-1 rounded inline-block font-bold tracking-widest uppercase">
              {bookingPass.passId}
            </p>
          </div>

          <div className="border-t border-b border-gray-100 my-6 py-6 space-y-3.5 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400 font-semibold font-sans uppercase text-[10px]">Consultant Allocated</span>
              <span className="font-serif font-extrabold text-brand-navy text-right">{bookingPass.consultantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-semibold font-sans uppercase text-[10px]">Adviser Capacity</span>
              <span className="font-sans font-bold text-brand-gold text-right">{bookingPass.consultantTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-semibold font-sans uppercase text-[10px]">Session timeslot</span>
              <span className="font-sans font-bold text-brand-navy text-right flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-gold" />
                {bookingPass.slot}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-400 font-semibold font-sans uppercase text-[10px]">Registration Date</span>
              <span className="text-gray-500 font-medium">{bookingPass.dateBooking}</span>
            </div>
            <div className="border-t pt-3">
              <p className="text-gray-400 font-semibold font-sans uppercase text-[10px] mb-1">Strategic Contextbrief</p>
              <p className="bg-background-soft p-3 rounded font-sans italic text-gray-600 leading-relaxed text-[11px]">
                "{bookingPass.brief}"
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-linear-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 rounded p-4 text-xs flex items-start gap-2 text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-gray-500 leading-relaxed">
                A secured invitation has been transmitted to <strong>{bookingPass.email}</strong>. It contains encrypted credential tokens for the secure portal call.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelBooking}
                className="w-full border border-gray-300 text-gray-500 hover:text-brand-navy py-3 px-4 rounded font-sans text-xs font-bold uppercase transition-all"
              >
                Reschedule Session
              </button>
              <button
                onClick={() => setSelectedConsultant(null)}
                className="w-full bg-brand-navy text-white hover:bg-brand-navy-light py-3 px-4 rounded font-sans text-xs font-bold uppercase transition-all"
              >
                Close Receipt
              </button>
            </div>
          </div>

          <p className="text-[9px] text-gray-400 mt-6 text-center leading-relaxed">
            *BaFin compliance: Individual consultations subject to regulatory recording protocols. Credentials not shareable.
          </p>

        </div>
      )}

    </div>
  );
}
