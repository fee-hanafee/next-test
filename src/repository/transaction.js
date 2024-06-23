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
      remain: +user.balance,
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
  const receiver = await User.findOne({ bank_account });

  if (!receiver)
    throw new CustomError("Receiver_not_found", "WRONG_INPUT", 400);
  const { _id } = receiver;
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
      remain: sender.balance,
    });

    const receiverTransaction = new Transaction({
      user_id: receiverId,
      type: "Transfer",
      amount: amount,
      remain: receiver.balance,
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
      remain: user.balance,
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

module.exports.getTransactionsByUserId = async (userId) => {
  try {
    const results = await Transaction.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender_id",
          foreignField: "_id",
          as: "senderDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiver_id",
          foreignField: "_id",
          as: "receiverDetails",
        },
      },
      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: "$senderDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: "$receiverDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          type: 1,
          amount: 1,
          remain: 1,
          created_at: 1,
          "userDetails.first_name": 1,
          "userDetails.last_name": 1,
          "senderDetails.first_name": 1,
          "senderDetails.last_name": 1,
          "receiverDetails.first_name": 1,
          "receiverDetails.last_name": 1,
          "userDetails.bank_account": 1,
          "senderDetails.bank_account": 1,
          "receiverDetails.bank_account": 1,
        },
      },
    ]);

    return results;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
