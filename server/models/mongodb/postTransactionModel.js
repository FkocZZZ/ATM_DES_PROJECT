const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  cardNumber: { type: String, required: true },
  cardHolder: { type: String, required: true },
  mode: { type: String, required: true },
  currency: { type: String, required: true },
});

const postTransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = postTransactionModel;