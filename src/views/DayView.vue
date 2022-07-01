<template>
  <div class="day" @click="$emit('add-event', displayDate)">
    <div class="day-header">{{displayDate.toLocaleDateString()}}</div>
    <EventBubble v-for="(item, idx) in eventsForDay(displayDate)" :key="idx" :event="item" @click.native.stop="$emit('edit-event', item)" expanded />
  </div>
</template>

<script lang="ts">
import CalendarEvent from "@/models/CalendarEvent";
import EventBubble from "../components/EventBubble.vue";
import { defineComponent } from "@vue/composition-api";
import Calendar from "@/models/Calendar";
import { filterEventsOccuringOnDay } from '@/util/FilterUtil';

export default defineComponent({
  components: {
    EventBubble
  },
  emits: [ "input", "add-event", "edit-event" ],
  setup() {
    return {};
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
  methods: {
    formatDate(date: Date): string {
      return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric"});
    },
    eventsForDay(day: Date): CalendarEvent[] {
      return filterEventsOccuringOnDay(this.calendars as Calendar[], day);
    },
    navigateBackward() {
      return this.navigateDays(-1);
    },
    navigateForward() {
      return this.navigateDays(1);
    },
    navigateDays(amount: number) {
      const newDate = new Date(this.displayDate.getTime());
      newDate.setDate(newDate.getDate() + amount);
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
.day {
  border: 1px solid lightgray;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: center;
  flex-grow: 1;
  gap: 0.25em;
}

.day-header {
  background-color: #efefef;
  height: fit-content;
  width: 100%;
}
</style>
