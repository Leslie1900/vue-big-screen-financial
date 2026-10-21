<template>
  <div class="trend-container">
    <div class="card-title">
      <div class="title-left">
        <span class="icon-bar"></span>
        <span>24H交易流量峰值与清算吞吐走势 (TPS & Txn)</span>
      </div>
      <div class="trend-tabs">
        <span 
          v-for="tab in tabs" 
          :key="tab.key" 
          :class="['tab-btn', { active: currentTab === tab.key }]"
          @click="switchTab(tab.key)"
        >
          {{ tab.name }}
        </span>
      </div>
    </div>

    <div class="chart-box" ref="trendChartRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getTrendData } from '../mock/index.js';

const trendChartRef = ref(null);
let chart = null;
let resizeHandler = null;
const currentTab = ref('both');

const tabs = [
  { name: '综合双轴', key: 'both' },
  { name: 'TPS峰值', key: 'tps' },
  { name: '交易总金额', key: 'amount' }
];

let trendData = null;

const switchTab = (tabKey) => {
  currentTab.value = tabKey;
  renderChart();
};

const renderChart = () => {
  if (!chart || !trendData) return;
  const { hours, txnAmount, tps } = trendData;

  const series = [];
  const yAxis = [];

  if (currentTab.value === 'both' || currentTab.value === 'amount') {
    yAxis.push({
      type: 'value',
      name: '清算金额 (亿元)',
      nameTextStyle: { color: 'rgba(200, 230, 255, 0.7)', fontSize: 10 },
      axisLabel: { color: 'rgba(200, 230, 255, 0.7)', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(0, 180, 255, 0.1)', type: 'dashed' } }
    });
  }

  if (currentTab.value === 'both' || currentTab.value === 'tps') {
    yAxis.push({
      type: 'value',
      name: 'TPS 实时峰值',
      nameTextStyle: { color: 'rgba(0, 242, 254, 0.8)', fontSize: 10 },
      axisLabel: { color: '#00f2fe', fontSize: 10 },
      splitLine: { show: false }
    });
  }

  if (currentTab.value === 'both' || currentTab.value === 'amount') {
    series.push({
      name: '清算金额(亿元)',
      type: 'bar',
      barWidth: 12,
      yAxisIndex: 0,
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00f2fe' },
          { offset: 1, color: 'rgba(0, 102, 204, 0.15)' }
        ])
      },
      data: txnAmount
    });
  }

  if (currentTab.value === 'both' || currentTab.value === 'tps') {
    series.push({
      name: '吞吐TPS',
      type: 'line',
      smooth: true,
      yAxisIndex: currentTab.value === 'both' ? 1 : 0,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: { color: '#ffb703', borderColor: '#fff', borderWidth: 1 },
      lineStyle: { width: 2.5, color: '#ffb703', shadowColor: 'rgba(255,183,3,0.5)', shadowBlur: 8 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(255, 183, 3, 0.35)' },
          { offset: 1, color: 'rgba(255, 183, 3, 0.0)' }
        ])
      },
      data: tps
    });
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(3, 20, 50, 0.9)',
      borderColor: '#00d2ff',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: series.map(s => s.name),
      textStyle: { color: '#bce4ff', fontSize: 10 },
      top: 6,
      right: 10
    },
    grid: {
      top: 38,
      left: 45,
      right: currentTab.value === 'both' ? 45 : 20,
      bottom: 24
    },
    xAxis: {
      type: 'category',
      data: hours,
      axisLine: { lineStyle: { color: 'rgba(0, 180, 255, 0.3)' } },
      axisLabel: { color: 'rgba(200, 230, 255, 0.7)', fontSize: 10 }
    },
    yAxis: yAxis,
    series: series
  };

  chart.setOption(option, true);
};

onMounted(() => {
  trendData = getTrendData();
  nextTick(() => {
    const el = trendChartRef.value;
    if (!el) return;
    chart = echarts.init(el);
    renderChart();
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
.trend-container {
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

.trend-tabs {
  display: flex;
  gap: 6px;
}

.tab-btn {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(0, 80, 180, 0.2);
  border: 1px solid rgba(0, 180, 255, 0.2);
  color: rgba(180, 220, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active, .tab-btn:hover {
  background: rgba(0, 242, 254, 0.25);
  border-color: #00f2fe;
  color: #fff;
}

.chart-box {
  flex: 1;
  width: 100%;
  min-height: 0;
}
</style>
