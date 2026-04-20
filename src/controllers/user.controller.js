const { Op } = require('sequelize');
const User = require('../models/User');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { success, error, paginated } = require('../utils/response');
const { getPagination } = require('../utils/pagination');

// 获取所有用户（需要管理员权限）
const getUsers = async (req, res) => {
  try {
    const { page, limit, keyword } = req.query;
    const { skip } = getPagination(page, limit);

    const where = {};
    if (keyword) {
      where[Op.or] = [
        { username: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit) || 10,
      offset: skip,
      distinct: true
    });

    paginated(res, users, count, page || 1, limit || 10, '获取成功');
  } catch (err) {
    error(res, err.message || '获取失败');
  }
};

// 获取单个用户
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return error(res, '用户不存在', 404);
    }
    
    success(res, user, '获取成功');
  } catch (err) {
    error(res, err.message || '获取失败');
  }
};

// 更新用户信息
const updateUser = async (req, res) => {
  try {
    // 只能修改自己的信息，管理员可以修改任何人
    if (req.params.id != req.user.id && req.user.role !== 'admin') {
      return error(res, '没有权限修改此用户信息', 403);
    }

    const updateData = { ...req.body };
    // 不允许直接修改密码和角色
    delete updateData.password;
    delete updateData.role;

    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return error(res, '用户不存在', 404);
    }

    await user.update(updateData);

    // 重新查询并排除密码
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    success(res, updatedUser, '更新成功');
  } catch (err) {
    error(res, err.message || '更新失败');
  }
};

// 删除用户（仅管理员）
const deleteUser = [
  protect,
  authorize('admin'),
  async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return error(res, '用户不存在', 404);
      }

      await user.destroy();

      success(res, null, '删除成功');
    } catch (err) {
      error(res, err.message || '删除失败');
    }
  }
];

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
