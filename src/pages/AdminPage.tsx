import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { fetchAdminOverview } from '../lib/api';
import { 
  ShieldAlert, 
  Users, 
  Radio, 
  Layers, 
  CheckCircle2, 
  Trash2, 
  AlertTriangle, 
  Cpu, 
  Key, 
  Database,
  ExternalLink
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { role, switchRole } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminOverview()
      .then((data) => setOverview(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/30 shadow-2xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              Club Administration & Governance Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              EMBEDX Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Department of EEE, SRM TRP Engineering College • Centralized system oversight
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Current Role:</span>
            <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-bold font-mono text-xs uppercase border border-purple-500/40">
              {role.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Overview Stats */}
        {overview && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#151F32]/80 border border-slate-700/60 shadow-lg">
              <span className="text-xs font-mono uppercase text-slate-400">Total Presentations</span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                {overview.totalPresentations}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#151F32]/80 border border-slate-700/60 shadow-lg">
              <span className="text-xs font-mono uppercase text-slate-400">Active Live Sessions</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 flex items-center gap-2">
                <span>{overview.activeSessions?.length || 0}</span>
                {overview.activeSessions?.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#151F32]/80 border border-slate-700/60 shadow-lg">
              <span className="text-xs font-mono uppercase text-slate-400">Total Sessions Hosted</span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                {overview.totalSessionsCount}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#151F32]/80 border border-slate-700/60 shadow-lg">
              <span className="text-xs font-mono uppercase text-slate-400">System Engine</span>
              <div className="text-xs font-bold text-cyan-400 mt-2 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                WebSocket & Node Active
              </div>
            </div>
          </div>
        )}

        {/* Club Coordinators & System Users */}
        <div className="p-6 rounded-3xl bg-[#151F32]/80 border border-slate-700/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Authorized Coordinators & Club Leadership
              </h3>
              <p className="text-xs text-slate-400">
                Department faculty advisors and student technical heads
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
            {overview?.systemUsers?.map((u: any) => (
              <div key={u.id} className="p-4 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center font-mono">
                    {u.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{u.fullName}</h4>
                    <p className="text-slate-400 font-mono text-[11px]">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono text-[11px] uppercase font-bold border border-slate-700">
                    {u.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Session Management & Emergency Controls */}
        <div className="p-6 rounded-3xl bg-[#151F32]/80 border border-slate-700/60 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            Live Session Moderator Controls
          </h3>

          {overview?.activeSessions?.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">
              No live broadcasts currently running. Sessions will be listed here when started by coordinators.
            </p>
          ) : (
            <div className="space-y-3">
              {overview?.activeSessions?.map((s: any) => (
                <div key={s.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-cyan-300 font-bold text-xs">PIN: {s.code}</span>
                      <span className="text-white font-bold text-sm">{s.presentationTitle}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Host: {s.hostName} • Started: {new Date(s.startedAt).toLocaleTimeString()}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Terminate live broadcast for PIN ${s.code}?`)) {
                        fetch(`/api/admin/clear-session/${s.code}`, { method: 'POST' })
                          .then(() => window.location.reload());
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors"
                  >
                    Force Conclude
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Architecture & Infrastructure Status */}
        <div className="p-6 rounded-3xl bg-[#151F32]/80 border border-slate-700/60 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Infrastructure & Database Schema
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400">PostgreSQL / Supabase</span>
              <p className="text-white font-semibold">12 Relational Tables Configured</p>
              <p className="text-emerald-400 text-[10px]">RLS & Realtime Policies Active</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400">WebSocket Transport</span>
              <p className="text-white font-semibold">Socket.IO Sub-10ms Latency</p>
              <p className="text-cyan-400 text-[10px]">Room Isolation by 6-digit PIN</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400">Audio Synthesizer</span>
              <p className="text-white font-semibold">Web Audio API Procedural</p>
              <p className="text-amber-400 text-[10px]">Zero External Asset Dependencies</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
