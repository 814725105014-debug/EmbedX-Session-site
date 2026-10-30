import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkSessionCode } from '../lib/api';
import { getSocket } from '../lib/socket';
import { Slide, QAQuestion, ResponseRecord } from '../types';
import { OPTION_COLORS } from '../lib/colors';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  ThumbsUp, 
  Star, 
  Sparkles, 
  AlertCircle, 
  Lock, 
  HelpCircle, 
  Zap,
  Flame,
  Heart,
  Lightbulb,
  Rocket
} from 'lucide-react';

const EMOJI_REACTIONS = ['❤️', '👍', '💡', '🔥', '🚀'];

export const ParticipantSessionPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  // Participant identity
  const [participantId] = useState(() => {
    let id = localStorage.getItem('embedx_participant_id');
    if (!id) {
      id = `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      localStorage.setItem('embedx_participant_id', id);
    }
    return id;
  });

  const [nickname] = useState(() => {
    return localStorage.getItem('embedx_participant_nickname') || `Student #${Math.floor(100 + Math.random() * 900)}`;
  });

  const [avatar] = useState(() => {
    return localStorage.getItem('embedx_participant_avatar') || '⚡';
  });

  // Session state
  const [presentationTitle, setPresentationTitle] = useState('EMBEDX Session');
  const [hostName, setHostName] = useState('Presenter');
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(1);
  const [votingLocked, setVotingLocked] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [quizTimerSeconds, setQuizTimerSeconds] = useState<number | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);

  // Response inputs
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [wordCloudInput, setWordCloudInput] = useState('');
  const [openEndedInput, setOpenEndedInput] = useState('');
  const [ratingValue, setRatingValue] = useState<number>(3);
  const [rankingOrder, setRankingOrder] = useState<string[]>([]);
  const [qaInput, setQaInput] = useState('');
  const [qaList, setQaList] = useState<QAQuestion[]>([]);

  // Submission status per slide
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{ isCorrect?: boolean; points?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Response time tracking for quiz speed bonus
  const slideStartTimeRef = useRef<number>(Date.now());

  // Join session socket room
  useEffect(() => {
    if (!code) return;
    const cleanCode = code.replace(/\s+/g, '');

    // 1. Check REST session first
    checkSessionCode(cleanCode)
      .then((data) => {
        setPresentationTitle(data.presentationTitle);
        setHostName(data.hostName);
        setCurrentSlide(data.currentSlide);
        setCurrentSlideIndex(data.currentSlideIndex);
        setTotalSlides(data.totalSlides);
        setVotingLocked(data.votingLocked);
        setShowResults(data.showResults);
        setLoading(false);

        if (data.currentSlide?.options) {
          setRankingOrder(data.currentSlide.options.map((o: { id: string }) => o.id));
        }

        // 2. Connect socket
        const socket = getSocket();
        socket.emit('join_session', {
          sessionCode: cleanCode,
          nickname,
          avatar,
          participantId,
        });
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [code]);

  // Socket event listeners
  useEffect(() => {
    const socket = getSocket();

    socket.on('session_state', (data) => {
      setPresentationTitle(data.presentationTitle);
      setHostName(data.hostName);
      setCurrentSlide(data.currentSlide);
      setCurrentSlideIndex(data.currentSlideIndex);
      setTotalSlides(data.totalSlides);
      setVotingLocked(data.votingLocked);
      setShowResults(data.showResults);
      setQuizTimerSeconds(data.quizTimerSeconds);
      slideStartTimeRef.current = Date.now();

      if (data.userResponse) {
        setHasSubmitted(true);
        setSelectedOptionId(data.userResponse.optionId || null);
        setSubmissionFeedback({
          isCorrect: data.userResponse.isCorrect,
          points: data.userResponse.pointsAwarded,
        });
      } else {
        setHasSubmitted(false);
        setSubmissionFeedback(null);
        setSelectedOptionId(null);
        setWordCloudInput('');
        setOpenEndedInput('');
      }
    });

    socket.on('slide_changed', (data) => {
      setCurrentSlide(data.currentSlide);
      setCurrentSlideIndex(data.slideIndex);
      setTotalSlides(data.totalSlides);
      setVotingLocked(data.votingLocked);
      setShowResults(data.showResults);
      setHasSubmitted(false);
      setSubmissionFeedback(null);
      setSelectedOptionId(null);
      setWordCloudInput('');
      setOpenEndedInput('');
      setQuizTimerSeconds(null);
      slideStartTimeRef.current = Date.now();

      if (data.currentSlide?.options) {
        setRankingOrder(data.currentSlide.options.map((o: { id: string }) => o.id));
      }
    });

    socket.on('voting_state_changed', ({ locked }) => {
      setVotingLocked(locked);
    });

    socket.on('results_visibility_changed', ({ show }) => {
      setShowResults(show);
    });

    socket.on('quiz_timer_tick', ({ seconds }) => {
      setQuizTimerSeconds(seconds);
    });

    socket.on('response_confirmed', ({ response, pointsAwarded, isCorrect }) => {
      setHasSubmitted(true);
      setSubmissionFeedback({ isCorrect, points: pointsAwarded });
    });

    socket.on('question_added', ({ allQuestions }) => {
      setQaList(allQuestions || []);
    });

    socket.on('question_updated', ({ allQuestions }) => {
      setQaList(allQuestions || []);
    });

    socket.on('session_ended', () => {
      setSessionEnded(true);
    });

    return () => {
      socket.off('session_state');
      socket.off('slide_changed');
      socket.off('voting_state_changed');
      socket.off('results_visibility_changed');
      socket.off('quiz_timer_tick');
      socket.off('response_confirmed');
      socket.off('question_added');
      socket.off('question_updated');
      socket.off('session_ended');
    };
  }, []);

  // Send Floating Emoji Reaction
  const sendReaction = (reaction: string) => {
    if (!code) return;
    const socket = getSocket();
    socket.emit('send_reaction', {
      sessionCode: code,
      reaction,
    });
  };

  // Submit Answer
  const submitAnswer = (responseData: Partial<ResponseRecord>) => {
    if (!code || !currentSlide || votingLocked || hasSubmitted) return;
    const responseTimeMs = Date.now() - slideStartTimeRef.current;

    const socket = getSocket();
    socket.emit('submit_response', {
      sessionCode: code,
      participantId,
      slideId: currentSlide.id,
      responseData: {
        ...responseData,
        nickname,
        responseTimeMs,
      },
    });

    setHasSubmitted(true);
  };

  // Submit Q&A question
  const submitQA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !qaInput.trim()) return;

    const socket = getSocket();
    socket.emit('submit_question', {
      sessionCode: code,
      participantId,
      nickname,
      questionText: qaInput.trim(),
    });

    setQaInput('');
  };

  // Upvote Q&A question
  const upvoteQA = (questionId: string) => {
    if (!code) return;
    const socket = getSocket();
    socket.emit('upvote_question', {
      sessionCode: code,
      questionId,
      participantId,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-4 text-center text-slate-400">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-semibold text-white">Connecting to EMBEDX Live...</p>
        <p className="text-xs text-slate-500 mt-1">Synchronizing session state</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Unable to Join Session</h2>
        <p className="text-sm text-slate-400 max-w-sm mb-6">{error}</p>
        <button
          onClick={() => navigate('/join')}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs uppercase tracking-wider"
        >
          Try Another PIN
        </button>
      </div>
    );
  }

  if (sessionEnded) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Session Concluded</h2>
        <p className="text-sm text-slate-300 max-w-sm">
          Thank you for engaging with EMBEDX – Embedded Systems & Automation Club, SRM TRP Engineering College!
        </p>
        <button
          onClick={() => navigate('/join')}
          className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase"
        >
          Join Another Session
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between selection:bg-cyan-500">
      {/* MOBILE TOP BAR */}
      <header className="sticky top-0 z-30 bg-[#0B1220]/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="text-xl">{avatar}</span>
          <div className="truncate">
            <h3 className="text-xs font-bold text-white truncate">{presentationTitle}</h3>
            <p className="text-[10px] text-cyan-400 font-mono truncate">{hostName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {quizTimerSeconds !== null && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-mono text-xs font-bold animate-pulse">
              ⏱ {quizTimerSeconds}s
            </span>
          )}
          <span className="text-[11px] font-mono text-slate-400">
            {currentSlideIndex + 1}/{totalSlides}
          </span>
        </div>
      </header>

      {/* MAIN QUESTION & RESPONSE FORM */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 sm:p-6 flex flex-col justify-center space-y-6">
        {/* Slide Question Prompt */}
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {currentSlide?.title}
          </h2>
          {currentSlide?.description && (
            <p className="text-xs text-slate-400">{currentSlide.description}</p>
          )}
        </div>

        {/* Voting Locked Banner */}
        {votingLocked && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Voting is closed for this question.</span>
          </div>
        )}

        {/* Submission Confirmation Card */}
        {hasSubmitted && (
          <div className="p-6 rounded-3xl bg-cyan-950/40 border border-cyan-500/60 text-center space-y-2 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Response Submitted!</h3>
            <p className="text-xs text-slate-300">
              Your answer has been recorded live on the presenter's screen.
            </p>

            {submissionFeedback?.points !== undefined && submissionFeedback.points > 0 && (
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs border border-emerald-500/30">
                  <Zap className="w-3.5 h-3.5" /> +{submissionFeedback.points} Points Awarded!
                </span>
              </div>
            )}

            <div className="pt-3 text-[11px] text-slate-500 font-mono">
              Hold tight! Presenter will move to the next slide shortly.
            </div>
          </div>
        )}

        {/* INTERACTIVE INPUT FOR ALL 9 QUESTION TYPES */}
        {!hasSubmitted && !votingLocked && (
          <div className="space-y-4">
            {/* 1. Multiple Choice / Quiz / True-False */}
            {(currentSlide?.type === 'multiple_choice' || currentSlide?.type === 'quiz' || currentSlide?.type === 'true_false') && (
              <div className="space-y-3">
                {(currentSlide.options || []).map((opt, idx) => {
                  const color = OPTION_COLORS[idx % OPTION_COLORS.length];
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedOptionId(opt.id);
                        submitAnswer({ optionId: opt.id });
                      }}
                      className="w-full p-4 rounded-2xl bg-[#151F32] border border-slate-700 hover:border-cyan-400 text-left transition-all active:scale-[0.98] shadow-lg flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                          style={{ backgroundColor: color }}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-semibold text-sm sm:text-base text-white group-hover:text-cyan-300">
                          {opt.text}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. Word Cloud Input */}
            {currentSlide?.type === 'word_cloud' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (wordCloudInput.trim()) {
                    submitAnswer({ text: wordCloudInput.trim() });
                  }
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  maxLength={30}
                  autoFocus
                  placeholder="Enter word or phrase (e.g. ESP32)"
                  value={wordCloudInput}
                  onChange={(e) => setWordCloudInput(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border-2 border-slate-700 focus:border-cyan-400 text-white text-base font-semibold focus:outline-none text-center"
                />
                <button
                  type="submit"
                  disabled={!wordCloudInput.trim()}
                  className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-cyan-950/50"
                >
                  Submit Word
                </button>
              </form>
            )}

            {/* 3. Open-Ended Text Input */}
            {currentSlide?.type === 'open_ended' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (openEndedInput.trim()) {
                    submitAnswer({ text: openEndedInput.trim() });
                  }
                }}
                className="space-y-3"
              >
                <textarea
                  rows={4}
                  autoFocus
                  maxLength={250}
                  placeholder="Type your response or thoughts here..."
                  value={openEndedInput}
                  onChange={(e) => setOpenEndedInput(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-900 border-2 border-slate-700 focus:border-cyan-400 text-white text-sm focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={!openEndedInput.trim()}
                  className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-white font-bold text-sm shadow-lg"
                >
                  Submit Response
                </button>
              </form>
            )}

            {/* 4. Rating Scale */}
            {currentSlide?.type === 'rating_scale' && (
              <div className="space-y-6 text-center">
                <div className="flex items-center justify-center gap-2">
                  {Array.from(
                    { length: (currentSlide.settings?.max || 5) - (currentSlide.settings?.min || 1) + 1 },
                    (_, i) => (currentSlide.settings?.min || 1) + i
                  ).map((val) => (
                    <button
                      key={val}
                      onClick={() => setRatingValue(val)}
                      className={`w-11 h-11 rounded-2xl font-bold font-mono text-sm transition-all ${
                        ratingValue === val
                          ? 'bg-amber-500 text-white scale-110 shadow-lg shadow-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => submitAnswer({ rating: ratingValue })}
                  className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-sm shadow-lg"
                >
                  Submit Rating ({ratingValue} Stars)
                </button>
              </div>
            )}

            {/* 5. Ranking Drag/Tap */}
            {currentSlide?.type === 'ranking' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 text-center">
                  Order choices by priority (tap to move up):
                </p>
                <div className="space-y-2">
                  {rankingOrder.map((optId, idx) => {
                    const opt = (currentSlide.options || []).find((o) => o.id === optId);
                    if (!opt) return null;

                    return (
                      <div
                        key={optId}
                        onClick={() => {
                          if (idx > 0) {
                            const newOrder = [...rankingOrder];
                            const [moved] = newOrder.splice(idx, 1);
                            newOrder.splice(idx - 1, 0, moved);
                            setRankingOrder(newOrder);
                          }
                        }}
                        className="p-3.5 rounded-2xl bg-[#151F32] border border-slate-700 flex items-center justify-between text-sm font-semibold text-white cursor-pointer active:scale-95 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-cyan-400">#{idx + 1}</span>
                          <span>{opt.text}</span>
                        </div>
                        {idx > 0 && <span className="text-xs text-slate-500">Tap to move ↑</span>}
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => submitAnswer({ ranks: rankingOrder })}
                  className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-sm shadow-lg"
                >
                  Submit Ranked Order
                </button>
              </div>
            )}

            {/* 6. Live Audience Q&A */}
            {currentSlide?.type === 'qa' && (
              <div className="space-y-4">
                <form onSubmit={submitQA} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={140}
                    placeholder="Ask a question..."
                    value={qaInput}
                    onChange={(e) => setQaInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={!qaInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs"
                  >
                    Ask
                  </button>
                </form>

                {/* Live Upvoting Feed */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {qaList.map((q) => {
                    const hasUpvoted = q.voters?.includes(participantId);
                    return (
                      <div key={q.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <p className="text-xs text-white font-medium">{q.text}</p>
                          <span className="text-[10px] text-slate-500">{q.nickname}</span>
                        </div>
                        <button
                          onClick={() => upvoteQA(q.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                            hasUpvoted ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{q.upvotes || 0}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FLOATING LIVE EMOJI REACTION BAR */}
      <footer className="sticky bottom-0 bg-[#0B1220]/95 backdrop-blur-md border-t border-slate-800 p-3">
        <div className="max-w-md mx-auto flex items-center justify-around gap-2">
          {EMOJI_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => sendReaction(emoji)}
              className="text-2xl sm:text-3xl p-2 rounded-2xl hover:bg-slate-800 active:scale-125 transition-transform"
              title={`Send ${emoji} to presenter screen`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};
