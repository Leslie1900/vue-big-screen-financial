<template>
  <div class="tech-card ranking-container">
    <div class="corner-tl"></div>
    <div class="corner-tr"></div>
    <div class="corner-bl"></div>
    <div class="corner-br"></div>

    <div class="card-title">
      <div class="title-left">
        <span class="icon-bar"></span>
        <span>重点一级分行业务规模综合排名榜</span>
      </div>
      <div class="status-indicator">
        <span class="live-dot"></span>
        <span class="sub-tag">自动巡航播报</span>
      </div>
    </div>

    <div class="rank-list" @mouseenter="pauseScroll" @mouseleave="resumeScroll">
      <!-- 固定表头 -->
      <div class="rank-header">
        <span class="col-rank">排名</span>
        <span class="col-name">分支机构</span>
        <span class="col-amt">存款规模</span>
        <span class="col-growth">同比增幅</span>
        <span class="col-bar">目标达成率</span>
      </div>

      <!-- 纵向无缝滚动视口 -->
      <div class="scroll-viewport" ref="viewportRef">
        <div class="scroll-track" :style="trackStyle">
          <div 
            v-for="(item, index) in displayList" 
            :key="`${item.rank}-${index}`" 
            class="rank-item"
          >
            <span :class="['rank-badge', `top-${item.rank}`]">{{ item.rank }}</span>
            <span class="branch-name" :title="item.name">{{ item.name }}</span>
            <span class="branch-amt">{{ item.deposit }}</span>
            <span class="branch-growth">{{ item.growth }}</span>
            <div class="progress-wrap">
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" :style="{ width: `${item.rate}%` }"></div>
              </div>
              <span class="rate-num">{{ item.rate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBranchRankings } from '../mock/index.js';

export default {
  name: 'BranchRankings',
  data() {
    return {
      rankingList: [],
      scrollTop: 0,
      isPaused: false,
      animFrameId: null,
      rowHeight: 36
    };
  },
  computed: {
    // 复制双份以实现完全平滑无缝首尾相接滚动
    displayList() {
      return [...this.rankingList, ...this.rankingList];
    },
    trackStyle() {
      return {
        transform: `translateY(-${this.scrollTop}px)`
      };
    }
  },
  mounted() {
    this.rankingList = getBranchRankings();
    this.startScroll();
  },
  beforeDestroy() {
    this.stopScroll();
  },
  methods: {
    pauseScroll() {
      this.isPaused = true;
    },
    resumeScroll() {
      this.isPaused = false;
    },
    startScroll() {
      const scrollStep = () => {
        if (!this.isPaused && this.$refs.viewportRef) {
          const singleSetHeight = this.rankingList.length * this.rowHeight;
          if (singleSetHeight > 0) {
            this.scrollTop += 0.55; // 匀速平缓微步滚动
            if (this.scrollTop >= singleSetHeight) {
              this.scrollTop = 0; // 重置到第一组开头，实现无缝无跳动循环
            }
          }
        }
        this.animFrameId = requestAnimationFrame(scrollStep);
      };
      this.animFrameId = requestAnimationFrame(scrollStep);
    },
    stopScroll() {
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
    }
  }
};
</script>

<style scoped>
.ranking-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #38ef7d;
  box-shadow: 0 0 8px #38ef7d;
  animation: pulse-dot 1.5s infinite alternate;
}

@keyframes pulse-dot {
  0% { transform: scale(0.85); opacity: 0.6; }
  100% { transform: scale(1.2); opacity: 1; }
}

.sub-tag {
  font-size: 10px;
  color: rgba(180, 220, 255, 0.8);
  background: rgba(0, 102, 204, 0.25);
  padding: 2px 7px;
  border-radius: 10px;
  border: 1px solid rgba(0, 242, 254, 0.25);
}

.rank-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 4px 12px 6px;
  overflow: hidden;
  min-height: 0;
}

.rank-header {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: rgba(160, 205, 255, 0.65);
  padding: 6px 0;
  border-bottom: 1px dashed rgba(0, 180, 255, 0.2);
  flex-shrink: 0;
}

.scroll-viewport {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
  margin-top: 2px;
  mask-image: linear-gradient(180deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
}

.scroll-track {
  will-change: transform;
}

.rank-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  height: 36px;
  box-sizing: border-box;
  padding: 0 2px;
  border-bottom: 1px solid rgba(0, 160, 255, 0.05);
  transition: background 0.2s, transform 0.2s;
}

.rank-item:hover {
  background: rgba(0, 242, 254, 0.08);
}

.col-rank, .rank-badge {
  width: 26px;
  text-align: center;
  flex-shrink: 0;
}

.rank-badge {
  font-family: monospace;
  font-weight: 700;
  font-size: 11.5px;
  display: inline-block;
  width: 19px;
  height: 19px;
  line-height: 19px;
  border-radius: 50%;
  background: rgba(0, 80, 180, 0.35);
  color: #7ec7ff;
}

.rank-badge.top-1 {
  background: #ffb703;
  color: #000;
  box-shadow: 0 0 10px #ffb703;
}
.rank-badge.top-2 {
  background: #00f2fe;
  color: #000;
  box-shadow: 0 0 10px #00f2fe;
}
.rank-badge.top-3 {
  background: #38ef7d;
  color: #000;
  box-shadow: 0 0 10px #38ef7d;
}

.col-name, .branch-name {
  width: 82px;
  padding-left: 6px;
  color: #e2f1ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
}

.col-amt, .branch-amt {
  width: 72px;
  text-align: right;
  font-family: monospace;
  color: #00f2fe;
  font-weight: 600;
  flex-shrink: 0;
}

.col-growth, .branch-growth {
  width: 56px;
  text-align: right;
  color: #38ef7d;
  font-size: 11px;
  flex-shrink: 0;
}

.col-bar, .progress-wrap {
  flex: 1;
  padding-left: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
}

.progress-bar-bg {
  flex: 1;
  height: 6px;
  background: rgba(0, 50, 120, 0.45);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #0066cc 0%, #00f2fe 100%);
  border-radius: 3px;
  box-shadow: 0 0 6px rgba(0, 242, 254, 0.5);
  transition: width 0.6s ease;
}

.rate-num {
  font-size: 10px;
  color: rgba(200, 230, 255, 0.85);
  width: 33px;
  text-align: right;
  font-family: monospace;
  flex-shrink: 0;
}
</style>
