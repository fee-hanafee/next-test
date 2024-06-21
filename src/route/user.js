const express = require("express");

const c = require("../controller");

const userRoute = express.Router();

userRoute.post("/create", c.user.createUser);

module.exports = userRoute;
