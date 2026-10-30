import React, { useEffect } from 'react';
import { Participant } from '../../types';
import { Trophy, Medal, Award, Zap, Sparkles } from 'lucide-react';
import { triggerWinnerConfetti } from '../../lib/confetti';
import { soundFX } from '../../lib/sound';

interface QuizLeaderboardProps {
  participants: Participant[];
  showConfetti?: boolean;
}

export const QuizLeaderboard: React.FC<QuizLeaderboardProps> = ({
  participants = [],
  showConfetti = true,
}) => {
  const sorted = [...participants].sort((a, b) => (b.score || 0) - (a.score || 0));
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];
  const runnersUp = sorted.slice(3, 10);

  useEffect(() => {
    if (showConfetti && sorted.length > 0 && sorted[0].score > 0) {
      triggerWinnerConfetti();
      soundFX.playWinnerFanfare();
    }
  }, [showConfetti]);

  if (sorted.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto text-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800">
        <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400 font-medium">No quiz participants yet. Scores will appear as answers roll in!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Live Quiz Standings
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Leaderboard</h2>
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-12 max-w-2xl mx-auto">
        {/* 2nd Place */}
        {top2 ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-2 flex flex-col items-center">
              <span className="text-2xl sm:text-3xl mb-1">{top2.avatar || '🥈'}</span>
              <span className="font-bold text-white text-xs sm:text-sm truncate max-w-[90px] sm:max-w-[120px] text-center">
                {top2.nickname}
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">
                {top2.score} pts
              </span>
            </div>
            <div className="w-full h-28 sm:h-36 rounded-t-2xl bg-gradient-to-t from-slate-800 via-slate-700 to-slate-600 border-t-2 border-x-2 border-slate-400/50 flex flex-col items-center justify-center shadow-lg">
              <Medal className="w-8 h-8 text-slate-300 mb-1" />
              <span className="text-xl sm:text-2xl font-black text-white">2</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-28 rounded-t-2xl bg-slate-800/20" />
        )}

        {/* 1st Place (Champion) */}
        {top1 ? (
          <div className="flex flex-col items-center -mt-6">
            <div className="relative mb-2 flex flex-col items-center">
              <div className="absolute -top-7 text-amber-400 animate-bounce">
                <Trophy className="w-7 h-7 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              </div>
              <span className="text-3xl sm:text-4xl mb-1">{top1.avatar || '👑'}</span>
              <span className="font-black text-amber-300 text-sm sm:text-base truncate max-w-[100px] sm:max-w-[140px] text-center">
                {top1.nickname}
              </span>
              <span className="text-xs sm:text-sm font-mono font-extrabold text-amber-400">
                {top1.score} pts
              </span>
            </div>
            <div className="w-full h-40 sm:h-48 rounded-t-2xl bg-gradient-to-t from-amber-950/80 via-amber-700 to-amber-500 border-t-2 border-x-2 border-amber-300 flex flex-col items-center justify-center shadow-2xl shadow-amber-500/20">
              <Trophy className="w-10 h-10 text-white mb-1" />
              <span className="text-2xl sm:text-4xl font-black text-white">1</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-40 rounded-t-2xl bg-slate-800/20" />
        )}

        {/* 3rd Place */}
        {top3 ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-2 flex flex-col items-center">
              <span className="text-2xl sm:text-3xl mb-1">{top3.avatar || '🥉'}</span>
              <span className="font-bold text-white text-xs sm:text-sm truncate max-w-[90px] sm:max-w-[120px] text-center">
                {top3.nickname}
              </span>
              <span className="text-xs font-mono font-bold text-amber-600/90">
                {top3.score} pts
              </span>
            </div>
            <div className="w-full h-20 sm:h-28 rounded-t-2xl bg-gradient-to-t from-amber-950/60 via-amber-900 to-amber-800 border-t-2 border-x-2 border-amber-700/50 flex flex-col items-center justify-center shadow-lg">
              <Award className="w-7 h-7 text-amber-500 mb-1" />
              <span className="text-lg sm:text-xl font-black text-white">3</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-20 rounded-t-2xl bg-slate-800/20" />
        )}
      </div>

      {/* Ranks 4 to 10 */}
      {runnersUp.length > 0 && (
        <div className="space-y-2 max-w-xl mx-auto pt-4">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-wider px-2">Top Contenders</p>
          <div className="bg-[#151F32]/80 border border-slate-700/60 rounded-2xl divide-y divide-slate-800/80 overflow-hidden shadow-xl">
            {runnersUp.map((p, idx) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-mono font-bold text-xs text-slate-400">
                    #{idx + 4}
                  </span>
                  <span className="text-lg">{p.avatar || '⚡'}</span>
                  <span className="font-semibold text-white text-sm">{p.nickname}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono font-bold text-cyan-400 text-sm">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{p.score} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
