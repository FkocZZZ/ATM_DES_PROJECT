const express = require('express');
const router = express.Router();
const { postTransaction } = require('../controllers/postTransactionController');

// Route cho đăng nhập
router.post('/login', postTransaction);

module.exports = router;
