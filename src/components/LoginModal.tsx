import React, { useState } from 'react';
import { X, LogIn, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHoveringGoogle, setIsHoveringGoogle] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for email/password login would go here
    alert("Email/Password login simulated.");
  };

  const handleGoogleLogin = () => {
    // Real OAuth flow would be triggered here
    alert("Google OAuth flow would initiate here.");
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300">
      <div className="bg-[#0a110a] border border-green-900/50 w-full max-w-md rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.15)] flex flex-col overflow-hidden relative transform transition-all animate-in zoom-in-95 duration-500">
        
        {/* Animated Background Elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-green-600/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex justify-between items-center p-6 border-b border-green-900/30">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-2.5 rounded-xl text-green-400 border border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-white text-xl tracking-wide">SECURE <span className="text-green-500">ACCESS</span></h2>
              <span className="text-[10px] text-green-400 font-mono tracking-widest uppercase">Global Eco-Remediation</span>
            </div>
          </div>
          <button onClick={onClose} className="text-green-600/60 hover:text-green-400 p-2 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10 p-8 flex flex-col gap-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            onMouseEnter={() => setIsHoveringGoogle(true)}
            onMouseLeave={() => setIsHoveringGoogle(false)}
            className="w-full relative group overflow-hidden bg-black border border-green-700/50 hover:border-green-400 p-1 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.25)]"
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent transform transition-transform duration-500 ${isHoveringGoogle ? 'translate-x-0' : '-translate-x-full'}`}></div>
            <div className="relative flex items-center justify-center gap-3 bg-[#0d160d] py-3 px-4 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              <span className="text-sm font-bold text-white tracking-wide group-hover:text-green-50 transition-colors">Sign in with Google</span>
            </div>
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px bg-green-900/40 flex-1"></div>
            <span className="text-[10px] text-green-600 font-mono uppercase tracking-widest">Or access via terminal</span>
            <div className="h-px bg-green-900/40 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="group">
              <label className="block text-[10px] font-bold text-green-500 uppercase tracking-wider mb-1.5 font-mono">Email Clearance</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-green-700 group-focus-within:text-green-400 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@eco-network.org"
                  className="w-full bg-black/60 border border-green-900/40 rounded-xl py-3 pl-10 pr-4 text-sm text-green-100 placeholder-green-900/50 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/60 transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-bold text-green-500 uppercase tracking-wider mb-1.5 font-mono">Security Cipher</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-green-700 group-focus-within:text-green-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/60 border border-green-900/40 rounded-xl py-3 pl-10 pr-4 text-sm text-green-100 placeholder-green-900/50 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/60 transition-all font-mono tracking-widest"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full bg-green-600 hover:bg-green-500 text-black font-black text-sm uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Initialize Session
            </button>
          </form>

          <p className="text-center text-[9px] text-green-700 font-mono mt-2 uppercase tracking-widest">
            Level 4 Encrypted Connection Active
          </p>
        </div>
      </div>
    </div>
  );
}
