import React from 'react';
import { ResponseRecord } from '../../types';
import { Star, BarChart2 } from 'lucide-react';

interface RatingVisualizerProps {
  responses: ResponseRecord[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

export const RatingVisualizer: React.FC<RatingVisualizerProps> = ({
  responses = [],
  min = 1,
  max = 5,
  minLabel = 'Lowest',
  maxLabel = 'Highest',
}) => {
  const ratings = responses.map((r) => Number(r.rating) || 0).filter((v) => v >= min && v <= max);
  const total = ratings.length;

  const average = total > 0 ? (ratings.reduce((a, b) => a + b, 0) / total).toFixed(1) : '0.0';

  // Calculate frequency per rating score
  const scale = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const counts: Record<number, number> = {};
  scale.forEach((s) => (counts[s] = 0));
  ratings.forEach((r) => {
    counts[r] = (counts[r] || 0) + 1;
  });

  const maxFreq = Math.max(...Object.values(counts), 1);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Average Score Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-3xl bg-[#151F32]/80 border border-slate-700/60 shadow-xl gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Star className="w-8 h-8 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white">{average}</span>
              <span className="text-sm font-semibold text-slate-400">/ {max}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Average Rating ({total} {total === 1 ? 'Response' : 'Responses'})</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">Min: {minLabel}</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">Max: {maxLabel}</span>
        </div>
      </div>

      {/* Distribution Bars */}
      <div className="p-6 rounded-3xl bg-[#151F32]/80 border border-slate-700/60 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          Rating Distribution
        </div>

        {scale.map((score) => {
          const count = counts[score] || 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const barWidth = total > 0 ? (count / maxFreq) * 100 : 0;

          return (
            <div key={score} className="flex items-center gap-4">
              <div className="w-8 font-mono font-bold text-sm text-white flex items-center gap-1">
                <span>{score}</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </div>

              <div className="flex-1 h-7 rounded-xl bg-slate-900 overflow-hidden relative border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl transition-all duration-700"
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <div className="w-16 font-mono text-xs font-semibold text-slate-300 text-right">
                {count} ({pct}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
