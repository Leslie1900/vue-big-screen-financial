<template>
  <div class="channel-container">
    <div class="card-title">
      <div class="title-left">
        <span class="icon-bar"></span>
        <span>全渠道金融服务线上线下协同画像</span>
      </div>
      <span class="sub-tag">Omni-Channel</span>
    </div>

    <div class="radar-chart-box" ref="radarChartRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getChannelRadar } from '../mock/index.js';

const radarChartRef = ref(null);
let chart = null;
let resizeHandler = null;

const initChart = () => {
  const el = radarChartRef.value;
  if (!el) return;
  chart = echarts.init(el);
  const radarData = getChannelRadar();

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(3, 20, 50, 0.9)',
      borderColor: '#00d2ff'
    },
    legend: {
      bottom: 2,
      data: ['线上数字化渠道', '传统网点与自助设备'],
      textStyle: { color: 'rgba(200, 230, 255, 0.8)', fontSize: 10 },
      itemWidth: 10,
      itemHeight: 10
    },
    radar: {
      indicator: radarData.indicator,
      shape: 'polygon',
      splitNumber: 4,
      radius: '62%',
      center: ['50%', '45%'],
      axisName: { color: '#8ecae6', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(0, 180, 255, 0.2)' } },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(0, 50, 120, 0.1)', 'rgba(0, 100, 200, 0.2)']
        }
      },
      axisLine: { lineStyle: { color: 'rgba(0, 180, 255, 0.3)' } }
    },
    series: [
      {
        name: '渠道效能对比',
        type: 'radar',
        data: [
          {
            value: radarData.online,
            name: '线上数字化渠道',
            itemStyle: { color: '#00f2fe' },
            lineStyle: { width: 2, color: '#00f2fe' },
            areaStyle: { color: 'rgba(0, 242, 254, 0.3)' }
          },
          {
            value: radarData.traditional,
            name: '传统网点与自助设备',
            itemStyle: { color: '#ffb703' },
            lineStyle: { width: 2, color: '#ffb703' },
            areaStyle: { color: 'rgba(255, 183, 3, 0.25)' }
          }
        ]
      }
    ]
  };

  chart.setOption(option);
};

onMounted(() => {
  nextTick(() => {
    initChart();
  });
  resizeHandler = () => {
    if (chart) chart.resize();
  };
  window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }
});
</script>

<style scoped>
.channel-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px 4px;
  border-bottom: 1px solid rgba(0, 210, 255, 0.15);
  font-size: 14px;
  font-weight: 600;
  color: #e2f1ff;
}

.title-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-bar {
  width: 4px;
  height: 14px;
  background: linear-gradient(180deg, #00f2fe 0%, #0066cc 100%);
  border-radius: 2px;
  box-shadow: 0 0 8px #00f2fe;
}

.sub-tag {
  font-size: 10px;
  color: rgba(180, 220, 255, 0.7);
  background: rgba(0, 102, 204, 0.25);
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid rgba(0, 242, 254, 0.2);
}

.radar-chart-box {
  flex: 1;
  width: 100%;
  min-height: 0;
}
</style>
