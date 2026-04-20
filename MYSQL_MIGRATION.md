# MySQL 迁移指南

本文档详细说明博客系统从 MongoDB 迁移到 MySQL 的所有变更。

## 📋 迁移概述

### 技术栈变更
- **之前**: MongoDB + Mongoose
- **现在**: MySQL + Sequelize ORM

### 主要变更内容
1. 依赖包替换
2. 数据库连接配置
3. 数据模型定义
4. 查询语法调整
5. 关联关系处理

---

## 🔧 配置变更

### 环境变量 (.env)

**之前的 MongoDB 配置:**
```env
MONGODB_URI=mongodb://localhost:27017/my-blog
```

**现在的 MySQL 配置:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=my_blog
```

---

## 📦 依赖包变更

### 移除的包
```json
{
  "mongoose": "^8.0.3"
}
```

### 新增的包
```json
{
  "sequelize": "^6.35.2",
  "mysql2": "^3.6.5"
}
```

---

## 🗄️ 数据库模型变更

### User 模型

**Sequelize 版本特点:**
- 使用 `DataTypes` 定义字段类型
- 使用 `hooks` 替代 `pre('save')` 中间件
- 密码加密在 `beforeCreate` 和 `beforeUpdate` hook 中完成

```javascript
// Sequelize 模型结构
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // ... 其他字段
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});
```

### Article 模型

**关联关系定义:**
```javascript
// 多对一关系
Article.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Article.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// 多对多关系
Article.belongsToMany(Tag, { 
  through: 'article_tags',
  foreignKey: 'articleId',
  otherKey: 'tagId',
  as: 'tags' 
});

// 一对多关系
User.hasMany(Article, { foreignKey: 'authorId', as: 'articles' });
```

### Comment 模型

**自关联关系:**
```javascript
// 评论可以回复其他评论
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });
Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });
```

---

## 🔍 查询语法变更

### 基础查询对比

| 操作 | MongoDB/Mongoose | MySQL/Sequelize |
|------|------------------|-----------------|
| 查找单个 | `Model.findById(id)` | `Model.findByPk(id)` |
| 查找所有 | `Model.find()` | `Model.findAll()` |
| 条件查询 | `Model.findOne({email})` | `Model.findOne({where: {email}})` |
| 创建记录 | `Model.create(data)` | `Model.create(data)` |
| 更新记录 | `doc.save()` | `instance.update(data)` |
| 删除记录 | `doc.remove()` | `instance.destroy()` |

### 复杂查询示例

**分页查询:**
```javascript
// Sequelize
const { count, rows } = await Article.findAndCountAll({
  where: { status: 'published' },
  include: [
    { model: User, as: 'author' },
    { model: Category, as: 'category' }
  ],
  limit: 10,
  offset: 0
});
```

**模糊查询:**
```javascript
// Sequelize
const { Op } = require('sequelize');

Article.findAll({
  where: {
    title: { [Op.like]: '%keyword%' }
  }
});
```

**关联查询:**
```javascript
// Sequelize
Article.findAll({
  include: [{
    model: Tag,
    as: 'tags',
    through: { attributes: [] }
  }]
});
```

---

## 🔄 关联数据处理

### MongoDB 方式
```javascript
// 使用 populate
Article.find().populate('author').populate('tags')
```

### MySQL 方式
```javascript
// 使用 include
Article.findAll({
  include: [
    { model: User, as: 'author' },
    { model: Tag, as: 'tags', through: { attributes: [] } }
  ]
})
```

---

## 📊 数据库表结构

### users 表
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) DEFAULT '',
  bio TEXT,
  role ENUM('user', 'admin') DEFAULT 'user',
  status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### articles 表
```sql
CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content LONGTEXT NOT NULL,
  excerpt TEXT,
  cover_image VARCHAR(255) DEFAULT '',
  author_id INT NOT NULL,
  category_id INT,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  is_top BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### article_tags 表（多对多关联表）
```sql
CREATE TABLE article_tags (
  article_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (article_id, tag_id),
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);
```

---

## ⚠️ 注意事项

### 1. 数据类型映射

| JavaScript | Sequelize | MySQL |
|------------|-----------|-------|
| String | DataTypes.STRING | VARCHAR(255) |
| Text | DataTypes.TEXT | TEXT |
| Number | DataTypes.INTEGER | INT |
| Boolean | DataTypes.BOOLEAN | TINYINT(1) |
| Date | DataTypes.DATE | DATETIME |

### 2. 时间戳处理

Sequelize 自动处理时间戳：
- `createdAt` → `created_at`
- `updatedAt` → `updated_at`

配置方式：
```javascript
{
  timestamps: true,
  underscored: true  // 使用下划线命名
}
```

### 3. 错误处理

**Sequelize 常见错误:**
- `SequelizeUniqueConstraintError` - 唯一约束冲突
- `SequelizeValidationError` - 数据验证失败
- `SequelizeForeignKeyConstraintError` - 外键约束失败

### 4. 性能优化

**索引建议:**
```sql
-- 常用查询字段添加索引
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_created_at ON articles(created_at);
CREATE INDEX idx_comments_article_id ON comments(article_id);
```

---

## 🚀 初始化步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 配置数据库
```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE my_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 运行初始化脚本
```bash
npm run init
```

这会自动：
- 创建所有表结构
- 创建默认管理员账号
- 创建默认分类和标签

---

## 📚 参考资料

- [Sequelize 官方文档](https://sequelize.org/)
- [MySQL 文档](https://dev.mysql.com/doc/)
- [Sequelize vs Mongoose 对比](https://sequelize.org/docs/v6/other-topics/migrating-to-sequelize/)

---

## ✅ 迁移检查清单

- [ ] 安装 Sequelize 和 mysql2
- [ ] 更新 .env 配置文件
- [ ] 转换所有模型为 Sequelize 格式
- [ ] 更新所有控制器查询逻辑
- [ ] 更新数据库连接代码
- [ ] 更新初始化脚本
- [ ] 测试所有 API 接口
- [ ] 更新文档
- [ ] 性能测试和优化

---

迁移完成后，系统将完全基于 MySQL 运行，享受关系型数据库的优势！🎉
