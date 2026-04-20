const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tag.controller');

// 公开路由
router.get('/', tagController.getTags);
router.get('/:id', tagController.getTagById);

// 受保护路由（需要管理员权限）
router.post('/', tagController.createTag);
router.put('/:id', tagController.updateTag);
router.delete('/:id', tagController.deleteTag);

module.exports = router;
