export const CATEGORIES = [
  '火锅',
  '烧烤',
  '日料',
  '韩餐',
  '西餐',
  '小吃',
  '咖啡',
  '甜品',
  '中餐',
  '饮品',
  '其他',
] as const;

export const SOURCE_LABELS: Record<string, string> = {
  delivery: '外卖',
  dinein: '到店',
  travel: '异地收藏',
};

export const STATUS_LABELS: Record<string, string> = {
  visited: '已吃',
  wishlist: '待吃',
};

export const DEFAULT_TAGS = [
  '聚餐',
  '热门',
  '服务好',
  '性价比高',
  '环境好',
  '排队久',
  '必吃',
  '约会',
  '一人食',
];

export const RATING_OPTIONS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;

export const CITIES = [
  '上海',
  '北京',
  '深圳',
  '广州',
  '杭州',
  '成都',
  '重庆',
  '武汉',
  '南京',
  '苏州',
] as const;
