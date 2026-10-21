<template>
  <div class="metrics-grid">
    <div class="metric-card" v-for="(item, index) in metricList" :key="index">
      <div class="corner-tl"></div>
      <div class="corner-br"></div>
      
      <div class="metric-icon-wrap" :style="{ color: item.color }">
        <span class="m-icon">{{ item.icon }}</span>
      </div>

      <div class="metric-info">
        <div class="metric-label">{{ item.label }}</div>
        <div class="metric-value-row">
          <span class="m-value" :style="{ color: item.color }">{{ item.formattedVal }}</span>
          <span class="m-unit">{{ item.unit }}</span>
        </div>
        <div class="metric-footer">
          <span class="trend-text" :class="item.trendUp ? 'up' : 'down'">
            {{ item.trendUp ? '▲' : '▼' }} {{ item.trendRate }}
          </span>
          <span class="sub-desc">{{ item.desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CoreMetrics',
  props: {
    metrics: {
      type: Object,
      required: true
    }
  },
  computed: {
    metricList() {
      const m = this.metrics || {};
      return [
        {
          label: '资产总规模 (Total Assets)',
          formattedVal: Number(m.totalAssets || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          unit: '亿元',
          icon: '🏦',
          color: '#00f2fe',
          trendUp: true,
          trendRate: '+8.45%',
          desc: '较年初'
        },
        {
          label: '各项存款余额 (Deposits)',
          formattedVal: Number(m.totalDeposits || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          unit: '亿元',
          icon: '📈',
          color: '#38ef7d',
          trendUp: true,
          trendRate: '+6.12%',
          desc: '稳步吸存'
        },
        {
          label: '各项贷款余额 (Loans)',
          formattedVal: Number(m.totalLoans || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          unit: '亿元',
          icon: '💼',
          color: '#ffb703',
          trendUp: true,
          trendRate: '+10.2%',
          desc: '实体让利'
        },
        {
          label: '今日交易笔数 (Txn Count)',
          formattedVal: Number(m.todayTxnCount || 0).toLocaleString('zh-CN'),
          unit: '笔',
          icon: '⚡',
          color: '#00d2ff',
          trendUp: true,
          trendRate: '+14.6%',
          desc: '核心系统'
        },
        {
          label: '实时峰值吞吐 (Peak TPS)',
          formattedVal: Number(m.tpsPeak || 0).toLocaleString('zh-CN'),
          unit: 'TPS',
          icon: '🚀',
          color: '#a78bfa',
          trendUp: true,
          trendRate: '稳定',
          desc: '分布式多活'
        },
        {
          label: 'AI实时风控拦截 (Defense)',
          formattedVal: Number(m.riskInterception || 0).toLocaleString('zh-CN'),
          unit: '次',
          icon: '🛡️',
          color: '#ff5376',
          trendUp: false,
          trendRate: '-0.3%',
          desc: '毫秒反欺诈'
        }
      ];
    }
  }
};
</script>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  width: 100%;
}

.metric-card {
  position: relative;
  background: rgba(4, 25, 65, 0.75);
  border: 1px solid rgba(0, 180, 255, 0.28);
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  backdrop-filter: blur(8px);
  box-shadow: inset 0 0 15px rgba(0, 102, 204, 0.2);
  transition: transform 0.25s, border-color 0.25s;
}

.metric-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 242, 254, 0.7);
  box-shadow: 0 4px 20px rgba(0, 150, 255, 0.3), inset 0 0 20px rgba(0, 200, 255, 0.3);
}

.metric-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: rgba(0, 50, 120, 0.4);
  border: 1px solid rgba(0, 242, 254, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.metric-info {
  flex: 1;
  overflow: hidden;
}

.metric-label {
  font-size: 11px;
  color: rgba(180, 215, 255, 0.75);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.m-value {
  font-family: 'Courier New', Courier, monospace;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.m-unit {
  font-size: 11px;
  color: rgba(200, 230, 255, 0.7);
}

.metric-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 10px;
}

.trend-text.up {
  color: #00f5d4;
}

.trend-text.down {
  color: #ff5376;
}

.sub-desc {
  color: rgba(160, 200, 250, 0.5);
}
</style>
