const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');

// 单图上传
router.post('/single', uploadController.uploadSingle);

// 多图上传（最多5张）
router.post('/multiple', uploadController.uploadMultiple);

module.exports = router;
