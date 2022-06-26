<template>
  <VApp id="app">
    <VContainer fluid class="fill-height pa-0">
      <VRow fluid class="fill-height">
        <VCol fluid class="pt-0 flex-grow-0"><AppSidebar v-model="sidebarCalendars" @add-calendar="addCalendar" @edit-calendar="editCalendar" /></VCol>
        <VCol fluid class="d-flex flex-column mr-1em">
          <div class="header">
            <VSelect :items="viewTypeItems" label="View" dense outlined hide-details class="fit-content" v-model="currentViewType">
            </VSelect>
            <VBtn @click="navigateToToday">Today</VBtn>
            <VBtn icon @click="navigateBackward"><VIcon>mdi-chevron-left</VIcon></VBtn>
            <VBtn icon @click="navigateForward"><VIcon>mdi-chevron-right</VIcon></VBtn>
            <div>{{displayDateString}}</div>
            <div class="ml-auto">username here</div>
            <VBtn outlined small @click="logout">Logout</VBtn>
          </div>

          <DayView class="pad-right" v-if="currentViewType == CurrentCalendarView.Day" v-model="displayDateString" :calendars="filteredCalendars" ref="currentView" :display-date="displayDate" @add-event="addEvent" @edit-event="editEvent" />
          <WeekView class="pad-right" v-else-if="currentViewType == CurrentCalendarView.Week" v-model="displayDateString" :calendars="filteredCalendars" ref="currentView" :display-date="displayDate" @add-event="addEvent" @edit-event="editEvent" />
          <MonthView class="pad-right" v-else-if="currentViewType == CurrentCalendarView.Month" v-model="displayDateString" :calendars="filteredCalendars" ref="currentView" :display-date="displayDate" @add-event="addEvent" @edit-event="editEvent" />
          <YearView class="pad-right" v-else-if="currentViewType == CurrentCalendarView.Year" v-model="displayDateString" ref="currentView" :display-date="displayDate" @add-event="addEvent" @edit-event="editEvent"
            @nav-to-day="navToDay" @nav-to-month="navToMonth" />
        </VCol>
      </VRow>
    </VContainer>
    <EventEditDialog v-model="showEventEditor" :event="editingEvent" :calendars="filteredCalendars" @cancel="showEventEditor = false" @save="saveEvent" @delete="deleteEvent" />
    <CalendarEditDialog v-model="showCalendarEditor" :calendar="editingCalendar" @cancel="showCalendarEditor = false" @save="saveCalendar" @delete="deleteCalendar" />
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

const CurrentCalendarView = {
  Day: 'Day',
  Week: 'Week',
  Month: 'Month',
  Year: 'Year'
}

const fakeEvent1 = new CalendarEvent("Test Event", new Date("Jun 30, 2022 13:01:23 EST"), new Date("Jun 30, 2022 14:00:00 EST"));
fakeEvent1.id = 1;
const fakeCalendars = [
  {
    calendar: new Calendar("My Cal 1", [
      fakeEvent1,
      new CalendarEvent("A really long title break somwhere", new Date("Jun 24, 2022 13:01:23 EST"), new Date("Jun 25, 2022 14:00:00 EST")),
      new CalendarEvent("Test 2", new Date("Jun 3, 2022 13:01:23 EST"), new Date("Jun 3, 2022 14:00:00 EST"),
        "Some location", "This is a very long description, I need it to run over the end of the view and get hidden or something like that"),
      new CalendarEvent("Test 3", new Date("Jun 3, 2022 13:01:23 EST"), new Date("Jun 3, 2022 14:00:00 EST"),
        "Some location 2", "This is a very long description, I need it to run over the end of the view and get hidden or something like that"),
      new CalendarEvent("Test 4", new Date("Jun 3, 2022 13:01:23 EST"), new Date("Jun 3, 2022 14:00:00 EST")),
      new CalendarEvent("Test 5", new Date("Jun 3, 2022 13:01:23 EST"), new Date("Jun 3, 2022 14:00:00 EST")),
      new CalendarEvent("Test 6", new Date("Jun 3, 2022 13:01:23 EST"), new Date("Jun 3, 2022 14:00:00 EST")),
      new CalendarEvent("Test 7", new Date("Jun 3, 2022 13:01:23 EST"), new Date("Jun 3, 2022 14:00:00 EST"))
    ]),
    selected: true
  }
];

export default defineComponent({
  components: {
    AppSidebar,
    DayView,
    WeekView,
    MonthView,
    YearView,
    EventEditDialog,
    CalendarEditDialog
  },
  props: {},
  setup() {
    return {
      sidebarCalendars: ref(fakeCalendars),
      currentViewType: CurrentCalendarView.Month,
      displayDate: ref(new Date()),
      displayDateString: "",
      CurrentCalendarView,
      showEventEditor: false,
      editingEvent: new CalendarEvent("", new Date(), new Date()), // Dummy event
      showCalendarEditor: false,
      editingCalendar: new Calendar(""), // Dummy calendar
    }
  },
  computed: {
    viewTypeItems() {
      return Object.keys(CurrentCalendarView);
    },
    filteredCalendars(): Calendar[] {
      return this.sidebarCalendars.filter(c => c.selected).map(c => c.calendar);
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
      endDate.setDate(endDate.getDate() + 1);
      this.editingEvent = new CalendarEvent(`Event on ${dayStr}`, day, endDate);
      this.showEventEditor = true;
    },
    editEvent(event: CalendarEvent) {
      this.editingEvent = event;
      this.showEventEditor = true;
    },
    saveEvent(event: CalendarEvent) {
      //if (!this.calendar.events.includes(event))
      //  this.calendar.events.push(event);
      // TODO: save calendar event
      this.showEventEditor = false;
      console.log(event);
    },
    deleteEvent(event: CalendarEvent) {
      this.showEventEditor = false;
      console.log(event);
    },
    addCalendar() {
      this.editingCalendar = new Calendar("");
      this.showCalendarEditor = true;
    },
    editCalendar(cal: Calendar) {
      this.editingCalendar = cal;
      this.showCalendarEditor = true;
    },
    saveCalendar(cal: Calendar) {
      this.showCalendarEditor = false;
      console.log(cal);
    },
    deleteCalendar(cal: Calendar) {
      this.showCalendarEditor = false;
      console.log(cal);
    },
    logout() {

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
