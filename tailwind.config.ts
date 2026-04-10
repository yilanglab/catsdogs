import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 猫系配色
        "cat-blue": "#8B9DAF",
        "cat-lavender": "#B8A9C9",
        "cat-mint": "#A8D8C8",
        // 犬系配色
        "dog-amber": "#E8A87C",
        "dog-orange": "#F4A460",
        "dog-cream": "#F5E6CA",
        // 狐系点缀
        "fox-gold": "#D4A574",
        // 狼系质感
        "wolf-dark": "#4A4A5A",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"PingFang SC"',
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
