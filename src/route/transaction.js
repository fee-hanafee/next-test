const express = require("express");

const c = require("../controller");
const authenticate = require("../middlewares/authenticate");

const transactionRoute = express.Router();

transactionRoute.post("/deposit", c.transaction.deposit);
transactionRoute.post("/transfer", c.transaction.transfer);
transactionRoute.post("/withdraw", c.transaction.withdraw);

module.exports = transactionRoute;
