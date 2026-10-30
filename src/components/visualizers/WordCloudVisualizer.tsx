import React, { useMemo } from 'react';
import { ResponseRecord } from '../../types';
import { OPTION_COLORS } from '../../lib/colors';
import { Cloud, Sparkles } from 'lucide-react';

interface WordCloudVisualizerProps {
  responses: ResponseRecord[];
}

interface WordEntry {
  text: string;
  count: number;
  color: string;
  fontSize: number;
}

export const WordCloudVisualizer: React.FC<WordCloudVisualizerProps> = ({ responses = [] }) => {
  const words = useMemo(() => {
    const freqMap: Record<string, number> = {};

    responses.forEach((r) => {
      if (r.text) {
        // Words can be separated by commas, spaces, or entered as short phrases
        const tokens = r.text
          .split(/[,;\n]+/)
          .map((w) => w.trim())
          .filter((w) => w.length > 0);

        tokens.forEach((token) => {
          const lower = token.toLowerCase();
          // Normalize capitalization (capitalize first letter)
          const capitalized = lower.charAt(0).toUpperCase() + lower.slice(1);
          freqMap[capitalized] = (freqMap[capitalized] || 0) + 1;
        });
      }
    });

    const entries = Object.entries(freqMap).map(([text, count]) => ({
      text,
      count,
    }));

    if (entries.length === 0) return [];

    const maxCount = Math.max(...entries.map((e) => e.count), 1);
    const minCount = Math.min(...entries.map((e) => e.count), 1);

    // Calculate font size range: 18px to 64px
    return entries.map((entry, idx): WordEntry => {
      const normalized = (entry.count - minCount) / Math.max(1, maxCount - minCount);
      const fontSize = Math.round(18 + normalized * 44);
      const color = OPTION_COLORS[idx % OPTION_COLORS.length];

      return {
        text: entry.text,
        count: entry.count,
        color,
        fontSize,
      };
    });
  }, [responses]);

  if (words.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto h-80 rounded-2xl border-2 border-dashed border-slate-700/60 flex flex-col items-center justify-center p-8 text-center bg-slate-900/30">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 animate-pulse">
          <Cloud className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">Waiting for Audience Words...</h3>
        <p className="text-sm text-slate-400 max-w-md">
          Participants can submit words or short phrases from their phones. They will float and grow in real time!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-400 px-2 font-mono">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{words.length} Unique Words • {responses.length} Submissions</span>
        </span>
      </div>

      <div className="min-h-[360px] p-8 rounded-3xl bg-[#151F32]/80 border border-slate-700/60 backdrop-blur-md flex flex-wrap items-center justify-center gap-4 sm:gap-6 shadow-2xl overflow-hidden">
        {words.map((item, idx) => (
          <span
            key={`${item.text}-${idx}`}
            className="inline-block transition-all duration-700 ease-out hover:scale-110 cursor-default select-none animate-in fade-in zoom-in-50"
            style={{
              fontSize: `${item.fontSize}px`,
              color: item.color,
              fontWeight: item.count > 1 ? 800 : 600,
              textShadow: item.count > 1 ? `0 0 20px ${item.color}40` : 'none',
              transform: `rotate(${(idx % 5 - 2) * 2}deg)`,
            }}
            title={`${item.text}: ${item.count} submission${item.count > 1 ? 's' : ''}`}
          >
            {item.text}
            {item.count > 1 && (
              <span className="text-xs font-mono opacity-60 ml-1.5 align-super">
                ×{item.count}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

