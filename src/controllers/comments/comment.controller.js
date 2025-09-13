const asyncHandler = require("express-async-handler");
const Comment = require("../../models/comments/Comment.models");

//@desc new comment created
//@route POST/api/v1/comment
//@access private
exports.createComment = asyncHandler(async(req,resp,next)=>
{
    //get the comment message from req.body
    //get user from req.userAuth
    //create comment
    //resp send
    const {postId} = req.params;
    const{message} = req.body;

    const newComment = await Comment.create({message,auther:req?.userAuth?._id,postId});

    resp.status(200).json({
        status:"success",
        message:"new comment created successfully",
        newComment
    });
});

//@desc get single comment
//route GET/api/v1/comment
//access public
exports.getComment = asyncHandler(async(req,resp,next)=>{
    //get the commentId from req.params
    //get comment from db
    //resp send

    const {commentId} = req.params;
    
    const comment = await Comment.findById(commentId);

    if(!comment)
    {
        const error = new Error("comment are not exsit");
        next(error);
        return;
    }

    resp.status(200).json({
        status:"success",
        message:"fetch comment successfully",
        comment
    });
});
//@desc delete comment
//route DELETE/api/v1/comment/:commentId
//access private
exports.deleteComment = asyncHandler(async(req,resp,next)=>{

    //get the commentId from req.params
    //delete comment from db
    //resp send

    const{commentId} = req.params;

    await Comment.findByIdAndDelete(commentId);

    resp.status(200).json({
        status:"success",
        message:"comment deleted successfully"
    });
});

//@desc update comment
//route PATCH/api/v1/comment/:commentId
//access private
exports.updateComment = asyncHandler(async(req,resp,next)=>
{
    //get the comment message from req.body
    //get the commentId from req.params
    //updated the comment from db
    //resp send

    const{commentId} = req.params;
    const{message} = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(commentId,{message},{new:true});

    resp.status(200).json({
        status:"success",
        message:"comment update successful",
        updatedComment
    });
});