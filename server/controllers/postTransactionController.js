const { DES } = require("../classes/DES.js");
const  postTransactionModel  = require("../models/mongodb/postTransactionModel");
const { DateTime } = require("luxon");


const postTransaction = async (req, res) => {
  const { cardNumber, cardHolder, mode, currency } = req.body;
  console.log('Dữ liệu nhận được:', req.body);
  const des = new DES();
  const time = String(DateTime.now().setZone("Asia/Ho_Chi_Minh").toFormat("yyyy-MM-dd HH:mm:ss"));

  const decyptedTransaction = {
    cardNumber: des.runDecrypt(cardNumber, process.env.DES_KEY),
    cardHolder: des.runDecrypt(cardHolder, process.env.DES_KEY),
    mode: des.runDecrypt(mode, process.env.DES_KEY),
    currency: Number(des.runDecrypt(currency, process.env.DES_KEY)),
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
  
};

module.exports = { postTransaction };


