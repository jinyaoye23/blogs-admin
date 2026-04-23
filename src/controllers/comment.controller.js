const { Op } = require('sequelize');
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const User = require('../models/User');
const { protect } = require('../middlewares/auth.middleware');
const { success, error, paginated } = require('../utils/response');
const { getPagination } = require('../utils/pagination');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validator.middleware');

// 获取文章评论（公开）
exports.getCommentsByArticle = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { skip } = getPagination(page, limit);

    const where = {
      articleId: req.params.articleId,
      status: 'approved',
      parentId: null // 只获取顶级评论
    };

    const { count, rows: comments } = await Comment.findAndCountAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
        { 
          model: Comment, 
          as: 'replies',
          include: [
            { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit) || 10,
      offset: skip,
      distinct: true
    });

    paginated(res, comments, count, page || 1, limit || 10, '获取成功');
  } catch (err) {
    error(res, err.message || '获取失败');
  }
};

// 创建评论
exports.createComment = [
  protect,
  body('content').trim().notEmpty().withMessage('评论内容不能为空'),
  validate,
  async (req, res) => {
    try {
      const { articleId } = req.params;
      const { content, parentId, replyToId } = req.body;

      // 检查文章是否存在
      const article = await Article.findByPk(articleId);
      if (!article) {
        return error(res, '文章不存在', 404);
      }

      const commentData = {
        content,
        articleId,
        authorId: req.user.id
      };

      // 如果是回复评论
      if (parentId) {
        commentData.parentId = parentId;
        if (replyToId) {
          commentData.replyToId = replyToId;
        }
      }

      const comment = await Comment.create(commentData);

      // 更新文章评论数
      await article.increment('commentCount');

      // 重新查询并填充关联数据
      const fullComment = await Comment.findByPk(comment.id, {
        include: [
          { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }
        ]
      });

      success(res, fullComment, '评论成功', 201);
    } catch (err) {
      error(res, err.message || '评论失败');
    }
  }
];

// 删除评论
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return error(res, '评论不存在', 404);
    }

    // 权限检查
    if (comment.authorId !== req.user.id && req.user.role !== 'admin') {
      return error(res, '没有权限删除此评论', 403);
    }

    const articleId = comment.articleId;
    await comment.destroy();

    // 更新文章评论数
    await Article.decrement('commentCount', { where: { id: articleId } });

    success(res, null, '删除成功');
  } catch (err) {
    error(res, err.message || '删除失败');
  }
};

// 获取我的评论
exports.getMyComments = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { skip } = getPagination(page, limit);

    const where = { authorId: req.user.id };

    const { count, rows: comments } = await Comment.findAndCountAll({
      where,
      include: [
        { model: Article, as: 'article', attributes: ['id', 'title'] },
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit) || 10,
      offset: skip,
      distinct: true
    });

    paginated(res, comments, count, page || 1, limit || 10, '获取成功');
  } catch (err) {
    error(res, err.message || '获取失败');
  }
};
