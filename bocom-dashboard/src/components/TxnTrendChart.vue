<template>
  <div class="tech-card trend-container">
    <div class="corner-tl"></div>
    <div class="corner-tr"></div>
    <div class="corner-bl"></div>
    <div class="corner-br"></div>

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

<script>
import * as echarts from 'echarts';
import { getTrendData } from '../mock/index.js';

export default {
  name: 'TxnTrendChart',
  data() {
    return {
      chart: null,
      currentTab: 'both',
      tabs: [
        { name: '综合双轴', key: 'both' },
        { name: 'TPS峰值', key: 'tps' },
        { name: '交易总金额', key: 'amount' }
      ],
      resizeHandler: null,
      trendData: null
    };
  },
  mounted() {
    this.trendData = getTrendData();
    this.$nextTick(() => {
      this.initChart();
    });
    this.resizeHandler = () => {
      if (this.chart) this.chart.resize();
    };
    window.addEventListener('resize', this.resizeHandler);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  },
  methods: {
    switchTab(tabKey) {
      this.currentTab = tabKey;
      this.renderChart();
    },
    initChart() {
      const el = this.$refs.trendChartRef;
      if (!el) return;
      this.chart = echarts.init(el);
      this.renderChart();
    },
    renderChart() {
      if (!this.chart || !this.trendData) return;
      const { hours, txnCount, txnAmount, tps } = this.trendData;

      let series = [];
      let yAxis = [];

      if (this.currentTab === 'both' || this.currentTab === 'amount') {
        yAxis.push({
          type: 'value',
          name: '清算金额 (亿元)',
          nameTextStyle: { color: 'rgba(200, 230, 255, 0.7)', fontSize: 10 },
          axisLabel: { color: 'rgba(200, 230, 255, 0.7)', fontSize: 10 },
          splitLine: { lineStyle: { color: 'rgba(0, 180, 255, 0.1)', type: 'dashed' } }
        });
      }

      if (this.currentTab === 'both' || this.currentTab === 'tps') {
        yAxis.push({
          type: 'value',
          name: 'TPS 实时峰值',
          nameTextStyle: { color: 'rgba(0, 242, 254, 0.8)', fontSize: 10 },
          axisLabel: { color: '#00f2fe', fontSize: 10 },
          splitLine: { show: false }
        });
      }

      // 金额柱状图
      if (this.currentTab === 'both' || this.currentTab === 'amount') {
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

      // TPS折线区域图
      if (this.currentTab === 'both' || this.currentTab === 'tps') {
        series.push({
          name: '吞吐TPS',
          type: 'line',
          smooth: true,
          yAxisIndex: this.currentTab === 'both' ? 1 : 0,
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
          top: 42,
          left: 45,
          right: this.currentTab === 'both' ? 45 : 20,
          bottom: 26
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

      this.chart.setOption(option, true);
    }
  }
};
</script>

<style scoped>
.trend-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  min-height: 160px;
}
</style>
