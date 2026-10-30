// ====================================================================
// BRAND COLOR PALETTES & THEMES
// ====================================================================

export const OPTION_COLORS = [
  '#2563EB', // Blue
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#14B8A6', // Teal
];

export const THEMES = [
  {
    id: 'cyber_dark',
    name: 'Cyber Dark',
    bg: 'bg-gradient-to-br from-[#0B1220] via-[#101828] to-[#070B14]',
    cardBg: 'bg-[#151F32]/80 backdrop-blur-md border border-cyan-900/30',
    textColor: 'text-white',
    accentColor: 'text-cyan-400'
  },
  {
    id: 'deep_navy',
    name: 'Deep Navy',
    bg: 'bg-gradient-to-b from-[#101828] to-[#1E293B]',
    cardBg: 'bg-[#1E293B]/90 backdrop-blur-md border border-blue-800/40',
    textColor: 'text-slate-100',
    accentColor: 'text-blue-400'
  },
  {
    id: 'circuit_neon',
    name: 'Circuit Neon',
    bg: 'bg-gradient-to-br from-[#050C1A] via-[#091D34] to-[#061426]',
    cardBg: 'bg-[#0E2A47]/80 backdrop-blur-md border border-cyan-500/30',
    textColor: 'text-cyan-50',
    accentColor: 'text-cyan-300'
  },
  {
    id: 'clean_light',
    name: 'Clean Light',
    bg: 'bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50',
    cardBg: 'bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl',
    textColor: 'text-slate-900',
    accentColor: 'text-blue-600'
  }
];

export function getTheme(themeId?: string) {
  return THEMES.find(t => t.id === themeId) || THEMES[0];
}

