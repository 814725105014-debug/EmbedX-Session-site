import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { fetchReports } from '../lib/api';
import { SessionReportSummary } from '../types';
import { 
  BarChart3, 
  Users, 
  Clock, 
  ArrowRight, 
  Download, 
  Calendar, 
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<SessionReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReports()
      .then((data) => setReports(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.code.includes(search)
  );

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Session Reports & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Review audience participation, quiz leaderboards, and export results for club records
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by title or 6-digit code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm">Loading session reports...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#151F32]/50 border-2 border-dashed border-slate-800 text-center space-y-3">
            <BarChart3 className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No session reports yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Launch a live presentation to record responses and view rich post-event analytics.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-2xl bg-[#151F32]/80 border border-slate-700/60 hover:border-slate-500 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                      PIN: {r.code}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      r.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {r.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(r.startedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {r.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      {r.totalParticipants} Participants
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                      {r.totalResponses} Total Responses
                    </span>
                    <span className="flex items-center gap-1 hidden sm:inline-flex">
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      {r.totalSlides} Slides
                    </span>
                  </div>
                </div>

                {/* Report Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <a
                    href={`/api/reports/${r.id}/export`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </a>

                  <Link
                    to={`/reports/${r.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold transition-colors shadow-md"
                  >
                    <span>View Analytics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

