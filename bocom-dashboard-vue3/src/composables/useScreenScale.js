import { ref, onMounted, onUnmounted } from 'vue';

/**
 * 屏幕自适应微缩方案：
 * 固定 1920x1080 物理基准，取宽、高缩放比中的最小值，绝对居中
 */
export function useScreenScale(baseWidth = 1920, baseHeight = 1080) {
  const scale = ref(1);

  const calcScale = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scaleX = w / baseWidth;
    const scaleY = h / baseHeight;
    scale.value = Math.min(scaleX, scaleY);
  };

  onMounted(() => {
    calcScale();
    window.addEventListener('resize', calcScale);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', calcScale);
  });

  return {
    scale,
    baseWidth,
    baseHeight
  };
}
