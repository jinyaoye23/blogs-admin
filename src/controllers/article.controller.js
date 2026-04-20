const { Op } = require('sequelize');
const Article = require('../models/Article');
const User = require('../models/User');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const { protect } = require('../middlewares/auth.middleware');
const { success, error, paginated } = require('../utils/response');
const { getPagination } = require('../utils/pagination');
const { body, query, param } = require('express-validator');
const { validate } = require('../middlewares/validator.middleware');

// 获取文章列表（公开）
exports.getArticles = async (req, res) => {
  try {
    const { page, limit, status, category, tag, keyword, sortBy = '-createdAt' } = req.query;
    const { skip } = getPagination(page, limit);

    // 构建查询条件
    const where = {};
    
    if (status) {
      where.status = status;
    } else {
      // 默认只返回已发布的文章
      where.status = 'published';
    }
    
    if (category) {
      where.categoryId = category;
    }
    
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { content: { [Op.like]: `%${keyword}%` } }
      ];
    }

    // 排序处理
    const order = [];
    if (sortBy.startsWith('-')) {
      order.push([sortBy.substring(1), 'DESC']);
    } else {
      order.push([sortBy, 'ASC']);
    }

    // 查询总数
    const { count, rows: articles } = await Article.findAndCountAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } }
      ],
      order,
      limit: parseInt(limit) || 10,
      offset: skip,
      distinct: true
    });

    paginated(res, articles, count, page || 1, limit || 10, '获取成功');
  } catch (err) {
    error(res, err.message || '获取失败');
  }
};

// 获取单篇文章（公开）
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'bio'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } }
      ]
    });

    if (!article) {
      return error(res, '文章不存在', 404);
    }

    // 增加阅读量
    await article.increment('viewCount');

    success(res, article, '获取成功');
  } catch (err) {
    error(res, err.message || '获取失败');
  }
};

// 创建文章
exports.createArticle = [
  protect,
  body('title').trim().notEmpty().withMessage('标题不能为空'),
  body('content').notEmpty().withMessage('内容不能为空'),
  validate,
  async (req, res) => {
    try {
      const articleData = {
        ...req.body,
        authorId: req.user.id
      };

      // 如果状态是published，设置发布时间
      if (articleData.status === 'published' && !articleData.publishedAt) {
        articleData.publishedAt = new Date();
      }

      const article = await Article.create(articleData);
      
      // 重新查询并填充关联数据
      const fullArticle = await Article.findByPk(article.id, {
        include: [
          { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
          { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
          { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } }
        ]
      });

      success(res, fullArticle, '创建成功', 201);
    } catch (err) {
      error(res, err.message || '创建失败');
    }
  }
];

// 更新文章
exports.updateArticle = [
  protect,
  param('id').isInt().withMessage('无效的文章ID'),
  validate,
  async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id);

      if (!article) {
        return error(res, '文章不存在', 404);
      }

      // 权限检查
      if (article.authorId !== req.user.id && req.user.role !== 'admin') {
        return error(res, '没有权限修改此文章', 403);
      }

      // 如果状态变为published，设置发布时间
      const updateData = { ...req.body };
      if (req.body.status === 'published' && article.status !== 'published') {
        updateData.publishedAt = new Date();
      }

      await article.update(updateData);

      // 重新查询并填充关联数据
      const updatedArticle = await Article.findByPk(article.id, {
        include: [
          { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
          { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
          { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } }
        ]
      });

      success(res, updatedArticle, '更新成功');
    } catch (err) {
      error(res, err.message || '更新失败');
    }
  }
];

// 删除文章
exports.deleteArticle = [
  protect,
  param('id').isInt().withMessage('无效的文章ID'),
  validate,
  async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id);

      if (!article) {
        return error(res, '文章不存在', 404);
      }

      // 权限检查
      if (article.authorId !== req.user.id && req.user.role !== 'admin') {
        return error(res, '没有权限删除此文章', 403);
      }

      await article.destroy();

      success(res, null, '删除成功');
    } catch (err) {
      error(res, err.message || '删除失败');
    }
  }
];

// 获取我的文章
exports.getMyArticles = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const { skip } = getPagination(page, limit);

    const where = { authorId: req.user.id };
    if (status) {
      where.status = status;
    }

    const { count, rows: articles } = await Article.findAndCountAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'], through: { attributes: [] } }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit) || 10,
      offset: skip,
      distinct: true
    });

    paginated(res, articles, count, page || 1, limit || 10, '获取成功');
  } catch (err) {
    error(res, err.message || '获取失败');
  }
};
