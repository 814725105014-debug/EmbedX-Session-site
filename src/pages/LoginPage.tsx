import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { UserRole } from '../types';
import { ShieldCheck, User, Users, Smartphone, ArrowRight, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('presenter');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'coordinator@embedx.srmtrp.edu.in', selectedRole);
    navigate('/dashboard');
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    let defaultEmail = 'coordinator@embedx.srmtrp.edu.in';
    if (role === 'super_admin') defaultEmail = 'admin@embedx.srmtrp.edu.in';
    if (role === 'club_admin') defaultEmail = 'lead@embedx.srmtrp.edu.in';
    if (role === 'participant') {
      navigate('/join');
      return;
    }
    login(defaultEmail, role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Sign In to EMBEDX Live</h2>
          <p className="text-xs text-slate-400">
            SRM TRP Engineering College • Dept. of Electrical & Electronics Engineering
          </p>
        </div>

        {/* Quick Demo Role Picker Cards */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
            Fast Access by Role
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickRoleLogin('presenter')}
              className="p-3 rounded-2xl bg-[#101828] border border-cyan-500/30 hover:border-cyan-400 text-left transition-all group"
            >
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <User className="w-4 h-4" />
                <span className="text-xs font-bold text-white group-hover:text-cyan-300">Presenter</span>
              </div>
              <p className="text-[10px] text-slate-400">Create & host live presentations</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleLogin('club_admin')}
              className="p-3 rounded-2xl bg-[#101828] border border-slate-700/80 hover:border-blue-400 text-left transition-all group"
            >
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold text-white group-hover:text-blue-300">Club Admin</span>
              </div>
              <p className="text-[10px] text-slate-400">Manage sessions & club events</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleLogin('super_admin')}
              className="p-3 rounded-2xl bg-[#101828] border border-slate-700/80 hover:border-purple-400 text-left transition-all group"
            >
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold text-white group-hover:text-purple-300">Super Admin</span>
              </div>
              <p className="text-[10px] text-slate-400">Department faculty & controls</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleLogin('participant')}
              className="p-3 rounded-2xl bg-[#101828] border border-emerald-500/30 hover:border-emerald-400 text-left transition-all group"
            >
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Smartphone className="w-4 h-4" />
                <span className="text-xs font-bold text-white group-hover:text-emerald-300">Participant</span>
              </div>
              <p className="text-[10px] text-slate-400">No account required to join</p>
            </button>
          </div>
        </div>

        {/* Standard Email Login Form */}
        <div className="p-6 rounded-3xl bg-[#101828]/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Official College Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="coordinator@embedx.srmtrp.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-xs text-slate-500">
          <Link to="/" className="text-cyan-400 hover:underline">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
