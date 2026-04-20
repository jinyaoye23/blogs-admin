const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// 公开路由
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

// 受保护路由（需要管理员权限）
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
