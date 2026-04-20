/**
 * 分页辅助函数
 */
exports.getPagination = (page, limit) => {
  const pageNum = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  
  const skip = (pageNum - 1) * pageSize;
  
  return {
    page: pageNum,
    limit: pageSize,
    skip
  };
};

/**
 * 返回分页数据
 */
exports.paginatedResponse = (data, total, page, limit) => {
  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
};
