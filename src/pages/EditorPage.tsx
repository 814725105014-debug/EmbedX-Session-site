import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  fetchPresentationById, 
  createPresentation, 
  updatePresentation, 
  startLiveSession 
} from '../lib/api';
import { Presentation, Slide, QuestionType, AnswerOption } from '../types';
import { THEMES } from '../lib/colors';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Play, 
  Save, 
  Check, 
  Sparkles, 
  BarChart3, 
  Cloud, 
  Trophy, 
  MessageSquareText, 
  Radio, 
  Star, 
  ListOrdered, 
  CheckCircle2, 
  Flame, 
  ArrowLeft,
  Settings,
  Palette,
  Timer as TimerIcon
} from 'lucide-react';

const QUESTION_TYPES: Array<{ type: QuestionType; label: string; icon: React.FC<{ className?: string }>; desc: string }> = [
  { type: 'multiple_choice', label: 'Multiple Choice', icon: BarChart3, desc: 'Audience votes on 2-8 options' },
  { type: 'word_cloud', label: 'Word Cloud', icon: Cloud, desc: 'Participants submit technical keywords' },
  { type: 'quiz', label: 'Quiz Competition', icon: Trophy, desc: 'Timed question with speed points & podium' },
  { type: 'open_ended', label: 'Open Ended', icon: MessageSquareText, desc: 'Collect freeform thoughts & feedback' },
  { type: 'qa', label: 'Audience Q&A', icon: Radio, desc: 'Participants submit & upvote questions' },
  { type: 'rating_scale', label: 'Rating Scale', icon: Star, desc: 'Rate from 1 to 5 or 1 to 10' },
  { type: 'ranking', label: 'Ranking', icon: ListOrdered, desc: 'Rank choices in order of preference' },
  { type: 'true_false', label: 'True / False', icon: CheckCircle2, desc: 'Binary knowledge check' },
  { type: 'survey', label: 'Survey', icon: Flame, desc: 'Multi-aspect feedback gathering' },
];

export const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Load existing or create new
  useEffect(() => {
    if (id === 'new') {
      const defaultSlide: Slide = {
        id: `slide-${Date.now()}-0`,
        orderIndex: 0,
        type: 'multiple_choice',
        title: 'Welcome to our EMBEDX Session!',
        description: 'Select your preferred area of embedded systems exploration:',
        options: [
          { id: 'opt-1', text: 'Microcontroller Firmware (AVR / ESP32)', isCorrect: false },
          { id: 'opt-2', text: 'Robotics & Autonomous Rover Hardware', isCorrect: false },
          { id: 'opt-3', text: 'IoT & Wireless Sensor Networks', isCorrect: false },
          { id: 'opt-4', text: 'Circuit Design & PCB Fabrication', isCorrect: false },
        ]
      };
      setPresentation({
        id: `pres-${Date.now()}`,
        userId: user?.id || 'usr-2',
        title: 'New Technical Presentation',
        description: 'Interactive session for EMBEDX Club members',
        category: 'Technical Workshop',
        theme: 'cyber_dark',
        slides: [defaultSlide],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else if (id) {
      fetchPresentationById(id)
        .then((data) => setPresentation(data))
        .catch((err) => {
          alert('Could not load presentation: ' + err.message);
          navigate('/dashboard');
        });
    }
  }, [id]);

  const activeSlide: Slide | null = presentation && presentation.slides[activeSlideIndex] 
    ? presentation.slides[activeSlideIndex] 
    : null;

  // Auto-save debounced or on change
  const handleSave = async (presToSave = presentation) => {
    if (!presToSave) return;
    try {
      setIsSaving(true);
      setSaveStatus('saving');
      if (id === 'new') {
        const created = await createPresentation(presToSave);
        navigate(`/editor/${created.id}`, { replace: true });
      } else {
        await updatePresentation(presToSave.id, presToSave);
      }
      setSaveStatus('saved');
    } catch (err) {
      console.error(err);
      setSaveStatus('unsaved');
    } finally {
      setIsSaving(false);
    }
  };

  const updateActiveSlide = (updater: (slide: Slide) => Slide) => {
    if (!presentation || !activeSlide) return;
    const updatedSlides = [...presentation.slides];
    updatedSlides[activeSlideIndex] = updater(activeSlide);
    const updatedPres = { ...presentation, slides: updatedSlides, updatedAt: new Date().toISOString() };
    setPresentation(updatedPres);
    setSaveStatus('unsaved');
  };

  const handleAddSlide = (type: QuestionType) => {
    if (!presentation) return;
    let initialOptions: AnswerOption[] = [];

    if (type === 'multiple_choice' || type === 'quiz') {
      initialOptions = [
        { id: `opt-${Date.now()}-1`, text: 'Option A', isCorrect: type === 'quiz' },
        { id: `opt-${Date.now()}-2`, text: 'Option B', isCorrect: false },
        { id: `opt-${Date.now()}-3`, text: 'Option C', isCorrect: false },
        { id: `opt-${Date.now()}-4`, text: 'Option D', isCorrect: false },
      ];
    } else if (type === 'true_false') {
      initialOptions = [
        { id: `opt-${Date.now()}-1`, text: 'True', isCorrect: true },
        { id: `opt-${Date.now()}-2`, text: 'False', isCorrect: false },
      ];
    } else if (type === 'ranking') {
      initialOptions = [
        { id: `opt-${Date.now()}-1`, text: 'First Priority' },
        { id: `opt-${Date.now()}-2`, text: 'Second Priority' },
        { id: `opt-${Date.now()}-3`, text: 'Third Priority' },
      ];
    }

    const newSlide: Slide = {
      id: `slide-${Date.now()}-${presentation.slides.length}`,
      orderIndex: presentation.slides.length,
      type,
      title: type === 'quiz' ? 'Quiz Question: Which option is correct?' : 'Enter your question here...',
      description: 'Optional question instructions for participants',
      options: initialOptions,
      timerSeconds: type === 'quiz' ? 20 : 30,
      points: type === 'quiz' ? 1000 : undefined,
      speedBonus: type === 'quiz' ? true : undefined,
      settings: type === 'rating_scale' ? { min: 1, max: 5, minLabel: 'Low', maxLabel: 'High' } : {}
    };

    const updatedSlides = [...presentation.slides, newSlide];
    const updatedPres = { ...presentation, slides: updatedSlides };
    setPresentation(updatedPres);
    setActiveSlideIndex(updatedSlides.length - 1);
    setShowAddSlideModal(false);
    handleSave(updatedPres);
  };

  const handleDeleteSlide = (index: number) => {
    if (!presentation || presentation.slides.length <= 1) {
      alert('A presentation must have at least one slide.');
      return;
    }
    const updatedSlides = presentation.slides.filter((_, idx) => idx !== index);
    const updatedPres = { ...presentation, slides: updatedSlides };
    setPresentation(updatedPres);
    setActiveSlideIndex(Math.max(0, index - 1));
    handleSave(updatedPres);
  };

  const handleDuplicateSlide = (index: number) => {
    if (!presentation) return;
    const target = presentation.slides[index];
    const duplicated: Slide = {
      ...target,
      id: `slide-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${target.title} (Copy)`,
      options: target.options ? target.options.map(o => ({ ...o, id: `opt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` })) : []
    };
    const updatedSlides = [...presentation.slides];
    updatedSlides.splice(index + 1, 0, duplicated);
    const updatedPres = { ...presentation, slides: updatedSlides };
    setPresentation(updatedPres);
    setActiveSlideIndex(index + 1);
    handleSave(updatedPres);
  };

  const handleMoveSlide = (fromIndex: number, toIndex: number) => {
    if (!presentation || toIndex < 0 || toIndex >= presentation.slides.length) return;
    const updatedSlides = [...presentation.slides];
    const [moved] = updatedSlides.splice(fromIndex, 1);
    updatedSlides.splice(toIndex, 0, moved);
    const updatedPres = { ...presentation, slides: updatedSlides };
    setPresentation(updatedPres);
    setActiveSlideIndex(toIndex);
    handleSave(updatedPres);
  };

  const handleStartLive = async () => {
    if (!presentation) return;
    try {
      setIsStarting(true);
      await handleSave();
      const hostName = user?.fullName || 'EMBEDX Coordinator';
      const result = await startLiveSession(presentation.id, hostName);
      navigate(`/present/${result.session.id}`);
    } catch (err) {
      alert('Error launching session: ' + (err as Error).message);
    } finally {
      setIsStarting(false);
    }
  };

  if (!presentation || !activeSlide) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center text-slate-400">
        Loading Presentation Editor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col overflow-hidden">
      {/* Editor Header Bar */}
      <header className="h-14 border-b border-slate-800 bg-[#070B14] px-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/presentations"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to library"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <input
            type="text"
            value={presentation.title}
            onChange={(e) => {
              setPresentation({ ...presentation, title: e.target.value });
              setSaveStatus('unsaved');
            }}
            placeholder="Presentation Title"
            className="bg-transparent font-bold text-white text-base sm:text-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-2 py-0.5 border border-transparent hover:border-slate-700 w-64 sm:w-96 truncate"
          />

          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
            {saveStatus === 'saved' && <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Saved</span>}
            {saveStatus === 'saving' && <span className="text-cyan-400">Saving...</span>}
            {saveStatus === 'unsaved' && <span className="text-amber-400">Unsaved changes</span>}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          <button
            onClick={handleStartLive}
            disabled={isStarting}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-950/50 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isStarting ? 'Starting...' : 'Start Presentation'}</span>
          </button>
        </div>
      </header>

      {/* Main Editor 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Slide Thumbnails Deck */}
        <aside className="w-56 sm:w-64 border-r border-slate-800 bg-[#0B1220] flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Slides ({presentation.slides.length})
            </span>
            <button
              onClick={() => setShowAddSlideModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {presentation.slides.map((s, idx) => {
              const isSelected = idx === activeSlideIndex;
              const typeMeta = QUESTION_TYPES.find((t) => t.type === s.type);
              const Icon = typeMeta?.icon || BarChart3;

              return (
                <div
                  key={s.id}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`group relative p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#151F32] border-cyan-400 ring-1 ring-cyan-400 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded font-mono">
                      <Icon className="w-3 h-3" />
                      {typeMeta?.label}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                    {s.title || 'Untitled Slide'}
                  </p>

                  {/* Reorder and Delete Controls */}
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMoveSlide(idx, idx - 1); }}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMoveSlide(idx, idx + 1); }}
                        disabled={idx === presentation.slides.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDuplicateSlide(idx); }}
                        className="p-1 rounded text-slate-400 hover:text-white"
                        title="Duplicate Slide"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteSlide(idx); }}
                        className="p-1 rounded text-slate-400 hover:text-rose-400"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* CENTER COLUMN: Live Slide Preview Canvas */}
        <main className="flex-1 bg-[#070B14] p-4 sm:p-8 flex flex-col items-center justify-center overflow-y-auto relative">
          <div className="w-full max-w-3xl aspect-[16/10] rounded-3xl bg-[#101828] border-2 border-slate-700/80 shadow-2xl p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Slide Header Instructions */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800 pb-3">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Slide {activeSlideIndex + 1} of {presentation.slides.length}
              </span>
              <span>Go to /join • Code: <strong>XXXXXX</strong></span>
            </div>

            {/* Slide Title & Question Content */}
            <div className="space-y-3 my-auto py-4">
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {activeSlide.title}
              </h2>
              {activeSlide.description && (
                <p className="text-xs sm:text-sm text-slate-300 font-normal">
                  {activeSlide.description}
                </p>
              )}
            </div>

            {/* Slide Visual Mockup Preview based on question type */}
            <div className="w-full mt-auto pt-4">
              {activeSlide.type === 'multiple_choice' || activeSlide.type === 'quiz' || activeSlide.type === 'true_false' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(activeSlide.options || []).map((opt, i) => (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        opt.isCorrect && activeSlide.type === 'quiz'
                          ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300'
                          : 'bg-[#151F32]/80 border-slate-700 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-cyan-600/30 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold">{opt.text}</span>
                      </div>
                      {opt.isCorrect && activeSlide.type === 'quiz' && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                          Correct
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : activeSlide.type === 'word_cloud' ? (
                <div className="h-32 rounded-2xl bg-slate-900/40 border border-dashed border-slate-700 flex items-center justify-center text-xs text-slate-400 gap-3">
                  <span className="text-lg text-cyan-400 font-bold">Microcontroller</span>
                  <span className="text-2xl text-blue-400 font-black">ESP32</span>
                  <span className="text-sm text-emerald-400 font-semibold">Robotics</span>
                  <span className="text-xl text-amber-400 font-bold">Firmware</span>
                </div>
              ) : activeSlide.type === 'rating_scale' ? (
                <div className="h-28 rounded-2xl bg-slate-900/40 border border-slate-700 flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center justify-center">
                        {s} ★
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">1 (Novice) to 5 (Expert)</span>
                </div>
              ) : activeSlide.type === 'ranking' ? (
                <div className="space-y-1.5">
                  {(activeSlide.options || []).map((opt, i) => (
                    <div key={opt.id} className="p-2 rounded-xl bg-slate-900/60 border border-slate-700 text-xs text-white flex items-center gap-2">
                      <span className="font-mono text-cyan-400">#{i + 1}</span>
                      <span>{opt.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-28 rounded-2xl bg-slate-900/40 border border-dashed border-slate-700 flex items-center justify-center text-xs text-slate-400">
                  Real-time interactive audience response visualizer active
                </div>
              )}
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Slide Configuration Settings Panel */}
        <aside className="w-72 sm:w-80 border-l border-slate-800 bg-[#0B1220] p-4 flex flex-col overflow-y-auto space-y-6 shrink-0">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-cyan-400" />
              Slide Settings
            </span>
          </div>

          {/* Question Type Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Question Type</label>
            <select
              value={activeSlide.type}
              onChange={(e) => updateActiveSlide((s) => ({ ...s, type: e.target.value as QuestionType }))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-xs font-medium focus:outline-none"
            >
              {QUESTION_TYPES.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Slide Title */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Question / Slide Prompt</label>
            <textarea
              rows={3}
              value={activeSlide.title}
              onChange={(e) => updateActiveSlide((s) => ({ ...s, title: e.target.value }))}
              placeholder="Enter your question here..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-xs font-medium focus:outline-none resize-none"
            />
          </div>

          {/* Slide Description / Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Description / Subtitle</label>
            <input
              type="text"
              value={activeSlide.description || ''}
              onChange={(e) => updateActiveSlide((s) => ({ ...s, description: e.target.value }))}
              placeholder="e.g. Choose the best answer for speed bonus"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-xs font-medium focus:outline-none"
            />
          </div>

          {/* Options Management (if multiple_choice, quiz, ranking, true_false) */}
          {(activeSlide.type === 'multiple_choice' || activeSlide.type === 'quiz' || activeSlide.type === 'ranking') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Answer Options</label>
                {(activeSlide.options?.length || 0) < 8 && (
                  <button
                    onClick={() => {
                      const newOpt: AnswerOption = {
                        id: `opt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                        text: `Option ${(activeSlide.options?.length || 0) + 1}`,
                        isCorrect: false
                      };
                      updateActiveSlide((s) => ({ ...s, options: [...(s.options || []), newOpt] }));
                    }}
                    className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    + Add Option
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {(activeSlide.options || []).map((opt, i) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    {/* Correct Toggle for Quiz */}
                    {activeSlide.type === 'quiz' && (
                      <button
                        type="button"
                        onClick={() => {
                          updateActiveSlide((s) => ({
                            ...s,
                            options: (s.options || []).map((o) => ({
                              ...o,
                              isCorrect: o.id === opt.id,
                            })),
                          }));
                        }}
                        title={opt.isCorrect ? 'Correct Answer' : 'Mark as correct'}
                        className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold transition-colors ${
                          opt.isCorrect
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        ✓
                      </button>
                    )}

                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const newText = e.target.value;
                        updateActiveSlide((s) => ({
                          ...s,
                          options: (s.options || []).map((o) => (o.id === opt.id ? { ...o, text: newText } : o)),
                        }));
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />

                    {(activeSlide.options?.length || 0) > 2 && (
                      <button
                        onClick={() => {
                          updateActiveSlide((s) => ({
                            ...s,
                            options: (s.options || []).filter((o) => o.id !== opt.id),
                          }));
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz Timer Configuration */}
          {activeSlide.type === 'quiz' && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <TimerIcon className="w-3.5 h-3.5 text-amber-400" />
                Quiz Timer (Seconds)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 20, 30, 45].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => updateActiveSlide((s) => ({ ...s, timerSeconds: sec }))}
                    className={`py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                      activeSlide.timerSeconds === sec
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <span>Speed Bonus Points</span>
                <input
                  type="checkbox"
                  checked={activeSlide.speedBonus !== false}
                  onChange={(e) => updateActiveSlide((s) => ({ ...s, speedBonus: e.target.checked }))}
                  className="rounded text-cyan-500 focus:ring-cyan-400"
                />
              </div>
            </div>
          )}

          {/* Rating Scale Bounds */}
          {activeSlide.type === 'rating_scale' && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300">Rating Scale Range</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateActiveSlide((s) => ({ ...s, settings: { ...s.settings, max: 5 } }))}
                  className={`py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                    (activeSlide.settings?.max || 5) === 5 ? 'bg-cyan-500 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  1 to 5 Stars
                </button>
                <button
                  onClick={() => updateActiveSlide((s) => ({ ...s, settings: { ...s.settings, max: 10 } }))}
                  className={`py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                    activeSlide.settings?.max === 10 ? 'bg-cyan-500 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  1 to 10 Scale
                </button>
              </div>
            </div>
          )}

          {/* Theme Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              Presentation Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((thm) => (
                <button
                  key={thm.id}
                  onClick={() => setPresentation({ ...presentation, theme: thm.id })}
                  className={`p-2 rounded-xl text-left border text-xs font-semibold transition-all ${
                    presentation.theme === thm.id
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {thm.name}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ADD SLIDE MODAL */}
      {showAddSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#101828] border border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Add a New Slide</h3>
                <p className="text-xs text-slate-400 mt-0.5">Select from 9 interactive audience engagement question types</p>
              </div>
              <button
                onClick={() => setShowAddSlideModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {QUESTION_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.type}
                    onClick={() => handleAddSlide(t.type)}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400 text-left transition-all hover:-translate-y-0.5 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {t.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {t.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

