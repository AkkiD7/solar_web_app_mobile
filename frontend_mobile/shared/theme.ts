import type { LeadStatus } from './constants/leadStatus';

export const solarTheme = {
  colors: {
    background: '#f8f3f0',
    backgroundMuted: '#f3ece7',
    surface: '#fffdfa',
    surfaceMuted: '#f6eeea',
    surfaceAccent: '#f4e7dd',
    input: '#fffaf7',
    text: '#2f2622',
    textMuted: '#6d5c52',
    textSoft: '#9a887d',
    primary: '#b65a12',
    primaryStrong: '#9d4300',
    primarySoft: '#faede2',
    border: '#eaded4',
    borderStrong: '#dcc7b7',
    success: '#2ea56c',
    successSoft: '#e7f7ef',
    info: '#5b8ef5',
    infoSoft: '#eaf2ff',
    warning: '#f08a35',
    warningSoft: '#fff1e4',
    danger: '#d45c4a',
    dangerSoft: '#fdebe8',
    shadow: 'rgba(133, 71, 28, 0.08)',
    shadowStrong: 'rgba(133, 71, 28, 0.14)',
    line: 'rgba(182, 90, 18, 0.08)',
    white: '#ffffff',
  },
  spacing: {
    screen: 20,
    card: 16,
  },
  radius: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 28,
    pill: 999,
  },
} as const;

export const solarShadows = {
  card: {
    shadowColor: '#85471c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 4,
  },
  floating: {
    shadowColor: '#85471c',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 8,
  },
  soft: {
    shadowColor: '#85471c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
} as const;

export const leadStatusTheme: Record<
  LeadStatus,
  { accent: string; background: string; text: string }
> = {
  NEW: {
    accent: '#2d7df6',
    background: '#eaf2ff',
    text: '#5b8ef5',
  },
  CONTACTED: {
    accent: '#2aa6d9',
    background: '#e9f7ff',
    text: '#2f9cc2',
  },
  SITE_VISIT: {
    accent: '#9b7a65',
    background: '#efe7e1',
    text: '#8d6c57',
  },
  QUOTE_SENT: {
    accent: '#f97316',
    background: '#fff1e4',
    text: '#f08a35',
  },
  WON: {
    accent: '#2ea56c',
    background: '#e7f7ef',
    text: '#279867',
  },
  LOST: {
    accent: '#d45c4a',
    background: '#fdebe8',
    text: '#d45c4a',
  },
};

export function getLeadStatusTheme(status: LeadStatus) {
  return leadStatusTheme[status];
}

export function getInitials(name: string | null | undefined) {
  if (!name?.trim()) {
    return 'SC';
  }

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}
