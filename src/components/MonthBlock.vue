<template>
  <div class="month">
    <div @click="$emit('nav-to-month', month)">{{ month.toLocaleDateString(undefined, { month: "short" }) }}</div>
    <div v-for="week in 5" :key="week" class="week">
      <div v-for="day in getDaysForWeek(week - 1)" :key="day.getDate()" @click="$emit('nav-to-day', day)"
        :class="'day' + (isToday(day) ? ' current-day' : '')">
        {{ day.getDate() }}
      </div>
      <div class="day invisible" v-for="day in 7 - getDaysForWeek(week - 1).length" :key="day" aria-hidden="true">.</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { isToday } from '@/util/DateUtils';

export default defineComponent({
  emits: [ "nav-to-month", "nav-to-day" ],
  props: {
    month: {
      type: Date,
      required: true
    },
  },
  setup() {
    return {

    };
  },
  methods: {
    isToday,
    getDaysForWeek(weekNo: number) {
      const days = [];
      const lastDayOfMonth = new Date(this.month.getFullYear(), this.month.getMonth() + 1, 0).getDate();
      for (let i = 0; i < 7; i++) {
        let day = i + 1 + (weekNo * 7);
        if (day > lastDayOfMonth)
          break;
        days.push(new Date(this.month.getFullYear(), this.month.getMonth(), day));
      }
      return days;
    }
  }
});
</script>

<style scoped lang="scss">
.month {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.33em;
}

.week {
  display: flex;
  gap: 0.33em;
  width: fit-content;
}

.day {
  font-size: x-small;
  border-radius: 25%;

  width: 2.5em;
  min-width: 2.5em;
  height: 2.5em;

  background-color: lightblue;

  display: flex;
  align-items: center;
  justify-content: center;
}

.day:hover {
  cursor: pointer;
}

.current-day {
  background-color: dodgerblue;
  color: white;
}

.invisible {
  /* Hide from view, but not from DOM layout */
  visibility: hidden;
}
</style>