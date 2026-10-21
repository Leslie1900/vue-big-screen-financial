import Mock from "mockjs";

// 世界银行主要机构及中心节点
export const bankNodes = [
  {
    name: "总行(上海)",
    value: [121.4737, 31.2304],
    type: "hq",
    amount: "8,452.8亿",
    status: "正常"
  },
  {
    name: "北京分行",
    value: [116.4074, 39.9042],
    type: "branch",
    amount: "4,120.5亿",
    status: "正常"
  },
  {
    name: "深圳分行",
    value: [114.0579, 22.5431],
    type: "branch",
    amount: "3,890.2亿",
    status: "繁忙"
  },
  {
    name: "广州分行",
    value: [113.2644, 23.1291],
    type: "branch",
    amount: "3,540.6亿",
    status: "正常"
  },
  {
    name: "香港分行",
    value: [114.1655, 22.2753],
    type: "overseas",
    amount: "2,980.1亿",
    status: "正常"
  },
  {
    name: "南京分行",
    value: [118.7969, 32.0603],
    type: "branch",
    amount: "2,420.3亿",
    status: "正常"
  },
  {
    name: "杭州分行",
    value: [120.1551, 30.2741],
    type: "branch",
    amount: "2,780.0亿",
    status: "正常"
  },
  {
    name: "武汉分行",
    value: [114.3054, 30.5931],
    type: "branch",
    amount: "2,130.4亿",
    status: "正常"
  },
  {
    name: "成都分行",
    value: [104.0668, 30.5728],
    type: "branch",
    amount: "2,310.9亿",
    status: "正常"
  },
  {
    name: "重庆分行",
    value: [106.5516, 29.563],
    type: "branch",
    amount: "1,890.5亿",
    status: "正常"
  },
  {
    name: "西安分行",
    value: [108.9398, 34.3416],
    type: "branch",
    amount: "1,760.2亿",
    status: "正常"
  },
  {
    name: "沈阳分行",
    value: [123.4315, 41.8057],
    type: "branch",
    amount: "1,320.7亿",
    status: "正常"
  },
  {
    name: "青岛分行",
    value: [120.3826, 36.0671],
    type: "branch",
    amount: "1,650.3亿",
    status: "正常"
  },
  {
    name: "厦门分行",
    value: [118.0894, 24.4798],
    type: "branch",
    amount: "1,420.8亿",
    status: "正常"
  },
  {
    name: "合肥分行",
    value: [117.2272, 31.8206],
    type: "branch",
    amount: "1,290.5亿",
    status: "正常"
  },
  {
    name: "长沙分行",
    value: [112.9388, 28.2282],
    type: "branch",
    amount: "1,560.1亿",
    status: "正常"
  }
];

// 全国资金调度流向线 (汇聚到上海总行 或 总行分发)
export const bankLines = [
  {
    from: "北京分行",
    to: "总行(上海)",
    coords: [
      [116.4074, 39.9042],
      [121.4737, 31.2304]
    ],
    value: 85
  },
  {
    from: "深圳分行",
    to: "总行(上海)",
    coords: [
      [114.0579, 22.5431],
      [121.4737, 31.2304]
    ],
    value: 92
  },
  {
    from: "广州分行",
    to: "总行(上海)",
    coords: [
      [113.2644, 23.1291],
      [121.4737, 31.2304]
    ],
    value: 78
  },
  {
    from: "香港分行",
    to: "总行(上海)",
    coords: [
      [114.1655, 22.2753],
      [121.4737, 31.2304]
    ],
    value: 65
  },
  {
    from: "成都分行",
    to: "总行(上海)",
    coords: [
      [104.0668, 30.5728],
      [121.4737, 31.2304]
    ],
    value: 58
  },
  {
    from: "武汉分行",
    to: "总行(上海)",
    coords: [
      [114.3054, 30.5931],
      [121.4737, 31.2304]
    ],
    value: 72
  },
  {
    from: "西安分行",
    to: "总行(上海)",
    coords: [
      [108.9398, 34.3416],
      [121.4737, 31.2304]
    ],
    value: 45
  },
  {
    from: "杭州分行",
    to: "总行(上海)",
    coords: [
      [120.1551, 30.2741],
      [121.4737, 31.2304]
    ],
    value: 95
  },
  {
    from: "南京分行",
    to: "总行(上海)",
    coords: [
      [118.7969, 32.0603],
      [121.4737, 31.2304]
    ],
    value: 88
  },
  {
    from: "沈阳分行",
    to: "总行(上海)",
    coords: [
      [123.4315, 41.8057],
      [121.4737, 31.2304]
    ],
    value: 40
  },
  {
    from: "重庆分行",
    to: "总行(上海)",
    coords: [
      [106.5516, 29.563],
      [121.4737, 31.2304]
    ],
    value: 50
  },
  {
    from: "青岛分行",
    to: "总行(上海)",
    coords: [
      [120.3826, 36.0671],
      [121.4737, 31.2304]
    ],
    value: 62
  },
  {
    from: "长沙分行",
    to: "总行(上海)",
    coords: [
      [112.9388, 28.2282],
      [121.4737, 31.2304]
    ],
    value: 55
  }
];

// 核心指标实时数据
export const getCoreMetrics = () => {
  return {
    totalAssets: 148925.68 + (Math.random() * 2 - 1) * 5, // 资产总额 (亿元)
    totalDeposits: 89452.34 + (Math.random() * 2 - 1) * 3, // 客户存款 (亿元)
    totalLoans: 78560.12 + (Math.random() * 2 - 1) * 4, // 各项贷款 (亿元)
    todayTxnCount: 48625900 + Math.floor(Math.random() * 10000), // 今日交易笔数
    todayTxnAmount: 389240.5 + Math.random() * 50, // 今日清算金额 (万元)
    tpsPeak: 28450 + Math.floor(Math.random() * 500), // 峰值TPS
    nodeHealth: 99.998, // 系统可用率
    riskInterception: 14280 + Math.floor(Math.random() * 10) // 拦截欺诈交易
  };
};

// 24小时交易走势与TPS
export const getTrendData = () => {
  const hours = [
    "00:00",
    "02:00",
    "04:00",
    "06:00",
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
    "22:00"
  ];
  const txnCount = [
    120, 80, 60, 150, 620, 1580, 1420, 1890, 2100, 1750, 1230, 890
  ];
  const txnAmount = [
    32.5, 18.2, 12.0, 45.8, 180.4, 490.2, 410.5, 580.6, 620.8, 480.1, 350.2,
    210.4
  ];
  const tps = [
    1200, 850, 620, 1800, 8500, 24500, 21800, 28450, 29200, 23100, 16500, 9800
  ];
  return { hours, txnCount, txnAmount, tps };
};

// 业务产品结构占比
export const getProductDistribution = () => {
  return [
    { name: "普惠金融与科创贷", value: 34.2, color: "#00d2ff" },
    { name: "零售消费与信用卡", value: 26.5, color: "#00f5d4" },
    { name: "跨境投融资与贸易", value: 18.8, color: "#3a86ff" },
    { name: "财富管理与私人银行", value: 12.3, color: "#8338ec" },
    { name: "绿色金融与低碳债", value: 8.2, color: "#ffbe0b" }
  ];
};

// 渠道分流比例雷达图
export const getChannelRadar = () => {
  return {
    indicator: [
      { name: "手机银行", max: 100 },
      { name: "企业网银", max: 100 },
      { name: "开放API银行", max: 100 },
      { name: "智能柜员机VTM", max: 100 },
      { name: "线下网点", max: 100 },
      { name: "云上交银小程序", max: 100 }
    ],
    online: [98, 92, 88, 75, 45, 90],
    traditional: [60, 70, 40, 95, 92, 50]
  };
};

// 实时动态告警与安全防御流
export const getSecurityAlerts = () => {
  const branches = [
    "总行核心集群",
    "北京分行网关",
    "深圳分行清算中心",
    "香港跨境专线",
    "上海普陀IDC机房",
    "交银施罗德网关",
    "交银理财中心"
  ];
  const types = [
    "高频异常交易拦截",
    "跨境大额转账核验",
    "跨区域异地登录防御",
    "DDOS流量清洗触发",
    "反洗钱AI模型预警",
    "智能风控秒级放行"
  ];
  const levels = ["SUCCESS", "INFO", "WARN", "CRITICAL"];

  const alerts = [];
  for (let i = 0; i < 7; i++) {
    const time = Mock.Random.time("HH:mm:ss");
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = (Math.random() * 500 + 10).toFixed(2);
    const level = levels[Math.floor(Math.random() * levels.length)];
    alerts.push({
      id: Mock.Random.id(),
      time,
      branch,
      type,
      desc: `交易流水 ${Mock.Random.string(
        "number",
        8
      )} [金额 ¥${amount}万] - ${type}`,
      level
    });
  }
  return alerts;
};

// 分行综合实力TOP榜单
export const getBranchRankings = () => {
  return [
    {
      rank: 1,
      name: "上海分行",
      deposit: "14,250亿",
      loans: "12,890亿",
      growth: "+14.2%",
      rate: 98.6
    },
    {
      rank: 2,
      name: "北京分行",
      deposit: "12,800亿",
      loans: "11,450亿",
      growth: "+12.8%",
      rate: 97.4
    },
    {
      rank: 3,
      name: "广东(广州/深圳)",
      deposit: "11,920亿",
      loans: "10,780亿",
      growth: "+13.5%",
      rate: 96.9
    },
    {
      rank: 4,
      name: "江苏分行",
      deposit: "9,450亿",
      loans: "8,620亿",
      growth: "+10.4%",
      rate: 95.2
    },
    {
      rank: 5,
      name: "浙江分行",
      deposit: "9,120亿",
      loans: "8,310亿",
      growth: "+11.1%",
      rate: 94.8
    },
    {
      rank: 6,
      name: "湖北分行",
      deposit: "6,780亿",
      loans: "6,120亿",
      growth: "+9.3%",
      rate: 92.1
    },
    {
      rank: 7,
      name: "四川分行",
      deposit: "6,450亿",
      loans: "5,890亿",
      growth: "+8.9%",
      rate: 91.5
    },
    {
      rank: 8,
      name: "山东分行",
      deposit: "6,120亿",
      loans: "5,630亿",
      growth: "+8.4%",
      rate: 90.8
    },
    {
      rank: 9,
      name: "福建分行",
      deposit: "5,830亿",
      loans: "5,290亿",
      growth: "+8.1%",
      rate: 89.6
    },
    {
      rank: 10,
      name: "陕西分行",
      deposit: "5,420亿",
      loans: "4,980亿",
      growth: "+7.8%",
      rate: 88.9
    },
    {
      rank: 11,
      name: "重庆分行",
      deposit: "5,180亿",
      loans: "4,750亿",
      growth: "+7.5%",
      rate: 88.2
    },
    {
      rank: 12,
      name: "辽宁分行",
      deposit: "4,890亿",
      loans: "4,410亿",
      growth: "+6.9%",
      rate: 87.5
    }
  ];
};

// 全球外汇与行情实时数据
export const getFxRates = () => {
  return [
    {
      code: "USD/CNY",
      name: "美元/人民币",
      rate: "7.2345",
      chg: "+0.04%",
      up: true
    },
    {
      code: "EUR/CNY",
      name: "欧元/人民币",
      rate: "7.8520",
      chg: "-0.12%",
      up: false
    },
    {
      code: "HKD/CNY",
      name: "港币/人民币",
      rate: "0.9258",
      chg: "+0.02%",
      up: true
    },
    {
      code: "GBP/CNY",
      name: "英镑/人民币",
      rate: "9.3120",
      chg: "+0.18%",
      up: true
    },
    {
      code: "JPY/CNY",
      name: "日元/人民币",
      rate: "0.0482",
      chg: "-0.25%",
      up: false
    },
    {
      code: "CN10Y",
      name: "10年期国债收益率",
      rate: "2.128%",
      chg: "-1.2BP",
      up: false
    },
    {
      code: "SHIBOR-O/N",
      name: "隔夜拆借利率",
      rate: "1.452%",
      chg: "+3.5BP",
      up: true
    },
    {
      code: "GOLD-AU9999",
      name: "交银现货金",
      rate: "592.40元/g",
      chg: "+0.65%",
      up: true
    }
  ];
};

// 绿色金融与科技金融指标仪表盘
export const getGreenFinanceData = () => {
  return {
    greenCreditTotal: 8460.5, // 绿色信贷余额(亿)
    co2Reduction: 2450.8, // 减排二氧化碳(万吨)
    techCreditGrowth: 32.8, // 科创金融增速(%)
    digitalCustomerRate: 88.6 // 数字化客户渗透率(%)
  };
};
