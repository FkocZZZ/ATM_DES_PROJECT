const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {connectMongoDB} = require('./databases/mongoDb/connectMongoDB');
const { postTransaction, getTransaction } = require('./routes/postTransactionRoute');

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connectMongoDB();


app.use('/', require('./routes/postTransactionRoute'));
app.use('/', require('./routes/postTransactionRoute'));




// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});


