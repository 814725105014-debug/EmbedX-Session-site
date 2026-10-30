import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { checkSessionCode } from '../lib/api';
import { Smartphone, User, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

const AVATAR_OPTIONS = ['🤖', '⚡', '🚀', '💻', '🔬', '🎯', '🛠️', '💡', '🏆', '🔥'];

export const JoinPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [sessionCode, setSessionCode] = useState(initialCode);
  const [nickname, setNickname] = useState(() => {
    return localStorage.getItem('embedx_participant_nickname') || '';
  });
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem('embedx_participant_avatar') || '⚡';
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = sessionCode.replace(/\s+/g, '');

    if (cleanCode.length !== 6) {
      setError('Please enter a valid 6-digit session PIN.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Validate session with backend
      await checkSessionCode(cleanCode);

      // Save nickname & avatar
      localStorage.setItem('embedx_participant_nickname', nickname.trim() || 'Student');
      localStorage.setItem('embedx_participant_avatar', avatar);

      navigate(`/session/${cleanCode}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Bar */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between pt-2">
        <Logo size="sm" showSubtitle={false} />
        <Link to="/login" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
          Presenter Sign In →
        </Link>
      </header>

      {/* Center Join Card */}
      <main className="w-full max-w-md mx-auto my-auto py-6">
        <div className="rounded-3xl bg-[#101828]/95 border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 mb-2">
              <Smartphone className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Join Live Session</h1>
            <p className="text-xs text-slate-400">
              Department of EEE • SRM TRP Engineering College
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleJoin} className="space-y-4">
            {/* 6-Digit PIN Code */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                6-Digit Session PIN
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                placeholder="000 000"
                value={sessionCode}
                onChange={(e) => {
                  setSessionCode(e.target.value.replace(/\D/g, ''));
                  setError(null);
                }}
                className="w-full text-center text-3xl sm:text-4xl font-mono tracking-[0.4em] font-black py-3.5 rounded-2xl bg-slate-900 border-2 border-slate-700 focus:border-cyan-400 text-cyan-300 focus:outline-none shadow-inner"
              />
            </div>

            {/* Nickname */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Your Nickname
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={25}
                  placeholder="e.g. CircuitRider / Priya / Rohit"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Avatar Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Choose an Avatar
              </label>
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                      avatar === emoji
                        ? 'bg-cyan-500/20 border-2 border-cyan-400 scale-110 shadow-sm'
                        : 'bg-slate-900 border border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={sessionCode.length !== 6 || loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-sm shadow-xl shadow-cyan-950/50 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
              >
                <span>{loading ? 'Entering Session...' : 'Enter Live Session'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-500">
              No registration or download required.
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-slate-500 pb-2">
        EMBEDX Interactive • Department of EEE, SRM TRP Engineering College
      </footer>
    </div>
  );
};

