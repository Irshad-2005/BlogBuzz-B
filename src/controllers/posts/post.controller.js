const asyncHandler = require("express-async-handler");
const Post = require("../../models/posts/Post.models");
const User = require("../../models/users/User.models");
const Category = require("../../models/categories/Categoty.models");

//@desc create post
//route POST/api/v1/posts
//access private
exports.createPost = asyncHandler(async(req,resp,next)=>
{
    //get the title and content or categoryId from req.body
    //if check post are exist or not
    //create new post
    //user doc update with postId on posts array
    //category doc update with postId on posts array
    //return resp

    const{title,content,categoryId} = req.body;

    const post = await Post.findOne({title});
    //console.log(post)
    if(post)
    {
        const error = new Error("post are already exist");
        next(error)
        return;
    }
    const newPost = await Post.create({title,content,auther:req?.userAuth?._id});

    const user = await User.findByIdAndUpdate(req?.userAuth?._id,{$push:{posts:newPost?._id}},{new:true});
    const category = await Category.findByIdAndUpdate(categoryId,{$push:{posts:newPost?._id}},{new:true});

    console.log("user" , user);
    console.log("category", category)
    resp.status(200).json({
        status:"success",
        message:"post create sucessfully",
        newPost
    });
});

//@desc fetching all  post
//route GET/api/v1/posts
//access private
exports.getAllPosts = asyncHandler(async(req,resp)=>
{
    //get the all post from db
    // return resp
    const allPosts = await Post.find({});
    resp.status(200).json({
        status:"success",
        message:"fething all post successfully",
        allPosts
    });
});

//@desc fetch single  post
//route GET/api/v1/posts/:postId
//access private
exports.getPost = asyncHandler(async(req,resp,next)=>{
    //get the postId from req.params
    //find the post in db
    //return the response
    const {postId} = req.params;
    const post = await Post.findById(postId);
    if(!post)
    {
        const err = new Error("Post are not exist");
        next(err);
        return;
    }
    resp.status(200).json({
        status:"success",
        message:"fetch post successfuly",
        post
    });   
});

//@desc delete post
//route DELETE/api/v1/posts/:postId
//access private
exports.deletePost = asyncHandler(async(req,resp,next)=>
{
    const {postId} = req.params;

    await Post.findByIdAndDelete(postId);

    resp.status(200).json({
        status:"success",
        message:"post deleted successfully"
    });
});

//@desc update post
//route PATCH/api/v1/posts/:postId
//access private
exports.updatePost = asyncHandler(async(req,resp,next)=>
{
    //get the postId and titile or content
    //update the post
    //return resp
    const{postId}  =req.params;
    const{title,content} = req.body;

    const updatedPost = await Post.findByIdAndUpdate(postId,{title,content},{new:true});
    resp.status(200).json({
        status:"success",
        message:"post updated successfully",
        updatedPost
    });
});
