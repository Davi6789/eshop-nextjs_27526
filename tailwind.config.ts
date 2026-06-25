//  tailwind.config.ts

import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class", // Wichtig!
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
   theme: {
    extend: {
      colors: {
        // gray: {
        //   400: '#9ca3af',
        //   500: '#d1d5db',   // heller im Dark Mode
        //   600: '#e5e7eb',   // heller im Dark Mode
        //   700: '#f3f4f6',   // heller im Dark Mode
        //   800: '#f9fafb',   // heller im Dark Mode
        //   900: '#ffffff',   // weiß
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
}

export default config;