import Calendar from "@/models/Calendar";

export function filterEventsOccuringOnDay(calendars: Calendar[], day: Date) {
  return calendars.flatMap(cal => cal.events)
    .filter(event => event != null)
    .filter(event => event.startDateTime.getDate() <= day.getDate())
    .filter(event => event.endDateTime.getDate() >= day.getDate())
    .filter(event => event.startDateTime.getMonth() <= day.getMonth())
    .filter(event => event.endDateTime.getMonth() >= day.getMonth())
    .filter(event => event.startDateTime.getFullYear() <= day.getFullYear())
    .filter(event => event.endDateTime.getFullYear() >= day.getFullYear());
}
