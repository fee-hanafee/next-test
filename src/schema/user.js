const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  balance: { type: Number, default: 0 },
  bank_account: String,

  updated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
