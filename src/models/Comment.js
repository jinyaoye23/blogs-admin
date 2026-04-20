const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Article = require('./Article');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 2000]
    }
  },
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'articles',
      key: 'id'
    }
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  parentId: {
    type: DataTypes.INTEGER,
    defaultValue: null,
    references: {
      model: 'comments',
      key: 'id'
    }
  },
  replyToId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'comments',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'spam'),
    defaultValue: 'approved'
  },
  likeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 定义关联关系
Comment.belongsTo(Article, { foreignKey: 'articleId', as: 'article' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });
Comment.belongsTo(Comment, { foreignKey: 'replyToId', as: 'replyTo' });
Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });

Article.hasMany(Comment, { foreignKey: 'articleId', as: 'comments' });
User.hasMany(Comment, { foreignKey: 'authorId', as: 'comments' });

module.exports = Comment;
