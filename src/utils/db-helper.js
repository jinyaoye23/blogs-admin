const { Sequelize } = require('sequelize');
require('dotenv').config();

// 首先创建一个不指定数据库的连接，用于创建数据库本身
const createDatabaseIfNotExists = async () => {
  const sequelize = new Sequelize(
    process.env.DB_NAME || 'my_blog',
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false
    }
  );

  try {
    await sequelize.authenticate();
    console.log('✅ MySQL连接成功');
    return sequelize;
  } catch (error) {
    // 如果数据库不存在，尝试创建它
    if (error.message.includes('Unknown database')) {
      console.log('📝 数据库不存在，正在创建...');
      
      // 创建一个临时的不指定数据库的连接
      const tempSequelize = new Sequelize(
        '',
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT || 3306,
          dialect: 'mysql',
          logging: false
        }
      );

      try {
        await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log(`✅ 数据库 '${process.env.DB_NAME}' 创建成功`);
        await tempSequelize.close();
        
        // 重新连接到新创建的数据库
        await sequelize.authenticate();
        console.log('✅ 数据库连接成功');
        return sequelize;
      } catch (createError) {
        console.error('❌ 创建数据库失败:', createError.message);
        throw createError;
      }
    } else {
      console.error('❌ MySQL连接失败:', error.message);
      throw error;
    }
  }
};

module.exports = {
  createDatabaseIfNotExists
};
