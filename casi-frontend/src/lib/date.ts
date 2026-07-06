// Small shared date helpers — mirrors the month-boundary conventions from the
// backend's DateUtils (Sprint 2), kept minimal rather than pulling in a date library.

export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function getTodayDateString(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function shiftMonth(month: string, delta: number): string {
  const [year, monthNum] = month.split('-').map(Number)
  const date = new Date(year, monthNum - 1 + delta, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function formatMonthLabel(month: string): string {
  const [year, monthNum] = month.split('-').map(Number)
  const date = new Date(year, monthNum - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function formatDayLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
