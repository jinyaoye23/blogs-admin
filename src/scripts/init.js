const User = require('../models/User');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const { sequelize, syncModels } = require('../config/database');
const { createDatabaseIfNotExists } = require('../utils/db-helper');
require('dotenv').config();

// 初始化管理员账号
const initAdmin = async () => {
  try {
    // 检查是否已存在管理员
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    
    if (existingAdmin) {
      console.log('⚠️  管理员账号已存在');
      return;
    }

    // 创建管理员账号
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      bio: '系统管理员'
    });

    console.log('✅ 管理员账号创建成功');
    console.log('   用户名: admin');
    console.log('   邮箱: admin@example.com');
    console.log('   密码: admin123');
    console.log('   ⚠️  请及时修改默认密码！');
  } catch (error) {
    console.error('❌ 创建管理员失败:', error.message);
  }
};

// 初始化默认分类
const initCategories = async () => {
  try {
    const categories = await Category.findAll();
    
    if (categories.length > 0) {
      console.log('⚠️  分类已存在，跳过初始化');
      return;
    }

    // 逐个创建分类，确保触发hook
    const categoryList = [
      { name: '技术', description: '技术开发相关', color: '#007bff', sortOrder: 1 },
      { name: '生活', description: '生活随笔', color: '#28a745', sortOrder: 2 },
      { name: '随笔', description: '随想记录', color: '#ffc107', sortOrder: 3 }
    ];

    for (const cat of categoryList) {
      try {
        await Category.create(cat);
      } catch (err) {
        // 如果是因为slug重复，忽略错误
        if (err.name !== 'SequelizeUniqueConstraintError') {
          throw err;
        }
      }
    }
    
    console.log('✅ 默认分类创建成功');
  } catch (error) {
    console.error('❌ 创建分类失败:', error.message);
  }
};

// 初始化默认标签
const initTags = async () => {
  try {
    const tags = await Tag.findAll();
    
    if (tags.length > 0) {
      console.log('⚠️  标签已存在，跳过初始化');
      return;
    }

    // 逐个创建标签，确保触发hook
    const tagList = [
      { name: 'JavaScript', description: 'JavaScript相关' },
      { name: 'Node.js', description: 'Node.js相关' },
      { name: 'MongoDB', description: 'MongoDB相关' },
      { name: 'React', description: 'React相关' },
      { name: 'Vue', description: 'Vue相关' }
    ];

    for (const tag of tagList) {
      try {
        await Tag.create(tag);
      } catch (err) {
        // 如果是因为slug重复，忽略错误
        if (err.name !== 'SequelizeUniqueConstraintError') {
          throw err;
        }
      }
    }
    
    console.log('✅ 默认标签创建成功');
  } catch (error) {
    console.error('❌ 创建标签失败:', error.message);
  }
};

// 初始化主函数
const initialize = async () => {
  try {
    console.log('📝 开始初始化数据库...');
    
    // 自动创建数据库（如果不存在）
    await createDatabaseIfNotExists();
    
    // 强制同步数据库模型（会删除旧表并重新创建）
    // 生产环境应该使用 syncModels(false) 避免数据丢失
    await syncModels(true);
    console.log('✅ 数据库模型同步成功（已重建表）');

    // 初始化数据
    await initAdmin();
    await initCategories();
    await initTags();
    
    console.log('\n✨ 初始化完成！\n');
    
    // 关闭数据库连接
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ 初始化失败:', error.message);
    process.exit(1);
  }
};

initialize();
