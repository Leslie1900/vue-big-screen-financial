<template>
  <div class="tech-card alerts-container">
    <div class="corner-tl"></div>
    <div class="corner-tr"></div>
    <div class="corner-bl"></div>
    <div class="corner-br"></div>

    <div class="card-title">
      <div class="title-left">
        <span class="icon-bar"></span>
        <span>智慧风控中台实时防御与安全事件流</span>
      </div>
      <div class="radar-scan-badge">
        <span class="scan-dot"></span>
        <span>AI神经元防御中</span>
      </div>
    </div>

    <div class="stream-box">
      <transition-group name="list" tag="div" class="stream-list">
        <div 
          v-for="alert in alertList" 
          :key="alert.id" 
          class="alert-card-item"
        >
          <div class="alert-top">
            <span class="alert-time">{{ alert.time }}</span>
            <span class="alert-branch">{{ alert.branch }}</span>
            <span :class="['alert-badge', alert.level.toLowerCase()]">{{ alert.level }}</span>
          </div>
          <div class="alert-desc">{{ alert.desc }}</div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { getSecurityAlerts } from '../mock/index.js';
import Mock from 'mockjs';

export default {
  name: 'SecurityAlertStream',
  data() {
    return {
      alertList: [],
      timer: null
    };
  },
  mounted() {
    this.alertList = getSecurityAlerts();
    // 动态模拟持续推送新安全预警事件
    this.timer = setInterval(() => {
      this.addNewAlert();
    }, 3800);
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    addNewAlert() {
      const branches = ['总行核心集群', '深圳清算网关', '北京同城容灾中心', '香港跨境专线', '上海普陀IDC机房'];
      const types = ['高频欺诈交易阻断', '异地可疑大额提款核验', '跨国专线SSL重协商防护', '智能反洗钱特征命中', '零信任凭证秒级刷新'];
      const levels = ['SUCCESS', 'WARN', 'INFO', 'CRITICAL'];

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const type = types[Math.floor(Math.random() * types.length)];
      const branch = branches[Math.floor(Math.random() * branches.length)];
      const amount = (Math.random() * 800 + 20).toFixed(2);
      const level = levels[Math.floor(Math.random() * levels.length)];

      const newAlert = {
        id: Mock.Random.id(),
        time: timeStr,
        branch,
        type,
        desc: `流水 #${Mock.Random.string('number', 8)} [¥${amount}万] - ${type}`,
        level
      };

      this.alertList.unshift(newAlert);
      if (this.alertList.length > 6) {
        this.alertList.pop();
      }
    }
  }
};
</script>

<style scoped>
.alerts-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.radar-scan-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #00f5d4;
  background: rgba(0, 245, 212, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid rgba(0, 245, 212, 0.3);
}

.scan-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00f5d4;
  box-shadow: 0 0 6px #00f5d4;
  animation: blink 1s infinite alternate;
}

@keyframes blink {
  from { opacity: 0.3; }
  to { opacity: 1; }
}

.stream-box {
  flex: 1;
  padding: 8px 12px;
  overflow: hidden;
  position: relative;
}

.stream-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
  height: 100%;
}

.alert-card-item {
  background: rgba(0, 40, 100, 0.3);
  border: 1px solid rgba(0, 180, 255, 0.18);
  border-left: 3px solid #00f2fe;
  padding: 6px 10px;
  border-radius: 4px;
  height: 48px;
  box-sizing: border-box;
  flex-shrink: 0;
  transition: all 0.4s ease;
}

.alert-card-item:hover {
  background: rgba(0, 70, 160, 0.35);
  border-left-color: #ffb703;
}

.alert-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
  font-size: 11px;
}

.alert-time {
  font-family: monospace;
  color: rgba(180, 220, 255, 0.7);
}

.alert-branch {
  color: #8ed0ff;
  font-weight: 500;
}

.alert-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 2px;
}

.alert-badge.success {
  background: rgba(0, 245, 212, 0.2);
  color: #00f5d4;
  border: 1px solid rgba(0, 245, 212, 0.4);
}

.alert-badge.info {
  background: rgba(0, 210, 255, 0.2);
  color: #00d2ff;
  border: 1px solid rgba(0, 210, 255, 0.4);
}

.alert-badge.warn {
  background: rgba(255, 183, 3, 0.2);
  color: #ffb703;
  border: 1px solid rgba(255, 183, 3, 0.4);
}

.alert-badge.critical {
  background: rgba(255, 83, 118, 0.25);
  color: #ff5376;
  border: 1px solid rgba(255, 83, 118, 0.5);
}

.alert-desc {
  font-size: 11px;
  color: rgba(220, 240, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 动效：使用 move 特性平滑位移，避免突兀跳动 */
.list-enter-active, .list-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.list-move {
  transition: transform 0.4s ease;
}
.list-enter {
  opacity: 0;
  transform: translateY(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-active {
  position: absolute;
  width: calc(100% - 24px);
}
</style>
