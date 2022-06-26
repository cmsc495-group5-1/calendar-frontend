<template>
  <VApp id="app">
    <VContainer fluid class="fill-height pa-0">
      <VRow fluid class="fill-height">
        <VCol fluid cols="2"><AppSidebar /></VCol>
        <VCol fluid cols="10" class="d-flex flex-column">
          <div class="header">
            <VSelect :items="viewTypeItems" label="View" dense outlined hide-details class="fit-content" v-model="currentViewType">
            </VSelect>
            <VBtn @click="navigateToToday">Today</VBtn>
            <VBtn icon @click="navigateBackward"><VIcon>mdi-chevron-left</VIcon></VBtn>
            <VBtn icon @click="navigateForward"><VIcon>mdi-chevron-right</VIcon></VBtn>
            <div>{{displayDateString}}</div>
            <div class="ml-auto">username here</div>
          </div>

          <DayView class="pad-right" v-if="currentViewType == CurrentCalendarView.Day" v-model="displayDateString" :calendar="calendar" ref="currentView" :display-date="displayDate" @add-event="addEvent" @edit-event="editEvent" />
          <WeekView class="pad-right" v-else-if="currentViewType == CurrentCalendarView.Week" v-model="displayDateString" :calendar="calendar" ref="currentView" :display-date="displayDate" @add-event="addEvent" @edit-event="editEvent" />
          <MonthView class="pad-right" v-else-if="currentViewType == CurrentCalendarView.Month" v-model="displayDateString" :calendar="calendar" ref="currentView" :display-date="displayDate" @add-event="addEvent" @edit-event="editEvent" />
          <YearView class="pad-right" v-else-if="currentViewType == CurrentCalendarView.Year" v-model="displayDateString" :calendar="calendar" ref="currentView" :display-date="displayDate" @add-event="addEvent" @edit-event="editEvent"
            @nav-to-day="navToDay" @nav-to-month="navToMonth" />
        </VCol>
      </VRow>
    </VContainer>
    <EventEditDialog v-model="editing" :event="editingEvent" @cancel="editing = false" @save="saveEvent" @delete="deleteEvent" />
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

const CurrentCalendarView = {
  Day: 'Day',
  Week: 'Week',
  Month: 'Month',
  Year: 'Year'
}

export default defineComponent({
  components: {
    AppSidebar,
    DayView,
    WeekView,
    MonthView,
    YearView,
    EventEditDialog
  },
  props: {},
  setup() {
    const event1 = new CalendarEvent("Test Event", new Date("Jun 30, 2022 13:01:23 EST"), new Date("Jun 30, 2022 14:00:00 EST"));
    event1.id = 1;

    return {
      calendar: new Calendar("My Cal 1", [
        // TODO
        event1,
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
      currentViewType: CurrentCalendarView.Month,
      displayDate: ref(new Date()),
      displayDateString: "",
      CurrentCalendarView,
      editing: false,
      editingEvent: new CalendarEvent("", new Date(), new Date()) // Dummy value for type inference
    }
  },
  computed: {
    viewTypeItems() {
      return Object.keys(CurrentCalendarView);
    },
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
      this.editing = true;
    },
    editEvent(event: CalendarEvent) {
      this.editingEvent = event;
      this.editing = true;
    },
    saveEvent(event: CalendarEvent) {
      //if (!this.calendar.events.includes(event))
      //  this.calendar.events.push(event);
      // TODO: save calendar event
      this.editing = false;
      console.log(event);
    },
    deleteEvent(event: CalendarEvent) {
      this.editing = false;
      console.log(event);
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
  padding-left: 1em;
  padding-right: 1em;
  padding-top: 1em;
}

.fit-content {
  width: fit-content;
  max-width: fit-content;
}

.pad-right {
  margin-right: 1em;
}
</style>
