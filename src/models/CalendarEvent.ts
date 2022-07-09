import Calendar from "./Calendar";

export default class CalendarEvent {
  eventId?: string;
  calendar?: Calendar;
  eventName: string;
  startDateTime: Date;
  endDateTime: Date;
  location?: string;
  description?: string;

  constructor(name: string, startDate: Date, endDate: Date,
    location: string | undefined = undefined, description: string | undefined = undefined) {

    this.eventName = name;
    this.startDateTime = startDate;
    this.endDateTime = endDate;
    this.location = location;
    this.description = description;
  }
}
