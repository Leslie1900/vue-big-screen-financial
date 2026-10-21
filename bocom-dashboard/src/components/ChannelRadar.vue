<template>
  <div class="tech-card channel-container">
    <div class="corner-tl"></div>
    <div class="corner-tr"></div>
    <div class="corner-bl"></div>
    <div class="corner-br"></div>

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

<script>
import * as echarts from 'echarts';
import { getChannelRadar } from '../mock/index.js';

export default {
  name: 'ChannelRadar',
  data() {
    return {
      chart: null,
      radarData: null,
      resizeHandler: null
    };
  },
  mounted() {
    this.radarData = getChannelRadar();
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
    initChart() {
      const el = this.$refs.radarChartRef;
      if (!el) return;
      this.chart = echarts.init(el);

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
          indicator: this.radarData.indicator,
          shape: 'polygon',
          splitNumber: 4,
          radius: '62%',
          center: ['50%', '45%'],
          axisName: {
            color: '#8ecae6',
            fontSize: 10
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(0, 180, 255, 0.2)'
            }
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(0, 50, 120, 0.1)', 'rgba(0, 100, 200, 0.2)']
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(0, 180, 255, 0.3)'
            }
          }
        },
        series: [
          {
            name: '渠道效能对比',
            type: 'radar',
            data: [
              {
                value: this.radarData.online,
                name: '线上数字化渠道',
                itemStyle: { color: '#00f2fe' },
                lineStyle: { width: 2, color: '#00f2fe' },
                areaStyle: {
                  color: 'rgba(0, 242, 254, 0.3)'
                }
              },
              {
                value: this.radarData.traditional,
                name: '传统网点与自助设备',
                itemStyle: { color: '#ffb703' },
                lineStyle: { width: 2, color: '#ffb703' },
                areaStyle: {
                  color: 'rgba(255, 183, 3, 0.25)'
                }
              }
            ]
          }
        ]
      };

      this.chart.setOption(option);
    }
  }
};
</script>

<style scoped>
.channel-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.radar-chart-box {
  flex: 1;
  width: 100%;
  min-height: 150px;
}
</style>
