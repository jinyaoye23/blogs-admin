const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Tag = require('./Tag');

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  slug: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  excerpt: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 500]
    }
  },
  coverImage: {
    type: DataTypes.STRING(255),
    defaultValue: ''
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  isTop: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  commentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  publishedAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'articles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeValidate: (article) => {
      // 在验证前生成 slug,确保 slug 不为 null
      if (article.title && (!article.slug || article.slug.trim() === '')) {
        article.slug = article.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '');
      }
    },
    beforeUpdate: (article) => {
      // 更新时,如果标题改变且 slug 未手动设置,则重新生成
      if (article.changed('title') && (!article.changed('slug') || !article.slug || article.slug.trim() === '')) {
        article.slug = article.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '');
      }
    }
  }
});

// 定义关联关系
Article.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Article.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Article.belongsToMany(Tag, { 
  through: 'article_tags',
  foreignKey: 'articleId',
  otherKey: 'tagId',
  as: 'tags' 
});

User.hasMany(Article, { foreignKey: 'authorId', as: 'articles' });
Category.hasMany(Article, { foreignKey: 'categoryId', as: 'articles' });

module.exports = Article;
