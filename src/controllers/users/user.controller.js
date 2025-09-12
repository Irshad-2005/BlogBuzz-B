const asyncHandlers = require("express-async-handler");

const User = require("../../models/users/User.models");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");

//@ desc register to new user 
//@ route POST /api/v1/users/register
//@ access public
exports.register = asyncHandlers( async(req,resp,next)=>
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
    
    const newUser =  new User.create({username,password:hashPassword,email});

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

exports.login = asyncHandlers( async(req,resp,)=>
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
        username:user?.username,
        email:user?.email,
        role:user?.role,
        token:generateToken(user)
    });
}
);


//@ desc profile view 
//@ riute GET/api/v1/users/profile/:id
//@ access private

exports.getProfile = asyncHandlers( async(req,resp,next)=>
{
        const user = await User.findById(req?.userAuth?._id).select("-password");
        resp.json({
            status:"success",
            message:"profile fetched",
            user,
        })
    }
);
