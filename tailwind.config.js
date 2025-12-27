/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	darkMode: 'class',
	theme: {
		container: { center: true, padding: '1rem' },
		extend: {
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui'],
			},
			colors: {
				brand: {
					50: '#fff8f1',
					100: '#ffedd5',
					600: '#fb923c',
				},
			},
		},
	},
	plugins: [],
};