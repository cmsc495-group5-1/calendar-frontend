<template>
  <VNavigationDrawer permanent>
    <VToolbar color="green" dark dense elevation="0">
      <VToolbarTitle>Calendar</VToolbarTitle>
      <VSpacer />
      <VBtn icon @click="$emit('add-calendar')"><VIcon>mdi-plus</VIcon></VBtn>
    </VToolbar>

    <VList dense nav>
      <VListItem v-for="(data, idx) in calendarsTyped" :key="idx">
        <VListItemAction class="cal-actions">
          <VCheckbox :input-value="data.selected" @change="updateSelection(data, $event)"></VCheckbox>
          <VBtn icon @click="$emit('edit-calendar', data.calendar)"><VIcon>mdi-cog</VIcon></VBtn>
        </VListItemAction>
        <VListItemContent>
          <VListItemTitle>{{ data.calendar.name }}</VListItemTitle>
        </VListItemContent>
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

<script lang="ts">
import Calendar from "@/models/Calendar";
import { defineComponent } from "@vue/composition-api";

type SidebarCalendar = {
  calendar: Calendar;
  selected: boolean;
};

export default defineComponent({
  setup() { return {}},
  emits: [ "add-calendar", "edit-calendar", "input" ],
  props: {
    value: {
      type: Array, // [{ cal: Calendar, selected: boolean }]
      required: true
    }
  },
  computed: {
    // ...
    calendarsTyped() {
      const data = this.value as Array<SidebarCalendar>;
      return data;
    }
  },
  methods: {
    updateSelection(target: SidebarCalendar, newValue: boolean) {
      const newCalendars = [...this.value] as Array<SidebarCalendar>;
      const idx = newCalendars.findIndex((value: SidebarCalendar) => value.calendar == target.calendar);
      newCalendars[idx].selected = newValue;
      this.$emit("input", newCalendars);
    }
  }
});
</script>

<style scoped>
.cal-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-right: 0;
  margin-right: 0;
}
</style>