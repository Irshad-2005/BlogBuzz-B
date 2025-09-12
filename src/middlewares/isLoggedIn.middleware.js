const jwt = require("jsonwebtoken");
const User = require("../models/users/User.models")
const isLoggedIn = (req,resp,next)=>
{
    //find the token in headers
    //if token are verify sucessfully then passed user object to next
    //if token are verify unsuccessfully then send error
    console.log("isLoggedIn middleware execute");
    const token = req?.headers?.authorization?.split(" ")[1];
    //console.log(token);

    jwt.verify(token,process.env.JWT_SECRET_KEY,async(error,decoded)=>
    {
        if(error)
        {
            const err = new Error(error.message);
            next(err);
        }
        else{

            const user = await User.findById(decoded.user.id).select("username email role _id");
            //console.log("user : ", user);
            req.userAuth = user;
            next();

        }
        
    })

    

}

module.exports = isLoggedIn;