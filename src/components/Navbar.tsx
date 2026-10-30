import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { 
  Play, 
  LayoutDashboard, 
  FileText, 
  Layers, 
  BarChart3, 
  ShieldAlert, 
  LogIn, 
  LogOut, 
  UserCheck, 
  Smartphone,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, switchRole, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pinInput, setPinInput] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleQuickJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.replace(/\s+/g, '');
    if (cleanPin.length === 6) {
      navigate(`/session/${cleanPin}`);
      setShowJoinModal(false);
      setPinInput('');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0B1220]/85 border-b border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive('/dashboard') 
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </span>
            </Link>

            <Link
              to="/presentations"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive('/presentations') 
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                Presentations
              </span>
            </Link>

            <Link
              to="/templates"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive('/templates') 
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Templates
              </span>
            </Link>

            <Link
              to="/reports"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive('/reports') 
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" />
                Reports
              </span>
            </Link>

            {(role === 'super_admin' || role === 'club_admin') && (
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive('/admin') 
                    ? 'text-purple-400 bg-purple-950/40 border border-purple-800/50' 
                    : 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/30'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Admin
                </span>
              </Link>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Join Button */}
            <button
              onClick={() => setShowJoinModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-900/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Smartphone className="w-4 h-4" />
              <span>Join Session</span>
            </button>

            {/* Role Switcher & User Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 font-medium transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="capitalize hidden lg:inline-block">
                    {role.replace('_', ' ')}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#151F32] border border-slate-700/90 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-700/60 mb-1">
                      <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <p className="px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Switch Role
                      </p>
                      <button
                        onClick={() => { switchRole('super_admin'); setShowRoleMenu(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                          role === 'super_admin' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        Super Admin
                        {role === 'super_admin' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </button>

                      <button
                        onClick={() => { switchRole('club_admin'); setShowRoleMenu(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                          role === 'club_admin' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        Club Admin
                        {role === 'club_admin' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </button>

                      <button
                        onClick={() => { switchRole('presenter'); setShowRoleMenu(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                          role === 'presenter' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        Presenter
                        {role === 'presenter' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </button>
                    </div>

                    <div className="border-t border-slate-700/60 pt-1 mt-1">
                      <button
                        onClick={() => { logout(); setShowRoleMenu(false); navigate('/login'); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/30 rounded-lg flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Quick Join PIN Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-[#101828] border border-cyan-500/40 p-6 shadow-2xl">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ×
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 text-cyan-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Join an EMBEDX Session</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the 6-digit code shown on the presenter screen
              </p>
            </div>

            <form onSubmit={handleQuickJoin} className="space-y-4">
              <input
                type="text"
                autoFocus
                maxLength={6}
                placeholder="123456"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-3xl font-mono tracking-[0.5em] font-extrabold py-3 rounded-xl bg-slate-900 border-2 border-slate-700 focus:border-cyan-400 text-cyan-300 focus:outline-none"
              />
              <button
                type="submit"
                disabled={pinInput.length !== 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-cyan-900/40 transition-all"
              >
                Enter Session
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
