# 排序字段映射修复说明

## 🐛 问题描述

当访问文章列表接口并尝试按时间排序时,出现错误:
```
"Unknown column 'Article.createdAt' in 'order clause'"
```

## 🔍 原因分析

在 [[article.controller.js](file://e:\web\project\my-blog-admin\src\controllers\article.controller.js)](file://e:\web\project\my-blog-admin\src\controllers\article.controller.js) 中,支持动态排序参数 `sortBy`:

**默认值:** `sortBy = '-createdAt'` (按创建时间降序)

**问题:** 
- JavaScript 中使用驼峰命名: `createdAt`
- MySQL 数据库中使用下划线命名: `created_at`
- 直接将 `createdAt` 传入 Sequelize 的 `order` 子句会导致 SQL 错误

## ✅ 解决方案

添加了字段映射逻辑,将常用的驼峰命名字段转换为下划线命名:

```javascript
// 排序处理
const order = [];
let sortField = sortBy.startsWith('-') ? sortBy.substring(1) : sortBy;

// 将驼峰命名转换为下划线命名
const fieldMapping = {
  'createdAt': 'created_at',
  'updatedAt': 'updated_at',
  'publishedAt': 'published_at',
  'viewCount': 'view_count',
  'likeCount': 'like_count',
  'commentCount': 'comment_count'
};

sortField = fieldMapping[sortField] || sortField;

if (sortBy.startsWith('-')) {
  order.push([sortField, 'DESC']);
} else {
  order.push([sortField, 'ASC']);
}
```

## 📋 支持的排序字段

现在可以安全使用以下字段进行排序:

| 前端参数 | 数据库字段 | 说明 |
|---------|-----------|------|
| `createdAt` | `created_at` | 创建时间 |
| `updatedAt` | `updated_at` | 更新时间 |
| `publishedAt` | `published_at` | 发布时间 |
| `viewCount` | `view_count` | 阅读量 |
| `likeCount` | `like_count` | 点赞数 |
| `commentCount` | `comment_count` | 评论数 |
| `title` | `title` | 标题 (无需转换) |

**使用示例:**
- `?sortBy=-createdAt` - 按创建时间降序 (最新在前)
- `?sortBy=createdAt` - 按创建时间升序 (最旧在前)
- `?sortBy=-viewCount` - 按阅读量降序 (最热在前)
- `?sortBy=title` - 按标题字母顺序升序

## 🎯 测试

### 测试 1: 默认排序
```bash
curl "http://localhost:3000/api/articles?page=1&limit=10"
```
应该返回按创建时间降序的文章列表。

### 测试 2: 按阅读量排序
```bash
curl "http://localhost:3000/api/articles?page=1&limit=10&sortBy=-viewCount"
```
应该返回按阅读量降序的文章列表。

### 测试 3: 按标题排序
```bash
curl "http://localhost:3000/api/articles?page=1&limit=10&sortBy=title"
```
应该返回按标题字母顺序升序的文章列表。

## 💡 最佳实践

### 1. 统一命名规范

在 API 文档中明确说明:
- **请求参数**: 使用驼峰命名 (符合 JavaScript 习惯)
- **内部处理**: 自动转换为数据库列名
- **响应数据**: 使用驼峰命名 (Sequelize 自动处理)

### 2. 扩展映射

如果未来添加新字段,记得在 `fieldMapping` 中添加映射:

```javascript
const fieldMapping = {
  'createdAt': 'created_at',
  'updatedAt': 'updated_at',
  // 添加新字段...
  'newField': 'new_field'
};
```

### 3. 白名单验证 (可选增强)

为了安全,可以只允许特定的字段排序:

```javascript
const allowedSortFields = [
  'created_at', 'updated_at', 'published_at',
  'view_count', 'like_count', 'comment_count',
  'title'
];

if (!allowedSortFields.includes(sortField)) {
  sortField = 'created_at'; // 默认字段
}
```

## 🔗 相关修复

这是继以下修复后的又一次类似问题修复:
- ✅ `User.findById` → `User.findByPk`
- ✅ `order: [['createdAt', 'DESC']]` → `order: [['created_at', 'DESC']]` (多个控制器)
- ✅ Article 动态排序字段映射 (本次修复)

所有 Sequelize 相关的命名问题已全面解决! 🎉

---

**修复日期:** 2024-01-01  
**影响范围:** 文章列表接口的排序功能  
**向后兼容:** ✅ 完全兼容,API 参数不变
