const express = require("express");

const c = require("../controller");
const authenticate = require("../middlewares/authenticate");

const userRoute = express.Router();

// userRoute.get("/", c.user.getAllUser);

userRoute.post("/login", c.user.login);
userRoute.post("/create", c.user.createUser);
userRoute.get("/me", authenticate, c.user.getMe);
module.exports = userRoute;
