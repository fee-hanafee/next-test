const express = require("express");

const c = require("../controller");
const authenticate = require("../middlewares/authenticate");

const transactionRoute = express.Router();

transactionRoute.post("/deposit", authenticate, c.transaction.deposit);
transactionRoute.post("/transfer", authenticate, c.transaction.transfer);

module.exports = transactionRoute;
