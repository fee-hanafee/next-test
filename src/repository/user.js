const User = require("../schema/user");

module.exports.createUser = async (data) => await User.create(data);

module.exports.getAllUser = async () => await User.find();

module.exports.getEmail = async (email) => await User.findOne({ email });
