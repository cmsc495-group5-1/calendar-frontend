<template>
  <VDialog max-width="80%" :value="value" target="app" transition="dialog-bottom-transition" @input="$emit('cancel')">
    <VCard>
      <VCardTitle>Edit Event</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol><VTextField label="Event Name *" required :value="event.name" /></VCol>
            <VCol v-if="!event.id">
              <VSelect :items="calendars" item-text="name" label="Calendar" dense outlined hide-details v-model="selectedCalendar" />
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
        <VBtn v-if="event.id" color="red darken-1" text @click="showConfirmDelete">Delete</VBtn>
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
      startDate: props.event.startDate,
      endDate: props.event.endDate,
      showConfirmDialog: false,
      confirmDialogText: "",
      selectedCalendar: null
    };
  },
  watch: {
    event() {
      this.startDate = this.event.startDate;
      this.endDate = this.event.endDate;
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
      e.startDate = this.startDate;
      e.endDate = this.endDate;
      if (this.selectedCalendar != null && e.calendar == null)
        e.calendar = this.selectedCalendar;
      return e;
    },
    showConfirmDelete() {
      this.confirmDialogText = `Confirm deletion of ${this.event.name}?`;
      this.showConfirmDialog = true;
    },
    confirmDelete() {
      this.showConfirmDialog = false;
      this.$emit('delete', this.event);
    }
  }
})
</script>
