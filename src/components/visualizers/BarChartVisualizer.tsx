import React from 'react';
import { AnswerOption, ResponseRecord } from '../../types';
import { OPTION_COLORS } from '../../lib/colors';
import { Check, Users } from 'lucide-react';

interface BarChartVisualizerProps {
  options: AnswerOption[];
  responses: ResponseRecord[];
  showCorrectAnswer?: boolean;
  isQuiz?: boolean;
}

export const BarChartVisualizer: React.FC<BarChartVisualizerProps> = ({
  options = [],
  responses = [],
  showCorrectAnswer = false,
  isQuiz = false,
}) => {
  const totalResponses = responses.length;

  // Calculate vote count per option
  const counts: Record<string, number> = {};
  options.forEach((opt) => {
    counts[opt.id] = 0;
  });

  responses.forEach((resp) => {
    if (resp.optionId && counts[resp.optionId] !== undefined) {
      counts[resp.optionId]++;
    }
  });

  const maxCount = Math.max(...Object.values(counts), 1);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Response Count Badge */}
      <div className="flex items-center justify-between text-sm text-slate-400 px-2 font-mono">
        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>{totalResponses} {totalResponses === 1 ? 'Vote' : 'Votes'} Recorded</span>
        </span>
        {isQuiz && showCorrectAnswer && (
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-4 h-4" /> Correct Answer Revealed
          </span>
        )}
      </div>

      {/* Options Bars */}
      <div className="space-y-3.5">
        {options.map((opt, idx) => {
          const count = counts[opt.id] || 0;
          const percentage = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
          const barWidth = totalResponses > 0 ? (count / maxCount) * 100 : 0;
          const isCorrect = Boolean(opt.isCorrect);
          const color = OPTION_COLORS[idx % OPTION_COLORS.length];

          const isHighlighted = showCorrectAnswer && isCorrect;
          const isDimmed = showCorrectAnswer && !isCorrect;

          return (
            <div
              key={opt.id}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-500 p-4 ${
                isHighlighted
                  ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-950/50'
                  : isDimmed
                  ? 'bg-slate-900/40 border-slate-800 opacity-60'
                  : 'bg-[#151F32]/80 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              {/* Dynamic Fill Bar */}
              <div
                className="absolute top-0 bottom-0 left-0 transition-all duration-700 ease-out rounded-2xl opacity-20"
                style={{
                  width: `${barWidth}%`,
                  backgroundColor: isHighlighted ? '#10B981' : color,
                }}
              />

              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: color }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className={`font-semibold text-base sm:text-lg ${isHighlighted ? 'text-emerald-300' : 'text-white'}`}>
                    {opt.text}
                  </span>
                  {showCorrectAnswer && isCorrect && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      <Check className="w-3 h-3" /> Correct
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono">
                  <span className="text-xl sm:text-2xl font-black text-white">
                    {count}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-400 w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
