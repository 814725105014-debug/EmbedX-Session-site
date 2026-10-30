import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { 
  Sparkles, 
  Play, 
  Smartphone, 
  BarChart3, 
  Trophy, 
  Cloud, 
  CheckCircle2, 
  Layers, 
  Radio, 
  Cpu, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight,
  Flame,
  MousePointerClick
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessionPin, setSessionPin] = useState('');

  // Sample interactive preview state for hero poll demo
  const [heroVote, setHeroVote] = useState<string | null>('esp32');
  const [heroVotes, setHeroVotes] = useState<Record<string, number>>({
    esp32: 84,
    stm32: 67,
    arduino: 42,
    pic: 19
  });

  const handleHeroVote = (key: string) => {
    if (heroVote === key) return;
    setHeroVotes(prev => ({
      ...prev,
      [key]: prev[key] + 1,
      ...(heroVote ? { [heroVote]: Math.max(0, prev[heroVote] - 1) } : {})
    }));
    setHeroVote(key);
  };

  const totalHeroVotes = Object.values(heroVotes).reduce((a, b) => a + b, 0);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = sessionPin.replace(/\s+/g, '');
    if (cleanPin.length === 6) {
      navigate(`/session/${cleanPin}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32">
          {/* Futuristic Background Glows & Traces */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/4 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              {/* Institution & Club Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-semibold backdrop-blur-md shadow-lg shadow-cyan-950/30 animate-in fade-in slide-in-from-top-4">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Department of EEE • SRM TRP Engineering College</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">EMBEDX Club</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
                Make Every Voice <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">
                  Count Live.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                Create interactive experiences, run live quizzes, collect ideas, and engage every participant with EMBEDX Interactive.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to="/editor/new"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-cyan-900/40 hover:shadow-cyan-900/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Create a Presentation</span>
                </Link>

                <Link
                  to="/join"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-base border border-slate-700 hover:border-slate-600 transition-all backdrop-blur-md"
                >
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                  <span>Join a Session</span>
                </Link>
              </div>

              {/* Fast Session PIN Input Banner */}
              <div className="pt-4 max-w-md mx-auto">
                <form onSubmit={handleJoinSubmit} className="relative flex items-center">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit session PIN (e.g. 583291)"
                    value={sessionPin}
                    onChange={(e) => setSessionPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-5 pr-28 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-white placeholder-slate-500 font-mono text-sm tracking-wider focus:outline-none shadow-xl"
                  />
                  <button
                    type="submit"
                    disabled={sessionPin.length !== 6}
                    className="absolute right-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                  >
                    Join
                  </button>
                </form>
              </div>
            </div>

            {/* LIVE PRODUCT PREVIEW DASHBOARD */}
            <div className="mt-16 sm:mt-24 relative max-w-5xl mx-auto">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-blue-600/30 to-indigo-500/30 blur-xl opacity-70" />
              
              <div className="relative rounded-3xl bg-[#101828]/95 border border-slate-700/80 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
                {/* Window Chrome Header */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-3 font-mono text-xs text-slate-400">
                      EMBEDX Live Session • Session PIN: <strong className="text-cyan-400">583 291</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Stream
                    </span>
                    <span>•</span>
                    <span>{totalHeroVotes} Active Voters</span>
                  </div>
                </div>

                {/* Interactive Hero Poll Demo */}
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">
                      Question 1 of 5 • Multiple Choice Poll
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      Which microcontroller development ecosystem do you prefer for IoT prototypes?
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Click any option below to test the instant real-time response bar animation:
                    </p>
                  </div>

                  {/* Interactive Poll Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'esp32', label: 'ESP32 (Wi-Fi + BLE Dual Core)', color: '#06B6D4' },
                      { key: 'stm32', label: 'STM32 ARM Cortex-M4', color: '#2563EB' },
                      { key: 'arduino', label: 'Arduino ATmega328P', color: '#10B981' },
                      { key: 'pic', label: 'Microchip PIC & 8051', color: '#F59E0B' },
                    ].map((item) => {
                      const count = heroVotes[item.key] || 0;
                      const pct = Math.round((count / totalHeroVotes) * 100);
                      const isSelected = heroVote === item.key;

                      return (
                        <button
                          key={item.key}
                          onClick={() => handleHeroVote(item.key)}
                          className={`relative overflow-hidden p-4 rounded-2xl border text-left transition-all duration-300 ${
                            isSelected
                              ? 'bg-cyan-950/40 border-cyan-400/90 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400'
                              : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-500'
                          }`}
                        >
                          {/* Animated Percentage Fill Bar */}
                          <div
                            className="absolute top-0 bottom-0 left-0 opacity-20 rounded-2xl transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: item.color }}
                          />

                          <div className="relative z-10 flex items-center justify-between gap-3">
                            <span className="font-semibold text-white text-sm sm:text-base">
                              {item.label}
                            </span>
                            <div className="font-mono text-right shrink-0">
                              <span className="text-base sm:text-lg font-black text-white">{count}</span>
                              <span className="text-xs text-slate-400 ml-1.5 font-normal">({pct}%)</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Micro-Features Floating Pills */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      Zero App Download Required
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-blue-400" />
                      Sub-second WebSocket Sync
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Anonymous & Safe
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9 QUESTION TYPES SHOWCASE */}
        <section id="features" className="py-20 sm:py-28 bg-[#070B14] border-t border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 font-mono">
                Comprehensive Interaction Toolkit
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                9 Rich Engagement Slide Types
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Everything you need to energize technical seminars, departmental meetings, and symposium competitions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Multiple Choice Poll',
                  desc: '2 to 8 customizable options with animated bar charts, percentage breakdowns, and instant vote tallying.',
                  icon: BarChart3,
                  color: 'from-blue-600 to-cyan-500',
                },
                {
                  title: 'Dynamic Word Cloud',
                  desc: 'Participants submit technical keywords; popular ideas automatically scale dynamically in a vibrant cloud.',
                  icon: Cloud,
                  color: 'from-cyan-500 to-teal-500',
                },
                {
                  title: 'Competitive Quiz & Podium',
                  desc: 'Timed multiple-choice questions with speed-based bonus scoring, live rank shifts, and confetti celebration.',
                  icon: Trophy,
                  color: 'from-amber-500 to-orange-600',
                },
                {
                  title: 'Open-Ended Brainstorm',
                  desc: 'Collect open text suggestions, troubleshooting ideas, and hardware debugging battle stories in a card wall.',
                  icon: Sparkles,
                  color: 'from-purple-500 to-indigo-600',
                },
                {
                  title: 'Audience Live Q&A',
                  desc: 'Students submit questions during seminars; peers upvote relevant inquiries with presenter moderation.',
                  icon: Radio,
                  color: 'from-emerald-500 to-green-600',
                },
                {
                  title: 'Rating Scales (1-5 & 1-10)',
                  desc: 'Collect workshop satisfaction, difficulty ratings, and confidence scores with live bell-curve averages.',
                  icon: Zap,
                  color: 'from-pink-500 to-rose-600',
                },
                {
                  title: 'Community Ranking',
                  desc: 'Participants drag and order technical choices; Borda count algorithm aggregates the collective priority.',
                  icon: Layers,
                  color: 'from-blue-500 to-indigo-500',
                },
                {
                  title: 'True or False',
                  desc: 'Binary knowledge check with instantaneous statistical distribution and correct answer reveals.',
                  icon: CheckCircle2,
                  color: 'from-cyan-600 to-blue-700',
                },
                {
                  title: 'Workshop Feedback Survey',
                  desc: 'Multi-aspect surveys for post-event analytics, curriculum feedback, and faculty coordinator review.',
                  icon: Flame,
                  color: 'from-violet-600 to-purple-800',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-[#101828]/80 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} p-0.5 mb-5 shadow-lg`}>
                      <div className="w-full h-full bg-[#101828] rounded-[14px] flex items-center justify-center text-cyan-400 group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 sm:py-28 bg-[#0B1220]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 font-mono">
                Seamless 3-Step Flow
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                How EMBEDX Interactive Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: '01',
                  title: 'Create or Pick a Template',
                  desc: 'Use the drag-and-drop editor to craft custom polls, embedded quizzes, or pick one of our 10 club-tailored templates.',
                },
                {
                  step: '02',
                  title: 'Start Live & Share Code',
                  desc: 'Launch presentation mode on your projector. A unique 6-digit PIN and high-contrast QR code appear instantly.',
                },
                {
                  step: '03',
                  title: 'Engage & Export Reports',
                  desc: 'Students join on their phones without accounts. Answers arrive in real time with animated charts, leaderboards, and CSV exports.',
                },
              ].map((step, idx) => (
                <div key={idx} className="relative p-8 rounded-3xl bg-[#151F32]/80 border border-slate-700/60">
                  <div className="text-5xl font-black font-mono text-cyan-500/20 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* READY-TO-USE CLUB TEMPLATES HIGHLIGHT */}
        <section id="templates" className="py-20 sm:py-28 bg-[#070B14] border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 font-mono">
                  Engineered for Technical Events
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                  10 Ready-to-Use Technical Templates
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                  Built specifically for SRM TRP EEE club orientations, workshops, and EMBEDNOVA competitions.
                </p>
              </div>

              <Link
                to="/templates"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors"
              >
                <span>Browse All Templates</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Embedded Systems Knowledge Quiz', cat: 'Technical Quiz', slides: 5 },
                { title: 'Electronics Fundamentals & Circuitry', cat: 'Academics & Core EEE', slides: 4 },
                { title: 'Microcontroller & Architecture Challenge', cat: 'Hardware Engineering', slides: 3 },
                { title: 'Arduino & ESP32 IoT Live Poll', cat: 'IoT & Wireless', slides: 3 },
                { title: 'Robotics & Autonomous Rovers Challenge', cat: 'Robotics & Automation', slides: 3 },
                { title: 'EMBEDNOVA National Symposium Engagement', cat: 'Symposium & Events', slides: 3 },
              ].map((tmpl, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-[#101828] border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group">
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {tmpl.cat}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {tmpl.title}
                    </h3>
                  </div>

                  <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between text-xs text-slate-400">
                    <span>{tmpl.slides} Interactive Slides</span>
                    <Link
                      to="/templates"
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      Use Template →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION BANNER */}
        <section className="py-20 sm:py-28 bg-[#0B1220] relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-blue-950/60 to-indigo-950/60 border border-cyan-500/30 shadow-2xl space-y-6">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Ready to Engage Your Audience?
              </h2>
              <p className="text-slate-300 max-w-xl mx-auto text-base sm:text-lg">
                Start a presentation in seconds or join an active session with your club members.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to="/editor/new"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-cyan-950/60 transition-all"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Launch New Presentation</span>
                </Link>
                <Link
                  to="/join"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base border border-slate-700 transition-all"
                >
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                  <span>Join Session by Code</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

