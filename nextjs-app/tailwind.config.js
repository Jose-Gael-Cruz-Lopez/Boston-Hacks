/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 8-bit Arcade Colors
        'arcade-yellow': '#FFE400',
        'arcade-cyan': '#00FFFF',
        'arcade-pink': '#FF69B4',
        'arcade-orange': '#FFA500',
        'arcade-red': '#FF0000',
        'arcade-green': '#00FF00',
        'arcade-blue': '#0000FF',
        'arcade-purple': '#800080',
        // Primary colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Retro/Remix Theme Colors
        neon: {
          pink: '#ff0080',
          purple: '#8b5cf6',
          cyan: '#00ffff',
          green: '#00ff00',
          yellow: '#ffff00',
          orange: '#ff8000',
        },
        retro: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          indigo: '#6366f1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
        retro: ['Orbitron', 'Exo 2', 'sans-serif'],
        // 8-bit Arcade Fonts
        'pixel': ['Press Start 2P', 'monospace'],
        'terminal': ['Courier New', 'monospace'],
        'arcade': ['VT323', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'retro-grid': 'linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px), linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px)',
        'pixel-stars': 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'stars\' patternUnits=\'userSpaceOnUse\' width=\'20\' height=\'20\'%3E%3Crect width=\'20\' height=\'20\' fill=\'%23000\'/%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\' fill=\'%23FFE400\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23stars)\'/%3E%3C/svg%3E")',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(139,92,246,0.5), 0 0 40px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.1)',
        'neon-pink': '0 0 20px rgba(236,72,153,0.5), 0 0 40px rgba(236,72,153,0.3), 0 0 60px rgba(236,72,153,0.1)',
        'neon-cyan': '0 0 20px rgba(6,182,212,0.5), 0 0 40px rgba(6,182,212,0.3), 0 0 60px rgba(6,182,212,0.1)',
        'retro': '0 8px 32px rgba(139,92,246,0.2), 0 4px 16px rgba(139,92,246,0.1)',
        // 8-bit Arcade Shadows
        'pixel': '4px 4px 0px #000',
        'pixel-lg': '8px 8px 0px #000',
        'pixel-glow': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-in',
        // 8-bit Arcade Animations
        'pixel-bounce': 'pixel-bounce 0.1s ease-in-out',
        'scanlines': 'scanlines 0.1s linear infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite alternate',
        'pixel-pulse': 'pixel-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-neon': {
          '0%': { boxShadow: '0 0 20px rgba(139,92,246,0.5), 0 0 40px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.1)' },
          '100%': { boxShadow: '0 0 30px rgba(139,92,246,0.8), 0 0 60px rgba(139,92,246,0.5), 0 0 90px rgba(139,92,246,0.2)' },
        },
        'glow': {
          '0%': { filter: 'brightness(1) saturate(1)' },
          '100%': { filter: 'brightness(1.2) saturate(1.5)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        // 8-bit Arcade Keyframes
        'pixel-bounce': {
          '0%': { transform: 'translate(0px, 0px)' },
          '100%': { transform: 'translate(2px, 2px)' },
        },
        'scanlines': {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(2px)' },
        },
        'glitch': {
          '0%': { transform: 'translate(0px, 0px)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0px, 0px)' },
        },
        'pixel-pulse': {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 10px rgba(255, 228, 0, 0.5)'
          },
          '50%': { 
            opacity: '0.8',
            boxShadow: '0 0 20px rgba(255, 228, 0, 0.8)'
          },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
