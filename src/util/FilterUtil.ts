import Calendar from "@/models/Calendar";

export function filterEventsOccuringOnDay(calendars: Calendar[], day: Date) {
  return calendars.flatMap(cal => cal.events)
    .filter(event => event.startDate.getDate() <= day.getDate())
    .filter(event => event.endDate.getDate() >= day.getDate())
    .filter(event => event.startDate.getMonth() <= day.getMonth())
    .filter(event => event.endDate.getMonth() >= day.getMonth())
    .filter(event => event.startDate.getFullYear() <= day.getFullYear())
    .filter(event => event.endDate.getFullYear() >= day.getFullYear());
}
