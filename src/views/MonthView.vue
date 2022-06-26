<template>
  <div class="month-grid">
    <div v-for="day in getDayNames()" :key="day" class="day day-header">
      {{ day }}
    </div>
    <template v-for="(date, dateIdx) in displayDates">
      <template>
        <div class="day" :key="dateIdx" @click="$emit('add-event', date)">
          <div :class="isToday(date) ? 'current-day' : 'not-current-day'">{{date.getDate()}}</div>
          <EventBubble v-for="(item, idx) in eventsForDay(date)" :key="idx" :event="item" @click.native.stop="$emit('edit-event', item)" />
          <div v-if="eventsForDayHasOverflow(date)" class="event-expander" @click.stop="showMoreEvents(date)">
            {{ eventsForDayOverflowCount(date) }} more...
          </div>
        </div>
      </template>
    </template>
    <VDialog v-model="showMoreEventsDialog">
      <VCard>
        <VCardTitle>Events for {{showMoreEventsDay.toLocaleDateString()}}</VCardTitle>
        <VCardText>
          <VContainer>
            <EventBubble style="margin-bottom: 10px" v-for="(item, idx) in showMoreEventsEventList" :key="idx" :event="item" @click.native.stop="$emit('edit-event', item)" />
            <VBtn color="green darken-2" dark small @click="$emit('add-event', showMoreEventsDay)">Add new event</VBtn>
          </VContainer>
        </VCardText>
        <VCardActions>
          <VSpacer />
        <VBtn color="blue darken-1" text @click="showMoreEventsDialog = false">Close</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script lang="ts">
import CalendarEvent from "@/models/CalendarEvent";
import EventBubble from "../components/EventBubble.vue";
import { defineComponent } from "@vue/composition-api";
import Calendar from "@/models/Calendar";
import { getDayNames, isToday } from '@/util/DateUtils';

export default defineComponent({
  components: {
    EventBubble
  },
  emits: [ "input", "add-event", "edit-event" ],
  setup() {
    return {
      showMoreEventsDialog: false,
      showMoreEventsDay: new Date(),
      showMoreEventsEventList: [] as CalendarEvent[]
    };
  },
  props: {
    calendars: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      required: false,
      default: ""
    },
    displayDate: {
      type: Date,
      required: true
    }
  },
  computed: {
    displayDates(): Date[] {
      // First day of month
      const firstDay = new Date(this.displayYear, this.displayMonth, 1);
      const daysBefore = firstDay.getDay();
      const prevMonthOffset = new Date(this.displayYear, this.displayMonth, 0).getDate() - daysBefore;

      // Last day
      const daysAfter = 6 - new Date(this.displayYear, this.displayMonth + 1, 0).getDay();
      const lastDayOfMonth = new Date(this.displayYear, this.displayMonth + 1, 0).getDate();

      // Days to display
      const days: Date[] = [];

      // Add all days
      for (let i = 1; i <= daysBefore; i++) {
        days.push(new Date(this.displayYear, this.displayMonth - 1, prevMonthOffset + i));
      }
      for (let i = 1; i <= lastDayOfMonth; i++) {
        days.push(new Date(this.displayYear, this.displayMonth, i));
      }
      for (let i = 0; i < daysAfter; i++) {
        days.push(new Date(this.displayYear, this.displayMonth + 1, i + 1));
      }

      return days;
    },
    displayYear(): number {
      return this.displayDate.getFullYear();
    },
    displayMonth(): number {
      return this.displayDate.getMonth();
    }
  },
  methods: {
    getDayNames,
    isToday,
    formatDate(date: Date): string {
      return date.toLocaleDateString(undefined, { year: "numeric", month: "long"});
    },
    eventsForDay(day: Date, limit: boolean = true): CalendarEvent[] {
      const events = (this.calendars as Calendar[]).flatMap(cal => cal.events)
        .filter(event => event.startDate.getDate() === day.getDate())
        .filter(event => event.startDate.getMonth() === day.getMonth())
        .filter(event => event.startDate.getFullYear() === day.getFullYear());
      if (!limit)
        return events;
      return events.slice(0, 3);
    },
    eventsForDayHasOverflow(day: Date): boolean {
      const events = (this.calendars as Calendar[]).flatMap(cal => cal.events)
        .filter(event => event.startDate.getDate() === day.getDate())
        .filter(event => event.startDate.getMonth() === day.getMonth())
        .filter(event => event.startDate.getFullYear() === day.getFullYear());
      return events.length > 4;
    },
    eventsForDayOverflowCount(day: Date): number {
      return (this.calendars as Calendar[]).flatMap(cal => cal.events)
        .filter(event => event.startDate.getDate() === day.getDate())
        .filter(event => event.startDate.getMonth() === day.getMonth())
        .filter(event => event.startDate.getFullYear() === day.getFullYear())
        .length - 4;
    },
    navigateBackward() {
      return this.navigateMonths(-1);
    },
    navigateForward() {
      return this.navigateMonths(1);
    },
    navigateMonths(amount: number) {
      const newDate = new Date(this.displayDate.getTime());
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    },
    showMoreEvents(day: Date) {
      const events = this.eventsForDay(day, false);
      this.showMoreEventsEventList = events;
      this.showMoreEventsDay = day;
      this.showMoreEventsDialog = true;
    }
  },
  watch: {
    displayDate(newValue: Date) {
      this.$emit("input", this.formatDate(newValue));
    }
  },
  mounted() {
    this.$emit("input", this.formatDate(this.displayDate));
  }
})
</script>

<style scoped lang="scss">
.day {
  border: 1px solid lightgray;
  display: flex;
  flex-direction: column;
  align-content: center;
  overflow: hidden;
  gap: 1px;
}

.current-day {
  background-color: dodgerblue;
  color: white;
}

.not-current-day {
  background-color: #efefef;
}

.day-header {
  background-color: #efefef;
  height: fit-content;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: auto;
  grid-auto-rows: 1fr;
  height: 100%;
}

.event-expander {
  font-weight: bold;
  font-size: x-small;
}

.event-expander:hover {
  cursor: pointer;
}
</style>
