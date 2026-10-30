import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { 
  fetchPresentations, 
  deletePresentation, 
  duplicatePresentation, 
  startLiveSession,
  fetchReports,
  fetchTemplates,
  cloneTemplate
} from '../lib/api';
import { Presentation, SessionReportSummary, Template } from '../types';
import { 
  Play, 
  Plus, 
  Copy, 
  Trash2, 
  Edit3, 
  Layers, 
  Users, 
  BarChart3, 
  Sparkles, 
  Clock, 
  Radio, 
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [reports, setReports] = useState<SessionReportSummary[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [startingId, setStartingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [presData, reportsData, tmplData] = await Promise.all([
        fetchPresentations(),
        fetchReports(),
        fetchTemplates()
      ]);
      setPresentations(presData);
      setReports(reportsData);
      setTemplates(tmplData.slice(0, 3)); // show top 3 templates
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartPresentation = async (presId: string) => {
    try {
      setStartingId(presId);
      const hostName = user?.fullName || 'EMBEDX Coordinator';
      const result = await startLiveSession(presId, hostName);
      navigate(`/present/${result.session.id}`);
    } catch (err) {
      alert('Error launching live presentation session: ' + (err as Error).message);
    } finally {
      setStartingId(null);
    }
  };

  const handleDuplicate = async (presId: string) => {
    try {
      await duplicatePresentation(presId);
      loadData();
    } catch (err) {
      alert('Error duplicating: ' + (err as Error).message);
    }
  };

  const handleDelete = async (presId: string) => {
    if (confirm('Are you sure you want to delete this presentation?')) {
      try {
        await deletePresentation(presId);
        loadData();
      } catch (err) {
        alert('Error deleting: ' + (err as Error).message);
      }
    }
  };

  const handleUseTemplate = async (templateId: string) => {
    try {
      const cloned = await cloneTemplate(templateId);
      navigate(`/editor/${cloned.id}`);
    } catch (err) {
      alert('Error using template: ' + (err as Error).message);
    }
  };

  // Metrics calculation
  const totalAttendees = reports.reduce((acc, r) => acc + (r.totalParticipants || 0), 0);
  const totalResponses = reports.reduce((acc, r) => acc + (r.totalResponses || 0), 0);
  const activeSessions = reports.filter(r => r.status === 'active');

  const filtered = presentations.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome & Quick Action Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101828] via-[#151F32] to-[#101828] border border-slate-700/80 shadow-2xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Department of EEE • SRM TRP
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome, {user?.fullName || 'Presenter'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Create live quizzes, technical polls, and interactive audience experiences for your club sessions.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/editor/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-950/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Presentation</span>
            </Link>

            <Link
              to="/templates"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Templates</span>
            </Link>
          </div>
        </div>

        {/* Participation Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#151F32]/80 border border-slate-700/60 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase">Presentations</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{presentations.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Ready for live events</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#151F32]/80 border border-slate-700/60 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase">Total Attendees</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{totalAttendees}</div>
            <div className="text-[11px] text-slate-400 mt-1">Students engaged</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#151F32]/80 border border-slate-700/60 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase">Live Votes Cast</span>
              <BarChart3 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{totalResponses}</div>
            <div className="text-[11px] text-slate-400 mt-1">Interactive responses</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#151F32]/80 border border-slate-700/60 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase">Active Sessions</span>
              <Radio className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <span>{activeSessions.length}</span>
              {activeSessions.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Currently broadcasting</div>
          </div>
        </div>

        {/* Active Sessions Quick Resume Alert */}
        {activeSessions.length > 0 && (
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Live Session Active</h4>
                <p className="text-xs text-slate-300">
                  "{activeSessions[0].title}" • Code: <strong className="text-cyan-400 font-mono">{activeSessions[0].code}</strong>
                </p>
              </div>
            </div>
            <Link
              to={`/present/${activeSessions[0].id}`}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Resume Presentation →
            </Link>
          </div>
        )}

        {/* Recent Presentations Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Your Presentations</h2>
              <p className="text-xs text-slate-400">Launch directly or edit your slide decks</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search presentations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Loading presentations...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#151F32]/50 border-2 border-dashed border-slate-800 text-center space-y-3">
              <Layers className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No presentations found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Create your first presentation or pick one of our ready-to-use technical templates.
              </p>
              <div className="pt-2">
                <Link
                  to="/editor/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  New Presentation
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((pres) => (
                <div
                  key={pres.id}
                  className="rounded-3xl bg-[#151F32]/80 border border-slate-700/60 p-5 shadow-xl hover:border-slate-500 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase font-bold">
                        {pres.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(pres.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {pres.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {pres.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        {pres.slides?.length || 0} Slides
                      </span>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-5 border-t border-slate-800/80 mt-5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleStartPresentation(pres.id)}
                      disabled={startingId === pres.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-950/40 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{startingId === pres.id ? 'Launching...' : 'Present Live'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <Link
                        to={`/editor/${pres.id}`}
                        title="Edit Presentation"
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDuplicate(pres.id)}
                        title="Duplicate Presentation"
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(pres.id)}
                        title="Delete Presentation"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ready-to-Use Templates Quick Suggestions */}
        {templates.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Recommended Club Templates
                </h3>
                <p className="text-xs text-slate-400">Clone and launch immediately for your club event</p>
              </div>

              <Link
                to="/templates"
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                View all 10 templates →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-5 rounded-2xl bg-[#101828] border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition-colors"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {tmpl.category}
                    </span>
                    <h4 className="text-sm font-bold text-white">{tmpl.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{tmpl.description}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">{tmpl.slides.length} slides</span>
                    <button
                      onClick={() => handleUseTemplate(tmpl.id)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      Use Template →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

