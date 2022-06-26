<template>
  <div class="year">
    <template v-for="(month, i) in getMonths()">
      <template>
        <MonthBlock class="month" :month="month" :key="month.getMonth()" @nav-to-day="$emit('nav-to-day', $event)" @nav-to-month="$emit('nav-to-month', $event)" />
        <div class="break" v-if="(i + 1) % 4 == 0" :key="month.getMonth() + 'b'"></div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import MonthBlock from '@/components/MonthBlock.vue';

export default defineComponent({
  components: {
    MonthBlock
  },
  emits: [ "input", "nav-to-month", "nav-to-day" ],
  setup() {
    return {};
  },
  props: {
    value: {
      type: String,
      required: false,
      default: ""
    },
    displayDate: {
      type: Date,
      required: true
    }
  },
  computed: {
    displayYear(): number {
      return this.displayDate.getFullYear();
    },
  },
  methods: {
    formatDate(date: Date) {
      return date.toLocaleDateString(undefined, { year: "numeric" });
    },
    navigateBackward() {
      return this.navigateYears(-1);
    },
    navigateForward() {
      return this.navigateYears(1);
    },
    navigateYears(amount: number) {
      const newDate = new Date(this.displayDate.getTime());
      newDate.setFullYear(newDate.getFullYear() + amount);
      return newDate;
    },
    getMonths() {
      const months = [];
      for (let i = 0 ; i < 12; i++) {
        months.push(new Date(this.displayYear, i));
      }
      return months;
    }
  },
  watch: {
    displayDate(newValue: Date) {
      this.$emit("input", this.formatDate(newValue));
    }
  },
  mounted() {
    this.$emit("input", this.formatDate(this.displayDate));
  }
})
</script>

<style scoped lang="scss">
.year {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  gap: 0.5rem;
}

.break {
  flex-basis: 100%;
  height: 0px;
}

.month {
  border: 1px solid lightgray;
  border-collapse: collapse;
  flex: 1 1 auto;
}
</style>
