const express = require("express");

const c = require("../controller");

const transactionRoute = express.Router();

transactionRoute.post("/deposit", c.transaction.deposit);
transactionRoute.post("/transfer", c.transaction.transfer);
transactionRoute.post("/withdraw", c.transaction.withdraw);

transactionRoute.get("/me",c.transaction.getTransactionsByUserId)

module.exports = transactionRoute;
