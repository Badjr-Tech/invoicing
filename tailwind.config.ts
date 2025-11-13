import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-accent": "#ffbd5a",
        "secondary-accent": "#476c2e",
        "light-gray": "#ffbd5a",
        "light-background": "#ffffff",
        "dark-foreground": "#363636",
        primary: "#ffbd5a",
        secondary: "#476c2e",
        background: "#ffffff",
        foreground: "#363636",
        "primary-foreground": "#363636",
      },
    },
  },
  plugins: [],
};
export default config;
