const { DES } = require("../classes/DES.js");
const e = require("express");
const { DES } = require("../classes/DES");
const  postTransactionModel  = require("../models/mongodb/postTransactionModel");
const { DateTime } = require("luxon");


const postTransaction = async (req, res) => {
  const { cardNumber, cardHolder, mode, currency } = req.body;
  console.log('Dữ liệu nhận được:', req.body);
  const des = new DES();
  const time = String(DateTime.now().setZone("Asia/Ho_Chi_Minh").toFormat("yyyy-MM-dd HH:mm:ss"));




  const encryptedTransaction = {
    cardNumber: des.runEncrypt(cardNumber, process.env.DES_KEY),
    cardHolder: des.runEncrypt(cardHolder, process.env.DES_KEY),
    mode: des.runEncrypt(mode, process.env.DES_KEY),
    currency: String(des.runEncrypt(currency, process.env.DES_KEY)),
    time: time,
  };


  
  const decyptedTransaction = {
    cardNumber: des.runDecrypt(encryptedTransaction.cardNumber, process.env.DES_KEY),
    cardHolder: des.runDecrypt(encryptedTransaction.cardHolder, process.env.DES_KEY),
    mode: des.runDecrypt(encryptedTransaction.mode, process.env.DES_KEY),
    currency: Number(des.runDecrypt(encryptedTransaction.currency, process.env.DES_KEY)),
    time: time,
  };

  
  try {
    const savedTransaction = await postTransactionModel.create(decyptedTransaction);
    
    // Phản hồi về cho FE sau khi lưu thành công
    const responseData = {
      status: des.runEncrypt("Success", process.env.DES_KEY), // Mã hóa trạng thái
      id: des.runEncrypt(savedTransaction._id.toString(), process.env.DES_KEY), // Mã hóa ID
      cardNumber: des.runEncrypt(decyptedTransaction.cardNumber, process.env.DES_KEY), // Mã hóa cardNumber
      cardHolder: des.runEncrypt(decyptedTransaction.cardHolder, process.env.DES_KEY), // Mã hóa cardHolder
      mode: des.runEncrypt(decyptedTransaction.mode, process.env.DES_KEY), // Mã hóa mode
      currency: des.runEncrypt(decyptedTransaction.currency.toString(), process.env.DES_KEY), // Mã hóa currency
    };
    
    console.log('Dữ liệu phản hồi:', responseData); // Thêm dòng này để kiểm tra dữ liệu
    res.send(responseData);
    
  } catch (error) {
    console.error('Lỗi khi lưu giao dịch:', error);
    res.status(500).send({
      status: des.runEncrypt("Failure", process.env.DES_KEY),
      message: "Lỗi khi lưu giao dịch vào MongoDB",
    });
  }
  

  
  const savedTransaction = await postTransactionModel.create(decyptedTransaction); // Save to MongoDB


  console.log('Decrypted data: ',decyptedTransaction);
  console.log('Encrypted DATA:', encryptedTransaction);
  res.send(req.body);
};

module.exports = { postTransaction };


const getTransaction = async (req, res) => {
  const transactions = await postTransactionModel.find();
  res.send(transactions);
}


module.exports = { postTransaction, getTransaction };
