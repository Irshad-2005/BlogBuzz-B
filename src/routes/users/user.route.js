const express = require("express");
const {register, login,  getProfile, blockUser, unBlockUser, viewOtherProfile, followingUser, unfollowUser, passwordReset, forgetPassword, accountVerification, accountVerificationMail, verifyAccount} = require("../../controllers/users/user.controller");
const isLoggedIn = require("../../middlewares/isLoggedIn.middleware");
const userRouter = express.Router();

//! Register route
userRouter.route("/register").post(register);
//! Login route
userRouter.route("/login").post(login)
//!Profile view route
userRouter.route("/profile").get(isLoggedIn,getProfile);
//! block user route
userRouter.route("/block/:userToBlockId").patch(isLoggedIn,blockUser);
//!unblock user route
userRouter.route("/unblock/:userIdToUnblock").patch(isLoggedIn,unBlockUser);
//! profile viewers route
userRouter.route("/viewOther-profile/:userId").patch(isLoggedIn,viewOtherProfile);
//! following route
userRouter.route("/following/:userId").patch(isLoggedIn,followingUser);
//! unfollow route
userRouter.route("/unfollow/:userId").patch(isLoggedIn,unfollowUser);
//! password forget route
userRouter.route("/forget-password").patch(forgetPassword);
//! password reset route
userRouter.route("/password-reset/:passwordResetToken").patch(passwordReset);
//! account verification send email route
userRouter.route("/account-verification-mail").patch(isLoggedIn,accountVerificationMail);
//! verify account route
userRouter.route("/verify-account/:accountVerificationToken").patch(isLoggedIn,verifyAccount);
module.exports = userRouter;