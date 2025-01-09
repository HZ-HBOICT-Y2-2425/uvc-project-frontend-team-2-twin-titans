/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}', 
    './routes/**/*.{html,js,svelte,ts}', 
    './src/routes/**/*.{html,js,svelte,ts}'
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': 'rgb(100, 173, 108)', // Voeg de groene kleur toe
      },
    },
  },
  plugins: [],
}
