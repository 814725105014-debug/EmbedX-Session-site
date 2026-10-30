import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link to="/" className="flex items-center gap-3 group focus:outline-none">
      <div className={`relative ${iconSizes[size]} transition-transform duration-300 group-hover:scale-105`}>
        <img src="/embedx-logo.svg" alt="EMBEDX Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
      </div>
      <div className="flex flex-col">
        <div className={`font-black tracking-tight leading-none ${textSizes[size]} flex items-center gap-1.5`}>
          <span className="text-white">EMBED</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">X</span>
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 tracking-widest uppercase ml-0.5">
            LIVE
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-slate-400 tracking-wider font-mono font-medium mt-0.5 hidden sm:inline-block">
            SRM TRP • DEPT OF EEE
          </span>
        )}
      </div>
    </Link>
  );
};
