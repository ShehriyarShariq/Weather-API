// For getting time remaining until end of month in seconds
export const time_remaining_until_month_end_in_seconds = () => {
  var today = new Date() // Today
  var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1) // First day of next month

  return Math.floor((lastDayOfMonth.getTime() - today.getTime()) / 1000) // Time in seconds
}
