const asyncHandler = require("express-async-handler");
const User = require("../../models/users/User.models");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");
const sendEmail = require("../../utils/sendEmail");
const crypto = require("crypto");
const sendAccountVerificationEmail = require("../../utils/sendAccountVerificationEmail");


//@ desc register to new user 
//@ route POST /api/v1/users/register
//@ access public
exports.register = asyncHandler( async(req,resp,next)=>
{
    //find the username and other details in req.body
    // check are username already exists or not
    // create are new user and return response
    const {username,password,email} = req.body;
    const user = await User.findOne({username});
    if(user)
    {
        throw new Error("User are already exist");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);
    
    const newUser = User.create({username,password:hashPassword,email});

    resp.json({
        status:"success",
        message:"user register are successfull",
        _id:newUser?.id,
        username:newUser?.username,
        email:newUser?.email
    });
}
);

//@ desc login to new user
//@ route POST/api/v1/users/login
//@ access public 

exports.login = asyncHandler( async(req,resp,)=>
{
    //find the username and password in req.body
    //find the user in database based on username
    //check are password is corrent or not
    //return are resp user are login

    const {username,password} = req.body;
    const user = await User.findOne({username});
    if(!user)
    {
        throw new Error("Invalid Credentials");
    }
    const isMatched = await bcrypt.compare(password,user.password);
    if(!isMatched)
    {
        throw new Error("Invalid Password")
    }
    user.lastLogin = Date.now();
    await user.save();

    resp.json({
        status:"success",
        message:"User are Login Successfully",
        id:user?._id,
        username:user?.username,
        email:user?.email,
        role:user?.role,
        token:generateToken(user)
    });
}
);


//@ desc get profile  
//@ route GET/api/v1/users/profile/:id
//@ access private

exports.getProfile = asyncHandler( async(req,resp,next)=>
{
        const user = await User.findById(req?.userAuth?._id).select("-password").
        populate({
            path:"posts",
            model:"Post",
            select:"title"
        }).
        populate({
            path:"following",
            model:"User",
            select:"username"
            }).
        populate({
            path:"followers",
            model:"User",
            select:"username"
        }).
        populate({
            path:"profileViewers",
            model:"User",
            select:"username"
        }).
        populate({
            path:"blockedUsers",
            model:"User",
            select:"username"
        }).
        populate({
            path:"likedPosts",
            model:"Post",
            select:"title"
        });

        resp.json({
            status:"success",
            message:"profile fetched",
            user,
        })
    }
);
//@ desc block to other user
//@ route PATCH /api/v1/users/block/:userToBlockId
//@ access private
exports.blockUser = asyncHandler(async(req,resp,next)=>
{
    //get the userToBlockId from req.params
    // check user are exist or not
    //get the blocking user id from req.userAuth and query to db
    //self-blocking check
    //check user are already block or not
    //block the user
    //resp send
    const {userToBlockId} = req.params;
    const blockUser = await User.findById(userToBlockId);
    if(!blockUser)
    {
        const err = new Error("user are not found ");
        next(err);
        return;
    }
    const currentUser = await User.findById(req?.userAuth?._id);

    if(currentUser.toString() === blockUser.toString())
    {
        const err = new Error("users cannot block themselfes");
        next(err);
        return;
    }

    if(currentUser?.blockedUsers?.includes(userToBlockId))
    {
        const err = new Error("user are already block");
        next(err);
        return;
    }

    currentUser?.blockedUsers?.push(userToBlockId);

    const user = await currentUser.save();

    resp.status(200).json({
        status:"success",
        message:"user block successfully",
        user
    });
});

//@ desc unBlock to other user
//@ route PATCH/api/v1/users/unBlock/:userIdToUnblock
//@ access private

exports.unBlockUser = asyncHandler(async(req,resp,next)=>
{
    //get the unblock user id from req.params
    //check unblock user are exist or not 
    // get the cuurent user from db
    //check user are not unblock himself
    //check user are block or not
    //unblock the user 
    //resp send
    const{userIdToUnblock} = req.params;
    const unBlockUser = await User.findById(userIdToUnblock);
    if(!unBlockUser)
    {
        const error = new Error("user are not found!");
        next(error);
        return;
    }

    const currentUser = await User.findById(req?.userAuth?._id);
    if(currentUser.toString() === unBlockUser.toString())
    {
        const err = new Error("user are not unblock himself");
        next(err);
        return;
    }

    if(!currentUser?.blockedUsers?.includes(userIdToUnblock))
    {
        const err = new Error("user is not blocked");
        next(err);
        return;
    }

    currentUser.blockedUsers = currentUser?.blockedUsers?.filter((blockUserId)=> blockUserId.toString() !== userIdToUnblock);

    const user = await currentUser.save();

    resp.status(200).json({
        status:"success",
        message:"user to unblock successfully",
        user
    });
});

//@ desc viewOther profile
//@ route PATCH/api/v1/users/viewOther-profile/:userId
//@ access private

exports.viewOtherProfile = asyncHandler(async(req,resp,next)=>
{
    //get the userID from req.params
    //check user exist or not 
    //get the current user from db
    //check user are already view profile then send message 
    //add the other user to viewerProfile
    //resp send

    const{userId} = req.params;
    const otherUser = await User.findById(userId);
    if(!otherUser)
    {
        const err = new Error("user not found");
        next(err);
        return;
    }

    const currentUser = await User.findById(req.userAuth._id);
    if(currentUser?.profileViewers.includes(userId))
    {
        const err = new Error("You are already view profile");
        next(err);
        return;
    }
    const updatedUser = await User.findByIdAndUpdate(currentUser._id,{$push:{profileViewers:userId}},{new:true});

    resp.status(200).json({
        status:"success",
        message:"You have view profile successfully",
        updatedUser
    });
});

//@ desc following the user to other user
//@ route PATCH/api/v1/users/following/:userId
//@ access private

exports.followingUser = asyncHandler(async(req,resp,next)=>
{
    //get the followed user Id from req.params
    //cheeck user are exist or not
    //get the current user to req.userAuth
    //check user are not following himself
    //add the followed userId to following array
    //resp send
    const {userId} = req.params;
    const followedUser = await User.findById(userId);
    if(!followedUser)
    {
        const err = new Error("user not found");
        next(err);
        return;
    }
    const currentUser = await User.findById(req?.userAuth?._id);
    if(currentUser.toString() === followedUser.toString())
    {
        const err= new Error("user can not following himself");
        next(err);
        return;
    }

    //cuurent user update following array
    await User.findByIdAndUpdate(currentUser._id,{$addToSet:{following:userId}},{new:true});
    //other user update followers array 
    await User.findByIdAndUpdate(userId,{$addToSet:{followers:currentUser._id}},{new:true});

    resp.status(200).json({
        status:"success",
        message:"user to following successfully",
    });
});

//@ desc unfollow to another user
//@ route PATCH/api/v1/users/unfollow/:userId
//@ access private

exports.unfollowUser = asyncHandler(async(req,resp,next)=>
{
    //get the unfollow user id from req.params
    //check are user exist or not
    //check user not unfollow himself
    //check user are following or not
    //remove the following user
    //resp send

    const {userId}  = req.params;
    const unfollowUser = await User.findById(userId);
    if(!unfollowUser)
    {
        const err = new Error("user not found");
        next(err);
        return;
    }

    const currentUser = await User.findById(req.userAuth._id);
    if(currentUser.toString() === unfollowUser.toString())
    {
        const err = new Error("user can not unfollow him self");
        next(err);
        return;
    }

    if(!currentUser.following.includes(userId))
    {
        const err = new Error("user are not following");
        next(err);
        return;
    }
    await User.findByIdAndUpdate(currentUser._id,{$pull:{following:userId}},{new :true});
    await User.findByIdAndUpdate(userId,{$pull:{followers:currentUser._id}},{new:true});

    resp.status(200).json({
        status:"success",
        message:"user unfollowed successfull"
    });
});

//@ desc password reset 
//@ route POST/api/v1/users/password-reset
//@ access public

exports.forgetPassword = asyncHandler(async(req,resp,next)=>
{
    //get the email from req.body
    //check user are exist or not
    //send email
    //resp send
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user)
    {
        const err = new Error("user not found");
        next(err);
        return;
    }
    const token = await user.generatePasswordForgetToken();
    console.log("token",token)
    sendEmail(email,token);
    await user.save();
    resp.status(200).json({
        status:"success",
        message:"forget password email send successfully"
    });
});

//@ desc reset password 
//@ route PATCH/api/v1/users/password-reset/:PasswordResetToken
//@ access public

exports.passwordReset = asyncHandler(async(req,resp,next)=>{
    //get the password reset token from req.params
    //get the new password from req.body
    // find the user in db based on password reset token and password reset expires
    // change password
    //resp send
    const {passwordResetToken} = req.params;
    const {newPassword} = req.body;
    const hashToken = crypto.createHash("sha256").update(passwordResetToken).digest("hex");
    const user = await User.findOne({passwordResetToken:hashToken,passwordResetExpires:{$gt:Date.now()}});
    if(!user)
    {
        const err = new Error("user not found");
        next(err);
        return;
    }

    const salt  = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword,salt);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    resp.status(200).json({
        status:"success",
        message:"password  change successfully",
        user
    });
});

//@ desc account verification email
//@ route PATCH/api/v1/users/account-verification
//@ access private

exports.accountVerificationMail = asyncHandler(async(req,resp,next)=>
{
    // get the current user from req.userAuth
    //send the mail
    //resp send
    const user = await User.findById(req.userAuth._id);
    if(!user)
    {
        const err = new Error("user are not found");
        next(err);
        return;
    }
    const accountVerificationToken = await user.generateAccountVerificationToken();
    sendAccountVerificationEmail(user.email,accountVerificationToken);
    await user.save();
    resp.status(200).json({
        status:"success",
        message:"account verification token send successfully",
    });
});

//@ desc verify account 
//@ route PATCH/api/v1/users/verify-account/:accountVerificationToken
//@ access private
exports.verifyAccount = asyncHandler(async(req,resp,next)=>
{
    //get the account verification token from req.params
    // convert to token in hashform
    //get the current user from req.userAuth
    // check token valid and time not expires

    const {accountVerificationToken} = req.params;

    const hashToken = crypto.createHash("sha256").update(accountVerificationToken).digest("hex");

    const user = await User.findOne({accountVerificationToken:hashToken,
        accountVerificationExpires:{$gt:Date.now()}});
    if(!user)
    {
        const err= new Error("Invalid account verification token or expires time");
        next(err);
        return;
    }
    user.isVerified = true;
    user.accountVerificationToken = null;
    user.accountVerificationExpires = null;
    await user.save();

    resp.status(200).json({
        status:"success",
        message:"Account verify successfully"
    });
});



