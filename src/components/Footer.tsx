import React from 'react';
import { Logo } from './Logo';
import { ExternalLink, Cpu, Heart, Shield, Radio, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#070B14] border-t border-slate-800 text-slate-400 text-xs py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" showSubtitle={false} />
            <p className="text-slate-400 text-xs leading-relaxed">
              Real-time audience polling, interactive quizzes, and live Q&A built for technical workshops, symposiums, and engineering hackathons.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Engine Online • WebSocket Active
            </div>
          </div>

          {/* Academic Affiliation */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Academic Home
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="font-medium text-slate-300">EMBEDX Student Club</li>
              <li>Department of Electrical and Electronics Engineering</li>
              <li>SRM TRP Engineering College</li>
              <li>Tiruchirappalli - 621 105, Tamil Nadu</li>
            </ul>
          </div>

          {/* Club Initiatives */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Club Initiatives
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://embedx.neocities.org/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
                >
                  Official Club Website <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <span className="text-slate-300 font-medium">EMBEDNOVA</span>
                <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Annual Symposium</span>
              </li>
              <li className="text-slate-400">Autonomous Rovers Lab</li>
              <li className="text-slate-400">Microcontroller & IoT Bootcamps</li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              Quick Join
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              Attending a live EMBEDX workshop or guest lecture? Enter the session code from your phone without downloading any app.
            </p>
            <div className="pt-1">
              <a 
                href="/join" 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-colors"
              >
                <span>Go to /join screen</span>
                →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} EMBEDX – Embedded Systems & Automation Club, SRM TRP Engineering College. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Production Grade SaaS Platform</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for SRM TRP Engineers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

