<template>
  <div class="event">
    {{ event.name }}
  </div>
</template>

<script lang="ts">
import CalendarEvent from '@/models/CalendarEvent';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: "EventBubble",
  props: {
    event: {
      type: CalendarEvent,
      required: true,
    }
  }
})
</script>

<style scoped lang="scss">
.event {
  border-radius: 5px;
  width: 100%;
  max-width: 100%;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  background-color: green;
  color: white;
}
</style>
