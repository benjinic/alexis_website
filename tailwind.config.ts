import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // 💡 老師防呆提醒：如果你的 app 資料夾不在 src 裡面，請記得補上 "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // --- Alexis Bespoke 品牌專屬色 (Updated Palette) ---
        'carbon-black': '#1F1F1F',
        'dim-grey': '#78716C',
        'midnight-violet': '#261132',
        'amber-earth': '#E7870A',
        'inferno': '#A40000',
        'graphite': '#40363E',
        'lava-red': '#F42B26',
        'brand-cream': '#FAF3E7',
        'brand-sand': '#F2E3CA',
        'brand-ink': '#1A1A1A',
        'brand-accent': '#682872',
        'silver-grey': '#B5B5B5',
        'dirty-grey':'#f9fafa',

        // --- Shadcn UI 系統色 ---
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      fontFamily: {
        sans: ['var(--font-roboto)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        jetbrains: ['var(--font-jetbrains-mono)', 'monospace'],
        roboto: ['var(--font-roboto-mono)', 'monospace'],
        condensed: ['var(--font-roboto-condensed)', 'sans-serif'],
        space: ['var(--font-space-mono)', 'monospace'],
        'zh-serif': ['"Noto Serif TC"', '"Songti TC"', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;