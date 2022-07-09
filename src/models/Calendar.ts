import CalendarEvent from "./CalendarEvent";

export default class Calendar {
  calendarId?: string;
  name: string;
  events: CalendarEvent[];

  constructor(name: string, events: CalendarEvent[] | undefined = undefined) {
    this.name = name;
    this.events = events || [];
  }
}
