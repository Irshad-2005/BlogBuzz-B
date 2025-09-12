const asyncHandler = require("express-async-handler");
const Post = require("../../models/posts/Post.models");
const User = require("../../models/users/User.models");
const Category = require("../../models/categories/Categoty.models");


exports.createPost = asyncHandler(async(req,resp)=>
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
        throw new Error("post are already exist");
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

exports.getPost = asyncHandler(async(req,resp)=>{
    //get the postId from req.params
    //find the post in db
    //return the response
    const {postId} = req.params;
    const post = await Post.findById(postId);
    resp.status(200).json({
        status:"success",
        message:"fetch post successfuly",
        post
    });
});