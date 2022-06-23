export default class CalendarEvent {
  id?: number;
  name: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;

  constructor(name: string, startDate: Date, endDate: Date) {
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
