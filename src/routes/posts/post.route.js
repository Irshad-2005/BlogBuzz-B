const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn.middleware");
const { createPost, getAllPosts, getPost, deletePost, updatePost } = require("../../controllers/posts/post.controller");


const postRouter = express.Router();

//! create post route
postRouter.route("/").post(isLoggedIn,createPost);

//! get all post route
postRouter.route("/").get(isLoggedIn,getAllPosts);

//! get single post route
postRouter.route("/:postId").get(isLoggedIn,getPost);

//! delete post route
postRouter.route("/:postId").delete(isLoggedIn,deletePost);

//! update post route
postRouter.route("/:postId").patch(isLoggedIn,updatePost)
module.exports = postRouter;