/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        accent: {
          blue: '#2563EB',
          teal: '#0D9488',
          emerald: '#059669',
          amber: '#D97706',
          violet: '#7C3AED',
          cyan: '#0891B2',
        },
        dark: {
          950: '#070A12',
          900: '#0B0F19',
          850: '#111827',
          800: '#172033',
          700: '#1E293B',
          600: '#334155',
          border: 'rgba(255, 255, 255, 0.08)',
          glass: 'rgba(15, 23, 42, 0.75)',
        },
        light: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          subtle: '#F1F5F9',
          border: '#E2E8F0',
          glass: 'rgba(255, 255, 255, 0.85)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-brand': '0 0 35px -5px rgba(99, 102, 241, 0.25)',
        'glow-teal': '0 0 35px -5px rgba(20, 184, 166, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
