const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const { protect } = require('../middlewares/auth.middleware');

// 公开路由
router.get('/', articleController.getArticles);
router.get('/:id', articleController.getArticleById);

// 受保护路由
router.post('/', protect, articleController.createArticle);
router.put('/:id', articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);
router.get('/my', protect, articleController.getMyArticles);

module.exports = router;
