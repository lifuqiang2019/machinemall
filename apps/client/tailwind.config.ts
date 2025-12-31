import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "var(--primary-color)",
                    hover: "var(--primary-hover)",
                },
                secondary: {
                    DEFAULT: "var(--secondary-color)",
                    hover: "var(--secondary-hover)",
                },
                'text-main': "var(--text-main)",
                'text-secondary': "var(--text-secondary)",
                'text-muted': "var(--text-muted)",
                'bg-light': "var(--bg-light)",
                'border-color': "var(--border-color)",
            },
            maxWidth: {
                'max-width': "var(--max-width)",
            },
        },
    },
    plugins: [
        typography,
    ],
};
export default config;
