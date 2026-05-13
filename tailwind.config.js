/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Ini bagian penting agar class font-heading dkk dikenali
      fontFamily: {
        heading: ["Instrument Serif", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}