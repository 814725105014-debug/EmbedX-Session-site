import React from 'react';
import { AnswerOption, ResponseRecord } from '../../types';
import { ListOrdered, Trophy, ArrowUp } from 'lucide-react';
import { OPTION_COLORS } from '../../lib/colors';

interface RankingVisualizerProps {
  options: AnswerOption[];
  responses: ResponseRecord[];
}

export const RankingVisualizer: React.FC<RankingVisualizerProps> = ({
  options = [],
  responses = [],
}) => {
  const n = options.length;
  const scores: Record<string, number> = {};
  options.forEach((opt) => (scores[opt.id] = 0));

  responses.forEach((resp) => {
    if (resp.ranks && Array.isArray(resp.ranks)) {
      resp.ranks.forEach((optId, rankIdx) => {
        // Borda Count: rank 0 gets n points, rank 1 gets n-1 points...
        const points = n - rankIdx;
        scores[optId] = (scores[optId] || 0) + points;
      });
    }
  });

  const rankedOptions = [...options].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
  const maxScore = Math.max(...Object.values(scores), 1);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-400 px-2 font-mono">
        <span className="flex items-center gap-1.5">
          <ListOrdered className="w-4 h-4 text-cyan-400" />
          <span>Aggregate Ranking ({responses.length} {responses.length === 1 ? 'Submission' : 'Submissions'})</span>
        </span>
      </div>

      <div className="space-y-3">
        {rankedOptions.map((opt, idx) => {
          const score = scores[opt.id] || 0;
          const barWidth = responses.length > 0 ? (score / maxScore) * 100 : 0;
          const color = OPTION_COLORS[idx % OPTION_COLORS.length];

          return (
            <div
              key={opt.id}
              className="relative overflow-hidden p-4 rounded-2xl bg-[#151F32]/80 border border-slate-700/60 shadow-lg transition-all duration-500"
            >
              <div
                className="absolute top-0 bottom-0 left-0 opacity-15 rounded-2xl transition-all duration-700"
                style={{ width: `${barWidth}%`, backgroundColor: color }}
              />

              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: color }}
                  >
                    #{idx + 1}
                  </div>
                  <span className="font-semibold text-white text-base sm:text-lg">
                    {opt.text}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono shrink-0">
                  <span className="text-xl font-black text-cyan-300">{score}</span>
                  <span className="text-xs text-slate-400">pts</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

