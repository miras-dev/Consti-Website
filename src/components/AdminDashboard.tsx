import React, { useState, useEffect } from "react";
import { Landmark, ArrowLeft, RefreshCw, Save, LogOut, History, CheckCircle, FileEdit, Undo2, Users, Calendar, Check, Trash2, Clock } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface AdminDashboardProps {
  onLogout: () => void;
}

interface VersionItem {
  id: string;
  timestamp: string;
  author: string;
  description: string;
}

interface LeadItem {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  meetingDate: string;
  meetingTime: string;
  meetingType: string;
  notes: string;
  status: string;
}

const GROUPS = [
  {
    id: "header",
    name: "General Header & Contact",
    keys: ["header.contact", "mobile.contact"]
  },
  {
    id: "hero",
    name: "Hero Section & Metrics",
    keys: [
      "hero.tag", "hero.title", "hero.titleItalic", "hero.desc", 
      "hero.btnLaunch", "hero.btnExplore", "hero.metricAssets", 
      "hero.metricRegulated", "hero.metricRetention", "hero.quote"
    ]
  },
  {
    id: "custody",
    name: "Capital Custody Guards",
    keys: ["custody.tag", "custody.title", "custody.desc", "custody.cardTitle", "custody.cardDesc"]
  },
  {
    id: "capabilities",
    name: "Capabilities (General)",
    keys: ["capabilities.tag", "capabilities.title", "capabilities.titleItalic", "capabilities.explore", "capabilities.activeModule"]
  },
  {
    id: "modules",
    name: "Capabilities (Modules)",
    keys: [
      "module.planning.title", "module.planning.subtitle", "module.planning.desc",
      "module.investment.title", "module.investment.subtitle", "module.investment.desc",
      "module.retirement.title", "module.retirement.subtitle", "module.retirement.desc",
      "module.insurance.title", "module.insurance.subtitle", "module.insurance.desc",
      "module.career.title", "module.career.subtitle", "module.career.desc",
      "module.tax.title", "module.tax.subtitle", "module.tax.desc",
      "module.salary.title", "module.salary.subtitle", "module.salary.desc",
      "module.international.title", "module.international.subtitle", "module.international.desc",
      "module.sustainable.title", "module.sustainable.subtitle", "module.sustainable.desc"
    ]
  },
  {
    id: "directory",
    name: "Consultant Directory & Tickets",
    keys: [
      "directory.tag", "directory.title", "directory.desc", "directory.scheduleTitle", "directory.slotsLabel",
      "directory.briefLabel", "directory.briefPlaceholder", "directory.emailLabel", "directory.emailPlaceholder",
      "directory.phoneLabel", "directory.phonePlaceholder", "directory.confirmBtn", "directory.slotLockedTitle",
      "directory.slotLockedDesc", "directory.bookingSecured", "directory.passConsultant", "directory.passCapacity",
      "directory.passTimeslot", "directory.passDate", "directory.passBrief", "directory.passEmailTransmitted",
      "directory.rescheduleBtn", "directory.closeBtn", "directory.bafinNotice"
    ]
  },
  {
    id: "profiles",
    name: "Adviser Profiles",
    keys: [
      "consultant.markus.title", "consultant.markus.experience", "consultant.markus.specialty", "consultant.markus.bio",
      "consultant.elene.title", "consultant.elene.experience", "consultant.elene.specialty", "consultant.elene.bio",
      "consultant.gabriel.title", "consultant.gabriel.experience", "consultant.gabriel.specialty", "consultant.gabriel.bio",
      "consultant.sarah.title", "consultant.sarah.experience", "consultant.sarah.specialty", "consultant.sarah.bio"
    ]
  },
  {
    id: "wizard",
    name: "Wealth Architect (Profiler Wizard)",
    keys: [
      "architect.loadingTitle", "architect.initializing", "architect.step1", "architect.step2", "architect.step3",
      "architect.setupTitle", "architect.setupDesc", "architect.nameLabel", "architect.namePlaceholder",
      "architect.emailLabel", "architect.emailPlaceholder", "architect.jurisdictionLabel", "architect.jurOption1",
      "architect.jurOption2", "architect.jurOption3", "architect.jurOption4", "architect.continueBtn",
      "architect.capitalTitle", "architect.capitalDesc", "architect.assetRangeLabel", "architect.objectiveLabel",
      "architect.objOption1", "architect.objOption2", "architect.objOption3", "architect.objOption4",
      "architect.riskLabel", "architect.riskOption1", "architect.riskOption2", "architect.riskOption3",
      "architect.prevStep", "architect.configureFocus", "architect.focusTitle", "architect.focusDesc",
      "architect.lensesLabel", "architect.submitBtn", "report.bannerProtocol", "report.resetBtn",
      "report.confidential", "report.proposalTitle", "report.allocationTitle", "report.consolidatedPool",
      "report.allReallocated", "report.esgIndex", "report.pillarsTitle", "report.actionableDeployment",
      "report.tacticsTitle", "report.timelineTitle", "chat.seniorPartner", "chat.activeSession",
      "chat.securedLine", "chat.loadingStatus", "chat.inputPlaceholder", "chat.transmit", "chat.mockFallback"
    ]
  },
  {
    id: "contact",
    name: "Contact Page Fields",
    keys: [
      "contact.tag", "contact.title", "contact.titleItalic", "contact.desc", "contact.email", "contact.privateLine",
      "contact.headquarters", "contact.hqCities", "contact.confidential", "contact.fullName", "contact.namePlaceholder",
      "contact.emailAddress", "contact.emailPlaceholder", "contact.subject", "contact.subOption", "contact.subOption1",
      "contact.subOption2", "contact.subOption3", "contact.subOption4", "contact.subOption5", "contact.subOption6",
      "contact.message", "contact.msgPlaceholder", "contact.sendBtn", "contact.receivedTitle", "contact.receivedDesc"
    ]
  },
  {
    id: "footer",
    name: "Website Footer Links",
    keys: [
      "footer.weeklyBrief", "footer.briefDesc", "footer.emailPlaceholder", "footer.subscribe", "footer.subscribed",
      "footer.brandDesc", "footer.globalNetwork", "footer.london", "footer.berlin", "footer.zurich", "footer.newyork",
      "footer.governance", "footer.bafinAudit", "footer.sfdr", "footer.ethics", "footer.mifid", "footer.securedPortals",
      "footer.privacy", "footer.terms", "footer.esg", "footer.registry", "footer.copyright"
    ]
  }
];

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { reloadContent } = useLanguage();
  const [activeGroup, setActiveGroup] = useState(GROUPS[0].id);
  const [translations, setTranslations] = useState<any>({ en: {}, de: {} });
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [changeLog, setChangeLog] = useState("");
  const [saving, setSaving] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Sub-tabs states
  const [subTab, setSubTab] = useState<"crm" | "chatbot" | "leads">("crm");
  
  // Chatbot configuration states
  const [chatbotInstructions, setChatbotInstructions] = useState("");
  const [chatbotModel, setChatbotModel] = useState("gpt-4o-mini");
  const [chatbotTemp, setChatbotTemp] = useState(0.7);
  const [chatbotConfigSaving, setChatbotConfigSaving] = useState(false);

  // RAG Resources states
  const [resources, setResources] = useState<{ name: string; size: number; wordCount: number }[]>([]);
  const [resourceUploading, setResourceUploading] = useState(false);

  // Leads & Bookings states
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  const loadLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data || []);
      }
    } catch (err) {
      console.error("Failed to load leads", err);
    } finally {
      setLeadsLoading(false);
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    setNotice(null);
    try {
      const res = await fetch("/api/admin/leads/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setNotice({ text: "Lead status updated successfully.", type: "success" });
        loadLeads();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (err: any) {
      setNotice({ text: err.message || "Failed to update status", type: "error" });
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead/booking?")) return;
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setNotice({ text: "Lead deleted successfully.", type: "success" });
        loadLeads();
      } else {
        throw new Error("Failed to delete lead");
      }
    } catch (err: any) {
      setNotice({ text: err.message || "Failed to delete lead", type: "error" });
    }
  };

  useEffect(() => {
    if (subTab === "leads") {
      loadLeads();
    }
  }, [subTab]);

  const loadData = async () => {
    try {
      const contentRes = await fetch("/api/content");
      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setTranslations(contentData);
      }

      const versionsRes = await fetch("/api/content/versions");
      if (versionsRes.ok) {
        const versionsData = await versionsRes.json();
        setVersions(versionsData);
      }

      // Load chatbot settings
      const chatConfigRes = await fetch("/api/chatbot/config");
      if (chatConfigRes.ok) {
        const chatConfigData = await chatConfigRes.json();
        setChatbotInstructions(chatConfigData.instructions || "");
        setChatbotModel(chatConfigData.model || "gpt-4o-mini");
        setChatbotTemp(chatConfigData.temperature !== undefined ? chatConfigData.temperature : 0.7);
      }

      // Load chatbot resources list
      const chatResourcesRes = await fetch("/api/chatbot/resources");
      if (chatResourcesRes.ok) {
        const chatResourcesData = await chatResourcesRes.json();
        setResources(chatResourcesData || []);
      }

      // Load captured leads list
      loadLeads();
    } catch (err) {
      console.error("Failed to load CRM data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveChatbotConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setChatbotConfigSaving(true);
    setNotice(null);

    try {
      const res = await fetch("/api/chatbot/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instructions: chatbotInstructions,
          model: chatbotModel,
          temperature: chatbotTemp
        })
      });

      if (!res.ok) throw new Error("Failed to save chatbot configurations");

      setNotice({ text: "AI Advisor configurations updated successfully.", type: "success" });
    } catch (err: any) {
      setNotice({ text: err.message || "Failed to save advisor settings", type: "error" });
    } finally {
      setChatbotConfigSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResourceUploading(true);
    setNotice(null);

    try {
      const reader = new FileReader();
      
      const fileDataPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1] || result;
          resolve(base64);
        };
        reader.onerror = reject;
      });

      reader.readAsDataURL(file);
      const base64Data = await fileDataPromise;

      const res = await fetch("/api/chatbot/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          data: base64Data
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to process and upload file");
      }

      setNotice({ text: `Successfully parsed and indexed "${file.name}" into RAG memory.`, type: "success" });
      await loadData();
    } catch (err: any) {
      setNotice({ text: err.message || "File upload failed", type: "error" });
    } finally {
      setResourceUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteResource = async (name: string) => {
    setNotice(null);
    try {
      const res = await fetch(`/api/chatbot/resources/${encodeURIComponent(name)}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete resource");

      setNotice({ text: `Deleted resource "${name}" from chatbot index.`, type: "success" });
      await loadData();
    } catch (err: any) {
      setNotice({ text: err.message || "Deletion failed", type: "error" });
    }
  };

  const handleInputChange = (lang: "en" | "de", key: string, value: string) => {
    setTranslations((prev: any) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value
      }
    }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    const logText = changeLog.trim() || `Updated fields in group '${activeGroup}'`;

    try {
      const res = await fetch("/api/content/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: translations,
          description: logText
        })
      });

      if (!res.ok) throw new Error("Failed to save translations");

      setChangeLog("");
      setNotice({ text: "Site content updated successfully. Live page updated.", type: "success" });
      await reloadContent(); // Reload local context state
      await loadData(); // Reload backend versions list
    } catch (err: any) {
      setNotice({ text: err.message || "Failed to save adjustments", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    setRestoring(versionId);
    setNotice(null);

    try {
      const res = await fetch("/api/content/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId })
      });

      if (!res.ok) throw new Error("Failed to restore target version");

      setNotice({ text: `Successfully rolled back to version ${versionId}.`, type: "success" });
      await reloadContent(); // Sync context
      await loadData(); // Reload dashboard
    } catch (err: any) {
      setNotice({ text: err.message || "Failed to rollback", type: "error" });
    } finally {
      setRestoring(null);
    }
  };

  const currentGroup = GROUPS.find((g) => g.id === activeGroup);

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col font-sans">
      
      {/* Top Admin Header */}
      <header className="bg-brand-navy text-white h-16 shrink-0 border-b border-white/5 px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Landmark className="w-5 h-5 text-brand-gold" />
          <h1 className="font-serif text-lg tracking-wider font-extrabold text-brand-gold">Prestige CRM Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.pushState({}, "", "/")}
            className="text-xs font-semibold text-gray-300 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            View Website
          </button>
          
          <button
            onClick={onLogout}
            className="bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded flex items-center gap-2 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </header>

      {/* Sub-Header Tab Bar */}
      <div className="bg-[#0e1e33] text-white shrink-0 border-b border-white/5 px-6 py-2.5 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => setSubTab("crm")}
          className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-all cursor-pointer ${
            subTab === "crm"
              ? "bg-brand-gold text-brand-navy"
              : "text-gray-300 hover:text-white hover:bg-white/5"
          }`}
        >
          CRM Translations
        </button>
        <button
          onClick={() => setSubTab("chatbot")}
          className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-all cursor-pointer ${
            subTab === "chatbot"
              ? "bg-brand-gold text-brand-navy"
              : "text-gray-300 hover:text-white hover:bg-white/5"
          }`}
        >
          AI Chatbot & RAG Settings
        </button>
        <button
          onClick={() => setSubTab("leads")}
          className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-all cursor-pointer ${
            subTab === "leads"
              ? "bg-brand-gold text-brand-navy"
              : "text-gray-300 hover:text-white hover:bg-white/5"
          }`}
        >
          Client Leads & Bookings
        </button>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {subTab === "crm" ? (
          <>
            {/* Left Side: CRM Group Nav */}
            <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto space-y-1.5 hidden md:block text-left shrink-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">Content Sections</p>
              {GROUPS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGroup(g.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-all ${
                    activeGroup === g.id
                      ? "bg-brand-navy text-white"
                      : "text-gray-600 hover:bg-background-soft hover:text-brand-navy"
                  }`}
                >
                  <span>{g.name}</span>
                  {activeGroup === g.id && <CheckCircle className="w-3.5 h-3.5 text-brand-gold shrink-0" />}
                </button>
              ))}
            </aside>

            {/* Center: Content Inputs Editor */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 text-left">
              
              {/* Mobile Group Select */}
              <div className="md:hidden">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Select Page Section</label>
                <select
                  value={activeGroup}
                  onChange={(e) => setActiveGroup(e.target.value)}
                  className="w-full bg-white border px-4 py-2.5 rounded text-xs font-semibold uppercase text-brand-navy"
                >
                  {GROUPS.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center bg-transparent">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-brand-navy">{currentGroup?.name}</h2>
                  <p className="font-sans text-xs text-gray-400">Edit translation keys for this page segment below.</p>
                </div>
                <button
                  onClick={loadData}
                  title="Refresh database entries"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {notice && (
                <div className={`p-4 rounded border text-xs leading-relaxed ${
                  notice.type === "success" 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                  {notice.text}
                </div>
              )}

              <form onSubmit={handleSaveChanges} className="space-y-6">
                
                {/* Input grid */}
                <div className="bg-white border border-gray-200 rounded p-6 md:p-8 space-y-6 shadow-xs">
                  {currentGroup?.keys.map((key) => {
                    const enVal = translations.en[key] || "";
                    const deVal = translations.de[key] || "";
                    const isLongText = enVal.length > 50 || deVal.length > 50;

                    return (
                      <div key={key} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-sans text-[11px] font-bold text-brand-gold uppercase tracking-widest">{key}</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* English Input */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                              <span>English (EN)</span>
                            </label>
                            {isLongText ? (
                              <textarea
                                rows={3}
                                value={enVal}
                                onChange={(e) => handleInputChange("en", key, e.target.value)}
                                className="w-full bg-background-soft border border-gray-200 p-3 rounded text-xs text-gray-800 outline-none focus:border-brand-navy resize-none leading-relaxed"
                              />
                            ) : (
                              <input
                                type="text"
                                value={enVal}
                                onChange={(e) => handleInputChange("en", key, e.target.value)}
                                className="w-full bg-background-soft border border-gray-200 px-3 py-2.5 rounded text-xs text-gray-800 outline-none focus:border-brand-navy"
                              />
                            )}
                          </div>

                          {/* German Input */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                              <span>German (DE)</span>
                            </label>
                            {isLongText ? (
                              <textarea
                                rows={3}
                                value={deVal}
                                onChange={(e) => handleInputChange("de", key, e.target.value)}
                                className="w-full bg-background-soft border border-gray-200 p-3 rounded text-xs text-gray-800 outline-none focus:border-brand-navy resize-none leading-relaxed"
                              />
                            ) : (
                              <input
                                type="text"
                                value={deVal}
                                onChange={(e) => handleInputChange("de", key, e.target.value)}
                                className="w-full bg-background-soft border border-gray-200 px-3 py-2.5 rounded text-xs text-gray-800 outline-none focus:border-brand-navy"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Commit Log comment & Save Button */}
                <div className="bg-white border border-gray-200 rounded p-6 shadow-xs flex flex-col sm:flex-row gap-4 items-end justify-between">
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Revision Change Description
                    </label>
                    <input
                      type="text"
                      value={changeLog}
                      onChange={(e) => setChangeLog(e.target.value)}
                      placeholder="e.g., Updated homepage Hero title translations..."
                      className="w-full border border-gray-200 px-4 py-3 rounded text-xs text-gray-700 outline-none focus:border-brand-navy bg-background-soft"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-md shrink-0 w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4 text-brand-gold" />
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>

              </form>
            </main>

            {/* Right Side: Version Rollback Timeline Panel */}
            <aside className="w-80 bg-white border-l border-gray-200 p-5 overflow-y-auto hidden lg:block text-left shrink-0">
              <div className="flex items-center gap-2 border-b pb-3 mb-4">
                <History className="w-4 h-4 text-brand-gold" />
                <h3 className="font-serif font-bold text-sm text-brand-navy uppercase tracking-wider">Version History Control</h3>
              </div>

              <div className="space-y-4">
                {versions.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">No edit revisions logged yet.</p>
                ) : (
                  versions.map((ver) => (
                    <div key={ver.id} className="border border-gray-100 bg-background-soft p-3.5 rounded relative text-xs space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-brand-gold uppercase text-[9px] tracking-wider">{ver.id}</p>
                          <p className="text-[10px] text-gray-400 font-bold">
                            {new Date(ver.timestamp).toLocaleDateString()} at {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <p className="font-sans text-[11px] text-gray-600 leading-relaxed italic">
                        "{ver.description}"
                      </p>

                      <button
                        onClick={() => handleRestoreVersion(ver.id)}
                        disabled={restoring !== null}
                        className="w-full bg-brand-navy/5 border border-brand-navy/10 hover:bg-brand-navy hover:text-white hover:border-brand-navy text-[10px] font-bold uppercase tracking-wider py-1.5 rounded transition-all flex items-center justify-center gap-1"
                      >
                        <Undo2 className="w-3 h-3 text-brand-gold" />
                        {restoring === ver.id ? "Restoring..." : "Restore Version"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </aside>
          </>
        ) : subTab === "chatbot" ? (
          /* AI Chatbot Configuration View */
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 text-left bg-background-soft">
            <div className="max-w-5xl mx-auto space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-navy">AI Chatbot & Knowledge Base</h2>
                <p className="font-sans text-xs text-gray-400">Configure client-facing advisory chatbot settings, personality, and knowledge base resources (RAG).</p>
              </div>

              {notice && (
                <div className={`p-4 rounded border text-xs leading-relaxed ${
                  notice.type === "success" 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                  {notice.text}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Columns: Chatbot Settings Form */}
                <div className="lg:col-span-2 space-y-6">
                  <form onSubmit={handleSaveChatbotConfig} className="bg-white border border-gray-200 rounded p-6 md:p-8 space-y-6 shadow-xs">
                    <h3 className="font-serif text-lg font-bold text-brand-navy border-b pb-3 flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-brand-gold" />
                      Advisor Settings
                    </h3>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest">
                        System Personality & Instructions (System Prompt)
                      </label>
                      <p className="text-[10px] text-gray-400">Instruct the advisor how to behave, respond, and present themselves to clients.</p>
                      <textarea
                        rows={8}
                        value={chatbotInstructions}
                        onChange={e => setChatbotInstructions(e.target.value)}
                        placeholder="Define prompt rules..."
                        className="w-full bg-background-soft border border-gray-200 p-4 rounded text-xs text-gray-800 outline-none focus:border-brand-navy resize-none leading-relaxed font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest">
                          OpenAI Model Selection
                        </label>
                        <select
                          value={chatbotModel}
                          onChange={e => setChatbotModel(e.target.value)}
                          className="w-full bg-background-soft border border-gray-200 px-3 py-2.5 rounded text-xs font-semibold text-gray-700 outline-none focus:border-brand-navy"
                        >
                          <option value="gpt-4o-mini">GPT-4o Mini (Recommended)</option>
                          <option value="gpt-4o">GPT-4o</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest flex justify-between">
                          <span>Temperature</span>
                          <span className="text-brand-navy font-bold">{chatbotTemp}</span>
                        </label>
                        <input
                          type="range"
                          min="0.0"
                          max="2.0"
                          step="0.1"
                          value={chatbotTemp}
                          onChange={e => setChatbotTemp(parseFloat(e.target.value))}
                          className="w-full accent-brand-navy cursor-pointer mt-2"
                        />
                        <div className="flex justify-between text-[8px] text-gray-400 font-semibold">
                          <span>0.0 (Factual / Deterministic)</span>
                          <span>2.0 (Creative / Loose)</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={chatbotConfigSaving}
                      className="bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-md w-full md:w-auto ml-auto cursor-pointer"
                    >
                      <Save className="w-4 h-4 text-brand-gold" />
                      {chatbotConfigSaving ? "Saving Settings..." : "Save Chatbot Settings"}
                    </button>
                  </form>
                </div>

                {/* Right Column: RAG Resource Knowledge Base */}
                <div className="space-y-6">
                  {/* File Upload Zone */}
                  <div className="bg-white border border-gray-200 rounded p-6 shadow-xs space-y-4">
                    <h3 className="font-serif text-md font-bold text-brand-navy border-b pb-2 flex items-center gap-2">
                      <FileEdit className="w-4 h-4 text-brand-gold" />
                      Knowledge Upload
                    </h3>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Upload `.pdf` or `.txt` manuals, brochures, or tax structuring guides to expand the advisor's knowledge base. Extracted text will be indexed dynamically.
                    </p>

                    <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-brand-navy transition-colors text-center cursor-pointer group">
                      <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleFileUpload}
                        disabled={resourceUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-2">
                        <RefreshCw className={`w-8 h-8 mx-auto text-gray-400 group-hover:text-brand-gold transition-colors ${resourceUploading ? 'animate-spin text-brand-gold' : ''}`} />
                        <p className="text-xs font-semibold text-gray-600">
                          {resourceUploading ? "Parsing & Uploading..." : "Choose File or Drag Here"}
                        </p>
                        <p className="text-[9px] text-gray-400">PDF or TXT up to 20MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Resource List Table */}
                  <div className="bg-white border border-gray-200 rounded p-6 shadow-xs space-y-4">
                    <h3 className="font-serif text-md font-bold text-brand-navy border-b pb-2 flex items-center gap-2">
                      <History className="w-4 h-4 text-brand-gold" />
                      Indexed Resources
                    </h3>

                    <div className="space-y-3">
                      {resources.length === 0 ? (
                        <p className="text-[10px] text-gray-400 text-center py-6">No resources indexed yet.</p>
                      ) : (
                        resources.map(res => (
                          <div key={res.name} className="border border-gray-100 bg-background-soft p-3.5 rounded flex items-center justify-between text-xs gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-brand-navy truncate" title={res.name}>{res.name}</p>
                              <p className="text-[9px] text-gray-400">
                                {(res.size / 1024).toFixed(1)} KB · {res.wordCount.toLocaleString()} words
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteResource(res.name)}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        ) : (
          /* Client Bookings & Leads View */
          <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 text-left bg-background-soft">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex justify-between items-center bg-transparent">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-brand-navy">Client Bookings & Leads</h2>
                  <p className="font-sans text-xs text-gray-400 font-medium">Review, approve, and manage appointments captured by the AI Assistant.</p>
                </div>
                <button
                  onClick={loadLeads}
                  title="Refresh leads list"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white transition-colors cursor-pointer bg-white/50"
                >
                  <RefreshCw className="w-4 h-4 text-brand-navy" />
                </button>
              </div>

              {notice && (
                <div className={`p-4 rounded border text-xs leading-relaxed ${
                  notice.type === "success" 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                  {notice.text}
                </div>
              )}

              {leadsLoading ? (
                <div className="bg-white border border-gray-200 rounded p-12 text-center text-xs text-gray-400 shadow-xs">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-gold" />
                  Loading leads and appointments database...
                </div>
              ) : leads.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded p-12 text-center text-xs text-gray-400 shadow-xs">
                  <Users className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                  No appointments or leads captured yet. Run client tests to log them.
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded overflow-x-auto shadow-xs">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-brand-gold uppercase tracking-widest">
                        <th className="px-6 py-4">Received / Client</th>
                        <th className="px-6 py-4">Appointment Detail</th>
                        <th className="px-6 py-4">Notes</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs text-gray-600">
                      {leads.map((lead) => {
                        const dateObj = new Date(lead.timestamp);
                        const displayTime = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        
                        let statusBadge = "bg-orange-50 text-orange-700 border-orange-200";
                        if (lead.status === "Confirmed") {
                          statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                        } else if (lead.status === "Followed Up") {
                          statusBadge = "bg-blue-50 text-blue-700 border-blue-200";
                        }

                        return (
                          <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 space-y-1">
                              <p className="font-bold text-brand-navy">{lead.name}</p>
                              <p className="text-[10px] text-gray-400">{displayTime}</p>
                              <div className="space-y-0.5 text-[10px]">
                                {lead.email && <p className="font-mono">✉ {lead.email}</p>}
                                {lead.phone && <p>☎ {lead.phone}</p>}
                              </div>
                            </td>
                            <td className="px-6 py-4 space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-brand-navy">
                                <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                                <span>{lead.meetingDate || "Not Specified"}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{lead.meetingTime || "Not Specified"}</span>
                                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-semibold text-gray-500">
                                  {lead.meetingType}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate leading-relaxed" title={lead.notes}>
                              {lead.notes || <span className="text-gray-300 italic">None</span>}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${statusBadge}`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                              {lead.status !== "Confirmed" && (
                                <button
                                  onClick={() => handleUpdateLeadStatus(lead.id, "Confirmed")}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1.5 rounded font-sans text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border border-emerald-200/50"
                                >
                                  Approve
                                </button>
                              )}
                              {lead.status === "New" && (
                                <button
                                  onClick={() => handleUpdateLeadStatus(lead.id, "Followed Up")}
                                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1.5 rounded font-sans text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border border-blue-200/50"
                                >
                                  Follow Up
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded transition-colors cursor-pointer border border-red-200/30 inline-flex items-center justify-center"
                                title="Delete entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
