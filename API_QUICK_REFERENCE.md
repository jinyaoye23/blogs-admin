# API 快速参考卡片

> 适用于 AI Coding 快速查阅的简洁版 API 文档

## 📍 Base URL
```
http://localhost:3000/api
```

## 🔑 Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 📚 API 速查表

### 认证 (Auth)
| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/auth/register` | 注册 | 公开 |
| POST | `/auth/login` | 登录 | 公开 |
| GET | `/auth/me` | 获取当前用户 | 登录 |

**请求体示例:**
```javascript
// 注册/登录
{ username, email, password }
{ email, password }
```

---

### 文章 (Articles)
| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/articles` | 文章列表 | 公开 |
| GET | `/articles/:id` | 文章详情 | 公开 |
| POST | `/articles` | 创建文章 | 登录 |
| PUT | `/articles/:id` | 更新文章 | 作者/管理员 |
| DELETE | `/articles/:id` | 删除文章 | 作者/管理员 |
| GET | `/articles/my` | 我的文章 | 登录 |

**查询参数:** `?page=1&limit=10&keyword=&categoryId=&tagId=&status=`

**请求体示例:**
```javascript
{
  title, content, excerpt, coverImage,
  categoryId, tagIds: [1,2,3], status
}
```

---

### 分类 (Categories)
| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/categories` | 分类列表 | 公开 |
| GET | `/categories/:id` | 分类详情 | 公开 |
| POST | `/categories` | 创建分类 | 管理员 |
| PUT | `/categories/:id` | 更新分类 | 管理员 |
| DELETE | `/categories/:id` | 删除分类 | 管理员 |

**请求体示例:**
```javascript
{ name, slug, description, sortOrder }
```

---

### 标签 (Tags)
| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/tags` | 标签列表 | 公开 |
| GET | `/tags/:id` | 标签详情 | 公开 |
| POST | `/tags` | 创建标签 | 管理员 |
| PUT | `/tags/:id` | 更新标签 | 管理员 |
| DELETE | `/tags/:id` | 删除标签 | 管理员 |

**请求体示例:**
```javascript
{ name, slug }
```

---

### 评论 (Comments)
| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/comments/article/:articleId` | 文章评论 | 公开 |
| POST | `/comments/article/:articleId` | 创建评论 | 登录 |
| DELETE | `/comments/:id` | 删除评论 | 作者/管理员 |
| GET | `/comments/my` | 我的评论 | 登录 |

**查询参数:** `?page=1&limit=10`

**请求体示例:**
```javascript
{ content, parentId: null } // parentId 为父评论ID
```

---

### 用户 (Users)
| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/users` | 用户列表 | 登录 |
| GET | `/users/:id` | 用户详情 | 登录 |
| PUT | `/users/:id` | 更新用户 | 本人/管理员 |
| DELETE | `/users/:id` | 删除用户 | 本人/管理员 |

**查询参数:** `?page=1&limit=10&keyword=`

**请求体示例:**
```javascript
{ username, email, avatar, bio }
```

---

### 上传 (Upload)
| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | `/upload/single` | 单图上传 | 登录 |
| POST | `/upload/multiple` | 多图上传 | 登录 |

**Content-Type:** `multipart/form-data`

**表单字段:**
- 单图: `image` (File)
- 多图: `images` (File[])

---

## 💻 前端调用模板

### Axios 实例配置
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// 添加 Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### API 模块封装
```javascript
import api from './axios';

// 认证
export const authAPI = {
  login: data => api.post('/auth/login', data),
  register: data => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// 文章
export const articleAPI = {
  list: params => api.get('/articles', { params }),
  detail: id => api.get(`/articles/${id}`),
  create: data => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: id => api.delete(`/articles/${id}`),
  my: params => api.get('/articles/my', { params }),
};

// 分类
export const categoryAPI = {
  list: () => api.get('/categories'),
  detail: id => api.get(`/categories/${id}`),
  create: data => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: id => api.delete(`/categories/${id}`),
};

// 标签
export const tagAPI = {
  list: () => api.get('/tags'),
  detail: id => api.get(`/tags/${id}`),
  create: data => api.post('/tags', data),
  update: (id, data) => api.put(`/tags/${id}`, data),
  delete: id => api.delete(`/tags/${id}`),
};

// 评论
export const commentAPI = {
  byArticle: (articleId, params) => 
    api.get(`/comments/article/${articleId}`, { params }),
  create: (articleId, data) => 
    api.post(`/comments/article/${articleId}`, data),
  delete: id => api.delete(`/comments/${id}`),
  my: params => api.get('/comments/my', { params }),
};

// 用户
export const userAPI = {
  list: params => api.get('/users', { params }),
  detail: id => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: id => api.delete(`/users/${id}`),
};

// 上传
export const uploadAPI = {
  single: file => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/single', formData);
  },
  multiple: files => {
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    return api.post('/upload/multiple', formData);
  },
};
```

### Vue 3 使用示例
```vue
<script setup>
import { ref, onMounted } from 'vue';
import { articleAPI } from '@/api';

const articles = ref([]);

onMounted(async () => {
  const res = await articleAPI.list({ page: 1, limit: 10 });
  articles.value = res.data;
});
</script>
```

### React 使用示例
```jsx
import { useState, useEffect } from 'react';
import { articleAPI } from '@/api';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  
  useEffect(() => {
    articleAPI.list({ page: 1, limit: 10 })
      .then(res => setArticles(res.data));
  }, []);
  
  return <ul>{articles.map(a => <li key={a.id}>{a.title}</li>)}</ul>;
}
```

---

## ⚡ 快速开始

1. **启动后端**: `npm run dev`
2. **配置代理** (可选): 在 Vite/Webpack 中配置 proxy
3. **安装 Axios**: `npm install axios`
4. **复制上面的代码**到你的前端项目
5. **开始开发**! 🎉

---

## 🔗 完整文档

详细文档请查看: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
