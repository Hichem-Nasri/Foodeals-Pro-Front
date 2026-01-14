import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '376px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
      colors: {
        primary: {
          DEFAULT: '#34D39E',
        },
        tulip: {
          '50': '#FEF9E8',
          '100': '#FEF0C3',
          '400': '#FAC215',
          '500': '#EAB308',
          '600': '#CA9A04',
        },
        coral: {
          '50': '#FEF2F2',
          '100': '#FEE2E2',
          '300': '#FCA5A5',
          '500': '#EF4444',
        },
        scooter: {
          '100': '#CFF7FE',
          '200': '#A5EFFC',
          '500': '#06B6D4',
          '700': '#0E7D90',
        },
        amethyst: {
          '50': '#FAF5FF',
          '100': '#F4E8FF',
          '200': ' #DAB4FE',
          '500': '#A855F7',
        },
        mountain: {
          '50': '#ECFDF7',
          '100': '#D1FAEC',
          '400': '#34D39E',
          '500': '#10B981',
        },
        lynch: {
          '50': '#F6F7F9',
          '100': '#ECEEF2',
          '200': '#D5D9E2',
          '300': '#B1BBC8',
          '400': '#8695AA',
          '500': '#64748B',
          '700': '#434E61',
          '900': '#343A46',
          '950': '#23272E',
        },
        subtitle: '#565656',
      },
      maxHeight: {
        '2lines': '30px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '4xl': '1.75rem',
        '5xl': '2rem',
        '6xl': '2.25rem',
      },
      gridTemplateColumns: {
        'cards-grid':
          'repeat(auto-fit, minmax(300px, 512px))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      keyframes: {
        pingCircle: {
          '75%, 100%': {
            transform: 'scale(1.2)',
            opacity: '0.5',
          },
        },
        bounceUp: {
          '0%, 20%, 50%, 80%, 100%': {
            transform: 'translateY(0)',
          },
          '40%': {
            transform:
              'translateY(-30px)',
          },
          '60%': {
            transform:
              'translateY(-15px)',
          },
        },
        bounceDown: {
          '0%, 100%': {
            transform:
              'translateY(0) translateX(0)',
          },
          '40%': {
            transform:
              'translateY(30px) translateX(10px)',
          },
          '60%': {
            transform:
              'translateY(15px) translateX(5px)',
          },
        },
        smoothBounce: {
          '0%, 100%': {
            transform:
              'translateY(0) translateX(0)',
            animationTimingFunction:
              'ease-in-out',
          },
          '50%': {
            transform:
              'translateY(-10px) translateX(5px)',
            animationTimingFunction:
              'ease-in-out',
          },
        },
        smoothBounceRotate: {
          '0%, 100%': {
            transform:
              'translateY(0) translateX(0) rotate(0)',
            animationTimingFunction:
              'ease-in-out',
          },
          '50%': {
            transform:
              'translateY(-10px) translateX(5px) rotate(-10deg)',
            animationTimingFunction:
              'ease-in-out',
          },
        },
        scanDown: {
          '0%': {
            transform:
              'translateY(-100%)',
            background:
              'linear-gradient(to bottom, transparent, green)',
          },
          '100%': {
            transform:
              'translateY(200%)',
            background:
              'linear-gradient(to bottom, transparent, green)',
          },
        },
        scanUp: {
          '0%': {
            transform:
              'translateY(200%)',
            background:
              'linear-gradient(to top, green, transparent)',
          },
          '100%': {
            transform:
              'translateY(-100%)',
            background:
              'linear-gradient(to top, green, transparent)',
          },
        },
        'scan-up-down': {
          '0%, 100%': {
            transform:
              'translateY(-50%)',
          },
          '50%': {
            transform:
              'translateY(50%)',
          },
        },
        'dialog-right': {
          '0%': {
            transform:
              'translateX(100%)',
            // opacity: '0.3',
          },
          '100%': {
            transform:
              'translateX(50%)',
            // opacity: '1',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height:
              'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height:
              'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'accordion-left': {
          from: {
            width: '0',
          },
          to: {
            width:
              'var(--radix-accordion-content-width)',
          },
        },
        'accordion-right': {
          from: {
            width:
              'var(--radix-accordion-content-width)',
          },
          to: {
            width: '0',
          },
        },
        'notification-slide-left': {
          from: {
            transform:
              'translateX(100%)',
          },
          to: {
            transform: 'translateX(0)',
          },
        },
        'notification-slide-down': {
          from: {
            transform:
              'translateY(-100%)',
          },
          to: {
            transform: 'translateY(0)',
          },
        },
        'fade-down': {
          from: {
            opacity: '0',
            transform:
              'translateY(-20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scrollText: {
          '0%': {
            transform: 'translateX(0%)',
          },
          '100%': {
            transform:
              'translateX(-100%)',
          },
        },
      },
      animation: {
        'accordion-down':
          'accordion-down 0.2s ease-out',
        'accordion-up':
          'accordion-up 0.2s ease-out',
        'accordion-left':
          'accordion-left 2s ease-out',
        'accordion-right':
          'accordion-right 2s ease-out',
        'dialog-right':
          'dialog-right 10s ease-in-out',
        'notification-slide-left':
          'notification-slide-left 0.5s ease-out',
        'notification-slide-down':
          'notification-slide-down 0.5s ease-out',
        'fade-down':
          'fade-down 0.5s ease-out',
        scanDown:
          'scanDown 2s linear forwards infinite',
        scanUp:
          'scanUp 2s linear forwards infinite',
        scan: 'scanDown 2s linear forwards, scanUp 2s linear 2s forwards',
        'scan-up-down':
          'scan-up-down 4s linear infinite',
        scrollText:
          'scrollText 10s linear infinite',
        bounceDown:
          'bounceDown 5s ease-out infinite',
        bounceUp:
          'bounceUp 5s ease-out infinite',
        smoothBounce:
          'smoothBounce 2s infinite',
        smoothBounceRotate:
          'smoothBounceRotate 4.3s infinite',
        pingCircle:
          'pingCircle 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-scrollbar'),
    require('tailwindcss-rtl'),
    function ({
      addUtilities,
    }: {
      addUtilities: any
    }) {
      addUtilities({
        '.flex-center': {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
        '.flex-col-center': {
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'center',
          'justify-content': 'center',
        },
        '.flex-col-center-start': {
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'center',
          'justify-content':
            'flex-start',
        },
        '.flex-col-center-end': {
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'center',
          'justify-content': 'flex-end',
        },
        '.flex-col-center-between': {
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'center',
          'justify-content':
            'space-between',
        },
        '.flex-col-center-around': {
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'center',
          'justify-content':
            'space-around',
        },
        '.flex-col-center-evenly': {
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'center',
          'justify-content':
            'space-evenly',
        },
        '.flex-center-start': {
          display: 'flex',
          'align-items': 'center',
          'justify-content':
            'flex-start',
        },
        '.flex-center-end': {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'flex-end',
        },
        '.flex-center-between': {
          display: 'flex',
          'align-items': 'center',
          'justify-content':
            'space-between',
        },
        '.flex-center-around': {
          display: 'flex',
          'align-items': 'center',
          'justify-content':
            'space-around',
        },
      })
    },
  ],
}
export default config
