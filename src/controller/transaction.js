const utils = require("../utils");
const repo = require("../repository");

module.exports.deposit = utils.catchError(async (req, res) => {
  const userId = req.user._id;
  const { amount } = req.body;

  const transaction = await repo.transaction.deposit(userId, amount);

  res.status(201).json({ transaction });
});

module.exports.transfer = utils.catchError(async (req, res) => {
  const { account, amount } = req.body;
  const userId = req.user._id;
  const receiverId = await repo.transaction.getAccount(account);

  const transaction = await repo.transaction.transfer(
    userId,
    receiverId,
    amount
  );

  res.status(201).json({ transaction });
});

module.exports.withdraw = utils.catchError(async (req, res) => {
  const { amount } = req.body;
  const userId = req.user._id;

  const user = await repo.transaction.withdraw(userId, amount);

  const userObj = user.toObject();
  
  delete userObj.password;

  res.status(201).json({ user: userObj });
});
