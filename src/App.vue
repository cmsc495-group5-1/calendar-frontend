<template>
  <VApp id="app">
    <div class="header">
      <VBtn @click="navigateToToday">Today</VBtn>
      <VBtn icon @click="navigateBackward"><VIcon>mdi-chevron-left</VIcon></VBtn>
      <VBtn icon @click="navigateForward"><VIcon>mdi-chevron-right</VIcon></VBtn>
      <div>{{displayDateString}}</div>
      <div class="flex-right">username here</div>
    </div>
    <MonthView :calendar="calendar" ref="currentView" v-model="displayDateString" />
  </VApp>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import MonthView from './views/MonthView.vue';
import CalendarEvent from './models/CalendarEvent';
import Calendar from './models/Calendar';

export default defineComponent({
  components: {
    MonthView
  },
  props: {},
  setup() {
    return {
      calendar: new Calendar("My Cal 1", [
        // TODO
        new CalendarEvent("Test Event", new Date("Jun 30, 2022 13:01:23 EST"), new Date("Jun 30, 2022 14:00:00 EST")),
        new CalendarEvent("A really long title break somwhere", new Date("Jun 24, 2022 13:01:23 EST"), new Date("Jun 25, 2022 14:00:00 EST")),
        new CalendarEvent("Test 2", new Date("Jun 3, 2022 13:01:23 EST"), new Date("Jun 3, 2022 14:00:00 EST")),
        new CalendarEvent("Test 3", new Date("Jun 3, 2022 13:01:23 EST"), new Date("Jun 3, 2022 14:00:00 EST")),
        new CalendarEvent("Test 4", new Date("Jun 3, 2022 13:01:23 EST"), new Date("Jun 3, 2022 14:00:00 EST")),
        new CalendarEvent("Test 5", new Date("Jun 3, 2022 13:01:23 EST"), new Date("Jun 3, 2022 14:00:00 EST")),
        new CalendarEvent("Test 6", new Date("Jun 3, 2022 13:01:23 EST"), new Date("Jun 3, 2022 14:00:00 EST")),
        new CalendarEvent("Test 7", new Date("Jun 3, 2022 13:01:23 EST"), new Date("Jun 3, 2022 14:00:00 EST"))
        ]),
      displayDateString: ""
    }
  },
  methods: {
    navigateToToday() {
      (this.$refs.currentView as any).navigateToToday();
    },
    navigateBackward() {
      (this.$refs.currentView as any).navigateBackward();
    },
    navigateForward() {
      (this.$refs.currentView as any).navigateForward();
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
  margin-top: 10px;
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
  padding-bottom: 1rem;
  padding-left: 2em;
  padding-right: 2em;
}

.flex-right {
  margin-left: auto;
}
</style>
