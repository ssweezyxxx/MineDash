/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  './pages/**/*.{js,jsx}',
	  './components/**/*.{js,jsx}',
	  './app/**/*.{js,jsx}',
	  './src/**/*.{js,jsx}',
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: [
					'"Google Sans"',
					'"Google Sans Text"',
					'"Outfit"',
					'"Plus Jakarta Sans"',
					'"Roboto"',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Segoe UI"',
					'sans-serif',
				],
				display: [
					'"Google Sans"',
					'"Google Sans Display"',
					'"Outfit"',
					'"Plus Jakarta Sans"',
					'"Roboto"',
					'sans-serif',
				],
				mono: [
					'"JetBrains Mono"',
					'"Roboto Mono"',
					'"Fira Code"',
					'"Cascadia Code"',
					'Consolas',
					'ui-monospace',
					'SFMono-Regular',
					'monospace',
				],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				'3xl': '1.75rem',
				'2xl': '1.25rem',
				xl: '1rem',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 4px)',
				sm: 'calc(var(--radius) - 8px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
			  'fade-in': {
				  from: { opacity: '0' },
				  to: { opacity: '1' }
			  },
			  'slide-up': {
				  from: { transform: 'translateY(4px)', opacity: '0' },
				  to: { transform: 'translateY(0)', opacity: '1' }
			  },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s cubic-bezier(0.2, 0, 0, 1)',
				'accordion-up': 'accordion-up 0.2s cubic-bezier(0.2, 0, 0, 1)',
			  'fade-in': 'fade-in 0.25s cubic-bezier(0.2, 0, 0, 1)',
			  'slide-up': 'slide-up 0.3s cubic-bezier(0.2, 0, 0, 1)',
			}
		}
	},
	plugins: [require("tailwindcss-animate"),
	  require("@tailwindcss/typography"),
	],
}