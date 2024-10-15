const express = require('express');
const router = express.Router();
const { postTransaction } = require('../controllers/postTransactionController');
const { getTransaction } = require('../controllers/postTransactionController'); 


router.route('/postTransaction').post(postTransaction);
router.route('/getTransaction').get(getTransaction);


module.exports = router;
