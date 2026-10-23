<template>
  <div class="screen-header">
    <div class="header-left">
      <div class="bank-logo-wrap">
        <div class="logo-badge">WB</div>
        <div class="logo-title">
          <span class="cn-name">世界银行</span>
          <span class="en-name">WORLD BANK</span>
        </div>
      </div>
      <div class="status-indicator">
        <span class="dot-live"></span>
        <span class="status-text">实时核心主干网在线</span>
        <span class="latency">3.2ms</span>
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

<script>
export default {
  name: 'ScreenHeader',
  data() {
    return {
      currentTime: '',
      currentDate: '',
      currentWeek: '',
      timer: null,
      isFullscreen: false
    };
  },
  mounted() {
    this.updateClock();
    this.timer = setInterval(this.updateClock, 1000);
    document.addEventListener('fullscreenchange', this.onFullScreenChange);
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
    document.removeEventListener('fullscreenchange', this.onFullScreenChange);
  },
  methods: {
    updateClock() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      this.currentTime = `${hours}:${minutes}:${seconds}`;

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      this.currentDate = `${year}-${month}-${day}`;

      const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      this.currentWeek = weeks[now.getDay()];
    },
    toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    },
    onFullScreenChange() {
      this.isFullscreen = !!document.fullscreenElement;
    }
  }
};
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
  border-bottom: 1px solid rgba(0, 180, 255, 0.2);
  z-index: 10;
  flex-shrink: 0;
}

.header-left, .header-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-left {
  gap: 20px;
}

.bank-logo-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-badge {
  background: linear-gradient(135deg, #0055b8 0%, #002e7a 100%);
  border: 1px solid #00d2ff;
  color: #fff;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 1px;
  padding: 4px 10px;
  border-radius: 4px;
  box-shadow: 0 0 12px rgba(0, 180, 255, 0.5);
  animation: logo-badge-breathe 2.8s ease-in-out infinite;
}

.logo-title {
  display: flex;
  flex-direction: column;
}

.cn-name {
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 2px;
  background: linear-gradient(180deg, #ffffff 0%, #b8e2ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  transform-origin: left center;
  animation: wb-name-breathe 2.8s ease-in-out infinite;
  will-change: transform, filter;
}

.en-name {
  font-size: 8px;
  letter-spacing: 1px;
  color: rgba(180, 220, 255, 0.7);
  display: inline-block;
  transform-origin: left center;
  animation: wb-en-breathe 2.8s ease-in-out infinite;
  will-change: transform, color;
}

@keyframes wb-name-breathe {
  0%, 100% {
    filter: drop-shadow(0 0 2px rgba(0, 210, 255, 0.3)) drop-shadow(0 0 6px rgba(0, 140, 255, 0.2));
    opacity: 0.88;
    transform: scale(0.97);
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(0, 242, 254, 0.95)) drop-shadow(0 0 20px rgba(0, 180, 255, 0.8));
    opacity: 1;
    transform: scale(1.14);
  }
}

@keyframes wb-en-breathe {
  0%, 100% {
    color: rgba(180, 220, 255, 0.6);
    opacity: 0.8;
    transform: scale(0.97);
  }
  50% {
    color: #00f2fe;
    text-shadow: 0 0 8px rgba(0, 242, 254, 0.7);
    opacity: 1;
    transform: scale(1.10);
  }
}

@keyframes logo-badge-breathe {
  0%, 100% {
    box-shadow: 0 0 8px rgba(0, 180, 255, 0.4), inset 0 0 4px rgba(0, 242, 254, 0.2);
    border-color: rgba(0, 210, 255, 0.6);
  }
  50% {
    box-shadow: 0 0 18px rgba(0, 242, 254, 0.85), inset 0 0 8px rgba(0, 242, 254, 0.5);
    border-color: #00f2fe;
  }
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 242, 254, 0.08);
  border: 1px solid rgba(0, 242, 254, 0.3);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
}

.dot-live {
  width: 8px;
  height: 8px;
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
  margin-top: 2px;
}

.header-light-bar {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 2px;
  background: radial-gradient(circle, #00f2fe 0%, transparent 80%);
  box-shadow: 0 0 10px #00f2fe;
}

.header-right {
  justify-content: flex-end;
  gap: 16px;
}

.time-block {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #c9e8ff;
  background: rgba(0, 30, 80, 0.6);
  padding: 6px 14px;
  border-radius: 4px;
  border: 1px solid rgba(0, 180, 255, 0.25);
}

.current-time {
  font-family: 'Courier New', Courier, monospace;
  font-size: 16px;
  font-weight: 700;
  color: #00f2fe;
  letter-spacing: 1px;
}

.fullscreen-btn {
  background: rgba(0, 102, 204, 0.3);
  border: 1px solid rgba(0, 242, 254, 0.4);
  color: #00f2fe;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.fullscreen-btn:hover {
  background: rgba(0, 242, 254, 0.25);
  box-shadow: 0 0 10px rgba(0, 242, 254, 0.5);
}
</style>
