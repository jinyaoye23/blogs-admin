const Tag = require('../models/Tag');
const Article = require('../models/Article');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { success, error } = require('../utils/response');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validator.middleware');

// 获取所有标签（公开）
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      order: [['created_at', 'DESC']]
    });
    
    success(res, tags, '获取成功');
  } catch (err) {
    error(res, err.message || '获取失败');
  }
};

// 获取单个标签（公开）
exports.getTagById = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    
    if (!tag) {
      return error(res, '标签不存在', 404);
    }
    
    success(res, tag, '获取成功');
  } catch (err) {
    error(res, err.message || '获取失败');
  }
};

// 创建标签（需要管理员权限）
exports.createTag = [
  protect,
  authorize('admin'),
  body('name').trim().notEmpty().withMessage('标签名称不能为空'),
  validate,
  async (req, res) => {
    try {
      const tag = await Tag.create(req.body);
      success(res, tag, '创建成功', 201);
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return error(res, '标签名称已存在', 400);
      }
      error(res, err.message || '创建失败');
    }
  }
];

// 更新标签（需要管理员权限）
exports.updateTag = [
  protect,
  authorize('admin'),
  body('name').trim().notEmpty().withMessage('标签名称不能为空'),
  validate,
  async (req, res) => {
    try {
      const tag = await Tag.findByPk(req.params.id);

      if (!tag) {
        return error(res, '标签不存在', 404);
      }

      await tag.update(req.body);

      success(res, tag, '更新成功');
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return error(res, '标签名称已存在', 400);
      }
      error(res, err.message || '更新失败');
    }
  }
];

// 删除标签（需要管理员权限）
exports.deleteTag = [
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const tag = await Tag.findByPk(req.params.id);

      if (!tag) {
        return error(res, '标签不存在', 404);
      }

      // 检查是否有文章使用此标签
      const articleCount = await Article.count({
        include: [{
          model: require('sequelize').Model,
          where: { '$tags.id$': req.params.id }
        }]
      });
      
      // 简化检查：直接尝试删除，如果有外键约束会失败
      await tag.destroy();

      success(res, null, '删除成功');
    } catch (err) {
      if (err.name === 'SequelizeForeignKeyConstraintError') {
        return error(res, '该标签还被文章使用，无法删除', 400);
      }
      error(res, err.message || '删除失败');
    }
  }
];
