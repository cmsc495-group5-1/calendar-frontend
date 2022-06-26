<template>
  <VDialog max-width="80%" :value="value" target="app" transition="dialog-bottom-transition" @input="$emit('cancel')">
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
import CalendarEvent from "@/models/CalendarEvent";
import { defineComponent } from "@vue/composition-api";
import ConfirmDialog from './ConfirmDialog.vue';

interface EventEditDialogData {
  startDate: Date;
  endDate: Date;
  showConfirmDialog: boolean;
  confirmDialogText: string;
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
    }
  },
  setup(props): EventEditDialogData {
    return {
      startDate: props.event.startDate,
      endDate: props.event.endDate,
      showConfirmDialog: false,
      confirmDialogText: ""
    };
  },
  methods: {
    buildEvent(): CalendarEvent {
      const e = this.event;
      e.startDate = this.startDate;
      e.endDate = this.endDate;
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
