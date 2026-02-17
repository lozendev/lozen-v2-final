/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
                roboto: ['Roboto', 'sans-serif'],
                urbanist: ['Urbanist', 'sans-serif'],
            },
            colors: {
                'cyber-yellow': '#fcf5e5',
            },
            keyframes: {
                'fade-in': {
                    'from': { opacity: '0', transform: 'translateY(10px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-up': {
                    'from': { opacity: '0', transform: 'scale(0.95)' },
                    'to': { opacity: '1', transform: 'scale(1)' },
                },
                'glitch-anim': {
                    '0%': { clipPath: 'inset(20% 0 80% 0)', transform: 'translate(-2px, 2px)' },
                    '20%': { clipPath: 'inset(60% 0 10% 0)', transform: 'translate(2px, -2px)' },
                    '40%': { clipPath: 'inset(40% 0 50% 0)', transform: 'translate(-2px, 2px)' },
                    '60%': { clipPath: 'inset(80% 0 5% 0)', transform: 'translate(2px, -2px)' },
                    '80%': { clipPath: 'inset(10% 0 70% 0)', transform: 'translate(-2px, 2px)' },
                    '100%': { clipPath: 'inset(0 0 0 0)', transform: 'translate(0)' },
                }
            },
            animation: {
                'fade-in': 'fade-in 0.5s ease-out forwards',
                'scale-up': 'scale-up 0.3s ease-out forwards',
                'glitch': 'glitch-anim 0.3s cubic-bezier(.25, .46, .45, .94) both infinite',
            }
        },
    },
    plugins: [],
}
