const utils = require("../utils");
const repo = require("../repository");

module.exports.createUser = utils.catchError(async (req, res) => {
  req.body.bank_account = "0587772342";

  req.body.password = await utils.bcrypt.hashed(req.body.password);

  const user = await repo.user.createUser(req.body);

  res.status(201).json({ user });
});
