const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn.middleware");
const { createComment, getComment, deleteComment, updateComment } = require("../../controllers/comments/comment.controller");
const commentRouter = express.Router();

//! create comment route
commentRouter.route("/:postId").post(isLoggedIn,createComment);

//! get comment route
commentRouter.route("/:commentId").get(getComment);

//! delete comment route
commentRouter.route("/:commentId").delete(isLoggedIn,deleteComment);

//! update comment route
commentRouter.route("/:commentId").patch(isLoggedIn,updateComment);

module.exports  = commentRouter;

