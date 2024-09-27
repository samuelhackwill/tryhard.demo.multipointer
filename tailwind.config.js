/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/*.{js,html}"],
  theme: {
    extend: {
      backgroundImage: {
        cursor: "url('/cursor.png')",
      },
    },
  },
  plugins: [],
}
