// tailwind.config.ts

import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography"; // Import the typography plugin

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Add any additional colors or customizations here
      },
      // Optional: Customize typography styles
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.foreground"),
            a: {
              color: theme("colors.primary"),
              "&:hover": {
                color: theme("colors.primary-dark"), // Ensure 'primary-dark' is defined in your colors
              },
            },
            // Add more customizations as needed
          },
        },
      }),
    },
  },
  plugins: [
    typography(), // Add the typography plugin here
    // You can add other plugins here as needed
  ],
};

export default config;
