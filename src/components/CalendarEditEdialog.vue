<template>
  <VDialog max-width="50%" :value="value" target="app" transition="dialog-bottom-transition" @input="$emit('cancel')">
    <VCard>
      <VCardTitle>Edit Calendar</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol><VTextField label="Calendar Name *" required v-model="calName" /></VCol>
          </VRow>
        </VContainer>
        <small>*indicates required field</small>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn v-if="calendar.calendarId" color="red darken-1" text @click="showConfirmDelete">Delete</VBtn>
        <VBtn color="blue darken-1" text @click="$emit('cancel')">Cancel</VBtn>
        <VBtn color="blue darken-1" text @click="$emit('save', buildCalendar())">Save</VBtn>
      </VCardActions>
    </VCard>
    <ConfirmDialog v-model="showConfirmDialog" action="Delete" :text="confirmDialogText"
      @cancel="showConfirmDialog = false" @confirm="confirmDelete" />
  </VDialog>
</template>

<script lang="ts">
import Calendar from "@/models/Calendar";
import { defineComponent } from "@vue/composition-api";
import ConfirmDialog from './ConfirmDialog.vue';

interface CalEditDialogData {
  showConfirmDialog: boolean;
  confirmDialogText: string;
  calName: string;
}

export default defineComponent({
  emits: ["delete", "cancel", "save"],
  components: {
    ConfirmDialog
  },
  props: {
    calendar: {
      required: true,
      type: Calendar,
    },
    value: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup(): CalEditDialogData {
    return {
      showConfirmDialog: false,
      confirmDialogText: "",
      calName: "",
    };
  },
  methods: {
    showConfirmDelete() {
      this.confirmDialogText = `Confirm deletion of ${this.calendar.name}?`;
      this.showConfirmDialog = true;
    },
    confirmDelete() {
      this.showConfirmDialog = false;
      this.$emit('delete', this.calendar);
    },
    buildCalendar() {
      const cal = this.calendar;
      cal.name = this.calName;
      return cal;
    }
  },
  watch: {
    calendar(newCal: Calendar) {
      this.calName = newCal.name;
    }
  }
})
</script>
