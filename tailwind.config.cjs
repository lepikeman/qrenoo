module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,css}",
    "./**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2F3E2E',
        'primary-hover': '#202b1f',
        secondary: '#f0ddbb',
        accent: '#0072b1',
        danger: '#dc2626',
        // Ajoute ici d'autres couleurs custom si besoin
      },
      borderRadius: {
        DEFAULT: '16px',
      },
      // Si tu veux ajouter des variables CSS comme background ou foreground, tu peux le faire ici ou via CSS natif
      // fontFamily, etc. à compléter selon besoin
    },
  },
  plugins: [],
}
