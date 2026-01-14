import { format } from 'date-fns'

export default function formatHour(hour: number): string {
  if (hour < 0 || hour > 23) {
    throw new Error('Hour must be between 0 and 23')
  }

  const date = new Date(0, 0, 0, hour, 0) // Create a date with the given hour
  return format(date, "HH'h'mm")
}
