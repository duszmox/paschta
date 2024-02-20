import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        transparent: "transparent",
        bg: "#F1E2CC",
        primary: "#4F3130",
        dark: "#A08A7E",
        light: "#C9B6A5",
      },
    },
  },
  plugins: [],
} satisfies Config;
