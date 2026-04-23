# 博客系统后端 API

基于 Node.js + Express + **MySQL** 构建的博客系统后端服务。

## 📋 功能特性

### 核心功能
- ✅ 用户认证（注册/登录/JWT）
- ✅ 文章管理（CRUD/分类/标签）
- ✅ 评论系统（支持嵌套回复）
- ✅ 分类管理
- ✅ 标签管理
- ✅ 文件上传（图片）
- ✅ 权限控制（管理员/普通用户）
- ✅ 分页查询
- ✅ 数据验证
- ✅ 安全保护（Helmet/CORS/限流）

## 🚀 快速开始

### 前置要求
- Node.js >= 14.x
- **MySQL >= 5.7 或 8.0**

### 安装步骤

1. **克隆项目**
```bash
git clone <your-repo-url>
cd my-blog-admin
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库和其他参数：
```env
NODE_ENV=development
PORT=3000

# MySQL数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=my_blog

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

4. **创建数据库**
```sql
CREATE DATABASE my_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. **初始化数据库并启动服务**
```bash
# 初始化数据库（创建表和管理员账号）
npm run init

# 开发模式
npm run dev

# 生产模式
npm start
```

服务将在 `http://localhost:3000` 启动

## 📁 项目结构

```
my-blog-admin/
├── src/
│   ├── config/           # 配置文件
│   │   └── database.js   # 数据库配置
│   ├── controllers/       # 控制器
│   │   ├── auth.controller.js
│   │   ├── article.controller.js
│   │   ├── category.controller.js
│   │   ├── tag.controller.js
│   │   ├── comment.controller.js
│   │   ├── user.controller.js
│   │   └── upload.controller.js
│   ├── models/           # 数据模型
│   │   ├── User.js
│   │   ├── Article.js
│   │   ├── Category.js
│   │   ├── Tag.js
│   │   └── Comment.js
│   ├── routes/           # 路由
│   │   ├── auth.routes.js
│   │   ├── article.routes.js
│   │   ├── category.routes.js
│   │   ├── tag.routes.js
│   │   ├── comment.routes.js
│   │   ├── user.routes.js
│   │   └── upload.routes.js
│   ├── middlewares/      # 中间件
│   │   ├── auth.middleware.js
│   │   └── validator.middleware.js
│   ├── utils/            # 工具函数
│   │   ├── jwt.js
│   │   ├── pagination.js
│   │   └── response.js
│   ├── scripts/          # 脚本文件
│   │   └── init.js       # 初始化脚本
│   └── app.js           # 应用入口
├── uploads/             # 上传文件目录
├── .env.example         # 环境变量示例
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API 接口

### 📚 API 文档

为方便前端项目接入,我们提供了完整的 API 文档和资源:

#### 🎯 快速开始
- **🚀 前端接入指南** - [`FRONTEND_INTEGRATION_GUIDE.md`](./FRONTEND_INTEGRATION_GUIDE.md) ⭐⭐⭐⭐⭐
  - 三步快速接入流程
  - 完整的项目配置指南
  - Vue/React 使用示例
  
- **📋 资源总览** - [`FRONTEND_RESOURCES_OVERVIEW.md`](./FRONTEND_RESOURCES_OVERVIEW.md)
  - 所有可用资源的汇总
  - 学习路径推荐
  - 使用技巧和常见问题

#### 📖 详细文档
- **⚡ 快速参考** - [`API_QUICK_REFERENCE.md`](./API_QUICK_REFERENCE.md) ⭐⭐⭐⭐⭐
  - 简洁的 API 速查表
  - 现成的代码模板 (Axios + Vue/React)
  - 适合日常开发查阅

- **📘 完整文档** - [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)
  - 详细的接口说明
  - 完整的请求/响应示例
  - 适合深入了解每个接口

#### 🔧 测试工具
- **Postman 集合** - [`postman_collection.json`](./postman_collection.json)
  - 可直接导入 Postman
  - 自动管理 Token
  - 方便接口测试和调试

---

### 核心接口概览

#### 认证接口 `/api/auth`
- `POST /register` - 用户注册
- `POST /login` - 用户登录
- `GET /me` - 获取当前用户信息（需要token）

#### 文章接口 `/api/articles`
- `GET /` - 获取文章列表（公开）
- `GET /:id` - 获取单篇文章（公开）
- `POST /` - 创建文章（需登录）
- `PUT /:id` - 更新文章（需登录）
- `DELETE /:id` - 删除文章（需登录）
- `GET /my` - 获取我的文章（需登录）

#### 分类接口 `/api/categories`
- `GET /` - 获取所有分类（公开）
- `GET /:id` - 获取单个分类（公开）
- `POST /` - 创建分类（需管理员）
- `PUT /:id` - 更新分类（需管理员）
- `DELETE /:id` - 删除分类（需管理员）

#### 标签接口 `/api/tags`
- `GET /` - 获取所有标签（公开）
- `GET /:id` - 获取单个标签（公开）
- `POST /` - 创建标签（需管理员）
- `PUT /:id` - 更新标签（需管理员）
- `DELETE /:id` - 删除标签（需管理员）

#### 评论接口 `/api/comments`
- `GET /article/:articleId` - 获取文章评论（公开）
- `POST /article/:articleId` - 创建评论（需登录）
- `DELETE /:id` - 删除评论（需登录）
- `GET /my` - 获取我的评论（需登录）

#### 用户接口 `/api/users`（需登录）
- `GET /` - 获取所有用户（需管理员）
- `GET /:id` - 获取单个用户
- `PUT /:id` - 更新用户信息
- `DELETE /:id` - 删除用户（需管理员）

#### 上传接口 `/api/upload`（需登录）
- `POST /single` - 单图上传
- `POST /multiple` - 多图上传（最多5张）

## 🔐 认证说明

所有需要认证的接口都需要在请求头中携带 JWT Token：

```
Authorization: Bearer <your-token>
```

## 📝 请求示例

### 创建文章
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "我的第一篇文章",
    "content": "文章内容...",
    "excerpt": "文章摘要",
    "categoryId": 1,
    "tagIds": [1, 2],
    "status": "published"
  }'
```

### 上传图片
```bash
curl -X POST http://localhost:3000/api/upload/single \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

## 🛠️ 技术栈

- **框架**: Express.js
- **数据库**: **MySQL** + **Sequelize ORM**
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcryptjs
- **验证**: express-validator
- **文件上传**: Multer
- **安全**: Helmet, CORS
- **日志**: Morgan
- **压缩**: Compression

## 📦 依赖说明

### 生产依赖
- `express` - Web框架
- **`sequelize`** - MySQL ORM
- **`mysql2`** - MySQL驱动
- `jsonwebtoken` - JWT认证
- `bcryptjs` - 密码加密
- `dotenv` - 环境变量
- `cors` - 跨域支持
- `helmet` - 安全头
- `express-rate-limit` - 请求限流
- `multer` - 文件上传
- `joi` - 数据验证
- `morgan` - HTTP日志
- `compression` - Gzip压缩
- `express-validator` - 表单验证

### 开发依赖
- `nodemon` - 热重载
- `jest` - 单元测试

## 🔧 开发建议

1. **修改JWT密钥**: 务必在生产环境中修改 `.env` 中的 `JWT_SECRET`
2. **数据库备份**: 定期备份MySQL数据
3. **错误监控**: 可集成Sentry等错误监控服务
4. **日志管理**: 生产环境建议配置日志文件轮转
5. **HTTPS**: 生产环境启用HTTPS

## 🔄 从MongoDB迁移到MySQL

本项目已从MongoDB迁移到MySQL，主要变化：

1. **ORM变更**: Mongoose → Sequelize
2. **数据模型**: Schema定义改为Model定义
3. **关联关系**: 引用改为外键关联
4. **查询语法**: MongoDB查询改为Sequelize查询
5. **配置方式**: MongoDB URI改为MySQL连接参数

## 📄 许可证

ISC
