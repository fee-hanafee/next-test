const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { json, urlencoded } = require("express");

const { notFound } = require("../middlewares/notFound");
const { errorMiddlewares } = require("../middlewares/error");

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
    .then(() => console.log("Connection Successfully", "\n"))
    .catch((err) => console.log(err));

  app.use("/ping", (req, res, next) => {
    try {
      console.log("Checking the API status: Everything is OK");
      res.status(200).json("pong");
    } catch (error) {
      next(new CustomError("Ping Error", "NotFoundData", 500));
    }
  });

  app.use(notFound);
  app.use(errorMiddlewares);
};
