# 前端项目快速接入指南

> 🎯 本文档帮助 AI Coding 前端项目快速接入博客后端 API

## 📦 三步快速接入

### 第一步: 获取 API 文档

我们为你准备了三种形式的文档,根据你的需求选择:

1. **📖 完整文档** - [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)
   - 详细的接口说明
   - 完整的请求/响应示例
   - 适合详细查阅

2. **⚡ 快速参考** - [`API_QUICK_REFERENCE.md`](./API_QUICK_REFERENCE.md) ⭐推荐
   - 简洁的 API 速查表
   - 现成的代码模板 (Axios + Vue/React)
   - 适合快速开发

3. **🔧 Postman 集合** - [`postman_collection.json`](./postman_collection.json)
   - 可直接导入 Postman
   - 方便接口测试和调试

### 第二步: 配置前端项目

#### 1. 安装依赖
```bash
npm install axios
```

#### 2. 创建 API 配置文件

在项目根目录或 `src` 目录下创建 `api` 文件夹:

```
src/
├── api/
│   ├── axios.js      # Axios 实例配置
│   ├── auth.js       # 认证相关接口
│   ├── article.js    # 文章相关接口
│   ├── category.js   # 分类相关接口
│   ├── tag.js        # 标签相关接口
│   ├── comment.js    # 评论相关接口
│   ├── user.js       # 用户相关接口
│   └── upload.js     # 上传相关接口
```

#### 3. 复制代码模板

从 [`API_QUICK_REFERENCE.md`](./API_QUICK_REFERENCE.md) 中复制以下代码:

- **Axios 实例配置** → `api/axios.js`
- **API 模块封装** → 分别复制到对应的文件
- **使用示例** → 参考 Vue/React 示例代码

### 第三步: 开始开发

#### 基础使用示例

```javascript
// 1. 登录获取 Token
import { authAPI } from '@/api/auth';

const login = async () => {
  const res = await authAPI.login({
    email: 'admin@example.com',
    password: '123456'
  });
  
  // 保存 Token
  localStorage.setItem('token', res.data.token);
};

// 2. 获取文章列表
import { articleAPI } from '@/api/article';

const articles = await articleAPI.list({ page: 1, limit: 10 });
console.log(articles.data);

// 3. 创建文章
import { articleAPI } from '@/api/article';

const newArticle = await articleAPI.create({
  title: '我的文章',
  content: '文章内容...',
  categoryId: 1,
  tagIds: [1, 2],
  status: 'published'
});
```

---

## 🔑 核心概念

### 1. Base URL
```javascript
http://localhost:3000/api
```

### 2. 认证方式
所有需要认证的接口都需要在请求头中添加 Token:
```javascript
Authorization: Bearer <your_token>
```

我们的 Axios 配置已经自动处理了这个逻辑。

### 3. 响应格式

**成功响应:**
```json
{
  "success": true,
  "message": "操作成功",
  "data": {}
}
```

**失败响应:**
```json
{
  "success": false,
  "message": "错误信息"
}
```

**分页响应:**
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

## 📋 API 模块清单

| 模块 | 文件 | 主要功能 |
|------|------|----------|
| 认证 | `auth.js` | 注册、登录、获取当前用户 |
| 文章 | `article.js` | 文章的 CRUD、列表查询 |
| 分类 | `category.js` | 分类的 CRUD |
| 标签 | `tag.js` | 标签的 CRUD |
| 评论 | `comment.js` | 评论的 CRUD、嵌套回复 |
| 用户 | `user.js` | 用户信息管理 |
| 上传 | `upload.js` | 单图/多图上传 |

---

## 🛠️ 常用场景示例

### 场景 1: 用户登录流程

```javascript
import { authAPI } from '@/api/auth';

async function handleLogin(email, password) {
  try {
    const res = await authAPI.login({ email, password });
    
    // 保存用户信息和 Token
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    
    // 跳转到首页
    router.push('/');
  } catch (error) {
    console.error('登录失败:', error.response?.data?.message);
  }
}
```

### 场景 2: 文章列表页面

```javascript
import { ref, onMounted } from 'vue';
import { articleAPI } from '@/api/article';

export default {
  setup() {
    const articles = ref([]);
    const loading = ref(false);
    const pagination = ref({});

    const loadArticles = async (page = 1) => {
      loading.value = true;
      try {
        const res = await articleAPI.list({ page, limit: 10 });
        articles.value = res.data;
        pagination.value = res.pagination;
      } catch (error) {
        console.error('加载失败:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => loadArticles());

    return { articles, loading, pagination, loadArticles };
  }
};
```

### 场景 3: 图片上传

```javascript
import { uploadAPI } from '@/api/upload';

async function handleImageUpload(file) {
  try {
    const res = await uploadAPI.single(file);
    const imageUrl = res.data.url;
    
    // 将图片URL保存到表单
    form.coverImage = imageUrl;
  } catch (error) {
    console.error('上传失败:', error);
  }
}
```

### 场景 4: 创建文章

```javascript
import { articleAPI } from '@/api/article';

async function createArticle(formData) {
  try {
    const res = await articleAPI.create({
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      coverImage: formData.coverImage,
      categoryId: formData.categoryId,
      tagIds: formData.tagIds,
      status: formData.status
    });
    
    // 跳转到文章详情页
    router.push(`/articles/${res.data.id}`);
  } catch (error) {
    console.error('创建失败:', error.response?.data?.message);
  }
}
```

---

## ⚙️ 环境配置

### 开发环境

如果前端项目和后端项目在不同端口运行,需要配置代理:

#### Vite 配置 (`vite.config.js`)
```javascript
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

#### Webpack 配置 (`vue.config.js` 或 `webpack.config.js`)
```javascript
module.exports = {
  devServer: {
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
};
```

配置后,前端可以使用相对路径访问:
```javascript
baseURL: '/api'  // 而不是 'http://localhost:3000/api'
```

---

## 🐛 常见问题

### Q1: 401 Unauthorized 错误
**原因**: Token 过期或无效  
**解决**: 
- 检查 Token 是否正确保存
- 重新登录获取新 Token
- 确认请求头中添加了 `Authorization: Bearer <token>`

### Q2: CORS 跨域错误
**原因**: 前后端端口不同  
**解决**: 
- 后端已配置 CORS,确保后端正常运行
- 或者配置前端代理 (见上方环境配置)

### Q3: 图片无法显示
**原因**: 图片路径是相对路径  
**解决**: 
```javascript
// 拼接完整 URL
const fullUrl = 'http://localhost:3000' + imageUrl;
```

### Q4: 如何知道哪些接口需要登录?
**查看文档**: 
- 完整文档中标注了每个接口的权限要求
- 快速参考表中也有"权限"列

---

## 📞 获取帮助

1. **查看完整文档**: [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)
2. **使用 Postman 测试**: 导入 `postman_collection.json`
3. **检查后端日志**: 启动后端时查看控制台输出
4. **浏览器 Network 面板**: 查看请求和响应详情

---

## ✅ 检查清单

在开始开发前,请确认:

- [ ] 后端服务已启动 (`npm run dev`)
- [ ] 可以访问 `http://localhost:3000/health` 返回 `{"status":"ok"}`
- [ ] 已安装 `axios` 依赖
- [ ] 已复制 API 配置代码到项目
- [ ] 已配置代理 (如需要)
- [ ] 已测试登录接口可以正常工作

---

## 🎉 开始你的开发之旅!

现在你已经准备好了,可以开始开发前端项目了!

**推荐工作流程:**
1. 先阅读 [`API_QUICK_REFERENCE.md`](./API_QUICK_REFERENCE.md) 了解 API 概览
2. 复制代码模板到你的项目
3. 根据需求查看详细文档
4. 使用 Postman 测试不确定的接口

祝你开发顺利! 🚀
