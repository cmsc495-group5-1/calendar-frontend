import axios, { AxiosRequestConfig } from 'axios';

import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import User from "@/models/User";

function jsonCleaner(key: any, value: any): any {
  // Remove the pseudo-elements that are stored in the model
  // classes here, but should not be serialized back to the API
  if (key == "calendar" || key == "events" || key == "calendars") {
    return undefined;
  }
  return value;
}

function toJson(obj: any): string {
  return JSON.stringify(obj, jsonCleaner);
}

const config: AxiosRequestConfig = { headers: {'Content-Type': 'application/json'} };

// TODO
const API_ROOT: string = process.env.VUE_APP_API_ROOT || "http://localhost:8080/api";

function buildUri(...params: string[]): string {
  return [API_ROOT, ...params].join('/');
}

export default class CalendarAPI {
  user: User | null | undefined;
  calendarCache: { [id: string]: Calendar };
  eventCache: { [id: string]: CalendarEvent };

  constructor() {
    this.calendarCache = {};
    this.eventCache = {};
  }

  getUserDetails() {
    return this.user;
  }

  async login(username: string, password: string): Promise<boolean> {
    this.user = new User("poopoo@peepee.com", "poo", "pee", undefined);
    this.user.id = "2c92808381dfa4460181dfb1130e0009";
    return true;

    const result = (await axios.post(buildUri("login"), {
      username,
      password
    })).data as User;
    this.user = result;
    return true;
  }

  async createUser(params: object): Promise<User> {
    const result = (await axios.post(buildUri("user"), params)).data;
    const user = new User(result.email, result.firstName, result.lastName);
    user.id = result.userId;
    this.user = user;
    if (result.calendarIds != null) {
      for (let id of result.calendarIds.split(",")) {
        id = id.replace("[", "").replace("]", "").trim();
        user.calendars.push(await this.getCalendar(id));
      }
    }
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
    const calendarsRaw = (await axios.get(buildUri("calendar", "all", this.user!.id!))).data;
    const calendars: Calendar[] = [];
    for (const calRaw of calendarsRaw) {
      calendars.push(await this.getCalendar(calRaw.calendarId));
    }
    return calendars;
  }

  async getCalendar(id: string): Promise<Calendar> {
    if (id in this.calendarCache) {
      return this.calendarCache[id];
    }
    const calObject = (await axios.get(buildUri("calendar", id.toString()))).data;
    const cal = new Calendar(calObject.name);
    cal.calendarId = calObject.calendarId;
    if (calObject.eventIds != null) {
      for (let id of calObject.eventIds.split(",")) {
        id = id.replace("[", "").replace("]", "").trim();
        cal.events.push(await this.getEvent(cal, id));
      }
    }
    this.calendarCache[cal.calendarId!] = cal;
    if (!(this.user!.calendars!.filter(c => c.calendarId == id).length > 0)) {
      this.user!.calendars.push(cal);
    }
    return cal;
  }

  async updateCalendar(cal: Calendar): Promise<boolean> {
    if (cal.calendarId == null) {
      throw "Calendar ID cannot be null";
    }
    this.calendarCache[cal.calendarId] = cal;
    return (await axios.put(buildUri("calendar", cal.calendarId.toString()), toJson(cal), config)).status == 200;
  }

  async deleteCalendar(cal: Calendar): Promise<boolean> {
    if (cal.calendarId == null) {
      throw "Calendar ID cannot be null";
    }
    delete this.calendarCache[cal.calendarId];
    return (await axios.delete(buildUri("calendar", cal.calendarId.toString()))).status == 200;
  }

  async createCalendar(params: Calendar): Promise<Calendar> {
    const calRaw = (await axios.post(buildUri("calendar", this.user!.id!), toJson(params), config)).data;
    const cal = await this.getCalendar(calRaw.calendarId);
    this.calendarCache[cal.calendarId!] = cal;
    return cal;
  }

  async getEventsForCalendar(cal: Calendar): Promise<CalendarEvent[]> {
    if (cal.calendarId == null) {
      throw "Calendar ID cannot be null";
    }
    const events = (await axios.get(buildUri("calendar", cal.calendarId.toString()))).data as CalendarEvent[];
    events.forEach(e => this.eventCache[e.eventId!] = e);
    return events;
  }

  async getEvent(cal: Calendar, id: string): Promise<CalendarEvent> {
    if (cal.calendarId == null) {
      throw "Calendar id cannot be null";
    }
    if (id in this.eventCache) {
      return this.eventCache[id];
    }
    const eventRaw = (await axios.get(buildUri("calendar", cal.calendarId.toString(), "event", id.toString()))).data;
    const event = new CalendarEvent(eventRaw.eventName, eventRaw.startDateTime, eventRaw.endDateTime, eventRaw.location, eventRaw.description);
    event.eventId = eventRaw.eventId;
    this.eventCache[event.eventId!] = event;
    return event;
  }

  async updateEvent(event: CalendarEvent): Promise<boolean> {
    if (event.eventId == null) {
      throw "Event id cannot be null";
    }
    if (event.calendar?.calendarId == null) {
      throw "Calendar id cannot be null";
    }
    this.eventCache[event.eventId] = event;
    return (await axios.put(buildUri("calendar", event.calendar.calendarId.toString(), "event", event.eventId.toString()), toJson(event), config)).data;
  }

  async deleteEvent(event: CalendarEvent): Promise<boolean> {
    if (event.eventId == null) {
      throw "Event id cannot be null";
    }
    if (event.calendar?.calendarId == null) {
      throw "Calendar id cannot be null";
    }
    delete this.eventCache[event.eventId];
    return (await axios.delete(buildUri("calendar", event.calendar.calendarId.toString(), "event", event.eventId.toString()))).status == 200;
  }

  async createEvent(cal: Calendar, e: CalendarEvent): Promise<CalendarEvent> {
    if (cal.calendarId == null) {
      throw "Calendar id cannot be null";
    }
    const eventRaw = (await axios.post(buildUri("calendar", cal.calendarId.toString(), "event"), toJson(e), config)).data;
    return await this.getEvent(cal, eventRaw.eventId);
  }
}
