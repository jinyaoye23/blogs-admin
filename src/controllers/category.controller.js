const Category = require('../models/Category');
const Article = require('../models/Article');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { success, error } = require('../utils/response');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validator.middleware');

// 获取所有分类（公开）
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['sortOrder', 'ASC'], ['created_at', 'DESC']]
    });
    
    success(res, categories, '获取成功');
  } catch (err) {
    error(res, err.message || '获取失败');
  }
};

// 获取单个分类（公开）
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return error(res, '分类不存在', 404);
    }
    
    success(res, category, '获取成功');
  } catch (err) {
    error(res, err.message || '获取失败');
  }
};

// 创建分类（需要管理员权限）
exports.createCategory = [
  protect,
  authorize('admin'),
  body('name').trim().notEmpty().withMessage('分类名称不能为空'),
  validate,
  async (req, res) => {
    try {
      const category = await Category.create(req.body);
      success(res, category, '创建成功', 201);
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return error(res, '分类名称已存在', 400);
      }
      error(res, err.message || '创建失败');
    }
  }
];

// 更新分类（需要管理员权限）
exports.updateCategory = [
  protect,
  authorize('admin'),
  body('name').trim().notEmpty().withMessage('分类名称不能为空'),
  validate,
  async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return error(res, '分类不存在', 404);
      }

      await category.update(req.body);

      success(res, category, '更新成功');
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return error(res, '分类名称已存在', 400);
      }
      error(res, err.message || '更新失败');
    }
  }
];

// 删除分类（需要管理员权限）
exports.deleteCategory = [
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return error(res, '分类不存在', 404);
      }

      // 检查是否有文章使用此分类
      const articleCount = await Article.count({ where: { categoryId: req.params.id } });
      if (articleCount > 0) {
        return error(res, `该分类下还有${articleCount}篇文章，无法删除`, 400);
      }

      await category.destroy();

      success(res, null, '删除成功');
    } catch (err) {
      error(res, err.message || '删除失败');
    }
  }
];
