export default class CalendarEvent {
  id?: number;
  name: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;

  constructor(name: string, startDate: Date, endDate: Date,
    location: string | undefined = undefined, description: string | undefined = undefined) {

    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.description = description;
  }
}
