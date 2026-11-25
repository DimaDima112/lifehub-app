import type { ThemeColor } from '../store/types';

export const colorMap: Record<ThemeColor, { bg: string; text: string; border: string; hex: string }> = {
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-400',   hex: '#3b82f6' },
  green:  { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-400',  hex: '#22c55e' },
  red:    { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-400',    hex: '#ef4444' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-400', hex: '#eab308' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-400', hex: '#a855f7' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-400', hex: '#f97316' },
};
