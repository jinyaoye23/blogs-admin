const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`), override: true });

const User = require('../models/User');

const ADMIN_CONFIG = {
  username: process.env.ADMIN_USERNAME || 'admin',
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  role: process.env.ADMIN_ROLE || 'admin',
  bio: process.env.ADMIN_BIO || '系统管理员',
  status: 'active'
};

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ where: { role: ADMIN_CONFIG.role } });
    if (existingAdmin) {
      console.log('⚠️  管理员账号已存在，跳过自动创建');
      return;
    }

    if (!ADMIN_CONFIG.email || !ADMIN_CONFIG.password) {
      console.warn('⚠️  未配置管理员账号环境变量 ADMIN_EMAIL / ADMIN_PASSWORD，已跳过自动创建默认管理员。');
      return;
    }

    const existingEmailUser = await User.findOne({ where: { email: ADMIN_CONFIG.email } });
    if (existingEmailUser) {
      console.warn(`⚠️  未检测到管理员账号，但邮箱 ${ADMIN_CONFIG.email} 已被其他用户占用。请手动检查数据库并调整管理员账号。`);
      return;
    }

    await User.create(ADMIN_CONFIG);
    console.log(`✅ 管理员账号创建成功: ${ADMIN_CONFIG.email}`);
    console.log('⚠️  请尽快修改默认密码以保证账号安全。');
  } catch (error) {
    console.error('❌ 管理员账号初始化失败:', error.message);
    throw error;
  }
};

module.exports = {
  seedAdmin,
  ADMIN_CONFIG
};
