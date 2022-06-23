<template>
  <div>
    <div class="month">
      <div v-for="day in getDayNames()" :key="day" class="day day-header">
        {{ day }}
      </div>
      <div class="break"></div>
      <template v-for="(date, dateIdx) in displayDates">
        <template>
          <div class="day" :key="dateIdx" @click="addEvent(date)">
            <div :class="isToday(date) ? 'current-day' : 'not-current-day'">{{date.getDate()}}</div>
            <EventBubble v-for="(item, idx) in eventsForDay(date)" :key="idx" :event="item" @click.native.stop="editEvent(item)" />
          </div>
          <div v-if="(dateIdx + 1) % 7 == 0" class="break" :key="dateIdx + 'b'"></div>
        </template>
      </template>
    </div>
    <EventEditDialog v-if="editing" :event="editingEvent" @cancel="editing = false" @save="saveEvent" />
  </div>
</template>

<script lang="ts">
import CalendarEvent from "@/models/CalendarEvent";
import EventBubble from "../components/EventBubble.vue";
import { defineComponent, Ref, ref } from "@vue/composition-api";
import EventEditDialog from "@/components/EventEditDialog.vue";
import Calendar from "@/models/Calendar";
import { getDayNames } from '@/util/DateUtils';

interface MonthViewData {
  displayDate: Ref<Date>;
  editing: boolean;
  editingEvent: CalendarEvent | null;
}

export default defineComponent({
  name: "MonthView",
  components: {
    EventBubble,
    EventEditDialog
  },
  emits: [ "input" ],
  setup(): MonthViewData {
    return {
      displayDate: ref(new Date()),
      editing: false,
      editingEvent: null
    }
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
    }
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
    navigateToToday() {
      this.displayDate = new Date();
      this.$emit("input", this.monthYearString);
    },
    navigateBackward() {
      this.navigateMonths(-1);
    },
    navigateForward() {
      this.navigateMonths(1);
    },
    navigateMonths(amount: number) {
      const newDate = new Date(this.displayDate.getTime());
      newDate.setMonth(newDate.getMonth() + amount);
      this.displayDate = newDate;
      this.$emit("input", this.monthYearString);
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
      this.editing = false;
      //if (!this.calendar.events.includes(event))
      //  this.calendar.events.push(event);
      // TODO: save calendar event
      console.log(event);
    }
  },
  mounted() {
    this.navigateToToday();
  }
})
</script>

<style scoped lang="scss">
.break {
  flex-basis: 100%;
  height: 0;
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

.day-header {
  background-color: #efefef;
  height: fit-content;
}
</style>
