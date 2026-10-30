import React from 'react';
import { QAQuestion } from '../../types';
import { ThumbsUp, Pin, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react';

interface QAPanelProps {
  questions: QAQuestion[];
  isPresenter?: boolean;
  onUpvote?: (questionId: string) => void;
  onModerate?: (questionId: string, action: 'answer' | 'pin' | 'delete') => void;
  currentUserId?: string;
}

export const QAPanel: React.FC<QAPanelProps> = ({
  questions = [],
  isPresenter = false,
  onUpvote,
  onModerate,
  currentUserId = '',
}) => {
  // Sort pinned first, then by upvotes descending
  const sortedQuestions = [...questions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return (b.upvotes || 0) - (a.upvotes || 0);
  });

  if (sortedQuestions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800">
        <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400 font-medium">No questions asked yet. Ask a question or upvote existing ones!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {sortedQuestions.map((q) => {
        const hasVoted = q.voters?.includes(currentUserId);

        return (
          <div
            key={q.id}
            className={`p-4 rounded-2xl border transition-all duration-300 ${
              q.isPinned
                ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                : q.isAnswered
                ? 'bg-slate-900/40 border-slate-800 opacity-60'
                : 'bg-[#151F32]/80 border-slate-700/60 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-cyan-400">
                    {q.nickname || 'Student'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    • {new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {q.isPinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      <Pin className="w-3 h-3 fill-cyan-400" /> Pinned
                    </span>
                  )}
                  {q.isAnswered && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3" /> Answered
                    </span>
                  )}
                </div>

                <p className="text-white text-base sm:text-lg font-medium leading-snug">
                  {q.text}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Upvote Button */}
                <button
                  onClick={() => onUpvote && onUpvote(q.id)}
                  disabled={!onUpvote}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                    hasVoted
                      ? 'bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-white' : ''}`} />
                  <span>{q.upvotes || 0}</span>
                </button>

                {/* Presenter Moderation Tools */}
                {isPresenter && onModerate && (
                  <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-700">
                    <button
                      onClick={() => onModerate(q.id, 'pin')}
                      title={q.isPinned ? 'Unpin' : 'Pin to top'}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        q.isPinned ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onModerate(q.id, 'answer')}
                      title={q.isAnswered ? 'Mark Unanswered' : 'Mark Answered'}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        q.isAnswered ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onModerate(q.id, 'delete')}
                      title="Delete question"
                      className="p-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
