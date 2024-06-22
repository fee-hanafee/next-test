const mongoose = require("mongoose");

const { CustomError } = require("../config/error");
const User = require("../schema/user");
const Transaction = require("../schema/transaction");

module.exports.deposit = async (userId, amount) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { balance: amount } },
      { new: true, session }
    );

    if (!user) {
      throw new CustomError("user is wrong", "WRONG_INPUT", 400);
    }
    const transaction = new Transaction({
      user_id: userId,
      type: "Deposit",
      amount: amount,
      receiver_id: userId,
    });

    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { user, transaction };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports.getAccount = async (bank_account) => {
  const { _id } = await User.findOne({ bank_account });
  return _id;
};

module.exports.transfer = async (senderId, receiverId, amount) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sender = await User.findById(senderId).session(session);
    const receiver = await User.findById(receiverId).session(session);

    if (!sender || !receiver) {
      throw new CustomError("Sender or Receiver not found", "WRONG_INPUT", 400);
    }

    if (sender.balance < amount) {
      throw new CustomError("Insufficient funds", "WRONG_INPUT", 400);
    }
    sender.balance -= amount;
    await sender.save({ session });

    receiver.balance += amount;
    await receiver.save({ session });

    const senderTransaction = new Transaction({
      user_id: senderId,
      type: "Transfer",
      amount: amount,
      sender_id: senderId,
      receiver_id: receiverId,
    });

    const receiverTransaction = new Transaction({
      user_id: receiverId,
      type: "Transfer",
      amount: amount,
      sender_id: senderId,
      receiver_id: receiverId,
    });

    await senderTransaction.save({ session });
    await receiverTransaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { senderTransaction, receiverTransaction };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports.withdraw = async (userId, amount) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new CustomError("User not found", "WRONG_INPUT", 400);
    }

    if (user.balance < amount) {
      throw new CustomError("Insufficient balance", "WRONG_INPUT", 400);
    }

    user.balance -= amount;
    await user.save({ session });

    const transaction = new Transaction({
      user_id: userId,
      type: "Withdraw",
      amount: amount,
    });

    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
