<template>
  <div class="year">
    <template v-for="month in getMonths()">
      <template>
        <MonthBlock class="month" :month="month" :key="month.getMonth()" @nav-to-day="$emit('nav-to-day', $event)" @nav-to-month="$emit('nav-to-month', $event)" />
        <div v-if="(month.getMonth() + 1) % 4 == 0" class="break" :key="month.getMonth() + 'b'"></div>
      </template>
    </template>
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
.break {
  flex-basis: 100%;
  height: 0;
}

.year {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  height: 100%;
}

.month {
  display: flex;
  flex-wrap: wrap;
  width: 25%;
}

.day {
  border: 1px solid lightgray;
  display: flex;
  flex-direction: column;
  align-content: center;
  width: calc(100% / 7);
  height: 6em;
}

.current-day {
  background-color: dodgerblue;
  color: white;
}

.not-current-day {
  background-color: #efefef;
}

.day-header {
  background-color: #efefef;
  height: fit-content;
}
</style>
