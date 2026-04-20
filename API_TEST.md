# API 测试示例
# 可以使用 Postman、Insomnia 或 curl 进行测试

## 基础URL
BASE_URL=http://localhost:3000/api

## 1. 用户认证

### 注册
POST {{BASE_URL}}/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456"
}

### 登录
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}

### 获取当前用户信息
GET {{BASE_URL}}/auth/me
Authorization: Bearer YOUR_TOKEN_HERE

## 2. 文章管理

### 获取文章列表（公开）
GET {{BASE_URL}}/articles?page=1&limit=10&status=published

### 获取单篇文章（公开）
GET {{BASE_URL}}/articles/:id

### 创建文章（需登录）
POST {{BASE_URL}}/articles
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "我的第一篇文章",
  "content": "这是文章内容...",
  "excerpt": "文章摘要",
  "category": "CATEGORY_ID",
  "tags": ["TAG_ID_1", "TAG_ID_2"],
  "status": "published"
}

### 更新文章（需登录）
PUT {{BASE_URL}}/articles/:id
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "更新后的标题",
  "content": "更新后的内容"
}

### 删除文章（需登录）
DELETE {{BASE_URL}}/articles/:id
Authorization: Bearer YOUR_TOKEN_HERE

### 获取我的文章（需登录）
GET {{BASE_URL}}/articles/my
Authorization: Bearer YOUR_TOKEN_HERE

## 3. 分类管理

### 获取所有分类（公开）
GET {{BASE_URL}}/categories

### 创建分类（需管理员）
POST {{BASE_URL}}/categories
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "name": "技术",
  "description": "技术类文章",
  "color": "#007bff"
}

### 更新分类（需管理员）
PUT {{BASE_URL}}/categories/:id
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "name": "技术开发",
  "description": "技术开发相关"
}

### 删除分类（需管理员）
DELETE {{BASE_URL}}/categories/:id
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE

## 4. 标签管理

### 获取所有标签（公开）
GET {{BASE_URL}}/tags

### 创建标签（需管理员）
POST {{BASE_URL}}/tags
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "name": "Node.js",
  "description": "Node.js相关"
}

## 5. 评论管理

### 获取文章评论（公开）
GET {{BASE_URL}}/comments/article/:articleId?page=1&limit=10

### 创建评论（需登录）
POST {{BASE_URL}}/comments/article/:articleId
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "content": "这是一条评论"
}

### 回复评论（需登录）
POST {{BASE_URL}}/comments/article/:articleId
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "content": "这是回复内容",
  "parentId": "PARENT_COMMENT_ID",
  "replyToId": "REPLY_TO_COMMENT_ID"
}

### 删除评论（需登录）
DELETE {{BASE_URL}}/comments/:id
Authorization: Bearer YOUR_TOKEN_HERE

### 获取我的评论（需登录）
GET {{BASE_URL}}/comments/my
Authorization: Bearer YOUR_TOKEN_HERE

## 6. 用户管理

### 获取所有用户（需管理员）
GET {{BASE_URL}}/users?page=1&limit=10
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE

### 获取单个用户
GET {{BASE_URL}}/users/:id
Authorization: Bearer YOUR_TOKEN_HERE

### 更新用户信息
PUT {{BASE_URL}}/users/:id
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "avatar": "https://example.com/avatar.jpg",
  "bio": "个人简介"
}

### 删除用户（需管理员）
DELETE {{BASE_URL}}/users/:id
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE

## 7. 文件上传

### 单图上传（需登录）
POST {{BASE_URL}}/upload/single
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

image: [file]

### 多图上传（需登录，最多5张）
POST {{BASE_URL}}/upload/multiple
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

images: [file1, file2, file3]

## 常见响应格式

### 成功响应
{
  "success": true,
  "message": "操作成功",
  "data": { ... }
}

### 错误响应
{
  "success": false,
  "message": "错误信息"
}

### 分页响应
{
  "success": true,
  "message": "获取成功",
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
