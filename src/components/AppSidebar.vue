<template>
  <VNavigationDrawer permanent>
    <VListItem>
      <VListItemContent>
        <VListItemTitle class="text-h6">
          Calendar
        </VListItemTitle>
      </VListItemContent>
    </VListItem>

    <VDivider></VDivider>

    <VList dense nav>
      <VListItem v-for="item in 3" :key="item" link>
      <!-- TODO put calendar list here -->
        <VListItemIcon>
          <VIcon>{{ "icon" }}</VIcon>
        </VListItemIcon>

        <VListItemContent>
          <VListItemTitle>{{ "title" }}</VListItemTitle>
        </VListItemContent>
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() { return {}},

});
</script>