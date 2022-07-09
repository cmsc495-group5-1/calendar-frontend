<template>
  <div class="event ellipsize">
    {{ event.eventName }}
    <div v-if="expanded" class="subtext">
      <div v-if="event.location" class="ellipsize">{{event.location}}</div>
      <div v-if="event.description" class="ellipsize flex-right">{{event.description}}</div>
    </div>
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
    },
    expanded: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
</script>

<style scoped lang="scss">
.event {
  border-radius: 5px;
  width: 100%;
  max-width: 100%;

  background-color: green;
  color: white;
}

.event:hover {
  cursor: pointer;
}

.ellipsize {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.flex-right {
  margin-left: auto;
}

.subtext {
  padding-left: 1em;
  padding-right: 1em;
  font-size: small;
  display: flex;
  gap: 1em;
}
</style>
