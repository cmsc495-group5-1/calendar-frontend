<template>
  <div class="week-container">
    <div class="day-headers">
      <div v-for="day in getDayNames()" :key="day" class="day day-header">
        {{ day }}
      </div>
    </div>
    <div class="week">
      <template v-for="(date, dateIdx) in displayDates">
        <template>
          <div class="day" :key="dateIdx" @click="$emit('add-event', date)">
            <div :class="isToday(date) ? 'current-day' : 'not-current-day'">{{date.getDate()}}</div>
            <EventBubble v-for="(item, idx) in eventsForDay(date)" :key="idx" :event="item" @click.native.stop="$emit('edit-event', item)" />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import CalendarEvent from "@/models/CalendarEvent";
import EventBubble from "../components/EventBubble.vue";
import { defineComponent } from "@vue/composition-api";
import Calendar from "@/models/Calendar";
import { getDayNames } from '@/util/DateUtils';

export default defineComponent({
  components: {
    EventBubble
  },
  emits: [ "input", "add-event", "edit-event" ],
  setup() {
    return {};
  },
  props: {
    calendar: {
      type: Calendar,
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
      // First day of week
      const daysBefore = this.displayDate.getDay();

      // Last day
      const daysAfter = 6 - this.displayDate.getDay();

      // Days to display
      const days: Date[] = [];

      // Add all days
      for (let i = -daysBefore; i < 0; i++) {
        days.push(new Date(this.displayYear, this.displayMonth, this.displayDate.getDate() + i));
      }
      days.push(this.displayDate);
      for (let i = 1; i <= daysAfter; i++) {
        days.push(new Date(this.displayYear, this.displayMonth, this.displayDate.getDate() + i));
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
    formatDate(date: Date): string {
      const dates = this.displayDates;
      if (dates.length == 0) {
        return date.toLocaleDateString(undefined, { year: "numeric", month: "short"});
      }
      const startDay = dates[0];
      const endDay = dates[dates.length - 1];

      const startMonthPart = startDay.toLocaleDateString(undefined, { month: "short" });
      let endMonthPart = endDay.toLocaleDateString(undefined, { month: "short" });
      endMonthPart = startMonthPart != endMonthPart ? " " + endMonthPart : "";

      let startYearPart = startDay.toLocaleDateString(undefined, { year: "numeric" });
      let endYearPart = endDay.toLocaleDateString(undefined, { year: "numeric" });
      startYearPart = startYearPart != endYearPart ? " " + startYearPart : "";

      return `${startMonthPart} ${startDay.getDate()}${startYearPart} -${endMonthPart} ${endDay.getDate()} ${endYearPart}`;
    },
    eventsForDay(day: Date): CalendarEvent[] {
      return this.calendar.events
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
    navigateBackward() {
      return this.navigateWeeks(-1);
    },
    navigateForward() {
      return this.navigateWeeks(1);
    },
    navigateWeeks(amount: number) {
      const newDate = new Date(this.displayDate.getTime());
      newDate.setDate(newDate.getDate() + (amount * 7));
      return newDate;
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
.break {
  flex-basis: 100%;
  height: 0;
}

.week-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.week {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
}

.day-headers {
  display: flex;
  flex-wrap: wrap;
  height: fit-content;
}

.day {
  border: 1px solid lightgray;
  display: flex;
  flex-direction: column;
  align-content: center;
  width: calc(100% / 7);
}

.day-header {
  background-color: #efefef;
  height: fit-content;
}

.current-day {
  background-color: dodgerblue;
  color: white;
}
</style>
