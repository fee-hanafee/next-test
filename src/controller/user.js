const utils = require("../utils");
const repo = require("../repository");
const { CustomError } = require("../config/error");

module.exports.getAllUser = utils.catchError(async (req, res) => {
  const user = await repo.user.getAllUser();
  res.status(200).json({ user });
});

module.exports.createUser = utils.catchError(async (req, res) => {
  req.body.bank_account = utils.generate();

  req.body.password = await utils.bcrypt.hashed(req.body.password);

  const user = await repo.user.createUser(req.body);

  res.status(201).json({ user });
});

module.exports.login = utils.catchError(async (req, res) => {
  const { email, password } = req.body;

  const user = await repo.user.getEmail(email);

  if (!user)
    throw new CustomError("email or password is wrong", "WRONG_INPUT", 400);

  const isMatch = await utils.bcrypt.compare(password, user.password);

  if (!isMatch)
    throw new CustomError("email or password is wrong", "WRONG_INPUT", 400);

  const userObj = user.toObject();

  const payload = { id: user.id, email };

  const token = utils.jwt.sign(payload);

  delete userObj.password;

  res.status(200).json({ token, user: userObj });
});

module.exports.getMe = utils.catchError(async (req, res) => {
  const userId = req.user._id;

  const user = await repo.user.getAccoutById(userId);

  const userObj = user.toObject();
  delete userObj.password;

  res.status(200).json({ user: userObj });
});
