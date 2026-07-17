/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#0B1410",
        ivory: "#F3EEE3",
        sapphire: "#2D5C8C",
        gold: "#C7A35C",
        ruby: "#8C2D3B",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      clipPath: {
        facet: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
      },
    },
  },
  plugins: [],
}
