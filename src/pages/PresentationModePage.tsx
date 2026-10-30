import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSessionById, endLiveSession } from '../lib/api';
import { getSocket } from '../lib/socket';
import { LiveSession, Slide, Participant, ResponseRecord, QAQuestion } from '../types';
import { getTheme } from '../lib/colors';
import { soundFX } from '../lib/sound';
import { QRModal } from '../components/QRModal';
import { PresentationControls } from '../components/PresentationControls';
import { FloatingReactions } from '../components/FloatingReactions';
import { BarChartVisualizer } from '../components/visualizers/BarChartVisualizer';
import { WordCloudVisualizer } from '../components/visualizers/WordCloudVisualizer';
import { QuizLeaderboard } from '../components/visualizers/QuizLeaderboard';
import { RatingVisualizer } from '../components/visualizers/RatingVisualizer';
import { RankingVisualizer } from '../components/visualizers/RankingVisualizer';
import { QAPanel } from '../components/visualizers/QAPanel';
import { OpenEndedGrid } from '../components/visualizers/OpenEndedGrid';
import { DonutChartVisualizer } from '../components/visualizers/DonutChartVisualizer';
import { 
  Sparkles, 
  Smartphone, 
  Users, 
  Timer, 
  CheckCircle2, 
  Lock, 
  EyeOff, 
  HelpCircle 
} from 'lucide-react';

export const PresentationModePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<LiveSession | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [responses, setResponses] = useState<Record<string, ResponseRecord>>({});
  const [questions, setQuestions] = useState<QAQuestion[]>([]);
  const [reactions, setReactions] = useState<Array<{ id: string; reaction: string }>>([]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [votingLocked, setVotingLocked] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize session data & connect socket
  useEffect(() => {
    if (!id) return;

    fetchSessionById(id)
      .then((data) => {
        setSession(data.session);
        setParticipants(data.participants || []);
        setCurrentSlideIndex(data.session.currentSlideIndex || 0);
        setVotingLocked(data.session.votingLocked || false);
        setShowResults(data.session.showResults !== false);
        setQuestions(data.questions || []);

        const slideId = data.session.presentationData.slides[data.session.currentSlideIndex]?.id;
        if (slideId && data.responses?.[slideId]) {
          setResponses(data.responses[slideId]);
        }

        // Connect as host in socket room
        const socket = getSocket();
        socket.emit('host_join', { sessionCode: data.session.code });

        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load session:', err);
        alert('Could not find live session.');
        navigate('/dashboard');
      });
  }, [id]);

  // Realtime Socket Listeners
  useEffect(() => {
    const socket = getSocket();

    socket.on('participant_joined', ({ participant, totalCount, participantsList }) => {
      setParticipants(participantsList || []);
      soundFX.playVoteChime();
    });

    socket.on('response_received', ({ slideId, totalResponses, allResponses, latestResponse }) => {
      soundFX.playVoteChime();
      setResponses((prev) => {
        const next = { ...prev };
        if (latestResponse) {
          next[latestResponse.participantId] = latestResponse;
        }
        return next;
      });
    });

    socket.on('responses_reset', () => {
      setResponses({});
    });

    socket.on('question_added', ({ question, allQuestions }) => {
      setQuestions(allQuestions || []);
    });

    socket.on('question_updated', ({ allQuestions }) => {
      setQuestions(allQuestions || []);
    });

    socket.on('reaction_received', ({ reaction, id }) => {
      setReactions((prev) => [...prev.slice(-15), { id, reaction }]);
    });

    socket.on('leaderboard_update', ({ leaderboard }) => {
      setParticipants(leaderboard || []);
    });

    return () => {
      socket.off('participant_joined');
      socket.off('response_received');
      socket.off('responses_reset');
      socket.off('question_added');
      socket.off('question_updated');
      socket.off('reaction_received');
      socket.off('leaderboard_update');
    };
  }, []);

  const currentSlide: Slide | null = session && session.presentationData.slides[currentSlideIndex]
    ? session.presentationData.slides[currentSlideIndex]
    : null;

  // Slide navigation
  const goToSlide = useCallback((index: number) => {
    if (!session || index < 0 || index >= session.presentationData.slides.length) return;
    const socket = getSocket();
    socket.emit('change_slide', { sessionCode: session.code, slideIndex: index });

    setCurrentSlideIndex(index);
    setVotingLocked(false);
    setTimerSecondsLeft(null);
    soundFX.playSlideClick();

    // Fetch responses for new slide
    const slideId = session.presentationData.slides[index]?.id;
    if (slideId) {
      fetchSessionById(session.id).then((data) => {
        setResponses(data.responses?.[slideId] || {});
      });
    }
  }, [session]);

  const handleNext = () => goToSlide(currentSlideIndex + 1);
  const handlePrev = () => goToSlide(currentSlideIndex - 1);

  // Voting lock
  const handleToggleLock = () => {
    if (!session) return;
    const nextState = !votingLocked;
    setVotingLocked(nextState);
    getSocket().emit('set_voting_locked', { sessionCode: session.code, locked: nextState });
  };

  // Results visibility
  const handleToggleResults = () => {
    if (!session) return;
    const nextState = !showResults;
    setShowResults(nextState);
    getSocket().emit('set_show_results', { sessionCode: session.code, show: nextState });
  };

  // Reset responses
  const handleResetResponses = () => {
    if (!session || !currentSlide) return;
    if (confirm('Reset all responses for this slide?')) {
      getSocket().emit('reset_slide_responses', { sessionCode: session.code, slideId: currentSlide.id });
      setResponses({});
    }
  };

  // Quiz Timer
  const handleStartTimer = (seconds: number) => {
    if (!session) return;
    setTimerSecondsLeft(seconds);
    getSocket().emit('start_quiz_timer', { sessionCode: session.code, seconds });

    const interval = setInterval(() => {
      setTimerSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          soundFX.playBuzzer();
          setVotingLocked(true);
          getSocket().emit('set_voting_locked', { sessionCode: session.code, locked: true });
          return 0;
        }
        if (prev <= 5) {
          soundFX.playTimerTick();
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // End Session
  const handleEndSession = async () => {
    if (!session) return;
    try {
      await endLiveSession(session.id);
      navigate(`/reports/${session.id}`);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // Keyboard Shortcuts (ArrowRight, ArrowLeft, Space, F, L, R, Q)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in modal input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleToggleLock();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleToggleResults();
      } else if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        setShowQR((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, session, votingLocked, showResults]);

  if (loading || !session || !currentSlide) {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center text-slate-400">
        Launching Live Presentation Mode...
      </div>
    );
  }

  const theme = getTheme(session.presentationData.theme);
  const formattedCode = `${session.code.slice(0, 3)} ${session.code.slice(3)}`;
  const currentResponsesList = Object.values(responses);

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 select-none relative overflow-hidden ${theme.bg}`}>
      {/* Floating Emojis */}
      <FloatingReactions reactions={reactions} />

      {/* TOP HEADER: Join Instructions Banner */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 z-20">
        {/* Left: Joining instructions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-mono text-xs sm:text-sm shadow-xl transition-all"
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Join at <strong className="text-cyan-300">embedx.live</strong> or <strong className="text-cyan-300">/join</strong></span>
            <span className="text-white/40">•</span>
            <span>Code: <strong className="text-2xl text-cyan-300 font-black tracking-wider ml-1">{formattedCode}</strong></span>
          </button>
        </div>

        {/* Right: Live Status & Timer */}
        <div className="flex items-center gap-3">
          {timerSecondsLeft !== null && (
            <div className={`px-4 py-1.5 rounded-2xl font-mono font-black text-lg sm:text-xl flex items-center gap-2 shadow-xl border animate-pulse ${
              timerSecondsLeft <= 5
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/50'
            }`}>
              <Timer className="w-5 h-5" />
              <span>{timerSecondsLeft}s</span>
            </div>
          )}

          {votingLocked && (
            <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold font-mono flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Voting Closed
            </span>
          )}

          {!showResults && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold font-mono flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5" /> Results Hidden
            </span>
          )}
        </div>
      </header>

      {/* CENTER STAGE: Slide Question & Live Visualization */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-6xl w-full mx-auto my-6 z-10 text-center">
        {/* Slide Title */}
        <div className="space-y-3 mb-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Slide {currentSlideIndex + 1} of {session.presentationData.slides.length}
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {currentSlide.title}
          </h1>
          {currentSlide.description && (
            <p className="text-base sm:text-xl text-slate-300 font-normal">
              {currentSlide.description}
            </p>
          )}
        </div>

        {/* Dynamic Visualizer based on Slide Question Type */}
        <div className="w-full">
          {!showResults ? (
            <div className="p-12 rounded-3xl bg-[#151F32]/60 border border-slate-700/60 max-w-lg mx-auto text-center space-y-3">
              <EyeOff className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-xl font-bold text-white">Results are Hidden</h3>
              <p className="text-xs text-slate-400">
                Responses are being recorded live. Presenter can reveal them anytime (Press 'R' or click Eye icon).
              </p>
              <div className="font-mono text-cyan-400 text-sm font-bold pt-2">
                {currentResponsesList.length} votes received so far
              </div>
            </div>
          ) : currentSlide.type === 'multiple_choice' ? (
            <BarChartVisualizer
              options={currentSlide.options || []}
              responses={currentResponsesList}
            />
          ) : currentSlide.type === 'quiz' ? (
            <div className="space-y-8">
              <BarChartVisualizer
                options={currentSlide.options || []}
                responses={currentResponsesList}
                isQuiz={true}
                showCorrectAnswer={votingLocked}
              />
              {/* If voting is closed, reveal quiz leaderboard */}
              {votingLocked && (
                <div className="pt-8 border-t border-slate-800">
                  <QuizLeaderboard participants={participants} showConfetti={true} />
                </div>
              )}
            </div>
          ) : currentSlide.type === 'word_cloud' ? (
            <WordCloudVisualizer responses={currentResponsesList} />
          ) : currentSlide.type === 'rating_scale' ? (
            <RatingVisualizer
              responses={currentResponsesList}
              min={currentSlide.settings?.min || 1}
              max={currentSlide.settings?.max || 5}
              minLabel={currentSlide.settings?.minLabel || 'Lowest'}
              maxLabel={currentSlide.settings?.maxLabel || 'Highest'}
            />
          ) : currentSlide.type === 'ranking' ? (
            <RankingVisualizer
              options={currentSlide.options || []}
              responses={currentResponsesList}
            />
          ) : currentSlide.type === 'qa' ? (
            <QAPanel
              questions={questions}
              isPresenter={true}
              onModerate={(qid, action) => {
                getSocket().emit('moderate_question', {
                  sessionCode: session.code,
                  questionId: qid,
                  action,
                });
              }}
            />
          ) : currentSlide.type === 'open_ended' ? (
            <OpenEndedGrid responses={currentResponsesList} />
          ) : currentSlide.type === 'true_false' ? (
            <BarChartVisualizer
              options={currentSlide.options || []}
              responses={currentResponsesList}
              showCorrectAnswer={votingLocked}
            />
          ) : currentSlide.type === 'survey' ? (
            <DonutChartVisualizer
              options={currentSlide.options || []}
              responses={currentResponsesList}
            />
          ) : null}
        </div>
      </main>

      {/* BOTTOM CONTROLS TOOLBAR */}
      <PresentationControls
        currentIndex={currentSlideIndex}
        totalSlides={session.presentationData.slides.length}
        votingLocked={votingLocked}
        showResults={showResults}
        participantCount={participants.length}
        timerSeconds={currentSlide.timerSeconds}
        isFullscreen={isFullscreen}
        onPrev={handlePrev}
        onNext={handleNext}
        onToggleLock={handleToggleLock}
        onToggleResults={handleToggleResults}
        onResetResponses={handleResetResponses}
        onStartTimer={handleStartTimer}
        onToggleQR={() => setShowQR(true)}
        onToggleFullscreen={handleToggleFullscreen}
        onEndSession={handleEndSession}
      />

      {/* QR Code Big Modal */}
      {showQR && (
        <QRModal
          sessionCode={session.code}
          presentationTitle={session.presentationTitle}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
};

