const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn.middleware");
const { createPost, getAllPosts, getPost, deletePost, updatePost, likePost, dislikePost, clapingPost, schedulePost, getPublicPost, postViewCount } = require("../../controllers/posts/post.controller");
const isAccountVerify = require("../../middlewares/isAccountVerify.middleware");
const storage = require("../../utils/cloudinary");
const multer = require("multer");


const upload = multer({storage});

const postRouter = express.Router();

//! create post route
postRouter.route("/").post(isLoggedIn,upload.single("image"),createPost);

//! get all post route
postRouter.route("/").get(isLoggedIn,getAllPosts);

//! get single post route
postRouter.route("/:postId").get(getPost);

//! get public post route
postRouter.route("/post/public").get(getPublicPost);

//! delete post route
postRouter.route("/:postId").delete(isLoggedIn,deletePost);

//! update post route
postRouter.route("/:postId").put (isLoggedIn,upload.single("image"),updatePost)
//!post like route
postRouter.route("/like/:postId").put(isLoggedIn,likePost);
//!post dislike route
postRouter.route("/dislike/:postId").put(isLoggedIn,dislikePost);
//! post claping route
postRouter.route("/claps/:postId").put(isLoggedIn,clapingPost);
//! post sheduleing route
postRouter.route("/shedule/:postId").put(isLoggedIn,schedulePost);

//! post view route
postRouter.get("/:postId/post-view-count",isLoggedIn,postViewCount);

module.exports = postRouter;