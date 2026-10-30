import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { fetchPresentations, deletePresentation, duplicatePresentation, startLiveSession } from '../lib/api';
import { Presentation } from '../types';
import { 
  Play, 
  Plus, 
  Copy, 
  Trash2, 
  Edit3, 
  Layers, 
  Search, 
  Clock, 
  Filter 
} from 'lucide-react';

export const PresentationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [startingId, setStartingId] = useState<string | null>(null);

  const loadPresentations = async () => {
    try {
      setLoading(true);
      const data = await fetchPresentations();
      setPresentations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresentations();
  }, []);

  const handleStart = async (presId: string) => {
    try {
      setStartingId(presId);
      const hostName = user?.fullName || 'EMBEDX Coordinator';
      const result = await startLiveSession(presId, hostName);
      navigate(`/present/${result.session.id}`);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setStartingId(null);
    }
  };

  const handleDuplicate = async (presId: string) => {
    try {
      await duplicatePresentation(presId);
      loadPresentations();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (presId: string) => {
    if (confirm('Delete this presentation?')) {
      try {
        await deletePresentation(presId);
        loadPresentations();
      } catch (err) {
        alert((err as Error).message);
      }
    }
  };

  const categories = ['All', ...new Set(presentations.map((p) => p.category))];

  const filtered = presentations.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Presentation Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Manage your interactive slide decks and start live engagement sessions
            </p>
          </div>

          <Link
            to="/editor/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/50 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Presentation</span>
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#151F32]/80 border border-slate-700/60">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search presentations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Presentation Cards Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm">Loading presentation library...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#151F32]/40 border-2 border-dashed border-slate-800 text-center space-y-3">
            <Layers className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No presentations found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query or category filter.
            </p>
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

                <div className="pt-5 border-t border-slate-800/80 mt-5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleStart(pres.id)}
                    disabled={startingId === pres.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{startingId === pres.id ? 'Starting...' : 'Present Live'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <Link
                      to={`/editor/${pres.id}`}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDuplicate(pres.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(pres.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
