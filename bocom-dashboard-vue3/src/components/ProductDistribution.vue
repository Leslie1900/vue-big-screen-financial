<template>
  <div class="product-container">
    <div class="card-title">
      <div class="title-left">
        <span class="icon-bar"></span>
        <span>信贷资产与金融产品业务结构</span>
      </div>
      <span class="sub-tag">多元生态</span>
    </div>

    <div class="product-content">
      <div class="chart-half" ref="pieChartRef"></div>
      <div class="legend-half">
        <div class="legend-row" v-for="(item, idx) in productList" :key="idx">
          <div class="dot" :style="{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }"></div>
          <div class="p-name">{{ item.name }}</div>
          <div class="p-val" :style="{ color: item.color }">{{ item.value }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getProductDistribution } from '../mock/index.js';

const pieChartRef = ref(null);
let chart = null;
let resizeHandler = null;
const productList = ref([]);

const initChart = () => {
  const el = pieChartRef.value;
  if (!el) return;
  chart = echarts.init(el);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      confine: true,
      backgroundColor: 'rgba(2, 18, 48, 0.95)',
      borderColor: '#00f2fe',
      borderWidth: 1.5,
      padding: [8, 12],
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (params) => {
        return `<div style="font-weight:bold;color:#00f2fe;margin-bottom:3px;font-size:12px">${params.seriesName}</div>
                <div style="display:flex;align-items:center;gap:6px">
                  <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${params.color}"></span>
                  <span>${params.name}: </span>
                  <b style="color:#ffd166;font-family:monospace;font-size:13px">${params.value}%</b>
                </div>`;
      }
    },
    series: [
      {
        name: '业务板块占比',
        type: 'pie',
        radius: ['46%', '70%'],
        center: ['54%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#030a1c',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          scale: true,
          scaleSize: 8,
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
            color: '#00f2fe',
            formatter: (params) => `${params.value}%\n${params.name.slice(0, 4)}`
          }
        },
        data: productList.value.map(p => ({
          name: p.name,
          value: p.value,
          itemStyle: { color: p.color }
        }))
      }
    ]
  };

  chart.setOption(option);
};

onMounted(() => {
  productList.value = getProductDistribution();
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
.product-container {
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
  flex-shrink: 0;
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

.product-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 4px;
  min-height: 0;
}

.chart-half {
  flex: 1.2;
  height: 100%;
  min-height: 150px;
}

.legend-half {
  flex: 1.1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 10px;
}

.legend-row {
  display: flex;
  align-items: center;
  font-size: 11px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}

.p-name {
  color: rgba(200, 230, 255, 0.8);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.p-val {
  font-family: monospace;
  font-weight: 700;
  margin-left: 6px;
}
</style>
