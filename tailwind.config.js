const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx,css}',
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          '200': 'var(--color-primary-200)',
          '300': 'var(--color-primary-300)',
          '400': 'var(--color-primary-400)',
          '500': 'var(--color-primary)',
          '600': 'var(--color-primary-600)',
          '700': 'var(--color-primary-700)',
          '800': 'var(--color-primary-800)'
        },
        'secondary': {
          '200': 'var(--color-secondary-200)',
          '300': 'var(--color-secondary-300)',
          '400': 'var(--color-secondary-400)',
          '500': 'var(--color-secondary)',
          '600': 'var(--color-secondary-600)',
          '700': 'var(--color-secondary-700)',
          '800': 'var(--color-secondary-800)'
        },        
      },
      screens: {
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... },

        '3xl': '1920px',
        // => @media (min-width: 1920px) { ... },

        '4xl': '2560px'
        // => @media (min-width: 2560px) { ... },
      },
      fontFamily: {
        body: ['var(--font-open-sans)', 'sans-serif'],
        headings: ['var(--font-open-sans)', 'sans-serif']
      },
    }
  },
  darkMode: "class",
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    nextui()
  ],
  experimental: {
    applyComplexClasses: true,
    uniformColorPalette: true
  }
}