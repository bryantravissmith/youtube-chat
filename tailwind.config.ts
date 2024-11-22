// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground))',
            code: {
              backgroundColor: 'rgb(31, 41, 55)',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.375rem',
              color: 'hsl(var(--foreground))',
            },
            pre: {
              backgroundColor: 'rgb(31, 41, 55)',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              color: 'hsl(var(--foreground))',
            },
            strong: {
              color: 'hsl(var(--foreground))',
            },
            em: {
              color: 'hsl(var(--foreground))',
            },
            h1: {
              color: 'hsl(var(--foreground))',
            },
            h2: {
              color: 'hsl(var(--foreground))',
            },
            h3: {
              color: 'hsl(var(--foreground))',
            },
            h4: {
              color: 'hsl(var(--foreground))',
            },
            blockquote: {
              color: 'hsl(var(--foreground))',
              borderLeftColor: 'hsl(var(--primary))',
            },
            hr: {
              borderColor: 'hsl(var(--border))',
            },
            a: {
              color: 'hsl(var(--primary))',
              '&:hover': {
                color: 'hsl(var(--primary))',
                textDecoration: 'underline',
              },
            },
            ul: {
              li: {
                '&::marker': {
                  color: 'hsl(var(--foreground))',
                },
              },
            },
            ol: {
              li: {
                '&::marker': {
                  color: 'hsl(var(--foreground))',
                },
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}