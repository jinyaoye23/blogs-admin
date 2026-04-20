# 快速开始指南

## 📦 安装步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 配置MySQL数据库

确保MySQL服务正在运行，然后创建数据库：

```sql
CREATE DATABASE my_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 配置环境变量
已创建 `.env` 文件，请根据实际情况修改数据库配置：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=my_blog
```

### 4. 初始化数据库
运行初始化脚本，自动创建表结构、管理员账号、默认分类和标签：

```bash
npm run init
```

**默认管理员账号：**
- 用户名: `admin`
- 邮箱: `admin@example.com`
- 密码: `admin123`

⚠️ **重要**: 首次登录后请立即修改默认密码！

### 5. 启动服务

开发模式（带热重载）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

服务将在 `http://localhost:3000` 启动

## 🧪 测试API

### 使用curl快速测试

#### 1. 用户注册
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'
```

#### 2. 用户登录
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

保存返回的token用于后续请求。

#### 3. 获取文章列表
```bash
curl http://localhost:3000/api/articles
```

#### 4. 创建文章（需要token）
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "第一篇文章",
    "content": "这是文章内容",
    "excerpt": "摘要",
    "status": "published"
  }'
```

## 📝 使用Postman/Insomnia

导入或参考 `API_TEST.md` 文件中的测试用例。

## 🔍 项目结构说明

```
my-blog-admin/
├── src/
│   ├── config/          # 配置文件
│   │   └── database.js  # MySQL数据库配置
│   ├── controllers/      # 控制器层（业务逻辑）
│   ├── models/          # 数据模型（Sequelize Models）
│   ├── routes/          # 路由定义（API端点）
│   ├── middlewares/     # 中间件（认证、验证）
│   ├── utils/           # 工具函数
│   ├── scripts/         # 脚本文件
│   └── app.js          # 应用入口
├── .env                # 环境配置
├── package.json        # 项目依赖
└── README.md           # 详细文档
```

## 🎯 核心功能

### ✅ 已完成功能

1. **用户系统**
   - 用户注册/登录
   - JWT认证
   - 角色权限控制（管理员/普通用户）

2. **文章管理**
   - 创建/编辑/删除文章
   - 文章状态（草稿/发布/归档）
   - 分页查询
   - 关键词搜索
   - 按分类/标签筛选

3. **分类和标签**
   - CRUD操作
   - 自动生成slug
   - 管理员专属管理

4. **评论系统**
   - 嵌套回复
   - 评论状态管理
   - 分页加载

5. **文件上传**
   - 单图上传
   - 多图上传（最多5张）
   - 文件类型和大小限制

6. **安全特性**
   - 密码加密存储
   - JWT token验证
   - CORS跨域支持
   - Helmet安全头
   - 请求日志

## 🛠️ 常见问题

### MySQL连接失败
确保MySQL服务正在运行：
```bash
# Windows
net start MySQL

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### 端口被占用
修改 `.env` 文件中的 `PORT` 配置。

### 忘记管理员密码
重新运行初始化脚本会检查并创建管理员：
```bash
npm run init
```

或者直接在数据库中修改用户密码。

### 数据库表不存在
运行 `npm run init` 会自动创建所有表。

## 📚 下一步

1. **查看完整文档**: 阅读 `README.md` 了解所有API详情
2. **测试接口**: 使用 `API_TEST.md` 中的示例测试所有接口
3. **自定义配置**: 根据需求调整 `.env` 配置
4. **开发扩展**: 基于现有架构添加新功能

## 🚀 部署建议

- 使用PM2进行进程管理
- 配置Nginx反向代理
- 启用HTTPS
- 定期备份MySQL数据
- 配置错误监控（如Sentry）

祝你开发愉快！🎉
