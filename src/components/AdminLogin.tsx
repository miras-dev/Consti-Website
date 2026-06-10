import React, { useState } from "react";
import { Lock, User, Landmark, ShieldCheck } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Authentication failed");
      }

      const data = await res.json();
      onLoginSuccess(data.token);
    } catch (err: any) {
      setError(err.message || "Invalid administrative credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1c2e] flex items-center justify-center px-5 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl transform translate-x-20 -translate-y-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-navy-light/10 rounded-full blur-3xl transform -translate-x-20 translate-y-20" />
      
      <div className="max-w-md w-full space-y-8 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl shadow-2xl relative z-10">
        
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-brand-gold-light/10 border border-brand-gold/30 flex items-center justify-center mx-auto shadow-md">
            <Landmark className="w-6 h-6 text-brand-gold" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wider">PRESTIGE CRM</h2>
          <p className="font-sans text-xs text-gray-400">Secure Administrative Gateway Access</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3.5 rounded text-center font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-3 rounded text-sm text-white placeholder-gray-500 outline-none focus:border-brand-gold transition-colors font-sans"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-brand-gold uppercase tracking-widest">
              Security PIN / Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-3 rounded text-sm text-white placeholder-gray-500 outline-none focus:border-brand-gold transition-colors font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold text-brand-navy hover:bg-brand-gold-light py-3.5 font-sans text-xs font-bold tracking-[0.2em] uppercase rounded flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-lg disabled:opacity-50"
          >
            {loading ? "Authorizing..." : "Authorize Access"}
          </button>
        </form>

        <div className="border-t border-white/10 pt-4 text-center flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
          <span className="font-sans text-[9px] text-gray-400 uppercase tracking-widest">BaFin Compliance Audited</span>
        </div>

      </div>
    </div>
  );
}
