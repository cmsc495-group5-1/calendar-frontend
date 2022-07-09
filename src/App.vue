<template>
  <VApp id="app">
    <AuthenticationView v-if="user == null" @login="login" @create-account="createAccount" />
    <VContainer v-else fluid class="fill-height pa-0">
      <VRow fluid class="fill-height">
        <VCol fluid class="pt-0 flex-grow-0">
          <AppSidebar v-model="filterableCalendars" @add-calendar="addCalendar" @edit-calendar="editCalendar" />
        </VCol>
        <VCol fluid class="d-flex flex-column mr-1em">
          <div class="header">
            <VSelect :items="viewTypeItems" label="View" dense outlined hide-details class="fit-content" v-model="currentViewType">
            </VSelect>
            <VBtn @click="navigateToToday">Today</VBtn>
            <VBtn icon @click="navigateBackward"><VIcon>mdi-chevron-left</VIcon></VBtn>
            <VBtn icon @click="navigateForward"><VIcon>mdi-chevron-right</VIcon></VBtn>
            <div>{{displayDateString}}</div>
            <div class="ml-auto ellipsize">{{ user.email }}</div>
            <VBtn outlined small color="error" @click="logout">Logout</VBtn>
          </div>

          <DayView class="pad-right" v-if="currentViewType == CurrentCalendarView.Day" v-model="displayDateString" :calendars="filteredCalendars" ref="currentView" :display-date="displayDate" @add-event="addEvent" @edit-event="editEvent" />
          <WeekView class="pad-right" v-else-if="currentViewType == CurrentCalendarView.Week" v-model="displayDateString" :calendars="filteredCalendars" ref="currentView" :display-date="displayDate" @add-event="addEvent" @edit-event="editEvent" />
          <MonthView class="pad-right" v-else-if="currentViewType == CurrentCalendarView.Month" v-model="displayDateString" :calendars="filteredCalendars" ref="currentView" :display-date="displayDate" @add-event="addEvent" @edit-event="editEvent" />
          <YearView class="pad-right" v-else-if="currentViewType == CurrentCalendarView.Year" v-model="displayDateString" ref="currentView" :display-date="displayDate" @add-event="addEvent" @edit-event="editEvent"
            @nav-to-day="navToDay" @nav-to-month="navToMonth" />
        </VCol>
      </VRow>
    </VContainer>
    <EventEditDialog v-if="user" v-model="showEventEditor" :event="editingEvent" :calendars="filteredCalendars" @cancel="showEventEditor = false" @save="saveEvent" @delete="deleteEvent" />
    <CalendarEditDialog v-if="user" v-model="showCalendarEditor" :calendar="editingCalendar" @cancel="showCalendarEditor = false" @save="saveCalendar" @delete="deleteCalendar" />
    <VDialog :value="showNotificationPopup" width="500">
      <VCard>
        <VCardTitle class="text-h5 grey lighten-2">Upcoming Event</VCardTitle>
        <VCardText>
            Event is starting: {{ notificationEventTitle }}
            <div v-if="notificationEventLocation.length > 0">
              At {{ notificationEventLocation }}
            </div>
        </VCardText>
        <VDivider></VDivider>
        <VCardActions>
          <VSpacer></VSpacer>
          <VBtn color="primary" text @click="popNotification">Ok</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VApp>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import AppSidebar from './components/AppSidebar.vue';
import DayView from './views/DayView.vue';
import WeekView from './views/WeekView.vue';
import MonthView from './views/MonthView.vue';
import YearView from './views/YearView.vue';
import CalendarEvent from './models/CalendarEvent';
import Calendar from './models/Calendar';
import EventEditDialog from "@/components/EventEditDialog.vue";
import CalendarEditDialog from '@/components/CalendarEditEdialog.vue';
import User, { UserLoginFormSubmission, UserCreationFormSubmission } from './models/User';
import AuthenticationView from '@/views/AuthenticationView.vue';
import CalendarAPI from './lib/CalendarAPI';

const CurrentCalendarView = {
  Day: 'Day',
  Week: 'Week',
  Month: 'Month',
  Year: 'Year'
}

type FilterableCalendar = {
  calendar: Calendar,
  selected: boolean;
}

const api = new CalendarAPI();
let notificationTimer: number | null = null;
const notified: CalendarEvent[] = [];

export default defineComponent({
  components: {
    AppSidebar,
    DayView,
    WeekView,
    MonthView,
    YearView,
    EventEditDialog,
    CalendarEditDialog,
    AuthenticationView
  },
  setup() {
    return {
      CurrentCalendarView,
      currentViewType: CurrentCalendarView.Month,
      displayDate: ref(new Date()),
      filterableCalendars: ref([] as FilterableCalendar[]),
      displayDateString: "",
      showEventEditor: false,
      editingEvent: new CalendarEvent("", new Date(), new Date()), // Dummy event
      showCalendarEditor: false,
      editingCalendar: new Calendar(""), // Dummy calendar
      user: undefined as User | undefined,
      notificationQueue: ref([] as CalendarEvent[])
    }
  },
  computed: {
    viewTypeItems() {
      return Object.keys(CurrentCalendarView);
    },
    filteredCalendars(): Calendar[] {
      return this.filterableCalendars.filter(c => c.selected).map(c => c.calendar);
    },
    showNotificationPopup(): boolean {
      return this.notificationQueue.length > 0;
    },
    notificationEventTitle(): string {
      if (this.notificationQueue.length > 0) {
        return this.notificationQueue[0].eventName;
      }
      return "";
    },
    notificationEventLocation(): string {
      if (this.notificationQueue.length > 0) {
        return this.notificationQueue[0].location || "";
      }
      return "";
    }
  },
  methods: {
    navigateToToday() {
      this.displayDate = new Date();
    },
    navigateBackward() {
      this.displayDate = (this.$refs.currentView as any).navigateBackward() as Date;
    },
    navigateForward() {
      this.displayDate = (this.$refs.currentView as any).navigateForward() as Date;
    },
    navToDay(date: Date) {
      this.displayDate = date;
      this.currentViewType = CurrentCalendarView.Day;
    },
    navToMonth(date: Date) {
      this.displayDate = date;
      this.currentViewType = CurrentCalendarView.Month;
    },
    addEvent(day: Date) {
      const dayStr = day.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric"});
      const endDate = new Date(day);
      endDate.setMinutes(-1);
      endDate.setDate(endDate.getDate() + 1);
      this.editingEvent = new CalendarEvent(`Event on ${dayStr}`, day, endDate);
      this.showEventEditor = true;
    },
    editEvent(event: CalendarEvent) {
      this.editingEvent = event;
      this.showEventEditor = true;
    },
    async saveEvent(event: CalendarEvent) {
      try {
        if (event.eventId == null) {
          const created = await api.createEvent(event.calendar!, event);
          event.eventId = created.eventId;
          let cals = this.user?.calendars.filter(c => c == event.calendar);
          if (cals != null && cals.length > 0) {
            cals[0].events.push(event);
          }
        } else {
          await api.updateEvent(event);
        }
        this.showEventEditor = false;
      } catch (e) {
        alert(e);
      }
    },
    async deleteEvent(event: CalendarEvent) {
      try {
        await api.deleteEvent(event);
        this.filterableCalendars.flatMap(fc => fc.calendar).filter(cal => cal.events.includes(event)).forEach(cal => {
          cal.events = cal.events.filter(e => event != e);
        });
        this.showEventEditor = false;
      } catch (e) {
        alert(e);
      }
    },
    addCalendar() {
      this.editingCalendar = new Calendar("");
      this.showCalendarEditor = true;
    },
    editCalendar(cal: Calendar) {
      this.editingCalendar = cal;
      this.showCalendarEditor = true;
    },
    async saveCalendar(cal: Calendar) {
      try {
        if (cal.calendarId) {
          await api.updateCalendar(cal);
          this.filterableCalendars.forEach(fc => {
            if (fc.calendar.calendarId == cal.calendarId) {
              fc.calendar.name = cal.name;
            }
          })
        } else {
          cal = await api.createCalendar(cal);
          this.filterableCalendars.push({
            calendar: cal,
            selected: true
          });
        }
        this.showCalendarEditor = false;
      } catch (e) {
        alert(e);
      }
    },
    async deleteCalendar(cal: Calendar) {
      this.showCalendarEditor = false;
      try {
        await api.deleteCalendar(cal);
        this.filterableCalendars = this.filterableCalendars.filter(fc => {
          if (fc.calendar == cal) return false;
          return true;
        });
      } catch (e) {
        alert(e);
      }
    },
    logout() {
      if (api.logout()) {
        this.user = undefined;
        this.filterableCalendars = [];
        if (notificationTimer != null)
          clearInterval(notificationTimer);
      } else {
        alert("Failed to log out");
      }
    },
    async login(obj: UserLoginFormSubmission) {
      try {
        if (await api.login(obj.email, obj.password)) {
          this.user = api.getUserDetails()!;
          this.filterableCalendars = (await this.user.getCalendars(api)).map(cal => ({
            calendar: cal,
            selected: true
          }));
          notificationTimer = setInterval(this.checkNotifications, 60 * 1000);
        } else {
          alert("Username or password incorrect");
        }
      } catch (e) {
        alert("Failed to login: " + e);
      }
    },
    async createAccount(obj: UserCreationFormSubmission) {
      try {
        this.user = await api.createUser(obj);
        const newCal = new Calendar(`${this.user.email}'s Primary Calendar`);
        const realNewCal = api.createCalendar(newCal);
        this.filterableCalendars = [
          {
            calendar: await realNewCal,
            selected: true
          }
        ];
        notificationTimer = setInterval(this.checkNotifications, 60 * 1000);
      } catch (e) {
        alert("Failed to create account: " + e);
      }
    },
    async checkNotifications() {
      const events = await api.getNotifications();
      const range = new Date();
      range.setMinutes(range.getMinutes() - 3); // 3 minute window
      const toNotify = events.filter(e => e.startDateTime >= range);
      for (const event of toNotify) {
        if (!(notified.includes(event))) {
          this.notificationQueue.push(event);
          notified.push(event);
        }
      }
      console.log(this.notificationQueue);
    },
    popNotification() {
      if (this.notificationQueue.length > 0) {
        this.notificationQueue.shift();
      }
    }
  }
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}

.ellipsize {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.header {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
  padding-bottom: 1rem;
}

.fit-content {
  width: fit-content;
  max-width: fit-content;
}

.mr-1em {
  margin-right: 1em;
}
</style>
