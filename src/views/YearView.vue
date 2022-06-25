<template>
  <div class="year">
    <MonthBlock v-for="month in getMonths()" class="month" :month="month" :key="month.getMonth()" @nav-to-day="$emit('nav-to-day', $event)" @nav-to-month="$emit('nav-to-month', $event)" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import Calendar from "@/models/Calendar";
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
    calendar: {
      type: Calendar,
      required: true
    },
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
  height: 100%;
  padding: 1em;
}

.month {
  width: 25%;
  border: 1px solid lightgray;
  border-collapse: collapse;
}
</style>
