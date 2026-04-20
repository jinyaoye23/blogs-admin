const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middlewares/auth.middleware');
const { success, error } = require('../utils/response');

// 确保上传目录存在
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 文件过滤
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('只支持图片文件（jpeg, jpg, png, gif, webp）'));
};

// 创建multer实例
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 默认5MB
  },
  fileFilter: fileFilter
});

// 单文件上传
exports.uploadSingle = [
  protect,
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return error(res, '文件大小不能超过5MB', 400);
        }
        return error(res, err.message, 400);
      } else if (err) {
        return error(res, err.message, 400);
      }
      next();
    });
  },
  (req, res) => {
    if (!req.file) {
      return error(res, '请上传文件', 400);
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    success(res, {
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size
    }, '上传成功');
  }
];

// 多文件上传
exports.uploadMultiple = [
  protect,
  (req, res, next) => {
    upload.array('images', 5)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return error(res, '文件大小不能超过5MB', 400);
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return error(res, '最多只能上传5个文件', 400);
        }
        return error(res, err.message, 400);
      } else if (err) {
        return error(res, err.message, 400);
      }
      next();
    });
  },
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return error(res, '请上传文件', 400);
    }

    const files = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size
    }));

    success(res, files, '上传成功');
  }
];
