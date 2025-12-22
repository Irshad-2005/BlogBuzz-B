const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
        enum:["user","admin"],
        default:"user"
    },
    password:{
        type:String,
        required:true
    },
    lastLogin:{
        type:Date,
        default:Date.now()
    },
    accountLevel:{
        type:String,
        enum:["Bronze","Silver","Gold"],
        default:"Bronze"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    profileImage:
    {
        type:String,
        default:""
    },
    coverImage:
    {
        type:String,
        default:""
    },
    Bio:{
        type:String,
        default:""
    },
    location:
    {
        type:String,
        default:""
    },
    noficationType:{
        email:{
            type:String,
            default:false
        }
    },
    gender:{
        type:String,
        default:null
    },
    profileViewers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    blockedUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    likedPosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    passwordResetToken:{
        type:String,
        default:null
    },
    passwordResetExpires:{
        type:Date,
        default:null

    },
    accountVerificationToken:
    {
        type:String,
        default:null
    },
    accountVerificationExpires:{
        type:Date,
        default:null
    }
},
{
    timestamps:true,
    toObject:{
        virtuals:true
    },
    toJSON:{
        virtuals:true
    }
});

userSchema.methods.generatePasswordForgetToken =  function(){
    const passwordResetToken  = crypto.randomBytes(20).toString("hex");
    console.log("passwordResetToken : ", passwordResetToken);
    const hashToken = crypto.createHash("sha256").update(passwordResetToken).digest("hex");
    this.passwordResetToken = hashToken;
    this.passwordResetExpires = Date.now() + 10*60*1000;
    return passwordResetToken;
}

userSchema.methods.generateAccountVerificationToken = function()
{
    const accountVerificationToken = crypto.randomBytes(20).toString("hex");
    console.log("accountVerification token: ",accountVerificationToken);
    const hashToken = crypto.createHash("sha256").update(accountVerificationToken).digest("hex");
    this.accountVerificationToken = hashToken;
    this.accountVerificationExpires = Date.now() + 10*60*1000;
    return accountVerificationToken;
}

module.exports = mongoose.model("User",userSchema);