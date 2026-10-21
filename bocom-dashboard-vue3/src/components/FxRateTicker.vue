<template>
  <div class="ticker-strip">
    <div class="strip-label">
      <span class="pulse-lamp"></span>
      <span>交银全球外汇与资产实时行情</span>
    </div>
    <div class="strip-track">
      <div class="strip-content">
        <span 
          v-for="(item, index) in fxList.concat(fxList)" 
          :key="index" 
          class="rate-chip"
        >
          <span class="chip-name">{{ item.name }} ({{ item.code }}):</span>
          <span class="chip-val">{{ item.rate }}</span>
          <span :class="['chip-chg', item.up ? 'up' : 'down']">
            {{ item.up ? '▲' : '▼' }} {{ item.chg }}
          </span>
          <span class="chip-dot">|</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFxRates } from '../mock/index.js';

const fxList = ref([]);

onMounted(() => {
  fxList.value = getFxRates();
});
</script>

<style scoped>
.ticker-strip {
  width: 100%;
  height: 28px;
  background: rgba(2, 12, 35, 0.85);
  border: 1px solid rgba(0, 180, 255, 0.2);
  border-radius: 4px;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 0 10px;
  margin-bottom: 6px;
  box-shadow: inset 0 0 10px rgba(0, 102, 204, 0.15);
}

.strip-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #00f2fe;
  font-weight: 600;
  white-space: nowrap;
  padding-right: 14px;
  border-right: 1px solid rgba(0, 180, 255, 0.3);
  flex-shrink: 0;
}

.pulse-lamp {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffb703;
  box-shadow: 0 0 6px #ffb703;
  animation: blink 1.2s infinite;
}

@keyframes blink {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

.strip-track {
  flex: 1;
  overflow: hidden;
  position: relative;
  white-space: nowrap;
}

.strip-content {
  display: inline-block;
  animation: marquee 35s linear infinite;
}

.strip-content:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.rate-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0 10px;
  font-size: 11px;
}

.chip-name {
  color: rgba(180, 215, 255, 0.75);
}

.chip-val {
  font-family: monospace;
  font-weight: 700;
  color: #fff;
}

.chip-chg.up {
  color: #00f5d4;
}

.chip-chg.down {
  color: #ff5376;
}

.chip-dot {
  color: rgba(0, 180, 255, 0.25);
  margin-left: 10px;
}
</style>
