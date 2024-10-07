const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const {connectMongoDB} = require('./databases/mongoDb/connectMongoDB');

require('dotenv').config();


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Kết nối MongoDB
connectMongoDB();

app.use('/', require('./routes/postTransactionRoute'));

// Sử dụng các routes
app.use('/api', require('./routes/postTransactionRoute'));

// Đường dẫn đến file HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});


// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});


