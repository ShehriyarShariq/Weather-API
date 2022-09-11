export const time_remaining_until_month_end_in_seconds = () => {
  var today = new Date()
  var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)

  return (lastDayOfMonth.getTime() - today.getTime()) / 1000
}
