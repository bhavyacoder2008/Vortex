/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        popup: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      },
      animation: {
        popup: "popup 0.3s ease-out forwards"
      },
      fontFamily: {
        fera: ["Fira Code", "monospace"],
        mon: ["Montserrat", "sans-serif"],
        lora: ["Lora", "serif"]
      }
  },
},
  plugins: [],
};