const { sequelize } = require('./src/config/database');
const Article = require('./src/models/Article');
const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Tag = require('./src/models/Tag');

// 10篇前端工程化相关的博客文章数据
const articlesData = [
  {
    title: "Webpack 5 完全指南：从零搭建现代化构建工具",
    content: `# Webpack 5 完全指南

## 前言
Webpack 作为现代前端开发的核心构建工具,已经发展到第 5 个版本。

## 主要改进
- 持久缓存
- 模块联邦
- 更好的 Tree Shaking
- 原生资源模块

## 基础配置
\`\`\`javascript
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  }
};
\`\`\`

## 性能优化
- 代码分割
- 缓存策略
- 懒加载`,
    excerpt: "深入解析 Webpack 5 的核心概念、配置方法和性能优化技巧。",
    status: "published"
  },
  {
    title: "Vite vs Webpack：下一代构建工具深度对比",
    content: `# Vite vs Webpack 对比

## 核心原理差异
- Webpack: Bundle Based
- Vite: Native ESM Based

## 性能对比
Vite 启动速度快 10-100 倍。

## 适用场景
- 新项目推荐 Vite
- 老项目继续使用 Webpack

## 迁移建议
逐步迁移,不要一次性切换。`,
    excerpt: "全面对比 Vite 和 Webpack 的性能、生态、适用场景。",
    status: "published"
  },
  {
    title: "TypeScript 工程化最佳实践",
    content: `# TypeScript 工程化

## 核心优势
- 静态类型检查
- 智能提示
- 重构更安全

## tsconfig.json 配置
启用 strict 模式,配置合理的编译目标。

## 高级类型
泛型、条件类型、映射类型。

## 最佳实践
避免 any 滥用,使用 unknown 替代。`,
    excerpt: "系统讲解 TypeScript 在项目工程化中的应用。",
    status: "published"
  },
  {
    title: "Monorepo 实战：pnpm + Turborepo",
    content: `# Monorepo 实战

## 什么是 Monorepo
将多个相关项目放在同一仓库。

## pnpm 优势
- 磁盘效率高
- 安装速度快
- 严格依赖管理

## Turborepo
高性能的 Monorepo 构建系统。

## 项目结构
packages/ 存放公共包,apps/ 存放应用。`,
    excerpt: "使用 pnpm 和 Turborepo 搭建高效的 Monorepo 项目。",
    status: "published"
  },
  {
    title: "CI/CD 流水线设计：GitHub Actions",
    content: `# CI/CD 完整实践

## 核心概念
- CI: 持续集成
- CD: 持续部署

## GitHub Actions
自动化构建、测试、部署流程。

## 常用工作流
- 代码质量检查
- 单元测试
- 构建产物
- 自动化部署

## 最佳实践
利用缓存、矩阵构建、失败快速。`,
    excerpt: "从零构建完整的 CI/CD 流水线,提升开发效率。",
    status: "published"
  },
  {
    title: "Docker 容器化部署：前端应用方案",
    content: `# Docker 容器化部署

## 为什么需要 Docker
环境一致性,快速部署,资源隔离。

## 多阶段构建
减小镜像体积,提高安全性。

## Nginx 配置
SPA 路由支持,静态资源缓存。

## docker-compose
编排多个服务,简化部署流程。

## 性能优化
利用层缓存,.dockerignore 文件。`,
    excerpt: "使用 Docker 容器化部署前端应用的完整方案。",
    status: "published"
  },
  {
    title: "前端监控体系建设：从 0 到 1",
    content: `# 前端监控体系

## 监控指标
- 性能监控: FCP, LCP, FID, CLS
- 错误监控: JS 错误,资源错误
- 行为监控: PV/UV,用户点击

## 数据采集
Performance API, web-vitals 库。

## 上报策略
立即上报、批量上报、采样上报。

## 告警机制
阈值告警,多渠道通知。`,
    excerpt: "系统化构建前端监控体系,保障线上质量。",
    status: "published"
  },
  {
    title: "微前端架构实战：qiankun 落地",
    content: `# 微前端架构

## 什么是微前端
将应用拆分成多个独立子应用。

## qiankun 框架
基于 single-spa,提供更好的隔离。

## 核心功能
- 样式隔离
- JS 沙箱
- 应用间通信
- 预加载

## 最佳实践
合理拆分粒度,统一规范。`,
    excerpt: "深入讲解 qiankun 微前端框架的使用和优化。",
    status: "published"
  },
  {
    title: "前端代码规范与 ESLint 配置",
    content: `# 代码规范与 ESLint

## 为什么需要规范
提高可读性,减少 Bug,降低维护成本。

## ESLint 配置
常用规则,流行规范集合。

## Prettier 集成
ESLint 关注质量,Prettier 关注格式。

## Git Hooks
Husky + lint-staged 自动化检查。

## 团队协作
统一配置,文档化,自动化。`,
    excerpt: "全面介绍前端代码规范体系和自动化工具链。",
    status: "published"
  },
  {
    title: "前端自动化测试：Jest + Testing Library",
    content: `# 前端自动化测试

## 测试价值
保证质量,文档作用,重构信心。

## Jest 基础
断言、异步测试、Mock 函数。

## Testing Library
测试 React/Vue 组件的用户行为。

## 测试覆盖率
配置覆盖率阈值,生成报告。

## 最佳实践
AAA 模式,测试行为不测实现。`,
    excerpt: "使用 Jest 和 Testing Library 编写高质量测试。",
    status: "published"
  }
];

async function initArticles() {
  try {
    console.log('🔍 正在连接数据库...');
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功\n');

    // 查找或创建作者
    let author = await User.findOne({ where: { username: 'admin' } });
    if (!author) {
      console.log('❌ 未找到 admin 用户,请先运行 npm run init 初始化数据库');
      process.exit(1);
    }
    console.log(`👤 使用作者: ${author.username} (ID: ${author.id})\n`);

    // 查找或创建分类
    let category = await Category.findOne({ where: { name: '前端工程化' } });
    if (!category) {
      category = await Category.create({
        name: '前端工程化',
        slug: 'frontend-engineering',
        description: '前端工程化相关文章'
      });
      console.log('📁 创建分类: 前端工程化\n');
    } else {
      console.log(`📁 使用分类: ${category.name}\n`);
    }

    // 创建标签
    const tagNames = ['Webpack', 'Vite', 'TypeScript', 'Monorepo', 'CI/CD', 'Docker', '监控', '微前端', 'ESLint', '测试'];
    const tags = [];
    
    for (const tagName of tagNames) {
      let tag = await Tag.findOne({ where: { name: tagName } });
      if (!tag) {
        tag = await Tag.create({
          name: tagName,
          slug: tagName.toLowerCase()
        });
        console.log(`🏷️  创建标签: ${tagName}`);
      }
      tags.push(tag);
    }
    console.log('');

    // 创建文章
    console.log('📝 开始创建文章...\n');
    
    for (let i = 0; i < articlesData.length; i++) {
      const articleData = articlesData[i];
      
      // 检查文章是否已存在
      const existingArticle = await Article.findOne({ 
        where: { 
          title: articleData.title 
        } 
      });
      
      if (existingArticle) {
        console.log(`⏭️  跳过已存在的文章: ${articleData.title}`);
        continue;
      }

      const article = await Article.create({
        title: articleData.title,
        content: articleData.content,
        excerpt: articleData.excerpt,
        status: articleData.status,
        authorId: author.id,
        categoryId: category.id
      });

      // 关联标签(每篇文章关联 1-3 个标签)
      const articleTags = tags.slice(i, i + Math.min(3, tags.length - i));
      if (articleTags.length > 0) {
        await article.addTags(articleTags);
      }

      console.log(`✅ 创建文章: ${article.title}`);
    }

    console.log('\n🎉 文章初始化完成!');
    
    // 统计
    const totalArticles = await Article.count();
    console.log(`📊 数据库中共有 ${totalArticles} 篇文章`);

    process.exit(0);
  } catch (error) {
    console.error('❌ 初始化失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

initArticles();
