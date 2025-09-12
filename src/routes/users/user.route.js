const express = require("express");
const {register, login,  getProfile} = require("../../controllers/users/user.controller");
const isLoggedIn = require("../../middlewares/isLoggedIn.middleware");
const userRouter = express.Router();

//! Register route
userRouter.route("/register").post(register);
//! Login route
userRouter.route("/login").post(login)
//!Profile view route
userRouter.route("/profile").get(isLoggedIn,getProfile);

module.exports = userRouter;