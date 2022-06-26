import axios from 'axios';

import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import User from "@/models/User";

// TODO
const API_ROOT: string = process.env.VUE_APP_API_ROOT || "http://localhost:8080/api/";

function buildUri(...params: string[]): string {
  return [API_ROOT, ...params].join('/');
}

export default class CalendarAPI {
  user: User | null | undefined;
  calendarCache: { [id: number]: Calendar };
  eventCache: { [id: number]: CalendarEvent };

  constructor() {
    this.calendarCache = {};
    this.eventCache = {};
  }

  getUserDetails() {
    return this.user;
  }

  async login(username: string, password: string): Promise<boolean> {
    const result = await axios.post(buildUri("login"), {
      username,
      password
    }) as User;
    this.user = result;
    return true;
  }

  async createUser(params: object): Promise<User> {
    const result = await axios.post(buildUri("login/newuser"), params) as User;
    this.user = result;
    return this.user;
  }

  logout(): boolean {
    // Clear cal/evt cache
    this.calendarCache = {};
    this.eventCache = {};

    // Check if signed in
    if (this.user == null) {
      return false;
    }

    // post DELETE to session id?

    // Clear cache (token, cookie, etc.)
    this.user = null;
    return true;
  }

  async getCalendars(): Promise<Calendar[]> {
    const calendars = await axios.get(buildUri("calendar")) as Calendar[];
    calendars.forEach(c => this.calendarCache[c.id!] = c);
    return calendars;
  }

  async getCalendar(id: number): Promise<Calendar> {
    if (id in this.calendarCache) {
      return this.calendarCache[id];
    }
    const cal = await axios.get(buildUri("calendar", id.toString())) as Calendar;
    this.calendarCache[cal.id!] = cal;
    return cal;
  }

  async updateCalendar(cal: Calendar): Promise<boolean> {
    if (cal.id == null) {
      throw "Calendar ID cannot be null";
    }
    this.calendarCache[cal.id] = cal;
    return await axios.put(buildUri("calendar", cal.id.toString()), cal);
  }

  async deleteCalendar(cal: Calendar): Promise<boolean> {
    if (cal.id == null) {
      throw "Calendar ID cannot be null";
    }
    delete this.calendarCache[cal.id];
    return await axios.delete(buildUri("calendar", cal.id.toString()));
  }

  async createCalendar(params: Calendar): Promise<Calendar> {
    const cal = await axios.post(buildUri("calendar"), params) as Calendar;
    this.calendarCache[cal.id!] = cal;
    return cal;
  }

  async getEventsForCalendar(cal: Calendar): Promise<CalendarEvent[]> {
    if (cal.id == null) {
      throw "Calendar ID cannot be null";
    }
    const events = await axios.get(buildUri("calendar", cal.id.toString())) as CalendarEvent[];
    events.forEach(e => this.eventCache[e.id!] = e);
    return events;
  }

  async getEvent(cal: Calendar, id: number): Promise<CalendarEvent> {
    if (cal.id == null) {
      throw "Calendar id cannot be null";
    }
    if (id in this.eventCache) {
      return this.eventCache[id];
    }
    const event = await axios.get(buildUri("calendar", cal.id.toString(), "event", id.toString())) as CalendarEvent;
    this.eventCache[event.id!] = event;
    return event;
  }

  async updateEvent(event: CalendarEvent): Promise<boolean> {
    if (event.id == null) {
      throw "Event id cannot be null";
    }
    if (event.calendar?.id == null) {
      throw "Calendar id cannot be null";
    }
    this.eventCache[event.id] = event;
    return await axios.put(buildUri("calendar", event.calendar.id.toString(), "event", event.id.toString()), event);
  }

  async deleteEvent(event: CalendarEvent): Promise<boolean> {
    if (event.id == null) {
      throw "Event id cannot be null";
    }
    if (event.calendar?.id == null) {
      throw "Calendar id cannot be null";
    }
    delete this.eventCache[event.id];
    return await axios.delete(buildUri("calendar", event.calendar.id.toString(), "event", event.id.toString()));
  }

  async createEvent(cal: Calendar, e: CalendarEvent): Promise<CalendarEvent> {
    if (cal.id == null) {
      throw "Calendar id cannot be null";
    }
    const res = await axios.post(buildUri("calendar", cal.id.toString(), "event"), e) as CalendarEvent;
    this.eventCache[res.id!] = res;
    return res;
  }
}
