"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ParticlesBackground } from "@/app/components/ParticlesBackground";
import { createClient } from "@/lib/supabase-browser";
import { Lock, Mail, CheckCircle } from "lucide-react";
const ALLOWED_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
      setError("This email is not authorized.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };
  if (sent) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative">
        <ParticlesBackground />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-sm px-4">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-white text-xl font-bold mb-2">Check your email</h2>
            <p className="text-gray-400 text-sm">
              We sent a magic link to <span className="text-white font-medium">{email}</span>.
              Click it to access the admin panel.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative">
      <ParticlesBackground />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm px-4">
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-[#fe8d32]/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-[#fe8d32]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-gray-500 text-sm mt-1">CSC MUJ Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fe8d32] transition-colors"
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-linear-to-r from-[#fe8d32] to-[#f8be19] rounded-lg text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : "Send Magic Link"
              }
            </button>
          </form>
          <p className="text-gray-600 text-xs text-center mt-6">
            A login link will be sent to your email. No password needed.
          </p>
        </div>
      </motion.div>
    </div>
  );
}