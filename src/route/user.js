const express = require("express");

const c = require("../controller");

const userRoute = express.Router();

userRoute.get("/", c.user.getAllUser);
userRoute.post("/login", c.user.login);
userRoute.post("/create", c.user.createUser);

module.exports = userRoute;
