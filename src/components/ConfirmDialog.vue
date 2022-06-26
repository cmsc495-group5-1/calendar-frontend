<template>
  <VDialog :value="value" width="500">
    <VCard>
      <VCardTitle class="text-h5 grey lighten-2">Confirm {{action}}</VCardTitle>
      <VCardText>{{text}}</VCardText>
      <VDivider></VDivider>

      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn color="blue darken-1" text @click="$emit('cancel')">Cancel</VBtn>
        <VBtn color="red darken-1" text @click="$emit('confirm')">{{action}}</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() { return {}; },
  emits: [ "cancel", "confirm" ],
  props: {
    action: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      required: false,
      default: true
    }
  }
});

</script>