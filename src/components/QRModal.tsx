import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Smartphone, ExternalLink } from 'lucide-react';

interface QRModalProps {
  sessionCode: string;
  presentationTitle: string;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({
  sessionCode,
  presentationTitle,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const formattedCode = `${sessionCode.slice(0, 3)} ${sessionCode.slice(3)}`;
  const joinUrl = `${window.location.origin}/session/${sessionCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#101828] border-2 border-cyan-500/50 p-6 sm:p-8 shadow-2xl text-center space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5" /> Scan or Enter Code
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{presentationTitle}</h3>
        </div>

        {/* High Contrast QR Code */}
        <div className="p-4 bg-white rounded-2xl w-fit mx-auto shadow-xl ring-4 ring-cyan-500/20">
          <QRCodeSVG
            value={joinUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* 6-Digit PIN Code */}
        <div className="space-y-1">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Join Code</p>
          <div className="text-4xl sm:text-5xl font-black font-mono text-cyan-300 tracking-wider">
            {formattedCode}
          </div>
        </div>

        {/* Join URL and Copy */}
        <div className="pt-2 flex items-center justify-center gap-2">
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Direct Link'}</span>
          </button>

          <a
            href={`/session/${sessionCode}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Tab</span>
          </a>
        </div>
      </div>
    </div>
  );
};

