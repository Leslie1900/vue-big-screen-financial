<template>
  <div class="screen-header">
    <div class="header-left">
      <div class="bank-logo-wrap">
        <div class="logo-badge">BOCOM</div>
        <div class="logo-title">
          <span class="cn-name">交通银行</span>
          <span class="en-name">BANK OF COMMUNICATIONS</span>
        </div>
      </div>
      <div class="status-indicator">
        <span class="dot-live"></span>
        <span class="status-text">核心集群双活在线</span>
        <span class="latency">2.8ms</span>
      </div>
      <div class="idc-tag">
        <span>张江 / 普陀 IDC</span>
      </div>
    </div>

    <div class="header-center">
      <div class="title-main">全球智慧金融运营数字全景看板</div>
      <div class="title-sub">GLOBAL SMART BANKING OPERATIONS COMMAND CENTER</div>
      <div class="header-light-bar"></div>
    </div>

    <div class="header-right">
      <div class="time-block">
        <span class="clock-icon">🕒</span>
        <span class="current-time">{{ currentTime }}</span>
        <span class="current-date">{{ currentDate }} {{ currentWeek }}</span>
      </div>
      <button class="fullscreen-btn" @click="toggleFullScreen" title="切换全屏">
        {{ isFullscreen ? '🗗 窗口' : '⛶ 全屏' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentTime = ref('');
const currentDate = ref('');
const currentWeek = ref('');
const isFullscreen = ref(false);
let timer = null;

const updateClock = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}:${seconds}`;

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  currentDate.value = `${year}-${month}-${day}`;

  const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  currentWeek.value = weeks[now.getDay()];
};

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

const onFullScreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

onMounted(() => {
  updateClock();
  timer = setInterval(updateClock, 1000);
  document.addEventListener('fullscreenchange', onFullScreenChange);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
  document.removeEventListener('fullscreenchange', onFullScreenChange);
});
</script>

<style scoped>
.screen-header {
  position: relative;
  width: 100%;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: linear-gradient(180deg, rgba(3, 20, 60, 0.95) 0%, rgba(2, 10, 30, 0.6) 80%, transparent 100%);
  border-bottom: 1px solid rgba(0, 180, 255, 0.25);
  z-index: 10;
  flex-shrink: 0;
}

.header-left, .header-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-left {
  gap: 16px;
}

.bank-logo-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-badge {
  background: linear-gradient(135deg, #0055b8 0%, #002e7a 100%);
  border: 1px solid #00d2ff;
  color: #fff;
  font-weight: 900;
  font-size: 13px;
  letter-spacing: 1px;
  padding: 3px 8px;
  border-radius: 4px;
  box-shadow: 0 0 12px rgba(0, 180, 255, 0.5);
}

.logo-title {
  display: flex;
  flex-direction: column;
}

.cn-name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
  background: linear-gradient(180deg, #ffffff 0%, #b8e2ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.en-name {
  font-size: 7.5px;
  letter-spacing: 1px;
  color: rgba(180, 220, 255, 0.7);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 242, 254, 0.08);
  border: 1px solid rgba(0, 242, 254, 0.3);
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 11px;
}

.dot-live {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00f5d4;
  box-shadow: 0 0 8px #00f5d4;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
}

.latency {
  color: #00f5d4;
  font-family: monospace;
}

.idc-tag {
  font-size: 10px;
  color: #ffb703;
  background: rgba(255, 183, 3, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 183, 3, 0.3);
}

.header-center {
  flex: 1.6;
  text-align: center;
  position: relative;
}

.title-main {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 4px;
  background: linear-gradient(180deg, #ffffff 10%, #70c4ff 60%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 25px rgba(0, 150, 255, 0.6);
}

.title-sub {
  font-size: 9px;
  letter-spacing: 3px;
  color: rgba(160, 215, 255, 0.7);
  margin-top: 1px;
}

.header-light-bar {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 2px;
  background: radial-gradient(circle, #00f2fe 0%, transparent 80%);
  box-shadow: 0 0 10px #00f2fe;
}

.header-right {
  justify-content: flex-end;
  gap: 14px;
}

.time-block {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #c9e8ff;
  background: rgba(0, 30, 80, 0.6);
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid rgba(0, 180, 255, 0.25);
}

.current-time {
  font-family: 'Courier New', Courier, monospace;
  font-size: 15px;
  font-weight: 700;
  color: #00f2fe;
  letter-spacing: 1px;
}

.fullscreen-btn {
  background: rgba(0, 102, 204, 0.3);
  border: 1px solid rgba(0, 242, 254, 0.4);
  color: #00f2fe;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}

.fullscreen-btn:hover {
  background: rgba(0, 242, 254, 0.25);
  box-shadow: 0 0 10px rgba(0, 242, 254, 0.5);
}
</style>
