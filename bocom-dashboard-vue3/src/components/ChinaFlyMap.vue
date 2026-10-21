<template>
  <div class="map-container">
    <div class="card-title">
      <div class="title-left">
        <span class="icon-bar"></span>
        <span>全国一级分行资金调度与清算网络拓扑 (3D分层态势)</span>
      </div>
      <div class="map-modes">
        <span class="roam-badge" :class="{ active: isAutoRoam && !isHoverPaused, paused: isHoverPaused }"
          @click="toggleAutoRoam">
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

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import chinaGeoJson from '../mock/china.json';
import { bankNodes, bankLines } from '../mock/index.js';

// 注册 GeoJSON
echarts.registerMap('china', chinaGeoJson);

const mapChartRef = ref(null);
let chart = null;
let resizeHandler = null;
let roamTimer = null;
const isAutoRoam = ref(true);
const isHoverPaused = ref(false);
let currentRoamIndex = 0;
let resumeTimer = null;

const stopAutoRoam = () => {
  if (roamTimer) {
    clearInterval(roamTimer);
    roamTimer = null;
  }
};

const clearAutoHighlight = () => {
  if (!chart) return;
  const branches = bankNodes.filter(n => n.type !== 'hq');
  const total = branches.length;
  const prevIndex = (currentRoamIndex - 1 + total) % total;
  chart.dispatchAction({
    type: 'downplay',
    seriesIndex: 2,
    dataIndex: prevIndex
  });
};

const toggleAutoRoam = () => {
  isAutoRoam.value = !isAutoRoam.value;
  isHoverPaused.value = false;
  if (resumeTimer) {
    clearTimeout(resumeTimer);
    resumeTimer = null;
  }
  if (!isAutoRoam.value) {
    stopAutoRoam();
    clearAutoHighlight();
    if (chart) chart.dispatchAction({ type: 'hideTip' });
  } else {
    startAutoRoam();
  }
};

const startAutoRoam = () => {
  if (roamTimer) clearInterval(roamTimer);
  roamTimer = setInterval(() => {
    if (!chart || !isAutoRoam.value) return;
    const branches = bankNodes.filter(n => n.type !== 'hq');
    const total = branches.length;
    const prevIndex = (currentRoamIndex - 1 + total) % total;
    const currIndex = currentRoamIndex % total;

    // 1. 取消上一个城市的高亮
    chart.dispatchAction({
      type: 'downplay',
      seriesIndex: 2,
      dataIndex: prevIndex
    });

    // 2. 高亮当前巡航城市（节点放大、发光）
    chart.dispatchAction({
      type: 'highlight',
      seriesIndex: 2,
      dataIndex: currIndex
    });

    // 3. 弹出当前巡航城市的 Tooltip 详情浮窗
    chart.dispatchAction({
      type: 'showTip',
      seriesIndex: 2,
      dataIndex: currIndex
    });

    currentRoamIndex++;
  }, 3000);
};

const initChart = () => {
  const el = mapChartRef.value;
  if (!el) return;
  chart = echarts.init(el);

  // 处理散点数据
  const hqData = bankNodes.filter(n => n.type === 'hq').map(n => ({
    name: n.name,
    value: [...n.value, 100],
    amount: n.amount,
    status: n.status,
    idc: n.idc
  }));

  const branchData = bankNodes.filter(n => n.type !== 'hq').map(n => ({
    name: n.name,
    value: [...n.value, 50],
    amount: n.amount,
    status: n.status,
    idc: n.idc
  }));

  // 处理飞线航线
  const linesData = bankLines.map(line => ({
    fromName: line.from,
    toName: line.to,
    coords: line.coords,
    value: line.value
  }));

  // 飞机矢量 SVG 路径 (ECharts 标准航线图标)
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
    // 双层地图技术：一层作为深度深蓝阴影底盘，一层作为发光交互顶层
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
      // 动态飞机飞行动画系列
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
          color: '#ffd166' // 金色高光，象征金融黄金航线与资金流向，对比深蓝底图极其鲜明
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
      // 全国重点分行活跃节点
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

  chart.setOption(option);
  startAutoRoam();

  // 鼠标交互监听：手动触发 Tooltip / 悬浮时暂停巡航
  const handleMouseEnter = () => {
    if (isAutoRoam.value) {
      isHoverPaused.value = true;
      if (resumeTimer) {
        clearTimeout(resumeTimer);
        resumeTimer = null;
      }
      stopAutoRoam();
      clearAutoHighlight();
    }
  };

  const handleMouseLeave = () => {
    if (isAutoRoam.value) {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        isHoverPaused.value = false;
        if (isAutoRoam.value) {
          startAutoRoam();
        }
      }, 1000);
    }
  };

  // 监听容器鼠标移入移出
  el.addEventListener('mouseenter', handleMouseEnter);
  el.addEventListener('mouseleave', handleMouseLeave);

  // 监听 ECharts 图表元素的 mouseover（覆盖节点触发）
  chart.on('mouseover', () => {
    if (isAutoRoam.value && !isHoverPaused.value) {
      isHoverPaused.value = true;
      if (resumeTimer) {
        clearTimeout(resumeTimer);
        resumeTimer = null;
      }
      stopAutoRoam();
      clearAutoHighlight();
    }
  });
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
  if (roamTimer) {
    clearInterval(roamTimer);
    roamTimer = null;
  }
  if (resumeTimer) {
    clearTimeout(resumeTimer);
    resumeTimer = null;
  }
});
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
