import React from 'react';
import { ResponseRecord } from '../../types';
import { MessageSquareText } from 'lucide-react';

interface OpenEndedGridProps {
  responses: ResponseRecord[];
}

export const OpenEndedGrid: React.FC<OpenEndedGridProps> = ({ responses = [] }) => {
  if (responses.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800">
        <MessageSquareText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400 font-medium">Waiting for participant thoughts. Responses will appear here live!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-sm text-slate-400 px-2 font-mono mb-4">
        {responses.length} {responses.length === 1 ? 'Response' : 'Responses'} Received
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {responses.map((r, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#151F32]/80 border border-slate-700/60 shadow-lg hover:border-slate-500 transition-all flex flex-col justify-between"
          >
            <p className="text-white text-base font-medium leading-relaxed mb-4">
              "{r.text}"
            </p>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
              <span className="font-semibold text-cyan-400">
                {r.nickname || 'Student'}
              </span>
              <span className="font-mono text-[11px]">
                {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
