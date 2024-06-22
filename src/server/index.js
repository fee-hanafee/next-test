const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const { json, urlencoded } = require("express");

const { notFound } = require("../middlewares/notFound");
const { errorMiddlewares } = require("../middlewares/error");

const userRoute = require("../route/user");
const transactionRoute = require("../route/transaction");
const authenticate = require("../middlewares/authenticate");

const URL = process.env.MONGODB_URL;

module.exports = function restApiServer(app) {
  app.use(morgan("dev"));
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(express.static("public"));

  mongoose.Promise = global.Promise;
  
  mongoose
    .connect(URL)
    .then(() => console.log("MongoDB connected...", "\n"))
    .catch((err) => console.log(err));

  app.use("/user", userRoute);
  app.use("/transaction", authenticate, transactionRoute);

  app.use(notFound);
  app.use(errorMiddlewares);
};
