<template>
  <div class="tech-card-wrapper">
    <!-- SVG 顺时针跑马微光线 -->
    <svg class="border-glow-svg" xmlns="http://www.w3.org/2000/svg">
      <rect class="border-line" x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="6" ry="6" />
    </svg>

    <!-- 四角科技标记 -->
    <div class="corner-tl"></div>
    <div class="corner-tr"></div>
    <div class="corner-bl"></div>
    <div class="corner-br"></div>

    <div class="card-inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlowCard'
};
</script>

<style scoped>
.tech-card-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(4, 20, 52, 0.72);
  border: 1px solid rgba(0, 180, 255, 0.28);
  box-shadow: inset 0 0 25px rgba(0, 102, 204, 0.18), 0 8px 32px 0 rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(10px);
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.tech-card-wrapper:hover {
  border-color: rgba(0, 242, 254, 0.65);
  box-shadow: inset 0 0 30px rgba(0, 200, 255, 0.28), 0 10px 40px rgba(0, 150, 255, 0.25);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 2;
}

/* 顺时针流光激光 */
.border-glow-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.border-line {
  fill: none;
  stroke: #00f2fe;
  stroke-width: 2px;
  stroke-dasharray: 60 400;
  stroke-dashoffset: 0;
  animation: borderRotate 8s linear infinite;
  opacity: 0.85;
  filter: drop-shadow(0 0 6px #00f2fe);
}

@keyframes borderRotate {
  0% {
    stroke-dashoffset: 0;
  }

  100% {
    stroke-dashoffset: -460;
  }
}

/* 四角高亮微切角 */
.corner-tl,
.corner-tr,
.corner-bl,
.corner-br {
  position: absolute;
  width: 10px;
  height: 10px;
  pointer-events: none;
  z-index: 3;
}

.corner-tl {
  top: 0;
  left: 0;
  border-top: 2px solid #00f2fe;
  border-left: 2px solid #00f2fe;
}

.corner-tr {
  top: 0;
  right: 0;
  border-top: 2px solid #00f2fe;
  border-right: 2px solid #00f2fe;
}

.corner-bl {
  bottom: 0;
  left: 0;
  border-bottom: 2px solid #00f2fe;
  border-left: 2px solid #00f2fe;
}

.corner-br {
  bottom: 0;
  right: 0;
  border-bottom: 2px solid #00f2fe;
  border-right: 2px solid #00f2fe;
}
</style>
