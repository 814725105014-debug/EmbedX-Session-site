import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { fetchTemplates, cloneTemplate } from '../lib/api';
import { Template } from '../types';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Search, 
  Play, 
  Eye, 
  X, 
  Check, 
  Cpu 
} from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cloningId, setCloningId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  useEffect(() => {
    fetchTemplates()
      .then((data) => setTemplates(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleUseTemplate = async (templateId: string) => {
    try {
      setCloningId(templateId);
      const cloned = await cloneTemplate(templateId);
      navigate(`/editor/${cloned.id}`);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setCloningId(null);
    }
  };

  const categories = ['All', ...new Set(templates.map((t) => t.category))];

  const filtered = templates.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            10 Official EMBEDX Templates
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Presentation Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Pre-configured interactive decks designed for technical workshops, hackathons, and SRM TRP club meetings
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#151F32]/80 border border-slate-700/60">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm">Loading templates...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tmpl) => (
              <div
                key={tmpl.id}
                className="rounded-3xl bg-[#151F32]/80 border border-slate-700/60 p-6 shadow-xl hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase">
                      {tmpl.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      {tmpl.slides.length} Slides
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {tmpl.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {tmpl.description}
                  </p>

                  {/* Question types pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {tmpl.slides.slice(0, 3).map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                      >
                        {s.type.replace('_', ' ')}
                      </span>
                    ))}
                    {tmpl.slides.length > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-500">
                        +{tmpl.slides.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleUseTemplate(tmpl.id)}
                    disabled={cloningId === tmpl.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <span>{cloningId === tmpl.id ? 'Cloning...' : 'Use Template'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#101828] border border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                  {previewTemplate.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{previewTemplate.title}</h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <p className="text-xs text-slate-300">{previewTemplate.description}</p>
              <div className="space-y-2 pt-2">
                <p className="text-xs uppercase font-bold text-slate-400 font-mono">
                  Slide Sequence ({previewTemplate.slides.length})
                </p>
                {previewTemplate.slides.map((s, idx) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3"
                  >
                    <span className="font-mono text-xs font-bold text-cyan-400 shrink-0 mt-0.5">
                      #{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white">{s.title}</p>
                      <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300">
                        {s.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = previewTemplate.id;
                  setPreviewTemplate(null);
                  handleUseTemplate(id);
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-md"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

