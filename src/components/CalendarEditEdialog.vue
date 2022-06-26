<template>
  <VDialog max-width="50%" :value="value" target="app" transition="dialog-bottom-transition" @input="$emit('cancel')">
    <VCard>
      <VCardTitle>Edit Calendar</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol><VTextField label="Calendar Name *" required :value="calendar.name" /></VCol>
          </VRow>
        </VContainer>
        <small>*indicates required field</small>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn v-if="calendar.id" color="red darken-1" text @click="showConfirmDelete">Delete</VBtn>
        <VBtn color="blue darken-1" text @click="$emit('cancel')">Cancel</VBtn>
        <VBtn color="blue darken-1" text @click="$emit('save', calendar)">Save</VBtn>
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
      confirmDialogText: ""
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
    }
  }
})
</script>
