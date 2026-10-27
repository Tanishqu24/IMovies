/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          bg: '#0B1020',
          secondary: '#11182B',
          card: '#171D33',
          cardHover: '#1E2642',
          border: '#27324A',
          borderLight: '#374567',
        },
        cinema: {
          purple: '#7C3AED',
          accent: '#A855F7',
          glow: 'rgba(124, 58, 237, 0.35)',
          text: '#F8FAFC',
          muted: '#94A3B8',
          success: '#22C55E',
          error: '#EF4444',
          gold: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'cinema-glow': '0 0 25px -5px rgba(124, 58, 237, 0.4)',
        'cinema-glow-lg': '0 0 40px -5px rgba(168, 85, 247, 0.5)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}

