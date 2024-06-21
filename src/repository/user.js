
const User = require("../schema/user");

module.exports.createUser = async (data) => await User.create(data);
