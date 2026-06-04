# Nuxt.js 博客前端集成指南

本文档说明如何在 Nuxt.js 项目中调用博客后端提供的公开 API 接口。

## 📋 目录

- [API 基础信息](#api-基础信息)
- [公开接口列表](#公开接口列表)
- [Nuxt.js 项目配置](#nuxtjs-项目配置)
- [使用示例](#使用示例)
- [常见问题](#常见问题)

---

## API 基础信息

### 基础 URL

```
开发环境: http://localhost:3000/api
生产环境: https://your-domain.com/api
```

### 响应格式

所有 API 返回统一的 JSON 格式：

**成功响应：**
```json
{
  "success": true,
  "message": "获取成功",
  "data": { ... }
}
```

**分页响应：**
```json
{
  "success": true,
  "message": "获取成功",
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

**错误响应：**
```json
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误"
}
```

---

## 公开接口列表

### 1. 文章相关接口

#### 获取文章列表

```
GET /api/articles
```

**查询参数：**

| 参数 | 类型 | 必填 | 说明 | 默认值 |
|------|------|------|------|--------|
| page | number | 否 | 页码 | 1 |
| limit | number | 否 | 每页数量 | 10 |
| category | number | 否 | 分类ID | - |
| tag | number | 否 | 标签ID | - |
| keyword | string | 否 | 搜索关键词 | - |
| sortBy | string | 否 | 排序字段（-表示降序） | -createdAt |

**排序字段支持：**
- `createdAt` / `-createdAt` - 创建时间
- `publishedAt` / `-publishedAt` - 发布时间
- `viewCount` / `-viewCount` - 阅读量
- `likeCount` / `-likeCount` - 点赞数
- `commentCount` / `-commentCount` - 评论数

**示例请求：**
```bash
# 获取第1页，每页10条
GET /api/articles?page=1&limit=10

# 按分类筛选
GET /api/articles?category=1

# 按标签筛选
GET /api/articles?tag=2

# 关键词搜索
GET /api/articles?keyword=Vue

# 按阅读量降序
GET /api/articles?sortBy=-viewCount

# 组合条件
GET /api/articles?page=1&limit=20&category=1&sortBy=-publishedAt
```

**响应示例：**
```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "title": "Vue 3 入门教程",
      "slug": "vue-3-intro",
      "excerpt": "Vue 3 的新特性介绍...",
      "content": "文章内容...",
      "coverImage": "/uploads/cover.jpg",
      "status": "published",
      "viewCount": 128,
      "likeCount": 45,
      "commentCount": 12,
      "createdAt": "2024-01-15T08:00:00.000Z",
      "updatedAt": "2024-01-15T08:00:00.000Z",
      "publishedAt": "2024-01-15T08:00:00.000Z",
      "author": {
        "id": 1,
        "username": "admin",
        "avatar": "/uploads/avatar.jpg"
      },
      "category": {
        "id": 1,
        "name": "前端开发",
        "slug": "frontend"
      },
      "tags": [
        {
          "id": 1,
          "name": "Vue",
          "slug": "vue"
        },
        {
          "id": 2,
          "name": "JavaScript",
          "slug": "javascript"
        }
      ]
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

#### 获取单篇文章详情

```
GET /api/articles/:id
```

**路径参数：**
- `id` - 文章ID

**示例请求：**
```bash
GET /api/articles/1
```

**响应示例：**
```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "id": 1,
    "title": "Vue 3 入门教程",
    "slug": "vue-3-intro",
    "excerpt": "Vue 3 的新特性介绍...",
    "content": "<p>完整的文章内容...</p>",
    "coverImage": "/uploads/cover.jpg",
    "status": "published",
    "viewCount": 129,
    "likeCount": 45,
    "commentCount": 12,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z",
    "publishedAt": "2024-01-15T08:00:00.000Z",
    "author": {
      "id": 1,
      "username": "admin",
      "avatar": "/uploads/avatar.jpg",
      "bio": "全栈开发者"
    },
    "category": {
      "id": 1,
      "name": "前端开发",
      "slug": "frontend"
    },
    "tags": [
      {
        "id": 1,
        "name": "Vue",
        "slug": "vue"
      }
    ]
  }
}
```

**注意：** 每次访问会自动增加阅读量（viewCount +1）

---

### 2. 分类相关接口

#### 获取分类列表

```
GET /api/categories
```

**示例请求：**
```bash
GET /api/categories
```

**响应示例：**
```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "前端开发",
      "slug": "frontend",
      "description": "前端技术相关文章",
      "articleCount": 25,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "后端开发",
      "slug": "backend",
      "description": "后端技术相关文章",
      "articleCount": 18,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 获取单个分类

```
GET /api/categories/:id
```

---

### 3. 标签相关接口

#### 获取标签列表

```
GET /api/tags
```

**示例请求：**
```bash
GET /api/tags
```

**响应示例：**
```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "Vue",
      "slug": "vue",
      "articleCount": 15,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "React",
      "slug": "react",
      "articleCount": 12,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 获取单个标签

```
GET /api/tags/:id
```

---

### 4. 评论相关接口

#### 获取文章评论列表

```
GET /api/comments/article/:articleId
```

**路径参数：**
- `articleId` - 文章ID

**示例请求：**
```bash
GET /api/comments/article/1
```

**响应示例：**
```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "content": "写得很好！",
      "parentId": null,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "user": {
        "id": 2,
        "username": "user1",
        "avatar": "/uploads/user1.jpg"
      },
      "replies": [
        {
          "id": 2,
          "content": "谢谢支持！",
          "parentId": 1,
          "createdAt": "2024-01-15T11:00:00.000Z",
          "user": {
            "id": 1,
            "username": "admin",
            "avatar": "/uploads/avatar.jpg"
          }
        }
      ]
    }
  ]
}
```

---

## Nuxt.js 项目配置

### 1. 环境变量配置

在项目根目录创建 `.env` 文件：

```env
# API 基础URL
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 2. Nuxt Config 配置

在 `nuxt.config.ts` 中配置：

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'
    }
  }
})
```

### 3. 创建 API 工具类

创建 `composables/useApi.ts`：

```typescript
export const useApi = () => {
  const config = useRuntimeConfig()
  
  const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${config.public.apiBase}${endpoint}`
    
    try {
      const response = await $fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      })
      
      return {
        data: response.data,
        pagination: response.pagination,
        error: null
      }
    } catch (err: any) {
      return {
        data: null,
        pagination: null,
        error: err.message || '请求失败'
      }
    }
  }
  
  return {
    fetchApi
  }
}
```

### 4. 创建文章 Composable

创建 `composables/useArticles.ts`：

```typescript
export const useArticles = () => {
  const { fetchApi } = useApi()
  
  // 获取文章列表
  const getArticles = async (params: {
    page?: number
    limit?: number
    category?: number
    tag?: number
    keyword?: string
    sortBy?: string
  } = {}) => {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.category) queryParams.append('category', params.category.toString())
    if (params.tag) queryParams.append('tag', params.tag.toString())
    if (params.keyword) queryParams.append('keyword', params.keyword)
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    
    const queryString = queryParams.toString()
    const endpoint = `/articles${queryString ? '?' + queryString : ''}`
    
    return await fetchApi(endpoint)
  }
  
  // 获取文章详情
  const getArticleById = async (id: number) => {
    return await fetchApi(`/articles/${id}`)
  }
  
  return {
    getArticles,
    getArticleById
  }
}
```

### 5. 创建分类 Composable

创建 `composables/useCategories.ts`：

```typescript
export const useCategories = () => {
  const { fetchApi } = useApi()
  
  const getCategories = async () => {
    return await fetchApi('/categories')
  }
  
  return {
    getCategories
  }
}
```

### 6. 创建标签 Composable

创建 `composables/useTags.ts`：

```typescript
export const useTags = () => {
  const { fetchApi } = useApi()
  
  const getTags = async () => {
    return await fetchApi('/tags')
  }
  
  return {
    getTags
  }
}
```

---

## 使用示例

### 示例 1: 首页文章列表

`pages/index.vue`

```vue
<template>
  <div class="home">
    <h1>最新文章</h1>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <!-- 文章列表 -->
    <div v-else class="article-list">
      <article 
        v-for="article in articles" 
        :key="article.id"
        class="article-card"
      >
        <NuxtLink :to="`/articles/${article.slug || article.id}`">
          <img 
            v-if="article.coverImage" 
            :src="article.coverImage" 
            :alt="article.title"
          />
          <h2>{{ article.title }}</h2>
          <p>{{ article.excerpt }}</p>
          
          <div class="meta">
            <span class="author">{{ article.author.username }}</span>
            <span class="date">{{ formatDate(article.publishedAt) }}</span>
            <span class="views">👁 {{ article.viewCount }}</span>
          </div>
          
          <div class="tags">
            <span 
              v-for="tag in article.tags" 
              :key="tag.id"
              class="tag"
            >
              {{ tag.name }}
            </span>
          </div>
        </NuxtLink>
      </article>
      
      <!-- 分页 -->
      <div v-if="pagination" class="pagination">
        <button 
          @click="loadPage(pagination.page - 1)"
          :disabled="pagination.page <= 1"
        >
          上一页
        </button>
        <span>第 {{ pagination.page }} / {{ pagination.pages }} 页</span>
        <button 
          @click="loadPage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.pages"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getArticles } = useArticles()
const articles = ref([])
const pagination = ref(null)
const loading = ref(true)
const error = ref(null)

// 加载文章
const loadArticles = async (page = 1) => {
  loading.value = true
  error.value = null
  
  const { data, pagination: pag, error: err } = await getArticles({
    page,
    limit: 10,
    sortBy: '-publishedAt'
  })
  
  if (err) {
    error.value = err
  } else {
    articles.value = data
    pagination.value = pag
  }
  
  loading.value = false
}

// 切换页面
const loadPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.pages) {
    loadArticles(page)
    window.scrollTo(0, 0)
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 服务端渲染时获取数据
await loadArticles()
</script>

<style scoped>
.article-list {
  display: grid;
  gap: 20px;
}

.article-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  transition: box-shadow 0.3s;
}

.article-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.meta {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 14px;
  margin-top: 10px;
}

.tags {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

### 示例 2: 文章详情页

`pages/articles/[slug].vue`

```vue
<template>
  <div class="article-detail">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <article v-else-if="article" class="article">
      <header>
        <h1>{{ article.title }}</h1>
        
        <div class="meta">
          <div class="author-info">
            <img 
              v-if="article.author.avatar" 
              :src="article.author.avatar" 
              :alt="article.author.username"
              class="avatar"
            />
            <span>{{ article.author.username }}</span>
          </div>
          <time>{{ formatDate(article.publishedAt) }}</time>
          <span class="views">👁 {{ article.viewCount }}</span>
        </div>
        
        <div class="category-tags">
          <span class="category">{{ article.category?.name }}</span>
          <span 
            v-for="tag in article.tags" 
            :key="tag.id"
            class="tag"
          >
            {{ tag.name }}
          </span>
        </div>
      </header>
      
      <img 
        v-if="article.coverImage" 
        :src="article.coverImage" 
        :alt="article.title"
        class="cover-image"
      />
      
      <div 
        class="content"
        v-html="article.content"
      ></div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getArticleById } = useArticles()
const article = ref(null)
const loading = ref(true)
const error = ref(null)

// 加载文章详情
const loadArticle = async () => {
  loading.value = true
  
  // 尝试通过 slug 或 id 获取
  const identifier = route.params.slug
  const isNumber = /^\d+$/.test(identifier)
  
  let result
  if (isNumber) {
    result = await getArticleById(parseInt(identifier))
  } else {
    // 如果后端支持 slug 查询，可以添加对应接口
    // 这里暂时假设只能通过 ID 查询
    error.value = '请使用文章ID访问'
    loading.value = false
    return
  }
  
  if (result.error) {
    error.value = result.error
  } else {
    article.value = result.data
    
    // 设置页面标题
    useHead({
      title: article.value.title,
      meta: [
        { name: 'description', content: article.value.excerpt },
        { property: 'og:title', content: article.value.title },
        { property: 'og:description', content: article.value.excerpt },
        { property: 'og:image', content: article.value.coverImage }
      ]
    })
  }
  
  loading.value = false
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

await loadArticle()
</script>

<style scoped>
.article {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
  color: #666;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.category-tags {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.category {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 4px;
}

.tag {
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 4px;
}

.cover-image {
  width: 100%;
  border-radius: 8px;
  margin: 20px 0;
}

.content {
  line-height: 1.8;
  font-size: 16px;
}

.content :deep(img) {
  max-width: 100%;
  height: auto;
}
</style>
```

### 示例 3: 分类页面

`pages/categories/[id].vue`

```vue
<template>
  <div class="category-page">
    <h1>{{ categoryName }} 分类文章</h1>
    
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="article-list">
      <article v-for="article in articles" :key="article.id">
        <NuxtLink :to="`/articles/${article.id}`">
          <h2>{{ article.title }}</h2>
          <p>{{ article.excerpt }}</p>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getArticles } = useArticles()
const { getCategories } = useCategories()

const articles = ref([])
const categoryName = ref('')
const loading = ref(true)
const error = ref(null)

const categoryId = parseInt(route.params.id as string)

// 先获取分类名称
const loadCategoryName = async () => {
  const { data, error: err } = await getCategories()
  if (!err && data) {
    const category = data.find((c: any) => c.id === categoryId)
    if (category) {
      categoryName.value = category.name
    }
  }
}

// 加载该分类下的文章
const loadArticles = async () => {
  loading.value = true
  
  const { data, error: err } = await getArticles({
    category: categoryId,
    sortBy: '-publishedAt'
  })
  
  if (err) {
    error.value = err
  } else {
    articles.value = data
  }
  
  loading.value = false
}

await loadCategoryName()
await loadArticles()
</script>
```

### 示例 4: 搜索页面

`pages/search.vue`

```vue
<template>
  <div class="search-page">
    <h1>搜索结果</h1>
    
    <input 
      v-model="keyword"
      @input="handleSearch"
      placeholder="输入关键词搜索..."
      type="search"
    />
    
    <div v-if="loading">搜索中...</div>
    <div v-else-if="articles.length === 0 && keyword">未找到相关文章</div>
    <div v-else class="results">
      <article v-for="article in articles" :key="article.id">
        <NuxtLink :to="`/articles/${article.id}`">
          <h2>{{ article.title }}</h2>
          <p>{{ article.excerpt }}</p>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getArticles } = useArticles()

const keyword = ref(route.query.q as string || '')
const articles = ref([])
const loading = ref(false)

let searchTimeout: NodeJS.Timeout

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    performSearch()
  }, 500)
}

const performSearch = async () => {
  if (!keyword.value.trim()) {
    articles.value = []
    return
  }
  
  loading.value = true
  
  const { data } = await getArticles({
    keyword: keyword.value,
    limit: 20
  })
  
  articles.value = data || []
  loading.value = false
}

// 初始搜索
if (keyword.value) {
  await performSearch()
}
</script>
```

---

## 常见问题

### Q1: 跨域问题如何解决？

确保后端已配置 CORS。检查 `src/app.js` 中的 CORS 配置：

```javascript
app.use(cors({
  origin: ['http://localhost:3001', 'https://your-domain.com'], // 添加你的Nuxt域名
  credentials: true
}))
```

### Q2: 如何实现 SEO 优化？

使用 Nuxt 的 `useHead` composable：

```typescript
useHead({
  title: article.title,
  meta: [
    { name: 'description', content: article.excerpt },
    { property: 'og:title', content: article.title },
    { property: 'og:description', content: article.excerpt },
    { property: 'og:image', content: article.coverImage }
  ]
})
```

### Q3: 图片路径如何处理？

后端返回的图片路径是相对路径，需要拼接完整 URL：

```typescript
const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${config.public.apiBase.replace('/api', '')}${path}`
}
```

### Q4: 如何实现无限滚动？

```typescript
const loadMore = async () => {
  if (loading.value || !pagination.value || pagination.value.page >= pagination.value.pages) {
    return
  }
  
  const nextPage = pagination.value.page + 1
  const { data } = await getArticles({ page: nextPage })
  
  articles.value = [...articles.value, ...data]
  pagination.value.page = nextPage
}
```

### Q5: 如何缓存数据？

使用 Nuxt 的 `useState` 或 Pinia：

```typescript
// 使用 useState
const cachedArticles = useState('articles', () => [])

// 使用 Pinia
import { defineStore } from 'pinia'

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [],
    categories: []
  }),
  actions: {
    async fetchArticles() {
      const { data } = await getArticles()
      this.articles = data
    }
  }
})
```

---

## 部署注意事项

### 1. 环境变量

生产环境配置 `.env.production`：

```env
NUXT_PUBLIC_API_BASE_URL=https://api.your-domain.com/api
```

### 2. Nuxt 构建

```bash
npm run build
npm run preview
```

### 3. SSR 配置

如果使用 SSR，确保在 `nuxt.config.ts` 中配置：

```typescript
export default defineNuxtConfig({
  ssr: true, // 启用服务端渲染
  nitro: {
    preset: 'node-server'
  }
})
```

---

## 总结

通过以上配置和示例，你可以在 Nuxt.js 项目中轻松调用博客后端的公开 API 接口。主要步骤：

1. ✅ 配置 API 基础 URL
2. ✅ 创建 API 工具类和 composables
3. ✅ 在页面中使用 composables 获取数据
4. ✅ 处理加载状态和错误
5. ✅ 实现分页、搜索等功能
6. ✅ 优化 SEO 和性能

如有问题，请参考后端 API 文档或查看控制台错误信息。
