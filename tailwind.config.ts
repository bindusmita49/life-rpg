import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        foreground: "#ededed",
        cyber: {
          dark: "#0a0a0f",
          cyan: "#00fff2",
          magenta: "#ff00c8",
        },
        neon: {
          cyan: "#00fff2",
          magenta: "#ff00c8",
        },
      },
      fontFamily: {
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        header: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
