# 个人美食库应用 AI 开发指令

## 项目概述

这是一个简单的个人美食收藏与推荐应用，使用 React + TypeScript 开发。

## 开发规范

- 使用 TypeScript，确保类型安全
- 组件使用函数式组件 + Hooks
- 使用 Tailwind CSS 编写样式
- 使用 Supabase PostgreSQL 作为主数据存储
- 使用 IndexedDB 作为本地缓存
- 使用 date-fns 处理日期逻辑
- 使用 ECharts 实现统计图表展示
- 使用 Supabase Auth 实现用户认证
- 支持 PWA 基础能力（可选但建议实现）

## 代码风格

- 使用 ESLint 和 Prettier
- 组件名使用 PascalCase
- 函数名使用 camelCase
- 常量使用 UPPER_SNAKE_CASE
- 文件命名使用 kebab-case 或 PascalCase（组件）
- 逻辑拆分清晰，避免单文件过长

## 项目结构规范

- components/ 仅放可复用 UI 组件
- pages/ 仅放页面级组件
- hooks/ 仅放状态与逻辑抽象
- utils/ 仅放纯函数工具
- services/ 仅处理数据存取与 API 调用
- types/ 仅放类型定义

## 数据存储规范

- 使用 Supabase PostgreSQL 作为唯一数据源
- 使用 IndexedDB 作为本地缓存层
- 所有数据必须绑定 userId
- 所有读写必须通过 services 层封装
- 禁止在组件中直接调用 Supabase Client
- 禁止在组件中直接操作 IndexedDB

统一服务层接口：

- getStores()
- addStore()
- updateStore()
- deleteStore()
- searchStores()

## 核心数据模型约束

必须统一使用 Store 模型：

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

禁止创建：

- DeliveryStore
- DineInStore
- WishlistStore
- TravelStore

所有店铺必须统一使用 Store 模型管理。

所有统计数据必须由 Store 数据实时派生，不允许冗余存储。

## 功能实现要求

### 首页

- 必须展示收藏总数
- 必须展示已吃数量
- 必须展示待吃数量
- 必须展示今日推荐
- 必须支持快速新增店铺
- 最近新增店铺必须可滚动展示

### 店铺管理

- 支持新增店铺
- 支持编辑店铺
- 支持删除店铺
- 支持标记已吃
- 支持标记待吃
- 默认创建时间为当前时间

### 搜索功能

- 支持店名搜索
- 支持分类搜索
- 支持城市搜索
- 支持标签搜索
- 搜索结果实时更新

### 统计功能

- 必须基于 Store 实时计算
- 不允许手写统计数据存储
- 使用图表展示统计结果

统计维度：

- 收藏数量
- 已吃数量
- 待吃数量
- 分类统计
- 城市统计

### AI 推荐

- 输入必须基于用户收藏数据
- 输入必须基于用户评分数据
- 输出必须为简短自然语言
- 推荐结果必须包含推荐理由

支持：

- 今天吃什么
- 外卖推荐
- 到店推荐
- 城市推荐

## 测试要求

- 每个功能完成后手动测试
- 确保 Supabase 数据正确读写
- 测试登录状态切换
- 测试空数据状态
- 测试极端数据（大量店铺）
- 测试搜索性能
- 测试数据同步逻辑
- 测试移动端适配

## 注意事项

- 保持代码极简，不允许过度抽象
- 优先实现核心收藏流程
- 不允许引入不必要的第三方库
- 必须保证 10 秒内完成店铺记录
- 搜索响应时间必须小于 300ms
- 所有交互必须适配移动端单手操作
- UI 必须保持极简、低视觉负担风格
- 优先保证收藏、搜索、推荐三大核心流程
- 禁止实现社区、评论、社交相关功能
- MVP 阶段不实现复杂权限体系
- 所有功能围绕个人美食知识库构建
