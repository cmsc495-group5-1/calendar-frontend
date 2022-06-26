<template>
  <div class="month">
    <div v-for="day in getDayNames()" :key="day" class="day day-header">
      {{ day }}
    </div>
    <template v-for="(date, dateIdx) in displayDates">
      <template>
        <div class="day" :key="dateIdx" @click="$emit('add-event', date)">
          <div :class="isToday(date) ? 'current-day' : 'not-current-day'">{{date.getDate()}}</div>
          <EventBubble v-for="(item, idx) in eventsForDay(date)" :key="idx" :event="item" @click.native.stop="$emit('edit-event', item)" />
        </div>
      </template>
    </template>
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
    eventsForDay(day: Date): CalendarEvent[] {
      return this.calendar.events
        .filter(event => event.startDate.getDate() === day.getDate())
        .filter(event => event.startDate.getMonth() === day.getMonth())
        .filter(event => event.startDate.getFullYear() === day.getFullYear())
        .slice(0, 4);
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
.month {
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

.day-header {
  background-color: #efefef;
  height: fit-content;
}
</style>
