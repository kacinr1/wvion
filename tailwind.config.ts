import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Direction artistique « Smoking »
        ink: '#070707',
        surface: { DEFAULT: '#0B0A08', 2: '#16130E', 3: '#14110C' },
        ivory: '#F2EDE4',
        'ivory-2': '#CFC9BD',
        mute: '#A39E94',
        faint: '#8E897F',
        gold: { DEFAULT: '#C9A96E', light: '#FFF3D6', dark: '#8C7442' },
        line: { DEFAULT: '#1E1B16', 2: '#2A251D', 3: '#3A342A' },
        urgent: { DEFAULT: '#D63A3A', text: '#E07A7A', bg: '#0E0505', bg2: '#140808', line: '#5A2222' },
      },
      fontFamily: {
        serif: ['var(--font-bodoni)', 'Bodoni Moda', 'serif'],
        sans: ['var(--font-jost)', 'Jost', 'sans-serif'],
      },
      maxWidth: {
        shell: '1320px',
      },
    },
  },
  plugins: [],
};

export default config;
