<template>
  <span ref="countRef" class="digital-roll">{{ formattedValue }}</span>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { CountUp } from 'countup.js';

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  decimals: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 2.0
  },
  prefix: {
    type: String,
    default: ''
  },
  separator: {
    type: String,
    default: ','
  }
});

const countRef = ref(null);
let countUpInstance = null;

const formattedValue = computed(() => {
  return Number(props.value || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals
  });
});

onMounted(() => {
  if (countRef.value) {
    countUpInstance = new CountUp(countRef.value, props.value, {
      startVal: 0,
      decimalPlaces: props.decimals,
      duration: props.duration,
      useGrouping: true,
      separator: props.separator,
      prefix: props.prefix
    });
    if (!countUpInstance.error) {
      countUpInstance.start();
    }
  }
});

watch(
  () => props.value,
  (newVal) => {
    if (countUpInstance && typeof countUpInstance.update === 'function') {
      countUpInstance.update(newVal);
    }
  }
);
</script>

<style scoped>
.digital-roll {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 800;
  display: inline-block;
  letter-spacing: 0.5px;
}
</style>
