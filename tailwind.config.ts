import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx}',
        './hooks/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
                serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
                mono: ['Geist Mono', 'monospace'],
            },
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                card: {
                    DEFAULT: 'var(--card)',
                    foreground: 'var(--card-foreground)',
                },
                popover: {
                    DEFAULT: 'var(--popover)',
                    foreground: 'var(--popover-foreground)',
                },
                primary: {
                    DEFAULT: 'var(--primary)',
                    foreground: 'var(--primary-foreground)',
                },
                secondary: {
                    DEFAULT: 'var(--secondary)',
                    foreground: 'var(--secondary-foreground)',
                },
                muted: {
                    DEFAULT: 'var(--muted)',
                    foreground: 'var(--muted-foreground)',
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    foreground: 'var(--accent-foreground)',
                },
                destructive: {
                    DEFAULT: 'var(--destructive)',
                    foreground: 'var(--destructive-foreground)',
                },
                border: 'var(--border)',
                input: 'var(--input)',
                ring: 'var(--ring)',
                chart: {
                    '1': 'var(--chart-1)',
                    '2': 'var(--chart-2)',
                    '3': 'var(--chart-3)',
                    '4': 'var(--chart-4)',
                    '5': 'var(--chart-5)',
                },
                sidebar: {
                    DEFAULT: 'var(--sidebar)',
                    foreground: 'var(--sidebar-foreground)',
                    primary: 'var(--sidebar-primary)',
                    'primary-foreground': 'var(--sidebar-primary-foreground)',
                    accent: 'var(--sidebar-accent)',
                    'accent-foreground': 'var(--sidebar-accent-foreground)',
                    border: 'var(--sidebar-border)',
                    ring: 'var(--sidebar-ring)',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                xl: 'calc(var(--radius) + 4px)',
            },
            animation: {
                'fade-up': 'fadeUp 800ms ease-out forwards',
                'fade-in': 'fadeIn 600ms ease-out forwards',
                'letter-spacing': 'letterSpacing 900ms ease-out forwards',
                'slow-pulse': 'slowPulse 2s ease-in-out infinite',
                'shake': 'shake 0.5s ease-in-out',
            },
            keyframes: {
                fadeUp: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                letterSpacing: {
                    from: { letterSpacing: '0.1em' },
                    to: { letterSpacing: '0.02em' },
                },
                slowPulse: {
                    '0%, 100%': { opacity: '0.4' },
                    '50%': { opacity: '1' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '20%, 60%': { transform: 'translateX(-4px)' },
                    '40%, 80%': { transform: 'translateX(4px)' },
                },
            },
        },
    },
    plugins: [tailwindcssAnimate],
}

export default config
