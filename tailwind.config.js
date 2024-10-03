/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./sidepanel/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:'#13233f',
        secondary:'#FFFFFF',
        tertiary:'#B6FFB0',
      },
      fontFamily:{
        body:['Inter']
     }
    },
  },
  plugins: [],
}