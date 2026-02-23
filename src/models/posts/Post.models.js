const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image : {
        type:String,
        default:""
    },
    claps:
    {
        type:Number,
        default : 0
    },
    postViewers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User" 
    }],
    shares:{
        type:Number,
        default:0
    },
    content:{
        type:String,
        required:true,
    },
    auther:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    scheduledPublished:{
        type:Date,
        default:null
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,   
        ref:"User"
    }
    ],
    comment:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
},
{
    timestamps:true,
    toObject:{
        virtuals:true
    },
    toJson:{
        virtuals:true
    }
});

module.exports = mongoose.model("Post",postSchema);