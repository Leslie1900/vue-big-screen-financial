<template>
  <div class="tech-card green-container">
    <div class="corner-tl"></div>
    <div class="corner-tr"></div>
    <div class="corner-bl"></div>
    <div class="corner-br"></div>

    <div class="card-title">
      <div class="title-left">
        <span class="icon-bar"></span>
        <span>绿色低碳与科技金融双轮引擎</span>
      </div>
      <span class="sub-tag">ESG 卓越表现</span>
    </div>

    <div class="green-content">
      <!-- 两个环形仪表盘 -->
      <div class="gauges-row">
        <div class="gauge-card" ref="gauge1Ref"></div>
        <div class="gauge-card" ref="gauge2Ref"></div>
      </div>

      <!-- 底部指标数值卡 -->
      <div class="sub-metrics-row">
        <div class="sub-m-item">
          <div class="s-title">🌱 绿色信贷余额</div>
          <div class="s-val text-glow">¥{{ greenData.greenCreditTotal }} <span class="s-unit">亿</span></div>
          <div class="s-sub">年增长 +24.6%</div>
        </div>
        <div class="sub-m-item">
          <div class="s-title">🌍 减排二氧化碳当量</div>
          <div class="s-val text-gold-glow">{{ greenData.co2Reduction }} <span class="s-unit">万吨</span></div>
          <div class="s-sub">绿色债券承销领跑</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { getGreenFinanceData } from '../mock/index.js';

export default {
  name: 'GreenFinanceGauge',
  data() {
    return {
      chart1: null,
      chart2: null,
      greenData: {},
      resizeHandler: null
    };
  },
  mounted() {
    this.greenData = getGreenFinanceData();
    this.$nextTick(() => {
      this.initGauges();
    });
    this.resizeHandler = () => {
      if (this.chart1) this.chart1.resize();
      if (this.chart2) this.chart2.resize();
    };
    window.addEventListener('resize', this.resizeHandler);
  },
  beforeDestroy() {
    if (this.chart1) this.chart1.dispose();
    if (this.chart2) this.chart2.dispose();
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  },
  methods: {
    initGauges() {
      const el1 = this.$refs.gauge1Ref;
      const el2 = this.$refs.gauge2Ref;
      if (!el1 || !el2) return;

      this.chart1 = echarts.init(el1);
      this.chart2 = echarts.init(el2);

      // 仪表盘1: 科创金融增速
      const option1 = {
        backgroundColor: 'transparent',
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 50,
            splitNumber: 5,
            radius: '110%',
            center: ['50%', '75%'],
            itemStyle: {
              color: '#00f2fe',
              shadowColor: 'rgba(0, 242, 254, 0.5)',
              shadowBlur: 10
            },
            progress: {
              show: true,
              roundCap: true,
              width: 8
            },
            pointer: {
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 10,
              offsetCenter: [0, '-50%'],
              itemStyle: {
                color: '#fff'
              }
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 8,
                color: [[1, 'rgba(0, 180, 255, 0.15)']]
              }
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            title: {
              offsetCenter: [0, '25%'],
              fontSize: 11,
              color: 'rgba(180, 220, 255, 0.8)'
            },
            detail: {
              fontSize: 16,
              offsetCenter: [0, '-10%'],
              valueAnimation: true,
              formatter: '{value}%',
              color: '#00f2fe',
              fontFamily: 'monospace',
              fontWeight: 'bold'
            },
            data: [
              {
                value: this.greenData.techCreditGrowth,
                name: '科创金融同比增速'
              }
            ]
          }
        ]
      };

      // 仪表盘2: 数字化业务渗透率
      const option2 = {
        backgroundColor: 'transparent',
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            splitNumber: 5,
            radius: '110%',
            center: ['50%', '75%'],
            itemStyle: {
              color: '#38ef7d',
              shadowColor: 'rgba(56, 239, 125, 0.5)',
              shadowBlur: 10
            },
            progress: {
              show: true,
              roundCap: true,
              width: 8
            },
            pointer: {
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 10,
              offsetCenter: [0, '-50%'],
              itemStyle: {
                color: '#fff'
              }
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 8,
                color: [[1, 'rgba(0, 180, 255, 0.15)']]
              }
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            title: {
              offsetCenter: [0, '25%'],
              fontSize: 11,
              color: 'rgba(180, 220, 255, 0.8)'
            },
            detail: {
              fontSize: 16,
              offsetCenter: [0, '-10%'],
              valueAnimation: true,
              formatter: '{value}%',
              color: '#38ef7d',
              fontFamily: 'monospace',
              fontWeight: 'bold'
            },
            data: [
              {
                value: this.greenData.digitalCustomerRate,
                name: '线上离柜业务率'
              }
            ]
          }
        ]
      };

      this.chart1.setOption(option1);
      this.chart2.setOption(option2);
    }
  }
};
</script>

<style scoped>
.green-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.green-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 4px 10px;
}

.gauges-row {
  display: flex;
  height: 105px;
}

.gauge-card {
  flex: 1;
  height: 100%;
}

.sub-metrics-row {
  flex: 1;
  display: flex;
  gap: 10px;
  align-items: center;
  border-top: 1px dashed rgba(0, 180, 255, 0.2);
  padding-top: 4px;
}

.sub-m-item {
  flex: 1;
  background: rgba(0, 40, 100, 0.3);
  border-radius: 4px;
  padding: 6px 10px;
  border: 1px solid rgba(0, 180, 255, 0.15);
}

.s-title {
  font-size: 10px;
  color: rgba(180, 215, 255, 0.7);
}

.s-val {
  font-family: monospace;
  font-size: 15px;
  font-weight: 800;
  color: #00f2fe;
  margin: 2px 0;
}

.s-unit {
  font-size: 10px;
  color: #a0cfff;
}

.s-sub {
  font-size: 9px;
  color: #38ef7d;
}
</style>
