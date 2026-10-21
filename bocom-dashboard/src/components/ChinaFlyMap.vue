<template>
  <div class="tech-card map-container">
    <div class="card-title">
      <div class="title-left">
        <span class="icon-bar"></span>
        <span>全国一级分行资金调度与清算网络拓扑 (3D分层态势)</span>
      </div>
      <div class="map-modes">
        <span 
          class="roam-badge" 
          :class="{ active: isAutoRoam && !isHoverPaused, paused: isHoverPaused }"
          @click="toggleAutoRoam"
          :title="isAutoRoam ? '点击暂停自动巡航' : '点击开启自动巡航'"
        >
          {{ !isAutoRoam ? '⏸️ 巡航已关闭' : (isHoverPaused ? '⏸️ 交互悬停已暂停' : '🔄 自动巡航轮播中') }}
        </span>
        <span class="mode-tag active">🚀 实时多维航线调度</span>
        <span class="sub-tag">核心：上海总行双活数据中心</span>
      </div>
    </div>

    <!-- 地图核心画布 -->
    <div class="map-chart-box" ref="mapChartRef"></div>

    <!-- 底部悬浮关键数据徽章 -->
    <div class="map-floating-panel">
      <div class="float-item">
        <span class="f-num">16</span>
        <span class="f-label">重点清算枢纽</span>
      </div>
      <div class="divider"></div>
      <div class="float-item">
        <span class="f-num" style="color: #00f5d4;">100%</span>
        <span class="f-label">主干网连通率</span>
      </div>
      <div class="divider"></div>
      <div class="float-item">
        <span class="f-num" style="color: #ffb703;">1.28万亿</span>
        <span class="f-label">实时日间调度量</span>
      </div>
      <div class="divider"></div>
      <div class="float-item">
        <span class="f-num" style="color: #a78bfa;">0.00ms</span>
        <span class="f-label">跨行容灾丢包率</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import chinaGeoJson from '../mock/china.json';
import { bankNodes, bankLines } from '../mock/index.js';

// 注册中国地图 GeoJSON
echarts.registerMap('china', chinaGeoJson);

export default {
  name: 'ChinaFlyMap',
  data() {
    return {
      chart: null,
      resizeHandler: null,
      roamTimer: null,
      resumeTimer: null,
      isAutoRoam: true,
      isHoverPaused: false,
      currentRoamIndex: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
    this.resizeHandler = () => {
      if (this.chart) this.chart.resize();
    };
    window.addEventListener('resize', this.resizeHandler);
  },
  beforeDestroy() {
    this.stopAutoRoam();
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
      this.resumeTimer = null;
    }
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  },
  methods: {
    stopAutoRoam() {
      if (this.roamTimer) {
        clearInterval(this.roamTimer);
        this.roamTimer = null;
      }
    },
    clearAutoHighlight() {
      if (!this.chart) return;
      const branches = bankNodes.filter(n => n.type !== 'hq');
      const total = branches.length;
      const prevIndex = (this.currentRoamIndex - 1 + total) % total;
      this.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 2,
        dataIndex: prevIndex
      });
    },
    toggleAutoRoam() {
      this.isAutoRoam = !this.isAutoRoam;
      this.isHoverPaused = false;
      if (this.resumeTimer) {
        clearTimeout(this.resumeTimer);
        this.resumeTimer = null;
      }
      if (!this.isAutoRoam) {
        this.stopAutoRoam();
        this.clearAutoHighlight();
        if (this.chart) this.chart.dispatchAction({ type: 'hideTip' });
      } else {
        this.startAutoRoam();
      }
    },
    startAutoRoam() {
      if (this.roamTimer) clearInterval(this.roamTimer);
      this.roamTimer = setInterval(() => {
        if (!this.chart || !this.isAutoRoam) return;
        const branches = bankNodes.filter(n => n.type !== 'hq');
        const total = branches.length;
        if (total === 0) return;
        const prevIndex = (this.currentRoamIndex - 1 + total) % total;
        const currIndex = this.currentRoamIndex % total;

        // 1. 取消上一个城市的高亮
        this.chart.dispatchAction({
          type: 'downplay',
          seriesIndex: 2,
          dataIndex: prevIndex
        });

        // 2. 高亮当前巡航城市（节点发光放大）
        this.chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 2,
          dataIndex: currIndex
        });

        // 3. 自动触发 Tooltip 显示详情
        this.chart.dispatchAction({
          type: 'showTip',
          seriesIndex: 2,
          dataIndex: currIndex
        });

        this.currentRoamIndex++;
      }, 3000);
    },
    initChart() {
      const el = this.$refs.mapChartRef;
      if (!el) return;
      this.chart = echarts.init(el);

      // 处理散点数据
      const hqData = bankNodes.filter(n => n.type === 'hq').map(n => ({
        name: n.name,
        value: [...n.value, 100],
        amount: n.amount,
        status: n.status,
        idc: '双活数据中心A/B区'
      }));

      const branchData = bankNodes.filter(n => n.type !== 'hq').map(n => ({
        name: n.name,
        value: [...n.value, 50],
        amount: n.amount,
        status: n.status,
        idc: '核心分布式骨干网'
      }));

      // 处理飞线航线
      const linesData = bankLines.map(line => ({
        fromName: line.from,
        toName: line.to,
        coords: line.coords,
        value: line.value
      }));

      // 飞机矢量 SVG 路径 (ECharts 标准航线飞机图标)
      const PLANE_PATH = 'path://M1705 1429 l-42 -273 -323 -44 c-88 -12 -122 -32 -137 -81 -9 -30 -1 -65 24 -93 30 -33 74 -51 161 -66 l276 -48 106 -510 c8 -37 20 -60 38 -73 24 -17 56 -21 89 -10 32 10 56 31 67 61 7 20 6 48 -2 88 l-104 509 275 48 c88 15 132 33 162 66 25 28 33 63 24 93 -15 49 -49 69 -137 81 l-323 44 -42 273 c-6 38 -17 65 -35 81 -19 18 -45 26 -76 26 -31 0 -57 -8 -76 -26 -18 -16 -29 -43 -35 -81z';

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          confine: true, // 限制在图表区域内，靠近底部边缘自动朝上翻转，避免被卡片 overflow: hidden 截断
          extraCssText: 'z-index: 99; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7); pointer-events: none;',
          backgroundColor: 'rgba(2, 18, 48, 0.95)',
          borderColor: '#00f2fe',
          borderWidth: 1.5,
          padding: [8, 12],
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          formatter: (params) => {
            if (params.seriesType === 'lines') {
              return `<div style="font-weight:bold;color:#00f2fe">${params.data.fromName} ➔ ${params.data.toName}</div>
                      <div>资金清算频次指数: <span style="color:#ffb703">${params.data.value}</span></div>`;
            } else if (params.seriesType === 'effectScatter' || params.seriesType === 'scatter') {
              const data = params.data;
              return `<div style="font-weight:bold;color:#00f2fe;font-size:14px;margin-bottom:3px">${data.name}</div>
                      <div>日清算规模: <b style="color:#00f5d4">${data.amount || '0'}</b></div>
                      <div>机房架构: <b style="color:#ffd166">${data.idc || '分布式骨干'}</b></div>
                      <div>节点状态: <b style="color:#fff">${data.status || '核心在线'}</b></div>`;
            }
            return params.name;
          }
        },
        // 双层立体地图：一层深蓝阴影底盘，一层发光交互顶层
        geo: [
          {
            map: 'china',
            roam: false,
            zoom: 1.35,
            center: [104.5, 35.2], // 略向下位移产生3D厚度投影
            itemStyle: {
              areaColor: 'rgba(2, 15, 45, 0.95)',
              borderColor: 'rgba(0, 102, 204, 0.4)',
              borderWidth: 2,
              shadowColor: 'rgba(0, 0, 0, 0.8)',
              shadowBlur: 25
            },
            silent: true,
            z: 1
          },
          {
            map: 'china',
            roam: true,
            scaleLimit: { min: 0.9, max: 4.0 },
            zoom: 1.35,
            center: [104.5, 34.8], // 适度上移中心点，让香港、深圳等南部沿海城市与底栏保持舒适间距
            label: {
              show: false,
              color: 'rgba(255,255,255,0.7)'
            },
            itemStyle: {
              areaColor: 'rgba(6, 32, 90, 0.88)',
              borderColor: '#00f2fe',
              borderWidth: 1.6,
              shadowColor: 'rgba(0, 180, 255, 0.7)',
              shadowBlur: 22
            },
            emphasis: {
              itemStyle: {
                areaColor: '#0e55b2',
                borderColor: '#ffffff',
                borderWidth: 2.2,
                shadowColor: '#00f2fe',
                shadowBlur: 28
              },
              label: {
                show: true,
                color: '#fff',
                fontSize: 12
              }
            },
            z: 2
          }
        ],
        series: [
          // 航线固定轨道底线
          {
            type: 'lines',
            geoIndex: 1,
            zlevel: 3,
            effect: {
              show: false
            },
            lineStyle: {
              color: 'rgba(0, 242, 254, 0.35)',
              width: 1.8,
              opacity: 0.7,
              curveness: 0.22
            },
            data: linesData
          },
          // 动态飞机飞行动画系列（金色飞机高光流向）
          {
            type: 'lines',
            geoIndex: 1,
            zlevel: 4,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: PLANE_PATH,
              symbolSize: 15,
              color: '#ffd166'
            },
            lineStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: 'rgba(0, 242, 254, 0.2)' },
                { offset: 0.5, color: '#00f2fe' },
                { offset: 1, color: '#ffd166' }
              ]),
              width: 2.4,
              opacity: 0.9,
              curveness: 0.22
            },
            data: linesData
          },
          // 全国重点分行活跃节点 (自巡航的目标 seriesIndex: 2)
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            geoIndex: 1,
            zlevel: 5,
            data: branchData,
            symbolSize: 11,
            itemStyle: {
              color: '#00f2fe',
              borderColor: '#ffffff',
              borderWidth: 1.5,
              shadowBlur: 14,
              shadowColor: '#00f2fe'
            },
            label: {
              show: true,
              position: 'right',
              offset: [4, 0],
              formatter: '{b}',
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 600,
              textBorderColor: 'rgba(2, 10, 30, 0.9)',
              textBorderWidth: 3
            },
            emphasis: {
              scale: 1.8,
              itemStyle: {
                color: '#ffd166',
                borderColor: '#ffffff',
                borderWidth: 2,
                shadowBlur: 20,
                shadowColor: '#ffd166'
              },
              label: {
                color: '#ffd166',
                fontSize: 13,
                fontWeight: 'bold'
              }
            }
          },
          // 上海总行超级枢纽脉冲水波纹
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            geoIndex: 1,
            zlevel: 6,
            data: hqData,
            symbolSize: 22,
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke',
              scale: 6,
              period: 2
            },
            itemStyle: {
              color: '#ffb703',
              borderColor: '#fff',
              borderWidth: 2,
              shadowBlur: 25,
              shadowColor: '#ffb703'
            },
            label: {
              show: true,
              position: 'top',
              offset: [0, -6],
              formatter: '{b}',
              color: '#ffd166',
              fontSize: 13,
              fontWeight: 'bold',
              textBorderColor: '#020b1e',
              textBorderWidth: 4
            }
          }
        ]
      };

      this.chart.setOption(option);
      this.startAutoRoam();

      // 鼠标交互监听：手动悬浮时暂停巡航，移开后恢复
      const handleMouseEnter = () => {
        if (this.isAutoRoam) {
          this.isHoverPaused = true;
          if (this.resumeTimer) {
            clearTimeout(this.resumeTimer);
            this.resumeTimer = null;
          }
          this.stopAutoRoam();
          this.clearAutoHighlight();
        }
      };

      const handleMouseLeave = () => {
        if (this.isAutoRoam) {
          if (this.resumeTimer) clearTimeout(this.resumeTimer);
          this.resumeTimer = setTimeout(() => {
            this.isHoverPaused = false;
            if (this.isAutoRoam) {
              this.startAutoRoam();
            }
          }, 1000);
        }
      };

      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);

      // 监听 ECharts 节点 hover 覆盖触发
      this.chart.on('mouseover', () => {
        if (this.isAutoRoam && !this.isHoverPaused) {
          this.isHoverPaused = true;
          if (this.resumeTimer) {
            clearTimeout(this.resumeTimer);
            this.resumeTimer = null;
          }
          this.stopAutoRoam();
          this.clearAutoHighlight();
        }
      });
    }
  }
};
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 6px;
  border-bottom: 1px solid rgba(0, 210, 255, 0.15);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
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

.map-modes {
  display: flex;
  align-items: center;
  gap: 8px;
}

.roam-badge {
  font-size: 11px;
  color: #ffb703;
  background: rgba(255, 183, 3, 0.15);
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid rgba(255, 183, 3, 0.4);
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.roam-badge:hover {
  background: rgba(255, 183, 3, 0.25);
  box-shadow: 0 0 8px rgba(255, 183, 3, 0.4);
}

.roam-badge.active {
  color: #00f5d4;
  background: rgba(0, 245, 212, 0.15);
  border-color: rgba(0, 245, 212, 0.4);
}

.roam-badge.paused {
  color: #ffd166;
  background: rgba(255, 209, 102, 0.18);
  border-color: rgba(255, 209, 102, 0.5);
}

.mode-tag.active {
  font-size: 11px;
  color: #00f2fe;
  background: rgba(0, 242, 254, 0.15);
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid rgba(0, 242, 254, 0.4);
}

.sub-tag {
  font-size: 10px;
  color: rgba(180, 220, 255, 0.7);
  background: rgba(0, 102, 204, 0.25);
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid rgba(0, 242, 254, 0.2);
}

.map-chart-box {
  flex: 1;
  width: 100%;
  min-height: 0;
}

.map-floating-panel {
  position: absolute;
  bottom: 8px;
  left: 18px;
  right: 18px;
  background: rgba(3, 16, 45, 0.78);
  border: 1px solid rgba(0, 180, 255, 0.3);
  border-radius: 6px;
  padding: 5px 12px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  z-index: 5;
  pointer-events: none;
}

.float-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.f-num {
  font-family: 'Courier New', Courier, monospace;
  font-size: 17px;
  font-weight: 800;
  color: #00f2fe;
}

.f-label {
  font-size: 10px;
  color: rgba(180, 215, 255, 0.7);
  margin-top: 1px;
}

.divider {
  width: 1px;
  height: 22px;
  background: rgba(0, 200, 255, 0.2);
}
</style>
