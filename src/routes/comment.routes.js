const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { protect } = require('../middlewares/auth.middleware');

// 公开路由
router.get('/article/:articleId', commentController.getCommentsByArticle);

// 受保护路由
router.post('/article/:articleId', protect, commentController.createComment);
router.delete('/:id', protect, commentController.deleteComment);
router.get('/my', protect, commentController.getMyComments);

module.exports = router;
