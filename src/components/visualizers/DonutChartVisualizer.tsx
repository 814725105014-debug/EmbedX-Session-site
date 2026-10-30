import React from 'react';
import { AnswerOption, ResponseRecord } from '../../types';
import { OPTION_COLORS } from '../../lib/colors';
import { PieChart } from 'lucide-react';

interface DonutChartVisualizerProps {
  options: AnswerOption[];
  responses: ResponseRecord[];
}

export const DonutChartVisualizer: React.FC<DonutChartVisualizerProps> = ({
  options = [],
  responses = [],
}) => {
  const total = responses.length;
  const counts: Record<string, number> = {};
  options.forEach((opt) => (counts[opt.id] = 0));
  responses.forEach((r) => {
    if (r.optionId && counts[r.optionId] !== undefined) {
      counts[r.optionId]++;
    }
  });

  // Calculate SVG stroke dashes for donut segments
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  const segments = options.map((opt, idx) => {
    const count = counts[opt.id] || 0;
    const percent = total > 0 ? count / total : 0;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativePercent * circumference;
    cumulativePercent += percent;
    const color = OPTION_COLORS[idx % OPTION_COLORS.length];

    return {
      id: opt.id,
      text: opt.text,
      count,
      percent: Math.round(percent * 100),
      strokeDasharray,
      strokeDashoffset,
      color,
    };
  });

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 p-6 rounded-3xl bg-[#151F32]/80 border border-slate-700/60 shadow-xl">
      {/* SVG Donut */}
      <div className="relative w-52 h-52 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="#1E293B"
            strokeWidth="24"
          />
          {total > 0 &&
            segments.map((seg) => (
              <circle
                key={seg.id}
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth="24"
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
            ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-white">{total}</span>
          <span className="text-xs uppercase font-mono text-slate-400">Votes</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3 flex-1 w-full">
        {segments.map((seg) => (
          <div key={seg.id} className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="font-semibold text-white text-sm">{seg.text}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-white">{seg.count}</span>
              <span className="text-slate-400">({seg.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
