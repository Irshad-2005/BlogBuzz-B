const User = require("../models/users/User.models")

const isAccountVerify = async(req,resp,next)=>
{
    //get current user and check account verify or not
    
    try
    {
        const currentUser = await User.findById(req.userAuth._id);
        if(currentUser.isVerified)
        {
            next();
        }
        else{
            resp.status(401).json({
                status:"failed",
                message:"user account not verify"
            });
        }
    }catch(err)
    {
        console.log("ERROR : ",err);
        resp.status(500).json({
            status:"failed",
            message:"something are wrong "
        });
    }

}

module.exports = isAccountVerify;