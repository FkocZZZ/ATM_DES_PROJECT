const e = require("express");
const { DES } = require("../classes/DES");
const  postTransactionModel  = require("../models/mongodb/postTransactionModel");
const { DateTime } = require("luxon");


const postTransaction = async (req, res) => {
  const { cardNumber, cardHolder, mode, currency } = req.body;
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

  
  const savedTransaction = await postTransactionModel.create(decyptedTransaction); // Save to MongoDB


  console.log('Decrypted data: ',decyptedTransaction);
  console.log('Encrypted DATA:', encryptedTransaction);
  res.send(req.body);
};

const getTransaction = async (req, res) => {
  const transactions = await postTransactionModel.find();
  res.send(transactions);
}


module.exports = { postTransaction, getTransaction };
