export type ColorsT = 'purple' | 'blue' | 'yellow' | 'green' | 'red'

export const getActiveColorClassName = (
  color: ColorsT,
  type: 'text' | 'bg' | 'border' | 'hover' = 'text'
): string => {
  const colors = {
    green: {
      text: 'text-mountain-400',
      bg: 'bg-mountain-400',
      border: 'border-mountain-500',
      hover: 'hover:bg-mountain-500',
    },
    purple: {
      text: 'text-amethyst-500',
      bg: 'bg-amethyst-500',
      border: 'border-amethyst-500',
      hover: 'hover:bg-amethyst-500',
    },
    blue: {
      text: 'text-scooter-500',
      bg: 'bg-scooter-500',
      border: 'border-scooter-500',
      hover: 'hover:bg-scooter-500',
    },
    yellow: {
      text: 'text-tulip-500',
      bg: 'bg-tulip-500',
      border: 'border-tulip-500',
      hover: 'hover:bg-tulip-500',
    },
    red: {
      text: 'text-coral-500',
      bg: 'bg-coral-500',
      border: 'border-coral-500',
      hover: 'hover:bg-coral-500',
    },
  }

  return colors[color][type]
}
