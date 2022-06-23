<template>
  <VDialog max-width="80%" :value="true" target="app">
    <VCard>
      <VCardTitle>Edit Event</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol><VTextField label="Event Name *" required :value="event.name" /></VCol>
          </VRow>
          <VRow>
            <VCol>
              <v-datetime-picker label="Start *" v-model="startDate">
                <template #dateIcon><VIcon>mdi-calendar-range</VIcon></template>
                <template #timeIcon><VIcon>mdi-clock-outline</VIcon></template>
              </v-datetime-picker>
            </VCol>
            <VCol>
              <v-datetime-picker label="End *" v-model="endDate">
                <template #dateIcon><VIcon>mdi-calendar-range</VIcon></template>
                <template #timeIcon><VIcon>mdi-clock-outline</VIcon></template>
              </v-datetime-picker>
            </VCol>
          </VRow>
          <VRow>
            <VCol><VTextarea label="Description" required :value="event.description" /></VCol>
          </VRow>
          <VRow>
            <VCol><VTextField label="Location" required :value="event.location" /></VCol>
          </VRow>
        </VContainer>
        <small>*indicates required field</small>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="blue darken-1" text @click="$emit('cancel')">Cancel</VBtn>
        <VBtn color="blue darken-1" text @click="$emit('save', buildEvent())">Save</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import CalendarEvent from "@/models/CalendarEvent";
import { defineComponent } from "@vue/composition-api";

interface EventEditDialogData {
  startDate: Date;
  endDate: Date;
}

export default defineComponent({
    emits: ["cancel", "save"],
    props: {
        event: {
            required: true,
            type: CalendarEvent,
        }
    },
    setup(props): EventEditDialogData {
        return {
            startDate: props.event.startDate,
            endDate: props.event.endDate
        };
    },
    methods: {
      buildEvent(): CalendarEvent {
        const e = this.event;
        e.startDate = this.startDate;
        e.endDate = this.endDate;
        return e;
      }
    }
})
</script>
