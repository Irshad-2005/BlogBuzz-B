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
    console.log("URI : ", req.file)
    const newPost = await Post.create({
                                    title,
                                    content,
                                    auther:req?.userAuth?._id,
                                    category:categoryId,
                                    image:req?.file?.path
                                });

    const user = await User.findByIdAndUpdate(req?.userAuth?._id,{$push:{posts:newPost?._id}},{new:true});
    const category = await Category.findByIdAndUpdate(categoryId,{$push:{posts:newPost?._id}},{new:true});

    //console.log("user" , user);
    //console.log("category", category)
    resp.status(200).json({
        status:"success",
        message:"post create sucessfully",
        newPost
    });
});

//@desc fetching all  post
//route GET/api/v1/posts
//access private
exports.getAllPosts = asyncHandler(async(req,resp,next)=>
{
    //get the current user from req.userAuth
    //only not block user post read
    //check post schedule time greater then current time or null
    // return resp
    const currentUserId = req.userAuth._id;
    const userBlockingCurrentUser = await User.find({blockedUsers:currentUserId});

    const currentTime = new Date();

    const allPosts = await Post.find({auther:{$nin:userBlockingCurrentUser},
        $or:[
                {
                    scheduledPublished:{$lte:currentTime},
                    scheduledPublished:null
                }
            ]
        }).populate({
            path:"auther",
            model:"User",
            select:"username email role "
        }).populate({
            path:"category",
            model:"Category",
            select:"name"
        }).populate({
            path:"likes",
            model:"User",
            select:"username"
        }).populate({
            path:"dislikes",
            model:"User",
            select:"username"
        }).populate({
            path:"comment",
            model:"Comment",
            select:"username"
        });
    //console.log(userBlockingCurrentUser);
    resp.status(200).json({
        status:"success",
        message:"fething all post successfully",
        allPosts,

    });
});

//@desc fetch single  post
//route GET/api/v1/posts/:postId
//access public
exports.getPost = asyncHandler(async(req,resp,next)=>{
    //get the postId from req.params
    //find the post in db
    //return the response
    const {postId} = req.params;
    const post = await Post.findById(postId).populate({
        model:"User",
        path:"auther",
        select:"username email _id "
        })
    .populate("category")
    .populate({
        path:"comment",
        model:"Comment",
        populate:{
            path:"auther",
            model:"User",
            select:"username profileImage"
        }
    })
    
    if(!post)
    {
        const err = new Error("Post are not exist");
        next(err);
        return;
    }
    resp.status(200).json({
        status:"success",
        message:"fetch single post successfuly",
        post
    });   
});

//@desc get only 4 posts
//@route GET/api/v1/posts/public
//access public
exports.getPublicPost = asyncHandler(async(req,resp,next)=>{
    //get the postId from req.params
    //find the post in db
    //return the response
    
    const post = await Post.find({}).sort({createdAt:-1}).limit(4).populate({
        model:"Category",
        path:"category",
        select:"name auther"
    }).
    populate({
        model:"User",
        path:"auther",
        select:"username"
    });

    resp.status(200).json({
        status:"success",
        message:"fetch public post  successfuly",
        post
    });   
});
//@desc delete post
//route DELETE/api/v1/posts/:postId
//access private
exports.deletePost = asyncHandler(async(req,resp,next)=>
{
    const {postId} = req.params;
    const post = await Post.findById(postId);
    if(!post)
    {
        const err = new Error("post not found");
        next(err);
        return;
    }
    console.log(post)
    const isAuthor = post?.auther?._id.toString() === req.userAuth?._id.toString();
    
    if(!isAuthor)
    {
        throw new Error("Your are not post authur");
        
    }
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
    const{postId}  = req.params;
    const postFound = await Post.findById(postId);
    if(!postFound)
    {
        throw new Error("Post not found !");
    }

    const{title,content,categoryId} = req.body;

    const updatedPost = await Post.findByIdAndUpdate(postId,
        {
            title:title ? title : postFound?.title ,
            content:content ? content : postFound?.content,
            image : req?.file?.path ? req?.file?.path : postFound?.image,
            categoty : categoryId ? categoryId : postFound?.category
        }
        ,{
            runValidators:true,
            new:true
        });

    resp.status(200).json({
        status:"success",
        message:"post updated successfully",
        updatedPost
    });
});

//@ desc post like
//@ route PATCH/api/v1/posts/like/:postId
//@ access private

exports.likePost = asyncHandler(async(req,resp,next)=>
{
    //get the postId from req.params
    //find post exist or not
    //like array add auther id
    //remove dislike array to auther
    //resp send
    console.log("Inside like controller")
    const{postId} = req.params;
    const currentUserId = req.userAuth._id;
    
    const post = await Post.findById(postId);
    if(!post)
    {
        const err = new Error("post not found");
        next(err);
        return;
    }

    await Post.findByIdAndUpdate(postId,{$addToSet:{likes:currentUserId}},{new:true});
    await User.findByIdAndUpdate(currentUserId,{$addToSet:{likedPosts:postId}},{new:true})

    post.dislikes = post?.dislikes?.filter((userId)=> userId.toString() !== currentUserId.toString());

    const updatedPost = await post.save();

    resp.status(200).json({
        post,
        status:"success",
        message:"post like successfully",
        post:updatedPost
    });
});

//@ desc post disLike
//@ route PATCH/api/v1/posts/dislike/:postId
//@ access private

exports.dislikePost = asyncHandler(async(req,resp,next)=>
{
    //get postId from req.params
    //check post exist or not
    //add userId to disLike array
    //remove userId to likes array
    //resp send
    const {postId} = req.params;
    
    const post = await Post.findById(postId);
    if(!post)
    {
        const err = new Error("post not found");
        next(err);
        return;
    }
    await Post.findByIdAndUpdate(postId,{$addToSet:{dislikes:req.userAuth._id}},{new:true});
    await User.findByIdAndUpdate(req.userAuth._id,{$pull:{likedPosts:postId}},{new:true});

    post.likes = post.likes.filter((userId)=> userId.toString() !== req.userAuth._id.toString());
    const updatedPost = await post.save();
    resp.status(200).json({
        status:"success",
        message:"post dislike successfully",
        post:updatedPost

    });
});
//@ desc clap to post
//@ route PATCH/api/v1/posts/clap/:postId
//@ access private
exports.clapingPost = asyncHandler(async(req,resp,next)=>
{
    //get the post id from req.params
    //find post are exist or not
    //claping are increament 
    //resp send
    const{postId} = req.params;

    const post = Post.findById(postId);
    if(!post)
    {
        const error = new Error("post not found");
        next(error);
        return;
    }

    const updatedPost = await Post.findByIdAndUpdate(postId,{$inc:{claps:1}},{new:true});

    resp.status(200).json({
        status:"success",
        message:"post claping successfully",
        post:updatedPost
    });
});

//@ desc post schedule 
//@ route PATCH/api/v1/posts/schedule/:postId
//@ access private

exports.schedulePost = asyncHandler(async(req,resp,next)=>
{
    //get the post id from req.params
    //get the sheduleTime from req.body
    //check sheduleTime greater then current time
    //update post shedule time
    //resp send
    const {postId} = req.params;
    const {sheduleTime} = req.body;

    const currentTime = new Date();
    const postSheduleTime = new Date(sheduleTime);

    if(postSheduleTime < currentTime)
    {
        const error = new Error("Invalid post shedule time");
        next(error);
        return;
    }

    const post = await Post.findById(postId);
    if(!post)
    {
        const error = new Error("post not found");
        next(error);
        return;
    }
    await Post.findByIdAndUpdate(postId,{scheduledPublished:postSheduleTime},{new:true});
    resp.status(200).json({
        status:"success",
        message:"post sheduling successfully"
    });

});

//@ desc post views
//@ route PUT/api/v1/posts/post-view-count/:postId
//@ access private
exports.postViewCount = asyncHandler(async(req,res,next)=>
{
    const { postId} = req.params;
    console.log("post-view-count")
    const post = await Post.findById(postId);
    const currentUserId = req?.userAuth?._id
    if(!post)
    {
        const error = new Error("post not found");
        next(error);
        return;
    }
    //console.log(post)
    const updatedPost = await Post.findByIdAndUpdate(postId,{$addToSet:{postViewers:currentUserId}},{new:true});
    //console.log("Updated : ",updatedPost)
    res.json({
        message:"successfully",
        data : updatedPost
    })

})