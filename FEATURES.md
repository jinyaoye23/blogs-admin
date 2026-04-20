# 博客系统功能分析文档

## 📊 系统架构概览

本项目是一个基于 **Node.js + Express + MongoDB** 的完整博客系统后端应用，采用 RESTful API 设计，支持用户认证、文章管理、评论系统等核心功能。

## 🎯 核心功能模块

### 1. 用户认证模块 (Authentication)

**功能清单：**
- ✅ 用户注册（邮箱验证）
- ✅ 用户登录（JWT Token）
- ✅ 密码加密存储（bcrypt）
- ✅ Token自动过期机制
- ✅ 当前用户信息查询
- ✅ 用户角色权限控制（admin/user）

**API端点：**
```
POST   /api/auth/register    - 用户注册
POST   /api/auth/login       - 用户登录
GET    /api/auth/me          - 获取当前用户信息
```

**安全特性：**
- 密码使用bcrypt加密（salt rounds = 10）
- JWT token有效期可配置（默认7天）
- 请求携带Bearer Token进行身份验证
- 账户状态检查（active/inactive/banned）

---

### 2. 文章管理模块 (Article Management)

**功能清单：**
- ✅ 创建文章（草稿/发布）
- ✅ 编辑文章
- ✅ 删除文章
- ✅ 获取文章列表（分页）
- ✅ 获取单篇文章（详情）
- ✅ 我的文章列表
- ✅ 文章搜索（标题/内容）
- ✅ 按分类/标签筛选
- ✅ 文章状态管理（draft/published/archived）
- ✅ 置顶功能
- ✅ 阅读量统计
- ✅ 关联分类和标签

**API端点：**
```
GET    /api/articles              - 获取文章列表（公开）
GET    /api/articles/:id          - 获取单篇文章（公开）
POST   /api/articles              - 创建文章（需登录）
PUT    /api/articles/:id          - 更新文章（需登录）
DELETE /api/articles/:id          - 删除文章（需登录）
GET    /api/articles/my           - 我的文章（需登录）
```

**查询参数：**
- `page` - 页码
- `limit` - 每页数量
- `status` - 文章状态
- `category` - 分类ID
- `tag` - 标签ID
- `keyword` - 搜索关键词
- `sortBy` - 排序字段

---

### 3. 分类管理模块 (Category Management)

**功能清单：**
- ✅ 创建分类
- ✅ 编辑分类
- ✅ 删除分类（检查关联文章）
- ✅ 获取所有分类
- ✅ 获取单个分类
- ✅ 自动生成slug
- ✅ 分类颜色标识
- ✅ 排序功能

**API端点：**
```
GET    /api/categories            - 获取所有分类（公开）
GET    /api/categories/:id        - 获取单个分类（公开）
POST   /api/categories            - 创建分类（需管理员）
PUT    /api/categories/:id        - 更新分类（需管理员）
DELETE /api/categories/:id        - 删除分类（需管理员）
```

**权限要求：** 仅管理员可操作

---

### 4. 标签管理模块 (Tag Management)

**功能清单：**
- ✅ 创建标签
- ✅ 编辑标签
- ✅ 删除标签（检查关联文章）
- ✅ 获取所有标签
- ✅ 获取单个标签
- ✅ 自动生成slug

**API端点：**
```
GET    /api/tags                  - 获取所有标签（公开）
GET    /api/tags/:id              - 获取单个标签（公开）
POST   /api/tags                  - 创建标签（需管理员）
PUT    /api/tags/:id              - 更新标签（需管理员）
DELETE /api/tags/:id              - 删除标签（需管理员）
```

**权限要求：** 仅管理员可操作

---

### 5. 评论系统模块 (Comment System)

**功能清单：**
- ✅ 发表评论
- ✅ 删除评论
- ✅ 嵌套回复（支持@某人）
- ✅ 评论列表（分页）
- ✅ 评论状态管理（pending/approved/rejected/spam）
- ✅ 点赞数统计
- ✅ 我的评论列表
- ✅ 按文章获取评论

**API端点：**
```
GET    /api/comments/article/:articleId     - 获取文章评论（公开）
POST   /api/comments/article/:articleId     - 创建评论（需登录）
DELETE /api/comments/:id                    - 删除评论（需登录）
GET    /api/comments/my                     - 我的评论（需登录）
```

**特色功能：**
- 支持二级评论（回复其他评论）
- 评论审核机制
- 自动更新文章评论数

---

### 6. 文件上传模块 (File Upload)

**功能清单：**
- ✅ 单图上传
- ✅ 多图上传（最多5张）
- ✅ 文件类型限制（jpeg/jpg/png/gif/webp）
- ✅ 文件大小限制（默认5MB）
- ✅ 自动生成唯一文件名
- ✅ 静态资源访问

**API端点：**
```
POST   /api/upload/single       - 单图上传（需登录）
POST   /api/upload/multiple     - 多图上传（需登录）
```

**安全措施：**
- 文件类型白名单验证
- 文件大小限制
- 需要认证才能上传

---

### 7. 用户管理模块 (User Management)

**功能清单：**
- ✅ 获取所有用户（分页）
- ✅ 获取单个用户
- ✅ 更新用户信息
- ✅ 删除用户（仅管理员）
- ✅ 用户搜索
- ✅ 用户状态管理

**API端点：**
```
GET    /api/users               - 获取所有用户（需管理员）
GET    /api/users/:id           - 获取单个用户（需登录）
PUT    /api/users/:id           - 更新用户信息（需登录）
DELETE /api/users/:id           - 删除用户（需管理员）
```

**权限控制：**
- 用户只能修改自己的信息
- 管理员可以管理所有用户

---

## 🔐 权限系统设计

### 角色定义

1. **管理员 (admin)**
   - 所有用户权限
   - 管理分类和标签
   - 查看所有用户
   - 删除任意用户
   - 管理所有文章和评论

2. **普通用户 (user)**
   - 创建/编辑/删除自己的文章
   - 发表评论
   - 上传文件
   - 修改个人信息

### 中间件实现

```javascript
// 认证保护
protect - 验证JWT token

// 权限控制
authorize('admin') - 验证用户角色
```

---

## 📦 数据库设计

### User（用户表）
```javascript
{
  username: String (唯一, 必填),
  email: String (唯一, 必填),
  password: String (加密),
  avatar: String,
  bio: String,
  role: String (user/admin),
  status: String (active/inactive/banned),
  timestamps: true
}
```

### Article（文章表）
```javascript
{
  title: String (必填),
  slug: String (唯一),
  content: String (必填),
  excerpt: String,
  coverImage: String,
  author: ObjectId (ref: User),
  category: ObjectId (ref: Category),
  tags: [ObjectId] (ref: Tag),
  status: String (draft/published/archived),
  isTop: Boolean,
  viewCount: Number,
  likeCount: Number,
  commentCount: Number,
  publishedAt: Date,
  timestamps: true
}
```

### Category（分类表）
```javascript
{
  name: String (唯一, 必填),
  slug: String (唯一),
  description: String,
  icon: String,
  color: String,
  sortOrder: Number,
  timestamps: true
}
```

### Tag（标签表）
```javascript
{
  name: String (唯一, 必填),
  slug: String (唯一),
  description: String,
  timestamps: true
}
```

### Comment（评论表）
```javascript
{
  content: String (必填),
  article: ObjectId (ref: Article),
  author: ObjectId (ref: User),
  parent: ObjectId (ref: Comment),
  replyTo: ObjectId (ref: Comment),
  status: String (pending/approved/rejected/spam),
  likeCount: Number,
  timestamps: true
}
```

---

## 🛡️ 安全特性

1. **密码安全**
   - bcrypt加密存储
   - Salt rounds = 10
   - 明文密码永不存储

2. **认证安全**
   - JWT token机制
   - Token过期时间可配置
   - 每次请求验证token

3. **HTTP安全**
   - Helmet设置安全头
   - CORS跨域控制
   - 请求限流保护

4. **数据验证**
   - express-validator输入验证
   - 防止SQL注入（MongoDB天然防注入）
   - XSS防护

5. **文件安全**
   - 文件类型白名单
   - 文件大小限制
   - 唯一文件名生成

---

## 🚀 性能优化

1. **数据库索引**
   - 文章slug索引
   - 文章状态索引
   - 文章创建时间索引
   - 评论文章ID索引

2. **查询优化**
   - 分页查询避免大数据量
   - populate按需加载关联数据
   - 选择性返回字段

3. **响应优化**
   - Gzip压缩
   - JSON响应格式统一
   - 错误信息详细化

---

## 📝 代码规范

### 目录结构
```
src/
├── controllers/     # 业务逻辑层
├── models/         # 数据模型层
├── routes/         # 路由定义层
├── middlewares/    # 中间件
├── utils/          # 工具函数
└── scripts/        # 脚本文件
```

### 命名规范
- 文件名：kebab-case
- 变量名：camelCase
- 常量名：UPPER_SNAKE_CASE
- 模型名：PascalCase

### API响应格式
```javascript
// 成功
{
  success: true,
  message: "操作成功",
  data: {...}
}

// 失败
{
  success: false,
  message: "错误信息"
}
```

---

## 🧪 测试建议

1. **单元测试**
   - 控制器函数测试
   - 中间件逻辑测试
   - 工具函数测试

2. **集成测试**
   - API端点测试
   - 数据库操作测试
   - 认证流程测试

3. **压力测试**
   - 并发请求测试
   - 大数据量查询测试
   - 文件上传测试

---

## 🔄 扩展建议

### 可扩展功能
1. **邮件系统**
   - 注册验证邮件
   - 密码重置邮件
   - 评论通知邮件

2. **SEO优化**
   - 文章slug优化
   - sitemap生成
   - meta标签管理

3. **数据统计**
   - 访问量统计
   - 热门文章排行
   - 用户活跃度分析

4. **社交功能**
   - 文章分享
   - 点赞功能
   - 收藏功能

5. **内容增强**
   - Markdown编辑器支持
   - 代码高亮
   - 图片水印

6. **搜索增强**
   - 全文搜索引擎（Elasticsearch）
   - 高级搜索过滤
   - 搜索历史

---

## 📊 技术栈总结

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Express | ^4.18.2 |
| 数据库 | MongoDB + Mongoose | ^8.0.3 |
| 认证 | JWT | ^9.0.2 |
| 加密 | bcryptjs | ^2.4.3 |
| 验证 | express-validator | ^7.0.1 |
| 上传 | Multer | ^1.4.5 |
| 安全 | Helmet | ^7.1.0 |
| 日志 | Morgan | ^1.10.0 |
| 压缩 | Compression | ^1.7.4 |

---

## ✨ 项目亮点

1. **完整的RBAC权限系统** - 支持多角色权限控制
2. **RESTful API设计** - 规范的接口设计
3. **完善的错误处理** - 统一的错误响应格式
4. **数据验证机制** - 多层数据验证
5. **分页支持** - 所有列表接口支持分页
6. **关联查询** - MongoDB populate实现关联
7. **自动化slug生成** - 标题自动转URL友好格式
8. **安全的文件上传** - 多重验证保护
9. **环境变量配置** - 灵活的配置管理
10. **详细的文档** - 完整的API文档和示例

---

这是一个**生产级别**的博客后端应用，具备完整的功能和良好的架构设计，可以直接用于实际项目开发！🎉
