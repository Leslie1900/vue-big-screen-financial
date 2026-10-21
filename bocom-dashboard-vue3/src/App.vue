<template>
  <div class="screen-wrapper" ref="screenWrapper">
    <!-- 背景流光与微粒星空画布 -->
    <StarfieldCanvas />
    <div class="grid-bg-overlay"></div>
    <div class="ambient-glow glow-top"></div>
    <div class="ambient-glow glow-bottom"></div>

    <!-- 1920x1080 基准缩放舞台 -->
    <div class="screen-content" :style="screenStyle">
      <!-- 顶部交行品牌导航栏 -->
      <ScreenHeader />

      <!-- 全球外汇与行情实时滚动跑马灯 -->
      <FxRateTicker />

      <!-- 核心指标统计带 (数字机械平滑翻牌器) -->
      <div class="metrics-section">
        <CoreMetrics :metrics="coreMetrics" />
      </div>

      <!-- 大屏主看板三栏布局 -->
      <div class="dashboard-body">
        <!-- 左侧一栏: 业务结构分布 + 重点分行排行 -->
        <div class="col-left">
          <div class="card-wrapper top-card">
            <GlowCard>
              <ProductDistribution />
            </GlowCard>
          </div>
          <div class="card-wrapper bottom-card">
            <GlowCard>
              <BranchRankings />
            </GlowCard>
          </div>
        </div>

        <!-- 中间一栏: 3D分层全国分行清算拓扑巨幕 + 24H趋势图 -->
        <div class="col-center">
          <div class="card-wrapper map-card">
            <GlowCard>
              <ChinaFlyMap />
            </GlowCard>
          </div>
          <div class="card-wrapper trend-card">
            <GlowCard>
              <TxnTrendChart />
            </GlowCard>
          </div>
        </div>

        <!-- 右侧一栏: 全渠道雷达 + 绿色金融仪表 + 实时安全防御事件流 -->
        <div class="col-right">
          <div class="card-wrapper right-top">
            <GlowCard>
              <ChannelRadar />
            </GlowCard>
          </div>
          <div class="card-wrapper right-mid">
            <GlowCard>
              <GreenFinanceGauge />
            </GlowCard>
          </div>
          <div class="card-wrapper right-bottom">
            <GlowCard>
              <SecurityAlertStream />
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useScreenScale } from './composables/useScreenScale.js';
import StarfieldCanvas from './components/StarfieldCanvas.vue';
import ScreenHeader from './components/ScreenHeader.vue';
import FxRateTicker from './components/FxRateTicker.vue';
import CoreMetrics from './components/CoreMetrics.vue';
import GlowCard from './components/GlowCard.vue';
import ChinaFlyMap from './components/ChinaFlyMap.vue';
import TxnTrendChart from './components/TxnTrendChart.vue';
import ProductDistribution from './components/ProductDistribution.vue';
import ChannelRadar from './components/ChannelRadar.vue';
import BranchRankings from './components/BranchRankings.vue';
import SecurityAlertStream from './components/SecurityAlertStream.vue';
import GreenFinanceGauge from './components/GreenFinanceGauge.vue';
import { getCoreMetrics } from './mock/index.js';

// 自适应缩放
const { scale } = useScreenScale(1920, 1080);

const screenStyle = computed(() => {
  return {
    transform: `scale(${scale.value}) translate(-50%, -50%)`,
    transformOrigin: '0 0'
  };
});

const coreMetrics = ref({});
let metricTimer = null;

onMounted(() => {
  coreMetrics.value = getCoreMetrics();
  // 3秒高频微幅跳动
  metricTimer = setInterval(() => {
    coreMetrics.value = getCoreMetrics();
  }, 3000);
});

onUnmounted(() => {
  if (metricTimer) clearInterval(metricTimer);
});
</script>

<style scoped>
.screen-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at 50% 30%, #06193d 0%, #020b1e 70%, #010611 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 科技氛围漫反射光晕 */
.ambient-glow {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 1;
}

.glow-top {
  top: -100px;
  left: 20%;
  width: 600px;
  height: 300px;
  background: rgba(0, 110, 255, 0.22);
}

.glow-bottom {
  bottom: -150px;
  right: 15%;
  width: 800px;
  height: 400px;
  background: rgba(0, 242, 254, 0.14);
}

.screen-content {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  padding: 0 18px 12px;
  box-sizing: border-box;
  z-index: 2;
}

.metrics-section {
  margin-bottom: 10px;
  flex-shrink: 0;
}

.dashboard-body {
  flex: 1;
  display: grid;
  grid-template-columns: 395px 1fr 415px;
  gap: 14px;
  min-height: 0;
  height: calc(100% - 195px);
}

.card-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

/* 左侧列 */
.col-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  min-height: 0;
}

.top-card {
  height: 42%;
  min-height: 200px;
}

.bottom-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 中间列 */
.col-center {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  min-height: 0;
}

.map-card {
  flex: 1.85;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.trend-card {
  flex: 0.95;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 右侧列 */
.col-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  min-height: 0;
}

.right-top {
  height: 31%;
  min-height: 170px;
}

.right-mid {
  height: 32%;
  min-height: 180px;
}

.right-bottom {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
