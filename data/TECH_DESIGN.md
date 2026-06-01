# 个人美食库应用 TECH_DESIGN.md

## 技术栈

- 前端：React + TypeScript + Next.js（支持 SEO、PWA、多端访问）
- 样式：Tailwind CSS（快速构建极简卡片式界面）
- 状态管理：React Context + useReducer（MVP 阶段保持轻量）
- 数据存储：Supabase PostgreSQL（云端同步、多设备访问）
- 本地缓存：IndexedDB（离线访问、提升体验）
- 地图能力：高德地图 API（位置展示、距离计算）
- 图表：ECharts（用于收藏统计分析）
- 日期处理：date-fns
- AI 能力：OpenAI API / Claude API（用于美食推荐）
- 用户认证：Supabase Auth
- 部署：Vercel（前端） + Supabase（数据库）

---

## 项目结构

src/

components/ # 通用组件（卡片、按钮、搜索框、店铺卡片）

pages/ # 页面级组件（首页、店铺页、推荐页、统计页）

hooks/ # 自定义 Hooks（useStores, useRecommendation, useSearch）

store/ # 全局状态管理（Context + reducer）

services/ # API 服务（Supabase、AI、地图服务）

utils/ # 工具函数（距离计算、评分处理、日期处理）

types/ # TypeScript 类型定义

constants/ # 常量（分类、标签、默认配置）

assets/ # 静态资源

---

## 数据模型

### User（用户）

用于用户登录与数据隔离。

- id: string
- email: string
- nickname: string
- createdAt: string

---

### Store（店铺）

用于统一表示所有收藏店铺。

- id: string
- userId: string
- name: string
- category: string
- city: string
- address?: string
- rating?: number
- averageCost?: number
- note?: string
- tags?: string[]
- source: 'delivery' | 'dinein' | 'travel'
- status: 'visited' | 'wishlist'
- latitude?: number
- longitude?: number
- createdAt: string
- updatedAt: string

---

### Recommendation（推荐记录）

用于记录 AI 推荐结果。

- id: string
- userId: string
- type: 'delivery' | 'dinein' | 'city'
- content: string
- createdAt: string

---

### CityStats（城市统计）

用于城市维度分析。

- city: string
- totalStores: number
- visitedStores: number
- wishlistStores: number
- averageRating: number

---

### CategoryStats（分类统计）

用于分类维度分析。

- category: string
- totalStores: number
- averageRating: number
- averageCost: number

---

## 关键技术点

### 1. 云端数据同步设计（核心）

使用 Supabase PostgreSQL 作为主存储。

表设计：

- users
- stores
- recommendations

所有数据统一通过 service 层封装：

- getStores()
- addStore()
- updateStore()
- deleteStore()
- searchStores()

保证未来切换数据库时业务层无需修改。

---

### 2. 店铺统一模型设计（核心逻辑）

采用统一 Store 模型。

替代：

- 外卖表
- 到店表
- 待吃表
- 其他城市表

通过字段区分：

- source
- status

避免数据重复。

例如：

同一家店既可属于：

- delivery
- dinein

无需创建多条记录。

---

### 3. 云端 + 本地缓存架构

采用：

- Supabase 作为主数据源
- IndexedDB 作为缓存层

实现：

首次加载：

云端 → 本地缓存

后续访问：

缓存优先 → 后台同步

目标：

- 提升加载速度
- 支持离线浏览
- 降低数据库请求

---

### 4. 搜索系统设计（核心体验）

支持实时搜索：

- 店名
- 分类
- 城市
- 标签

实现方式：

- 前端输入防抖
- Supabase Full Text Search

搜索响应目标：

- ≤ 300ms

---

### 5. AI 推荐系统

支持：

- 今天吃什么
- 外卖推荐
- 到店推荐
- 城市推荐

输入数据：

- 用户收藏记录
- 用户评分记录
- 最近访问记录
- 当前城市

Prompt 结构：

- 收藏偏好分析
- 高评分店铺
- 最近未访问店铺
- 当前条件

输出：

- 推荐店铺
- 推荐原因
- 推荐场景

---

### 6. 地图能力实现

使用高德地图 API。

功能：

- 店铺定位
- 距离计算
- 附近收藏展示
- 导航跳转

实现：

店铺保存时记录：

- latitude
- longitude

附近推荐时计算：

- 用户位置
- 店铺距离

---

### 7. 收藏统计实现

统计维度：

- 收藏数量
- 已吃数量
- 待吃数量
- 分类分布
- 城市分布

数据来源：

Store 数据聚合计算。

优化：

- 后端 SQL 聚合
- 减少前端计算压力

---

### 8. 用户认证体系

使用 Supabase Auth。

支持：

- 邮箱登录
- Google 登录

数据隔离：

所有数据绑定：

- userId

保证用户数据独立。

---

### 9. PWA 支持（移动端关键）

实现：

- manifest.json
- service worker
- IndexedDB 缓存

目标体验：

- 可安装到桌面
- 类似原生 App
- 支持离线查看收藏

---

### 10. 性能优化策略

- 首页推荐结果缓存
- 搜索结果缓存
- React.memo 优化列表渲染
- useMemo 缓存统计结果
- 图片懒加载（V2）

目标：

- 首屏 < 2 秒
- 搜索响应 < 300ms

---

### 11. AI 推荐缓存机制

避免重复消耗 Token。

缓存规则：

- 同一天同条件推荐结果缓存
- 用户主动刷新重新生成

缓存时间：

- 24 小时

减少 AI 成本。

---

### 12. 扩展能力预留（V2）

为未来功能预留结构：

- 图片上传 → Storage 模块
- 店铺自动识别 → OCR 模块
- 地图模式 → GIS 模块
- 微信小程序 → API 复用
- App 版本 → React Native
- 美食年度报告 → Report 模块
- 社交分享 → Share 模块
- 多人收藏夹 → Collaboration 模块
