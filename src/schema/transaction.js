const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  updated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },

  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["Deposit", "Withdraw","Transfer"] },

  amount: { type: Number, required: true },
  remain:  Number, 
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
