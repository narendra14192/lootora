/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lootora: {
          bg: "#0A0A0A",
          card: "#141414",
          purple: "#8B5CF6",
          blue: "#00E5FF",
          pink: "#FF2E88",
          text: "#FFFFFF",
          muted: "#A0A0A0",
          border: "#1F1F1F",
        }
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        neonPurple: "0 0 15px rgba(139, 92, 246, 0.4)",
        neonBlue: "0 0 15px rgba(0, 229, 255, 0.4)",
        neonPink: "0 0 15px rgba(255, 46, 136, 0.4)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(to right, rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.05) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
