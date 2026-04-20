const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validator.middleware');

// 注册验证规则
exports.registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度3-20个字符'),
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码至少6个字符'),
  validate
];

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({ 
      where: {
        [require('sequelize').Op.or]: [{ email }, { username }]
      }
    });
    
    if (existingUser) {
      return error(res, existingUser.email === email ? '邮箱已被注册' : '用户名已存在', 400);
    }

    // 创建用户
    const user = await User.create({
      username,
      email,
      password
    });

    // 生成token
    const token = generateToken(user.id);

    success(res, {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    }, '注册成功', 201);
  } catch (err) {
    error(res, err.message || '注册失败');
  }
};

// 登录验证规则
exports.loginValidation = [
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('password')
    .notEmpty()
    .withMessage('密码不能为空'),
  validate
];

// 用户登录
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return error(res, '邮箱或密码错误', 401);
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return error(res, '邮箱或密码错误', 401);
    }

    // 检查账户状态
    if (user.status !== 'active') {
      return error(res, '账户已被禁用');
    }

    // 生成token
    const token = generateToken(user.id);

    success(res, {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      token
    }, '登录成功');
  } catch (err) {
    error(res, err.message || '登录失败');
  }
};

// 获取当前用户信息
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    success(res, user, '获取成功');
  } catch (err) {
    error(res, err.message || '获取失败');
  }
};
