# 金融大数据全景可视化大屏项目集合 (Financial Bigscreen Dashboard)

本项目是一套面向金融行业（银行、金融科技、数字风控等）打造的高保真、高交互、现代化科技感的大屏数据可视化解决方案。项目同时提供了 **Vue 2.7** 与 **Vue 3.5** 两个完整实现版本，帮助开发者在不同的技术栈和存量/新项目场景下快速复用与落地。

---

## 🌟 项目亮点与设计规范

- 🌌 **金融科技视觉风格**：采用标志性深海科技蓝底色（`#003b8e`、`#050b1d`），搭配科技青光蓝（`#00f2fe`）、金融质感金（`#ffb703`）与安全预警色；结合四角切角、流光边框、网格背景与粒子星空动效。
- 📐 **自适应缩放机制 (Auto-Scale)**：基于 **1920 × 1080** 基准设计尺寸，通过动态计算屏幕宽高比进行等比居中缩放（`transform: scale(...)`），完美适配 1080P、2K、4K、拼接大屏及各类长宽比笔记本。
- 📊 **深度集成的 ECharts 5 视觉组件**：包含全国多级拓扑飞线地图、双轴趋势图、嵌套环形图、雷达效能图、双弧形仪表盘等。
- ⚡ **极致开发体验**：两个版本均基于 **Vite 5** 高性能构建，秒级热重载与快速打包。

---

## 🆚 两个版本技术栈与特性对比

| 对比维度 | Vue 2 版本 (`bocom-dashboard`) | Vue 3 版本 (`bocom-dashboard-vue3`) |
| :--- | :--- | :--- |
| **Vue 核心** | Vue 2.7.16 (支持 Composition API) | Vue 3.5.13 (原生 Composition API + `<script setup>`) |
| **构建工具** | Vite 5.4 + `@vitejs/plugin-vue2` | Vite 5.4 + `@vitejs/plugin-vue` |
| **图表引擎** | ECharts 5.5.1 | ECharts 5.5.1 |
| **数据模拟** | Mock.js 1.1.0 | Mock.js 1.1.0 |
| **数字动效** | CSS3 滚动翻牌器 | CountUp.js 2.8.0 结合专用组件封装 |
| **动态背景** | CSS 渐变光晕与科技网格覆盖层 | Canvas 粒子星空微粒流光画布 (`StarfieldCanvas`) + CSS 光晕 |
| **响应式缩放** | 组件内部生命周期自适应监听与 scale 计算 | 独立抽离的可复用 Composable (`useScreenScale.js`) |
| **适用场景** | 存量 Vue 2 项目迁移、兼容老旧生态 | 全新项目立项、探索 Vue 3 新特性与组合式编程 |

---

## 🧩 核心功能板块详解

无论是 Vue 2 还是 Vue 3 版本，均具备以下完整的金融大屏业务模块：

1. **顶部运营监控与导航条 (`ScreenHeader`)**
   - 品牌标识、主干专线实时网络状态与毫秒级延迟监测；
   - 动态翻牌时钟（年-月-日、星期、时:分:秒实时跳动）；
   - 一键全屏切换与退出功能。

2. **全球汇率与行情实时跑马灯 (`FxRateTicker`)**
   - 实时轮播离岸人民币、美元指数、欧元、港币等核心汇率与涨跌幅。

3. **核心资产与关键运营指标带 (`CoreMetrics`)**
   - 汇聚资产总规模、各项存款余额、各项贷款余额、今日交易笔数、实时峰值 TPS、AI 实时风控拦截次数；
   - 支持动态随机微调刷新与同比/环比走势标记。

4. **中央主图：全国资金清算拓扑网络飞线图 (`ChinaFlyMap`)**
   - 基于中国地理 GeoJSON 高保真地图底图；
   - 覆盖全国 16+ 核心分支机构及上海总行清算中心；
   - 炫酷飞线流动动画、多层水波纹涟漪扩散动效、悬浮交互气泡 Tooltip。

5. **24 小时交易吞吐与 TPS 趋势走势 (`TxnTrendChart`)**
   - 交易金额柱状图与实时峰值 TPS 折线图双轴联动；
   - 支持图例交互与时段峰值高亮。

6. **信贷资产与金融产品业务结构环形图 (`ProductDistribution`)**
   - 展示普惠金融、零售消费、跨境投融资、财富管理、绿色金融五大业务生态比例。

7. **重点一级分行业务综合实力排行榜 (`BranchRankings`)**
   - 金银铜前三名专属勋章特效、动态进度条达成率与实时业绩排名。

8. **全渠道金融服务协同画像雷达图 (`ChannelRadar`)**
   - 评估手机银行、企业网银、开放 API、VTM 自助、线下网点、云端服务的多维协同效能。

9. **绿色金融与科创引擎仪表盘 (`GreenFinanceGauge`)**
   - 双弧形渐变仪表（科创金融增速、线上业务渗透率）+ 绿色信贷额度与减排数据卡。

10. **智慧风控中台实时防御事件流 (`SecurityAlertStream`)**
    - 动态模拟 AI 反洗钱、跨国异地登录、高频交易拦截的流水滚动播报（自动追加与淡出动效）。

---

## 📁 目录结构

```
bigscreen-projects/
├── .gitignore                     # 统一根目录 Git 忽略文件
├── README.md                      # 项目整体说明文档
├── bocom-dashboard/               # 【版本 1】Vue 2.7 大屏系统工程
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.js
│   │   ├── App.vue
│   │   ├── assets/                # 样式与静态资源
│   │   ├── components/            # 大屏各业务板块组件
│   │   └── mock/                  # 模拟数据与 GeoJSON 地图数据
│   └── README.md
│
└── bocom-dashboard-vue3/          # 【版本 2】Vue 3.5 大屏系统工程
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── src/
    │   ├── main.js
    │   ├── App.vue
    │   ├── assets/                # 全局样式与科技质感 CSS
    │   ├── composables/           # 组合式函数 (useScreenScale 缩放控制)
    │   ├── components/            # Vue 3 核心业务组件与 StarfieldCanvas
    │   └── mock/                  # 模拟数据与中国地图数据
    └── .gitignore
```

---

## 🚀 快速启动指南

### 环境要求
- **Node.js**: `>= 16.0.0` (推荐 18.x 或 20.x LTS)
- **包管理器**: `npm`、`pnpm` 或 `yarn`

---

### 1. 启动 Vue 2 版本 (`bocom-dashboard`)

```bash
# 进入 Vue 2 项目目录
cd bocom-dashboard

# 安装依赖
npm install

# 启动本地开发服务 (默认端口 http://localhost:5173)
npm run dev

# 生产环境打包
npm run build
```

---

### 2. 启动 Vue 3 版本 (`bocom-dashboard-vue3`)

```bash
# 进入 Vue 3 项目目录
cd bocom-dashboard-vue3

# 安装依赖
npm install

# 启动本地开发服务
npm run dev

# 生产环境打包
npm run build
```

---

## 🖥️ 屏幕自适应机制说明

本套大屏采用业界成熟的 **CSS Transform Scale** 居中等比缩放方案：

```javascript
// 计算缩放比例与居中偏移 (以 useScreenScale 为例)
const baseWidth = 1920;
const baseHeight = 1080;

const currentWidth = window.innerWidth;
const currentHeight = window.innerHeight;

// 保证内容全部可见的最小缩放比
const scale = Math.min(currentWidth / baseWidth, currentHeight / baseHeight);
```

配合外层 `overflow: hidden` 与居中绝对定位，能够确保不同物理分辨率和宽高比例的展示设备下，文字、图表和动效均不会拉伸变形。
