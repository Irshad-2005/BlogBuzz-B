    //check post are exists or not
    //find the postId  to view post
    //userId to add postView array
    //send resp 
    const {postId} = req.params;
    const userId  = req?.userAuth?._id;

    const post = await Post.findById(postId);
    if(!post)
    {
        const err = new Error("Post are not found");
        next(err);
        return;
    }
    const updatedPostawait = Post.findByIdAndUpdate(postId,
                                    {
                                        $addToSet:{postViewers:userId}
                                    },
                                    {
                                        new:true
                                    }
                                );

    res.status(200).json({
                    status:"success",
                    message:"post view are successfully",
                    updatedPostawait,
    });