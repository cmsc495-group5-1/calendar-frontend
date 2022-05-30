<template>
  <div>
    <div class="header">
      <VBtn @click="navigateToToday()">Today</VBtn>
      <VBtn icon @click="navigateMonths(-1)"><VIcon>mdi-chevron-left</VIcon></VBtn>
      <VBtn icon @click="navigateMonths(1)"><VIcon>mdi-chevron-right</VIcon></VBtn>
      <div>{{monthYearString}}</div>
    </div>
    <div class="month">
      <template v-for="(date, dateIdx) in displayDates">
        <template>
          <div class="day" :key="dateIdx">
            <div :class="isToday(date) ? 'current-day' : 'not-current-day'">{{date.getDate()}}</div>
            <EventBubble v-for="(item, idx) in eventsForDay(date)" :key="idx" :event="item" />
          </div>
          <div v-if="(dateIdx + 1) % 7 == 0" class="break" :key="dateIdx + 'b'"></div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import CalendarEvent from "@/models/CalendarEvent";
import EventBubble from "../components/EventBubble.vue";
import { defineComponent, Ref, ref } from "@vue/composition-api";

interface MonthViewData {
  displayDate: Ref<Date>
}

export default defineComponent({
  name: "MonthView",
  components: {
    EventBubble,
  },
  setup(): MonthViewData {
    return {
      displayDate: ref(new Date()),
    }
  },
  props: {
    events: {
      type: Array, //type: Array<CalendarEvent>,
      required: true,
      default: () => new Array<CalendarEvent>()
    },
  },
  computed: {
    monthYearString(): string {
      return this.displayDate.toLocaleDateString(undefined, { year: "numeric", month: "short"});
    },
    displayDates(): Date[] {
      // First day of month
      const firstDay = new Date(this.displayYear, this.displayMonth, 1);
      const daysBefore = firstDay.getDay();
      const prevMonthOffset = new Date(this.displayYear, this.displayMonth, 0).getDate() - daysBefore;

      // Last day
      const daysAfter = 6 - this.displayDate.getDay();

      // Days to display
      const days: Date[] = [];

      // Add all days
      for (let i = 0; i < daysBefore; i++) {
        days.push(new Date(this.displayYear, this.displayMonth - 1, prevMonthOffset + i));
      }
      for (let i = 1; i <= this.displayDate.getDate(); i++) {
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
    eventsForDay(day: Date): CalendarEvent[] {
      return (this.events as CalendarEvent[])
        .filter(event => event.startDate.getDate() === day.getDate())
        .filter(event => event.startDate.getMonth() === day.getMonth())
        .filter(event => event.startDate.getFullYear() === day.getFullYear())
        .slice(0, 4);
    },
    isToday(day: Date): boolean {
      const today = new Date();
      return day.getDate() == today.getDate() &&
        day.getMonth() == today.getMonth() &&
        day.getFullYear() == today.getFullYear();
    },
    navigateToToday() {
      this.displayDate = new Date();
    },
    navigateMonths(amount: number) {
      const newDate = new Date(this.displayDate.getTime());
      newDate.setMonth(newDate.getMonth() + amount);
      this.displayDate = newDate;
    }
  }
})
</script>

<style scoped lang="scss">
.break {
  flex-basis: 100%;
  height: 0;
}

.header {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
  padding-bottom: 1rem;
}

.month {
  border: 1px solid black;
  display: flex;
  flex-wrap: wrap;
}

.day {
  border: 1px solid lightgray;
  display: flex;
  flex-direction: column;
  align-content: center;
  width: calc(100% / 7);
  height: 6em;
}

.current-day {
  background-color: dodgerblue;
  color: white;
}

.not-current-day {
  background-color: #efefef;
}
</style>
