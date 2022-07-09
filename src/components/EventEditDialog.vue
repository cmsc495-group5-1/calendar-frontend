<template>
  <VDialog max-width="80%" :value="value" target="app" transition="dialog-bottom-transition" @input="$emit('cancel')">
    <VCard>
      <VCardTitle>Edit Event</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol><VTextField label="Event Name *" required v-model="eventName" /></VCol>
            <VCol v-if="!event.eventId">
              <VSelect :items="calendars" item-text="name" label="Calendar" dense outlined hide-details return-object v-model="selectedCalendar" />
            </VCol>
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
            <VCol><VTextarea label="Description" required v-model="eventDescription" /></VCol>
          </VRow>
          <VRow>
            <VCol><VTextField label="Location" required v-model="eventLocation" /></VCol>
          </VRow>
        </VContainer>
        <small>*indicates required field</small>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn v-if="event.eventId" color="red darken-1" text @click="showConfirmDelete">Delete</VBtn>
        <VBtn color="blue darken-1" text @click="$emit('cancel')">Cancel</VBtn>
        <VBtn color="blue darken-1" text @click="$emit('save', buildEvent())">Save</VBtn>
      </VCardActions>
    </VCard>
    <ConfirmDialog v-model="showConfirmDialog" action="Delete" :text="confirmDialogText"
      @cancel="showConfirmDialog = false" @confirm="confirmDelete" />
  </VDialog>
</template>

<script lang="ts">
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import { defineComponent } from "@vue/composition-api";
import ConfirmDialog from './ConfirmDialog.vue';

interface EventEditDialogData {
  startDate: Date;
  endDate: Date;
  eventLocation: string;
  eventDescription: string;
  eventName: string;
  showConfirmDialog: boolean;
  confirmDialogText: string;
  selectedCalendar: Calendar | null;
}

export default defineComponent({
  emits: ["delete", "cancel", "save"],
  components: {
    ConfirmDialog
  },
  props: {
    event: {
      required: true,
      type: CalendarEvent,
    },
    value: {
      type: Boolean,
      required: false,
      default: true
    },
    calendars: {
      type: Array,
      required: true
    }
  },
  setup(props): EventEditDialogData {
    return {
      startDate: props.event.startDateTime,
      endDate: props.event.endDateTime,
      eventLocation: "",
      eventDescription: "",
      eventName: "",
      showConfirmDialog: false,
      confirmDialogText: "",
      selectedCalendar: null
    };
  },
  watch: {
    event() {
      this.startDate = this.event.startDateTime;
      this.endDate = this.event.endDateTime;
      this.eventLocation = this.event.location || "";
      this.eventDescription = this.event.description || "";
      this.eventName = this.event.eventName;
      if (this.selectedCalendar == null && this.calendars.length > 0) {
        this.selectedCalendar = this.calendars[0] as Calendar;
      }
    }
  },
  mounted() {
    if (this.selectedCalendar == null && this.calendars.length > 0) {
      this.selectedCalendar = this.calendars[0] as Calendar;
    }
  },
  methods: {
    buildEvent(): CalendarEvent {
      const e = this.event;
      e.startDateTime = this.startDate;
      e.endDateTime = this.endDate;
      e.location = this.eventLocation;
      e.description = this.eventDescription;
      e.eventName = this.eventName;
      if (this.selectedCalendar != null && e.calendar == null)
        e.calendar = this.selectedCalendar;
      return e;
    },
    showConfirmDelete() {
      this.confirmDialogText = `Confirm deletion of ${this.event.eventName}?`;
      this.showConfirmDialog = true;
    },
    confirmDelete() {
      this.showConfirmDialog = false;
      this.$emit('delete', this.event);
    }
  }
})
</script>
