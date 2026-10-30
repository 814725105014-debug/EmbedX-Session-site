import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { fetchReportDetails } from '../lib/api';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Users, 
  BarChart3, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  FileSpreadsheet,
  Zap,
  HelpCircle
} from 'lucide-react';

export const SessionReportPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    fetchReportDetails(sessionId)
      .then((data) => setReport(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center text-slate-400">
        Loading Session Analytics...
      </div>
    );
  }

  const { session, totalParticipants, slideAnalytics, leaderboard, questions } = report;

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Back and Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
          <Link
            to="/reports"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Reports</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <a
              href={`/api/reports/${sessionId}/export`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold transition-colors shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>
          </div>
        </div>

        {/* Report Official Academic Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#101828] border border-slate-700/80 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                EMBEDX Interactive • Official Event Report
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {session.presentationTitle}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Host: <strong className="text-slate-200">{session.hostName}</strong> • Department of EEE, SRM TRP Engineering College
              </p>
            </div>

            <div className="text-right font-mono text-xs text-slate-400">
              <p className="text-cyan-300 font-bold text-sm">PIN: {session.code}</p>
              <p>{new Date(session.startedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400">Total Participants</span>
              <div className="text-2xl font-black text-white mt-1">{totalParticipants}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400">Total Questions</span>
              <div className="text-2xl font-black text-white mt-1">{slideAnalytics.length}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400">Avg Engagement</span>
              <div className="text-2xl font-black text-cyan-400 mt-1">
                {totalParticipants > 0
                  ? Math.round(
                      slideAnalytics.reduce((acc: number, s: any) => acc + s.participationRate, 0) /
                        slideAnalytics.length
                    )
                  : 0}
                %
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400">Status</span>
              <div className="text-base font-bold text-emerald-400 mt-2 uppercase">
                {session.status}
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Leaderboard Summary if applicable */}
        {leaderboard && leaderboard.length > 0 && leaderboard[0].score > 0 && (
          <div className="p-6 rounded-3xl bg-[#151F32]/80 border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Quiz Competition Final Standings
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {leaderboard.length} Scored Participants
              </span>
            </div>

            <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
              {leaderboard.map((p: any, idx: number) => (
                <div key={p.id} className="p-3.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 font-mono font-bold text-xs text-slate-400">#{idx + 1}</span>
                    <span className="text-lg">{p.avatar}</span>
                    <span className="font-semibold text-white">{p.nickname}</span>
                  </div>
                  <span className="font-mono font-bold text-cyan-400 text-sm">
                    {p.score} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question-by-Question Deep Analytics Breakdown */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Question-by-Question Results
          </h2>

          <div className="space-y-4">
            {slideAnalytics.map((slide: any, idx: number) => (
              <div
                key={slide.slideId}
                className="p-6 rounded-3xl bg-[#151F32]/80 border border-slate-700/60 space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase font-bold">
                      Slide {idx + 1} • {slide.type.replace('_', ' ')}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{slide.title}</h3>
                  </div>

                  <div className="text-right font-mono text-xs text-slate-400 shrink-0">
                    <p className="font-bold text-white">{slide.responseCount} Responses</p>
                    <p>{slide.participationRate}% Participation</p>
                  </div>
                </div>

                {/* Option Breakdown */}
                {slide.optionBreakdown && (
                  <div className="space-y-2 pt-2">
                    {Object.values(slide.optionBreakdown).map((opt: any, optIdx: number) => {
                      const count = opt.count || 0;
                      const pct = slide.responseCount > 0 ? Math.round((count / slide.responseCount) * 100) : 0;

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${
                            opt.isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300'
                              : 'bg-slate-900 border-slate-800 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{opt.text}</span>
                            {opt.isCorrect && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                Correct Answer
                              </span>
                            )}
                          </div>
                          <span className="font-mono font-bold">
                            {count} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Word Frequency */}
                {slide.wordFrequency && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap gap-2">
                    {Object.entries(slide.wordFrequency).map(([word, freq]) => (
                      <span
                        key={word}
                        className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-mono text-xs flex items-center gap-1.5"
                      >
                        <span>{word}</span>
                        <span className="text-[10px] opacity-60">×{String(freq)}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Rating Average */}
                {slide.averageRating && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
                    <span className="text-3xl font-black text-amber-400 font-mono">
                      {slide.averageRating} ★
                    </span>
                    <span className="text-xs text-slate-400">
                      Average rating across {slide.ratingCount} submissions
                    </span>
                  </div>
                )}

                {/* Open Ended Text Submissions */}
                {slide.textSubmissions && slide.textSubmissions.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {slide.textSubmissions.map((item: any, tIdx: number) => (
                      <div key={tIdx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
                        <p className="font-medium">"{item.text}"</p>
                        <p className="text-[10px] text-cyan-400 mt-2">— {item.participantName}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Q&A Transcripts */}
        {questions && questions.length > 0 && (
          <div className="p-6 rounded-3xl bg-[#151F32]/80 border border-slate-700/60 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              Audience Q&A Log ({questions.length} Questions)
            </h3>

            <div className="space-y-2">
              {questions.map((q: any) => (
                <div key={q.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <p className="font-medium text-white">{q.text}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Asked by {q.nickname}</p>
                  </div>
                  <span className="font-mono text-cyan-400 font-bold shrink-0">
                    ▲ {q.upvotes || 0} Upvotes
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};
