import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Timer, 
  QrCode, 
  Maximize, 
  Minimize, 
  Volume2, 
  VolumeX, 
  Users, 
  LogOut 
} from 'lucide-react';
import { soundFX } from '../lib/sound';

interface PresentationControlsProps {
  currentIndex: number;
  totalSlides: number;
  votingLocked: boolean;
  showResults: boolean;
  participantCount: number;
  timerSeconds?: number;
  isFullscreen: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleLock: () => void;
  onToggleResults: () => void;
  onResetResponses: () => void;
  onStartTimer?: (seconds: number) => void;
  onToggleQR: () => void;
  onToggleFullscreen: () => void;
  onEndSession: () => void;
}

export const PresentationControls: React.FC<PresentationControlsProps> = ({
  currentIndex,
  totalSlides,
  votingLocked,
  showResults,
  participantCount,
  timerSeconds,
  isFullscreen,
  onPrev,
  onNext,
  onToggleLock,
  onToggleResults,
  onResetResponses,
  onStartTimer,
  onToggleQR,
  onToggleFullscreen,
  onEndSession,
}) => {
  const [isMuted, setIsMuted] = useState(soundFX.getMuted());
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const toggleMute = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#0B1220]/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-2 sm:gap-3 transition-all duration-300">
        {/* Slide Navigation */}
        <button
          onClick={onPrev}
          disabled={currentIndex <= 0}
          title="Previous Slide (← Left Arrow)"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="font-mono text-xs sm:text-sm font-bold text-white px-2">
          {currentIndex + 1} / {totalSlides}
        </span>

        <button
          onClick={onNext}
          disabled={currentIndex >= totalSlides - 1}
          title="Next Slide (→ Right Arrow or Space)"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-slate-800 mx-1" />

        {/* Voting Lock/Unlock */}
        <button
          onClick={onToggleLock}
          title={votingLocked ? 'Unlock Voting (L)' : 'Lock Voting (L)'}
          className={`p-2 rounded-xl transition-colors ${
            votingLocked
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          {votingLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>

        {/* Show / Hide Results */}
        <button
          onClick={onToggleResults}
          title={showResults ? 'Hide Results from Viewers (R)' : 'Show Results to Viewers (R)'}
          className={`p-2 rounded-xl transition-colors ${
            !showResults
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          {showResults ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        {/* Timer Trigger */}
        {timerSeconds && onStartTimer && (
          <button
            onClick={() => onStartTimer(timerSeconds)}
            title={`Start ${timerSeconds}s Countdown Timer`}
            className="p-2 rounded-xl text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-800/40 transition-colors"
          >
            <Timer className="w-4 h-4" />
          </button>
        )}

        {/* Reset Responses */}
        <button
          onClick={onResetResponses}
          title="Reset Responses for this slide"
          className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-800 mx-1" />

        {/* QR Code Modal Toggle */}
        <button
          onClick={onToggleQR}
          title="Show Join Instructions & QR Code (Q)"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <QrCode className="w-4 h-4" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute Audio (M)' : 'Mute Audio (M)'}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        <div className="w-px h-6 bg-slate-800 mx-1" />

        {/* Connected Participants Counter */}
        <div className="flex items-center gap-1.5 px-2 text-xs font-mono font-bold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Users className="w-3.5 h-3.5 text-cyan-400 ml-0.5" />
          <span>{participantCount}</span>
        </div>

        {/* End Session Button */}
        <button
          onClick={() => setShowEndConfirm(true)}
          title="End Presentation Session"
          className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* End Session Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#101828] border border-rose-500/40 p-6 text-center space-y-4">
            <h3 className="text-lg font-bold text-white">End Presentation Session?</h3>
            <p className="text-xs text-slate-400">
              This will complete the live session and compile the final participant reports and analytics.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEndConfirm(false);
                  onEndSession();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-950/50"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

