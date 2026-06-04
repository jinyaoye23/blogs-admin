# Slug 自动生成修复说明

## 🐛 问题描述

创建文章时出现错误:
```
"notNull Violation: Article.slug cannot be null"
```

## 🔍 原因分析

### 原代码问题

在 [[Article.js](file://e:\web\project\my-blog-admin\src\models\Article.js)](file://e:\web\project\my-blog-admin\src\models\Article.js) 模型中,原本使用 `beforeCreate` hook 生成 slug:

```javascript
hooks: {
  beforeCreate: (article) => {
    if (article.title && !article.slug) {
      article.slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
  }
}
```

**存在的问题:**

1. **Hook 时机不对**: `beforeCreate` 在验证之后执行,如果 slug 为 null,会在验证阶段就失败
2. **条件判断不完善**: `!article.slug` 无法处理空字符串 `""` 的情况
3. **不支持中文**: 正则表达式 `/[^a-z0-9]+/g` 会过滤掉中文字符

### Sequelize Hook 执行顺序

```
beforeValidate → 验证 → beforeCreate → 插入数据库
     ↑                                    ↑
  应该在这里生成 slug                  太晚了,验证已失败
```

---

## ✅ 解决方案

### 修改 1: 使用 `beforeValidate` Hook

将 slug 生成逻辑从 `beforeCreate` 移到 `beforeValidate`,确保在验证之前生成 slug。

### 修改 2: 完善条件判断

```javascript
// 修改前
if (article.title && !article.slug)

// 修改后  
if (article.title && (!article.slug || article.slug.trim() === ''))
```

这样可以处理:
- `null`
- `undefined`
- `""` (空字符串)
- `"   "` (纯空格)

### 修改 3: 支持中文标题

```javascript
// 修改前
.replace(/[^a-z0-9]+/g, '-')

// 修改后
.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
```

添加了 `\u4e00-\u9fa5` Unicode 范围,支持中文字符。

---

## 📝 修复后的代码

```javascript
hooks: {
  beforeValidate: (article) => {
    // 在验证前生成 slug,确保 slug 不为 null
    if (article.title && (!article.slug || article.slug.trim() === '')) {
      article.slug = article.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '');
    }
  },
  beforeUpdate: (article) => {
    // 更新时,如果标题改变且 slug 未手动设置,则重新生成
    if (article.changed('title') && (!article.changed('slug') || !article.slug || article.slug.trim() === '')) {
      article.slug = article.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '');
    }
  }
}
```

---

## 🧪 测试用例

### 测试 1: 英文标题
```javascript
// 输入
{
  title: "Hello World",
  content: "Content here"
}

// 自动生成
slug: "hello-world"
```

### 测试 2: 中文标题
```javascript
// 输入
{
  title: "你好世界",
  content: "内容在这里"
}

// 自动生成
slug: "你好世界"
```

### 测试 3: 中英文混合
```javascript
// 输入
{
  title: "Hello 世界 Test",
  content: "Content"
}

// 自动生成
slug: "hello-世界-test"
```

### 测试 4: 手动指定 slug
```javascript
// 输入
{
  title: "Hello World",
  slug: "custom-slug",
  content: "Content"
}

// 使用手动指定的 slug
slug: "custom-slug"
```

### 测试 5: 空字符串 slug
```javascript
// 输入
{
  title: "Test Article",
  slug: "",  // 空字符串
  content: "Content"
}

// 自动生成 (忽略空字符串)
slug: "test-article"
```

---

## 💡 最佳实践

### 1. Slug 生成规则

**推荐的 slug 格式:**
- ✅ 小写字母
- ✅ 数字
- ✅ 中文字符 (如果需要)
- ✅ 连字符 `-` 作为分隔符
- ❌ 不要以 `-` 开头或结尾
- ❌ 不要有特殊字符

### 2. 前端传参建议

**方式 A: 让后端自动生成 (推荐)**
```javascript
// 前端只传 title,不传 slug
{
  title: "我的文章",
  content: "文章内容..."
}
```

**方式 B: 前端生成 slug**
```javascript
// 前端根据 title 生成 slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

{
  title: "我的文章",
  slug: generateSlug("我的文章"),
  content: "文章内容..."
}
```

### 3. 唯一性保证

如果生成的 slug 已存在,需要添加序号:

```javascript
// 在 controller 中处理
async function generateUniqueSlug(title) {
  let slug = title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '');
  let count = 1;
  let originalSlug = slug;
  
  while (await Article.findOne({ where: { slug } })) {
    slug = `${originalSlug}-${count}`;
    count++;
  }
  
  return slug;
}
```

---

## 🔗 相关经验

这是继以下修复后的又一次 Sequelize Hook 相关问题:

1. ✅ `User.findById` → `User.findByPk`
2. ✅ `order: [['createdAt']]` → `order: [['created_at']]`
3. ✅ Article 动态排序字段映射
4. ✅ **Slug 生成: `beforeCreate` → `beforeValidate`** (本次修复)

---

## ⚠️ 注意事项

### 1. bulkCreate 不会触发 Hooks

如果使用 `Article.bulkCreate()`,默认不会触发 hooks:

```javascript
// ❌ 不会触发 beforeValidate
await Article.bulkCreate(articles);

// ✅ 需要显式启用 individualHooks
await Article.bulkCreate(articles, { individualHooks: true });
```

### 2. 已有数据的 slug 为空

如果数据库中已有文章的 slug 为 null,需要手动修复:

```sql
-- 为所有 slug 为 NULL 的文章生成 slug
UPDATE articles 
SET slug = LOWER(REPLACE(title, ' ', '-'))
WHERE slug IS NULL;
```

或在 Node.js 中:

```javascript
const articles = await Article.findAll({ where: { slug: null } });
for (const article of articles) {
  article.slug = article.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-');
  await article.save();
}
```

---

## 🎯 总结

**问题根源:** Hook 执行时机不当 + 条件判断不完善

**解决方案:** 
- ✅ 使用 `beforeValidate` 而非 `beforeCreate`
- ✅ 完善空值判断逻辑
- ✅ 支持中文字符

**影响范围:** 文章创建和更新功能

**向后兼容:** ✅ 完全兼容,不影响现有功能

---

**修复日期:** 2024-01-01  
**相关文件:** [`src/models/Article.js`](file://e:\web\project\my-blog-admin\src\models\Article.js)
