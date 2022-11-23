module.exports = {
  content: ['./src/**/*.{html,js,ts,tsx}'],
  safelist: [
    "text-left"
  ],
  theme: {
    extend: {
      colors: {
        'bp-dark-gray': {
          500: '#394B59',
          600: '#30404D',
          700: '#293742',
          800: '#202B33',
          900: '#182026',
        },
        'bp-gray': {
          300: '#BFCCD6',
          350: '#A7B6C2',
          400: '#8A9BA8',
          450: '#738694',
          500: '#5C7080',
        },
        'bp-light-gray': {
          50: '#F5F8FA',
          100: '#EBF1F5',
          150: '#E1E8ED',
          200: '#D8E1E8',
          250: '#CED9E0',
        },
        'bp-blue': {
          500: '#48AFF0',
          600: '#2B95D6',
          700: '#137CBD',
          800: '#106BA3',
          900: '#0E5A8A',
        },
      },
      borderWidth: {
        1.5: '1.5px',
      },
    },
  },
  plugins: [],
}
