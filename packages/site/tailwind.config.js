import colors from 'tailwindcss/colors';
import { fontFamily } from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,tsx}'],
    darkMode: 'selector',
    theme: {
        extend: {
            fontFamily: {
                'rubik': ['Rubik', 'sans-serif', ...fontFamily.sans],
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.35s ease forwards',
            }
        },

    },
    plugins: [
        plugin(function ({ addComponents }) {
            addComponents({
                '.bg-primary': {
                    backgroundColor: colors.white,
                    '.dark &': {
                        backgroundColor: colors.neutral[900],
                    },
                },
                '.bg-button': {
                    backgroundColor: colors.gray[100],
                    '.dark &': {
                        backgroundColor: colors.neutral[800],
                    }
                },
                '.text-primary': {
                    color: colors.gray[800],
                    '.dark &': {
                        color: colors.neutral[200],
                    }
                },
                '.text-secondary': {
                    color: colors.gray[400],
                    '.dark &': {
                        color: colors.neutral[500],
                    }
                },
                '.text-light': {
                    color: colors.gray[400],
                    '@media (prefers-contrast: more)': {
                        color: colors.gray[500],
                    },
                    '.dark &': {
                        color: colors.neutral[500],
                        '@media (prefers-contrast: more)': {
                            color: colors.neutral[400],
                        },
                    }
                },
                '.border-primary': {
                    borderColor: colors.gray[100],
                    '.dark &': {
                        borderColor: colors.neutral[800],
                    }
                },
                '.border-button': {
                    borderColor: colors.gray[200],
                    '.dark &': {
                        borderColor: colors.neutral[700],
                    }
                },
            })
        })
    ]
};
