# 博客系统 API 文档

> 本文档适用于 AI Coding 前端项目快速接入后端 API

## 📋 基础信息

- **Base URL**: `http://localhost:3000/api` (开发环境)
- **认证方式**: JWT Token (Bearer Token)
- **数据格式**: JSON
- **字符编码**: UTF-8

## 🔐 认证说明

所有需要认证的接口，请在请求头中添加：
```
Authorization: Bearer <your_jwt_token>
```

## 📦 通用响应格式

### 成功响应
```json
{
  "success": true,
  "message": "操作成功",
  "data": {}
}
```

### 失败响应
```json
{
  "success": false,
  "message": "错误信息"
}
```

### 分页响应
```json
{
  "success": true,
  "message": "获取成功",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 🚀 API 接口列表

### 1. 认证模块 (`/api/auth`)

#### 1.1 用户注册
- **URL**: `POST /api/auth/register`
- **权限**: 公开
- **请求体**:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456"
}
```
- **响应**:
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 1.2 用户登录
- **URL**: `POST /api/auth/login`
- **权限**: 公开
- **请求体**:
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```
- **响应**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "role": "user",
      "avatar": "",
      "bio": ""
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 1.3 获取当前用户信息
- **URL**: `GET /api/auth/me`
- **权限**: 需要登录
- **响应**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "avatar": "",
    "bio": "",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. 文章模块 (`/api/articles`)

#### 2.1 获取文章列表
- **URL**: `GET /api/articles`
- **权限**: 公开
- **查询参数**:
  - `page`: 页码 (默认: 1)
  - `limit`: 每页数量 (默认: 10)
  - `keyword`: 搜索关键词 (可选)
  - `categoryId`: 分类ID (可选)
  - `tagId`: 标签ID (可选)
  - `status`: 状态 (draft/published/archived, 可选)
- **响应**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "title": "文章标题",
      "slug": "article-slug",
      "content": "文章内容",
      "excerpt": "文章摘要",
      "coverImage": "https://example.com/cover.jpg",
      "authorId": 1,
      "categoryId": 1,
      "status": "published",
      "isTop": false,
      "viewCount": 100,
      "likeCount": 10,
      "commentCount": 5,
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "author": {
        "id": 1,
        "username": "作者名",
        "avatar": ""
      },
      "category": {
        "id": 1,
        "name": "分类名",
        "slug": "category-slug"
      },
      "tags": [
        {
          "id": 1,
          "name": "标签名",
          "slug": "tag-slug"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### 2.2 获取文章详情
- **URL**: `GET /api/articles/:id`
- **权限**: 公开
- **响应**: 同文章列表中的单个文章对象

#### 2.3 创建文章
- **URL**: `POST /api/articles`
- **权限**: 需要登录
- **请求体**:
```json
{
  "title": "文章标题",
  "content": "文章内容",
  "excerpt": "文章摘要",
  "coverImage": "https://example.com/cover.jpg",
  "categoryId": 1,
  "tagIds": [1, 2, 3],
  "status": "draft"
}
```
- **响应**: 返回创建的文章对象

#### 2.4 更新文章
- **URL**: `PUT /api/articles/:id`
- **权限**: 需要登录 (仅作者或管理员)
- **请求体**: 同创建文章
- **响应**: 返回更新后的文章对象

#### 2.5 删除文章
- **URL**: `DELETE /api/articles/:id`
- **权限**: 需要登录 (仅作者或管理员)
- **响应**:
```json
{
  "success": true,
  "message": "删除成功"
}
```

#### 2.6 获取我的文章
- **URL**: `GET /api/articles/my`
- **权限**: 需要登录
- **查询参数**:
  - `page`: 页码
  - `limit`: 每页数量
  - `status`: 状态筛选
- **响应**: 同文章列表

---

### 3. 分类模块 (`/api/categories`)

#### 3.1 获取分类列表
- **URL**: `GET /api/categories`
- **权限**: 公开
- **响应**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "分类名称",
      "slug": "category-slug",
      "description": "分类描述",
      "sortOrder": 1,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 3.2 获取分类详情
- **URL**: `GET /api/categories/:id`
- **权限**: 公开
- **响应**: 单个分类对象

#### 3.3 创建分类
- **URL**: `POST /api/categories`
- **权限**: 需要管理员权限
- **请求体**:
```json
{
  "name": "分类名称",
  "slug": "category-slug",
  "description": "分类描述",
  "sortOrder": 1
}
```

#### 3.4 更新分类
- **URL**: `PUT /api/categories/:id`
- **权限**: 需要管理员权限
- **请求体**: 同创建分类

#### 3.5 删除分类
- **URL**: `DELETE /api/categories/:id`
- **权限**: 需要管理员权限

---

### 4. 标签模块 (`/api/tags`)

#### 4.1 获取标签列表
- **URL**: `GET /api/tags`
- **权限**: 公开
- **响应**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "标签名称",
      "slug": "tag-slug",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 4.2 获取标签详情
- **URL**: `GET /api/tags/:id`
- **权限**: 公开

#### 4.3 创建标签
- **URL**: `POST /api/tags`
- **权限**: 需要管理员权限
- **请求体**:
```json
{
  "name": "标签名称",
  "slug": "tag-slug"
}
```

#### 4.4 更新标签
- **URL**: `PUT /api/tags/:id`
- **权限**: 需要管理员权限

#### 4.5 删除标签
- **URL**: `DELETE /api/tags/:id`
- **权限**: 需要管理员权限

---

### 5. 评论模块 (`/api/comments`)

#### 5.1 获取文章评论
- **URL**: `GET /api/comments/article/:articleId`
- **权限**: 公开
- **查询参数**:
  - `page`: 页码
  - `limit`: 每页数量
- **响应**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "content": "评论内容",
      "articleId": 1,
      "authorId": 1,
      "parentId": null,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "author": {
        "id": 1,
        "username": "用户名",
        "avatar": ""
      },
      "replies": [
        {
          "id": 2,
          "content": "回复内容",
          "author": {
            "id": 2,
            "username": "回复者",
            "avatar": ""
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### 5.2 创建评论
- **URL**: `POST /api/comments/article/:articleId`
- **权限**: 需要登录
- **请求体**:
```json
{
  "content": "评论内容",
  "parentId": null
}
```
- **说明**: `parentId` 为父评论ID，回复评论时填写，顶级评论为 null

#### 5.3 删除评论
- **URL**: `DELETE /api/comments/:id`
- **权限**: 需要登录 (仅评论作者或管理员)

#### 5.4 获取我的评论
- **URL**: `GET /api/comments/my`
- **权限**: 需要登录
- **查询参数**:
  - `page`: 页码
  - `limit`: 每页数量

---

### 6. 用户模块 (`/api/users`)

> 所有用户接口都需要登录权限

#### 6.1 获取用户列表
- **URL**: `GET /api/users`
- **权限**: 需要登录
- **查询参数**:
  - `page`: 页码
  - `limit`: 每页数量
  - `keyword`: 搜索关键词 (用户名或邮箱)
- **响应**:
```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "username": "用户名",
      "email": "user@example.com",
      "avatar": "",
      "bio": "个人简介",
      "role": "user",
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### 6.2 获取用户详情
- **URL**: `GET /api/users/:id`
- **权限**: 需要登录

#### 6.3 更新用户
- **URL**: `PUT /api/users/:id`
- **权限**: 需要登录 (仅本人或管理员)
- **请求体**:
```json
{
  "username": "新用户名",
  "email": "new@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "新的个人简介"
}
```

#### 6.4 删除用户
- **URL**: `DELETE /api/users/:id`
- **权限**: 需要登录 (仅本人或管理员)

---

### 7. 上传模块 (`/api/upload`)

#### 7.1 单图上传
- **URL**: `POST /api/upload/single`
- **权限**: 需要登录
- **Content-Type**: `multipart/form-data`
- **表单字段**: `image` (文件)
- **响应**:
```json
{
  "success": true,
  "message": "上传成功",
  "data": {
    "url": "/uploads/xxx.jpg"
  }
}
```

#### 7.2 多图上传 (最多5张)
- **URL**: `POST /api/upload/multiple`
- **权限**: 需要登录
- **Content-Type**: `multipart/form-data`
- **表单字段**: `images` (多个文件)
- **响应**:
```json
{
  "success": true,
  "message": "上传成功",
  "data": [
    {
      "url": "/uploads/xxx1.jpg"
    },
    {
      "url": "/uploads/xxx2.jpg"
    }
  ]
}
```

---

## 🛠️ 前端接入示例

### JavaScript/TypeScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// 请求拦截器 - 添加 Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 统一处理错误
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期，跳转登录
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API 调用示例
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const articleAPI = {
  getList: (params) => api.get('/articles', { params }),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
  getMyArticles: (params) => api.get('/articles/my', { params }),
};

export const categoryAPI = {
  getList: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const tagAPI = {
  getList: () => api.get('/tags'),
  getById: (id) => api.get(`/tags/${id}`),
  create: (data) => api.post('/tags', data),
  update: (id, data) => api.put(`/tags/${id}`, data),
  delete: (id) => api.delete(`/tags/${id}`),
};

export const commentAPI = {
  getByArticle: (articleId, params) => 
    api.get(`/comments/article/${articleId}`, { params }),
  create: (articleId, data) => 
    api.post(`/comments/article/${articleId}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
  getMyComments: (params) => api.get('/comments/my', { params }),
};

export const uploadAPI = {
  uploadSingle: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
```

### Vue 3 组合式 API 示例

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { articleAPI } from '@/api/article';

const articles = ref([]);
const loading = ref(false);

const loadArticles = async () => {
  loading.value = true;
  try {
    const res = await articleAPI.getList({ page: 1, limit: 10 });
    articles.value = res.data;
  } catch (error) {
    console.error('加载文章失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadArticles();
});
</script>
```

### React Hooks 示例

```jsx
import { useState, useEffect } from 'react';
import { articleAPI } from '@/api/article';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await articleAPI.getList({ page: 1, limit: 10 });
        setArticles(res.data);
      } catch (error) {
        console.error('加载文章失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div>
      {loading ? <p>加载中...</p> : (
        <ul>
          {articles.map(article => (
            <li key={article.id}>{article.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## ⚠️ 注意事项

1. **Token 存储**: 建议将 Token 存储在 `localStorage` 或 `sessionStorage` 中
2. **错误处理**: 统一处理 401 (未授权)、403 (禁止访问)、404 (未找到) 等错误
3. **图片路径**: 上传的图片返回的是相对路径，需要拼接完整 URL: `http://localhost:3000 + url`
4. **分页参数**: 所有列表接口都支持 `page` 和 `limit` 参数
5. **时间格式**: 所有时间字段都是 ISO 8601 格式
6. **CORS**: 后端已配置 CORS，前端可以直接跨域访问

---

## 🔧 开发环境配置

如果前端项目需要配置代理，可以在 `vite.config.js` 或 `webpack.config.js` 中配置：

```javascript
// Vite 配置
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});
```

这样前端可以使用相对路径 `/api/xxx` 访问后端接口。

---

## 📞 技术支持

如有问题，请查看：
- 后端日志输出
- 浏览器 Network 面板
- 确保后端服务已启动: `npm run dev`
