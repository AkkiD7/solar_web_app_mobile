/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
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
        primary: {
          DEFAULT: '#b65a12',
          strong: '#9d4300',
          soft: '#faede2',
        },
        border: {
          DEFAULT: '#eaded4',
          strong: '#dcc7b7',
        },
        success: {
          DEFAULT: '#2ea56c',
          soft: '#e7f7ef',
        },
        info: {
          DEFAULT: '#5b8ef5',
          soft: '#eaf2ff',
        },
        warning: {
          DEFAULT: '#f08a35',
          soft: '#fff1e4',
        },
        danger: {
          DEFAULT: '#d45c4a',
          soft: '#fdebe8',
        },
        white: '#ffffff',
        // Shadcn fallbacks just in case
        foreground: '#2f2622',
        muted: {
          DEFAULT: '#f6eeea',
          foreground: '#6d5c52',
        },
        accent: {
          DEFAULT: '#f4e7dd',
          foreground: '#b65a12',
        },
        destructive: {
          DEFAULT: '#d45c4a',
          foreground: '#ffffff',
        },
        ring: '#b65a12',
      },
      borderRadius: {
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '24px',
        xxl: '28px',
        pill: '9999px',
      },
      spacing: {
        screen: '20px',
        card: '16px',
      },
      boxShadow: {
        'floating': '0px 12px 32px rgba(182, 90, 18, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.04)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
